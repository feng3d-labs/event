/* eslint-disable func-style */
import { deepEqual } from 'assert';
import { anyEmitter, EventEmitter, IEventTarget } from '../src';

describe('anyEmitter', () =>
{
    it('emit bubbles Entity-Component-System', () =>
    {
        class Component implements IEventTarget
        {
            name: string;
            entity: Entity;
            constructor(name = 'component')
            {
                this.name = name;
            }

            getBubbleTargets(): any[]
            {
                return [this.entity];
            }
        }

        class Entity implements IEventTarget
        {
            name: string;
            components: Component[];
            constructor(name = 'entity')
            {
                this.name = name;
            }

            getBubbleTargets()
            {
                return this.components;
            }
        }

        class Node extends Component
        {
            parent: Node;
            static create(name?: string)
            {
                const entity = new Entity(`entity-${name}`);
                const node = new Node(`node-${name}`);

                entity.components = [
                    node, new Component(`component0-${name}`), new Component(`component1-${name}`),
                ];
                entity.components.forEach((c) =>
                {
                    c.entity = entity;
                });

                return node;
            }

            getBubbleTargets()
            {
                return [this.entity as any].concat(this.entity.components, this.parent);
            }
        }

        const nodea = Node.create('a');
        const nodeb = Node.create('b');

        nodeb.parent = nodea;

        const result: string[] = [];

        ([] as any[]).concat(nodea.entity, nodea.entity.components, nodeb.entity, nodeb.entity.components).forEach((v: { name: string }) =>
        {
            anyEmitter.on(v, 'print', () => { result.push(v.name); });
        });

        anyEmitter.emit(nodeb, 'print', null, true);
        const result0 = ['node-b', 'entity-b', 'component0-b', 'component1-b', 'node-a', 'entity-a', 'component0-a', 'component1-a'];

        deepEqual(result0, result);
    });

    it('emit bubbles Entity-Component-System extends EventEmitter', () =>
    {
        interface ComponentEventMap
        {
            print: any;
        }

        class Component<T extends ComponentEventMap = ComponentEventMap> extends EventEmitter<T> implements IEventTarget
        {
            name: string;
            entity: Entity;
            constructor(name = 'component')
            {
                super();
                this.name = name;
            }

            getBubbleTargets(): any[]
            {
                return [this.entity];
            }
        }

        type EntityEventMap = ComponentEventMap;

        class Entity<T extends EntityEventMap = EntityEventMap> extends EventEmitter<T> implements IEventTarget
        {
            name: string;
            components: Component[];
            constructor(name = 'entity')
            {
                super();
                this.name = name;
            }

            getBubbleTargets()
            {
                return this.components;
            }
        }

        class Node extends Component
        {
            parent: Node;
            static create(name?: string)
            {
                const entity = new Entity(`entity-${name}`);
                const node = new Node(`node-${name}`);

                entity.components = [
                    node, new Component(`component0-${name}`), new Component(`component1-${name}`),
                ];
                entity.components.forEach((c) =>
                {
                    c.entity = entity;
                });

                return node;
            }

            getBubbleTargets()
            {
                return [this.entity as any].concat(this.entity.components, this.parent);
            }
        }

        const nodea = Node.create('a');
        const nodeb = Node.create('b');

        nodeb.parent = nodea;

        const result: string[] = [];
        const listenerFunc = function listenerFunc() { result.push(this.name); };

        // ---------- 使用 event 派发事件。

        // 首次添加事件
        ([] as any[]).concat(nodea.entity, nodea.entity.components, nodeb.entity, nodeb.entity.components).forEach((v: Component) =>
        {
            anyEmitter.on(v, 'print', listenerFunc, v);
        });

        anyEmitter.emit(nodeb, 'print', null, true);

        const result0 = ['node-b', 'entity-b', 'component0-b', 'component1-b', 'node-a', 'entity-a', 'component0-a', 'component1-a'];

        deepEqual(result0, result);

        // 再次添加事件，重复添加事件将被忽略
        result.length = 0;
        ([] as any[]).concat(nodea.entity, nodea.entity.components, nodeb.entity, nodeb.entity.components).forEach((v: Component) =>
        {
            anyEmitter.on(v, 'print', listenerFunc, v);
        });

        anyEmitter.emit(nodeb, 'print', null, true);
        deepEqual(result0, result);

        // 移除事件
        result.length = 0;
        ([] as any[]).concat(nodea.entity, nodea.entity.components, nodeb.entity, nodeb.entity.components).forEach((v: Component) =>
        {
            anyEmitter.off(v, 'print', listenerFunc, v);
        });

        anyEmitter.emit(nodeb, 'print', null, true);
        deepEqual('', result.join(','));

        // ---------- 使用 EventEmitter 派发事件。
        result.length = 0;
        ([] as any[]).concat(nodea.entity, nodea.entity.components, nodeb.entity, nodeb.entity.components).forEach((v: Component) =>
        {
            v.on('print', listenerFunc, v);
        });

        nodeb.emit('print', null, true);

        deepEqual(result0.join(','), result.join(','));

        //
        result.length = 0;
        ([] as any[]).concat(nodea.entity, nodea.entity.components, nodeb.entity, nodeb.entity.components).forEach((v: Component) =>
        {
            v.on('print', listenerFunc, v);
        });

        nodeb.entity.emit('print', null, true);
        const result1 = ['entity-b', 'node-b', 'component0-b', 'component1-b', 'node-a', 'entity-a', 'component0-a', 'component1-a'];

        deepEqual(result1.join(','), result.join(','));

        //
        result.length = 0;
        ([] as any[]).concat(nodea.entity, nodea.entity.components, nodeb.entity, nodeb.entity.components).forEach((v: Component) =>
        {
            v.on('print', listenerFunc, v);
        });

        nodeb.entity.components[2].emit('print', null, true);
        const result2 = ['component1-b', 'entity-b', 'node-b', 'component0-b', 'node-a', 'entity-a', 'component0-a', 'component1-a'];

        deepEqual(result2.join(','), result.join(','));
    });
});
