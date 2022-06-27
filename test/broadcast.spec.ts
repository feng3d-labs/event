import { deepEqual } from 'assert';
import { EventEmitter, IEventTarget } from '../src';

describe('EventEmitter', () =>
{
    it('冒泡测试', () =>
    {
        class Node extends EventEmitter implements IEventTarget
        {
            parent: Node;
            children: Node[];

            constructor(public name: string)
            {
                super();
            }

            getBubbleTargets()
            {
                return [this.parent];
            }

            getBroadcastTargets()
            {
                return this.children;
            }
        }

        const parent = new Node('parent');
        const child0 = new Node('child0');
        const child1 = new Node('child1');
        parent.children = [child0, child1];
        child0.parent = parent;
        child1.parent = parent;

        const result: string[] = [];
        parent.on('event0', () => { result.push('parent'); });
        child0.on('event0', () => { result.push('child0'); });
        child1.on('event0', () => { result.push('child1'); });

        result.length = 0;
        child0.broadcast('event0');
        deepEqual(result, ['child0']);
    });
});
