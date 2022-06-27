import { IEvent } from './IEvent';

/**
 * 监听器数据项。
 */
export interface ListenerItem
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
}
