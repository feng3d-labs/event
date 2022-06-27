/**
 * 派发事件的对象。
 */
export interface IEventTarget
{
    /**
     * 获取冒泡的上级目标列表。
     */
    getBubbleTargets?(): IEventTarget[];

    /**
     * 获取广播的下级目标列表。
     */
    getBroadcastTargets?(): IEventTarget[];
}
