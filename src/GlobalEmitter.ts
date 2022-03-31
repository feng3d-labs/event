import { EventEmitter } from './EventEmitter';

/**
 * 全局事件
 */
export const globalEmitter = new EventEmitter<Mixins_GlobalEvents>();

declare global
{
    /**
     * 事件列表
     */
    interface Mixins_GlobalEvents
    {
    }
}
