import { ListenerVO } from './ListenerVO';

/**
 * 事件
 */
export interface IEvent<T>
{
    /**
     * 事件的类型。类型区分大小写。
     */
    type: string;

    /**
     * 事件携带的自定义数据
     */
    data: T;

    /**
     * 事件目标。
     */
    target?: any;

    /**
     * 当前正在使用某个事件监听器处理 Event 对象的对象。
     */
    currentTarget?: any;

    /**
     * 表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
     *
     * 如果该事件为冒泡事件，则事件将会向上传递给父节点。
     */
    bubbles?: boolean;

    /**
     * 是否停止冒泡
     */
    isStopBubbles?: boolean;

    /**
     * 表示事件是否为广播事件。如果事件可以广播，则此值为 true；否则为 false。
     *
     * 如果该事件为广播事件，则事件将会传递给所有的子节点。
     */
    broadcast?: boolean;

    /**
     * 是否停止广播
     */
    isStopBroadcast?: boolean;

    /**
     * 是否停止处理事件监听器
     */
    isStop?: boolean;

    /**
     * 事件流过的对象列表，事件路径
     */
    targets: any[];

    /**
     * 处理列表
     */
    handles: ListenerVO[];
}
