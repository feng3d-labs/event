// 要求
// 1. Entity可以发射事件，Component无法发射事件。
// 2. Entity发射的事件将会在Node组件之间传递，包括冒泡（向父结点传递）与广播（向子结点传递）。
import { EventEmitter, IEvent, IEventTarget } from '../src';
import { deepEqual } from 'assert';

interface EntityEventMap
{
    print: any;
}

class Component
{
    name: string;
    entity: Entity;
    constructor(name = 'Component')
    {
        this.name = name;
    }
}

class Entity extends EventEmitter<EntityEventMap> implements IEventTarget
{
    name: string;
    node: Node;
    components: Component[];
    constructor(name = 'Entity')
    {
        super();
        this.name = name;
    }

    getBubbleTargets()
    {
        return [this.node?.parent?.entity];
    }

    getBroadcastTargets()
    {
        const targets = this.node?.children?.map((v) => v.entity);

        return targets;
    }
}

class Node extends Component
{
    parent: Node;
    children: Node[] = [];
    static create(name?: string)
    {
        const entity = new Entity(`Entity-${name}`);
        const node = new Node(`Node-${name}`);
        entity.node = node;
        entity.components = [
            node, new Component(`Component0-${name}`), new Component(`Component1-${name}`),
        ];
        entity.components.forEach((c) =>
        {
            c.entity = entity;
        });

        return node;
    }
}

const grandfather = Node.create('grandfather');
const parent = Node.create('parent');
const self = Node.create('self');
const brother = Node.create('brother');
const child0 = Node.create('child0');
const child1 = Node.create('child1');

grandfather.children = [parent];

parent.parent = grandfather;
parent.children = [brother, self];

brother.parent = parent;

self.parent = parent;
self.children = [child0, child1];

child0.parent = self;
child1.parent = self;

const result: string[] = [];
let resultEvent: IEvent;

function listenerFunc()
{
    result.push(this.name);
}

// 停止冒泡、广播以及事件处理。
function stop(event: IEvent<any>)
{
    event.isStop = true;
}

// 停止冒泡
function stopBubbles(event: IEvent<any>)
{
    event.isStopBubbles = true;
}

// 停止广播
function stopBroadcast(event: IEvent<any>)
{
    event.isStopBroadcast = true;
}

describe('Entity extends EventEmitter', () =>
{
    it('发射事件', () =>
    {
        // 首次添加事件
        ([] as Entity[]).concat(grandfather.entity, parent.entity, brother.entity, self.entity, child0.entity, child1.entity).forEach((v: Entity) =>
        {
            v.on('print', listenerFunc, v);
        });

        result.length = 0;
        resultEvent = self.entity.emit('print', null, true);// 冒泡
        deepEqual(['Entity-self', 'Entity-parent', 'Entity-grandfather'], result);
        deepEqual(resultEvent.handles.length, 3);
        deepEqual(resultEvent.targets.length, 3);
        deepEqual(resultEvent.target, self.entity);

        // 再次添加事件，重复添加事件将被忽略
        ([] as Entity[]).concat(grandfather.entity, parent.entity, brother.entity, self.entity, child0.entity, child1.entity).forEach((v: Entity) =>
        {
            v.on('print', listenerFunc, v);
        });

        result.length = 0;
        resultEvent = self.entity.emit('print', null, false, true);
        deepEqual(['Entity-self', 'Entity-child0', 'Entity-child1'].join(','), result.join(','));
    });

    it('同时冒泡与广播', () =>
    {
        result.length = 0;
        resultEvent = self.entity.emit('print', null, true, true);
        deepEqual(['Entity-self', 'Entity-parent', 'Entity-grandfather', 'Entity-child0', 'Entity-child1'].join(','), result.join(','));

        // 移除事件
        ([] as Entity[]).concat(grandfather.entity, parent.entity, brother.entity, self.entity, child0.entity, child1.entity).forEach((v: Entity) =>
        {
            v.off('print', listenerFunc, v);
        });

        result.length = 0;
        resultEvent = self.entity.emit('print', null, true, true);
        deepEqual(result.join(','), '');
    });

    it('冒泡事件 bubbles', () =>
    {
        ([] as Entity[]).concat(grandfather.entity, parent.entity, brother.entity, self.entity, child0.entity, child1.entity).forEach((v: Entity) =>
        {
            v.on('print', listenerFunc, v);
        });

        result.length = 0;
        resultEvent = self.entity.bubbles('print', null);
        deepEqual(['Entity-self', 'Entity-parent', 'Entity-grandfather'].join(','), result.join(','));
    });

    it('广播事件 broadcast', () =>
    {
        //
        ([] as Entity[]).concat(grandfather.entity, parent.entity, brother.entity, self.entity, child0.entity, child1.entity).forEach((v: Entity) =>
        {
            v.on('print', listenerFunc, v);
        });

        result.length = 0;
        resultEvent = self.entity.broadcast('print', null);
        deepEqual(['Entity-self', 'Entity-child0', 'Entity-child1'].join(','), result.join(','));
        deepEqual(resultEvent.handles.length, 3);
    });

    it('测试停止事件 IEvent.isStop', () =>
    {
        //
        self.entity.on('print', stop);
        //
        result.length = 0;
        resultEvent = self.entity.broadcast('print', null);
        deepEqual(['Entity-self'].join(','), result.join(','));
        deepEqual(resultEvent.handles.length, 2);

        //
        self.entity.off('print', stop);
        result.length = 0;
        resultEvent = self.entity.emit('print', null, true, true);
        deepEqual(['Entity-self', 'Entity-parent', 'Entity-grandfather', 'Entity-child0', 'Entity-child1'].join(','), result.join(','));
        deepEqual(resultEvent.handles.length, 5);
    });

    it('测试停止冒泡 IEvent.isStopBubbles', () =>
    {
        //
        self.entity.on('print', stopBubbles);
        //
        result.length = 0;
        resultEvent = self.entity.emit('print', null, true, true);
        deepEqual(['Entity-self', 'Entity-child0', 'Entity-child1'].join(','), result.join(','));
        deepEqual(resultEvent.handles.length, 4);

        // 恢复冒泡
        self.entity.off('print', stopBubbles);
        result.length = 0;
        resultEvent = self.entity.emit('print', null, true, true);
        deepEqual(['Entity-self', 'Entity-parent', 'Entity-grandfather', 'Entity-child0', 'Entity-child1'].join(','), result.join(','));
        deepEqual(resultEvent.handles.length, 5);
    });

    it('测试停止广播 IEvent.isStopBroadcast', () =>
    {
        //
        self.entity.on('print', stopBroadcast);
        //
        result.length = 0;
        resultEvent = self.entity.emit('print', null, true, true);
        deepEqual(['Entity-self', 'Entity-parent', 'Entity-grandfather'].join(','), result.join(','));
        deepEqual(resultEvent.handles.length, 4);

        // 恢复广播
        self.entity.off('print', stopBroadcast);
        result.length = 0;
        resultEvent = self.entity.emit('print', null, true, true);
        deepEqual(['Entity-self', 'Entity-parent', 'Entity-grandfather', 'Entity-child0', 'Entity-child1'].join(','), result.join(','));
        deepEqual(resultEvent.handles.length, 5);
    });
});
