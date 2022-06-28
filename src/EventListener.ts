import { IEvent } from './IEvent';

/**
 * 事件监听器。
 */
export class EventListener
{
    /**
     * 监听函数
     */
    listener: (event: IEvent<any>) => void;

    /**
     * 监听函数作用域
     */
    thisObject: any;

    /**
     * 优先级
     */
    priority: number;

    /**
     * 是否只监听一次
     */
    once: boolean;

    /**
     * 构建事件监听器。
     */
    constructor({ listener, thisObject = undefined, priority = 0, once = false }: {
        /**
         * 监听函数
         */
        listener: (event: IEvent<any>) => void,
        /**
         * 监听函数作用域
         */
        thisObject: any,
        /**
         * 优先级
         */
        priority: number,
        /**
         * 是否只监听一次
         */
        once: boolean,
    })
    {
        this.listener = listener;
        this.thisObject = thisObject;
        this.priority = priority;
        this.once = once;
    }
}
