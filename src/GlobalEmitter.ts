import { EventEmitter } from './EventEmitter';

/**
 * 全局事件
 */
export const globalEmitter = new EventEmitter<MixinsGlobalEvents>();

declare global
{
    /**
     * 事件列表
     */
    interface MixinsGlobalEvents
    {
    }
}
