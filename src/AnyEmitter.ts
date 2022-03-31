import { IEvent, EventEmitter } from './EventEmitter';

/**
 * 任意事件发射器。
 *
 * 可以为任何对象甚至基础类型派发事件。
 *
 * 可针对（除undefined、null、Symbol外）的任意对象（0, 1, true, false, "1", {}）派发事件
 */
export class AnyEmitter<O = any, T = any>
{
    /**
     * Return an array listing the events for which the emitter has registered
     * listeners.
     */
    eventNames(obj: O)
    {
        console.assert(obj !== undefined && obj !== null, `被监听对象无法为undefined或者null！`);
        const names = EventEmitter.getEventEmitter(obj)?.eventNames() || [];

        return names;
    }

    /**
     * Return the number of listeners listening to a given event.
     */
    listenerCount<K extends keyof T & string>(obj: O, type: K)
    {
        console.assert(obj !== undefined && obj !== null, `被监听对象无法为undefined或者null！`);
        const count = EventEmitter.getEventEmitter(obj)?.listenerCount(type) || 0;

        return count;
    }

    /**
     * 监听一次事件后将会被移除
     * @param type						事件的类型。
     * @param listener					处理事件的监听器函数。
     * @param thisObject                listener函数作用域
     * @param priority					事件监听器的优先级。数字越大，优先级越高。默认为0。
     */
    once<K extends keyof T & string>(obj: O, type: K, listener: (event: IEvent<T[K]>) => void, thisObject = null, priority = 0)
    {
        console.assert(obj !== undefined && obj !== null, `被监听对象无法为undefined或者null！`);
        EventEmitter.getOrCreateEventEmitter(obj).once(type, listener, thisObject, priority);

        return this;
    }

    /**
     * 派发事件
     *
     * 当事件重复流向一个对象时将不会被处理。
     *
     * @param e                 事件对象。
     * @returns                 返回事件是否被该对象处理。
     */
    emitEvent<K extends keyof T & string>(obj: O, e: IEvent<T[K]>)
    {
        console.assert(obj !== undefined && obj !== null, `被监听对象无法为undefined或者null！`);
        const result = EventEmitter.getOrCreateEventEmitter(obj).emitEvent(e) || false;

        return result;
    }

    /**
     * 将事件调度到事件流中. 事件目标是对其调用 emitEvent() 方法的 IEvent 对象。
     * @param type                      事件的类型。类型区分大小写。
     * @param data                      事件携带的自定义数据。
     * @param bubbles                   表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
     */
    emit<K extends keyof T & string>(obj: O, type: K, data?: T[K], bubbles = false)
    {
        console.assert(obj !== undefined && obj !== null, `被监听对象无法为undefined或者null！`);
        const result = EventEmitter.getOrCreateEventEmitter(obj).emit(type, data, bubbles) || false;

        return result;
    }

    /**
     * 检查 被监听对象 是否为特定事件类型注册了任何监听器.
     *
     * @param obj                       被监听对象。
     * @param type		                事件的类型。
     * @return 			                如果指定类型的监听器已注册，则值为 true；否则，值为 false。
     */
    has<K extends keyof T & string>(obj: O, type: K)
    {
        console.assert(obj !== undefined && obj !== null, `被监听对象无法为undefined或者null！`);
        const result = EventEmitter.getEventEmitter(obj)?.has(type) || false;

        return result;
    }

    /**
     * 为监听对象新增指定类型的事件监听。
     *
     * @param obj                       被监听对象。
     * @param type						事件的类型。
     * @param listener					处理事件的监听器函数。
     * @param thisObject                监听器的上下文。可选。
     * @param priority					事件监听器的优先级。数字越大，优先级越高。默认为0。
     * @param once                      值为true时在监听一次事件后该监听器将被移除。默认为false。
     */
    on<K extends keyof T & string>(obj: O, type: K, listener: (event: IEvent<T[K]>) => any, thisObject?: any, priority = 0, once = false)
    {
        console.assert(obj !== undefined && obj !== null, `被监听对象无法为undefined或者null！`);
        EventEmitter.getOrCreateEventEmitter(obj).on(type, listener, thisObject, priority, once);

        return this;
    }

    /**
     * 移除监听
     *
     * @param obj                       被监听对象。
     * @param type						事件的类型。可选。该值为空时所有被监听对象上的监听均将被移除。
     * @param listener					要删除的监听器对象。可选。该值为空时所有指定类型的监听均将被移除。
     * @param thisObject                监听器的上下文。可选。
     */
    off<K extends keyof T & string>(obj: O, type?: K, listener?: (event: IEvent<T[K]>) => any, thisObject?: any)
    {
        console.assert(obj !== undefined && obj !== null, `被监听对象无法为undefined或者null！`);
        EventEmitter.getEventEmitter(obj)?.off(type, listener, thisObject);

        return this;
    }

    /**
     * Remove all listeners, or those of the specified event.
     */
    offAll<K extends keyof T & string>(obj: O, type?: K)
    {
        console.assert(obj !== undefined && obj !== null, `被监听对象无法为undefined或者null！`);
        EventEmitter.getEventEmitter(obj)?.offAll(type);

        return this;
    }

    /**
     * 监听对象的任意事件，该对象的任意事件都将触发该监听器的调用。
     *
     * @param obj                       被监听对象。
     * @param listener                  处理事件的监听器函数。
     * @param thisObject                监听器的上下文。可选。
     * @param priority                  事件监听器的优先级。数字越大，优先级越高。默认为0。
     * @param once                      值为true时在监听一次事件后该监听器将被移除。默认为false。
     */
    onAny<K extends keyof T & string>(obj: O, listener: (event: IEvent<T[K]>) => void, thisObject?: any, priority = 0, once = false)
    {
        console.assert(obj !== undefined && obj !== null, `被监听对象无法为undefined或者null！`);
        EventEmitter.getOrCreateEventEmitter(obj).onAny(listener, thisObject, priority, once);

        return this;
    }

    /**
     * 移除监听对象的任意事件。
     *
     * @param obj                       被监听对象。
     * @param listener                  处理事件的监听器函数。
     * @param thisObject                监听器的上下文。可选。
     */
    offAny<K extends keyof T & string>(obj: O, listener?: (event: IEvent<T[K]>) => void, thisObject?: any)
    {
        console.assert(obj !== undefined && obj !== null, `被监听对象无法为undefined或者null！`);
        EventEmitter.getEventEmitter(obj)?.offAny(listener, thisObject);

        return this;
    }

    /**
     * 初始化事件对象
     *
     * @param type                      事件的类型。类型区分大小写。
     * @param data                      事件携带的自定义数据。
     * @param bubbles                   表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
     */
    makeEvent<K extends keyof T & string>(type: K, data: T, bubbles = false): IEvent<T>
    {
        const e = {
            type, data, bubbles, target: null,
            currentTarget: null, isStop: false, isStopBubbles: false, targets: [], handles: [],
            targetsIndex: -1,
            targetsBubblesIndex: -1,
        } as IEvent<T>;

        return e;
    }
}

/**
 * 事件
 */
export const anyEmitter = new AnyEmitter();