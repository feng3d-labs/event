import { EventEmitter } from './EventEmitter';

/**
 * 全局事件发射器。
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
