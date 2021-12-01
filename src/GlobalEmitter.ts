import { EventEmitter } from './EventEmitter';

/**
 * 全局事件
 */
export const globalEmitter = new EventEmitter<GlobalEvents>();

/**
 * 事件列表
 */
export interface GlobalEvents
{

}
