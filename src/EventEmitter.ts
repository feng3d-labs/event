import { IEvent } from './IEvent';
import { IEventTarget } from './IEventTarget';
import { ListenerVO } from './ListenerVO';

/**
 * 事件属性名称常量
 */
const EVENT_KEY = '__event__';

/**
 * 事件派发器
 */
export class EventEmitter<T = any>
{
    /**
     * 目标与派发器映射。
     */
    private static targetEmitterMap = new Map<any, EventEmitter>();

    /**
     * 派发器与目标映射。
     */
    private static emitterTargetMap = new Map<EventEmitter, IEventTarget>();

    /**
     * 获取事件派发器
     * @param target
     */
    static getEventEmitter(target: any)
    {
        console.assert(target !== undefined && target !== null, `被监听对象无法为undefined或者null！`);
        if (target instanceof EventEmitter)
        {
            return target;
        }

        return this.targetEmitterMap.get(target);
    }

    /**
     * 获取事件派发器，当没有找到对应派发器时，返回新建的事件派发器。
     * @param target
     */
    static getOrCreateEventEmitter(target: any)
    {
        let eventEmitter = this.getEventEmitter(target);

        if (!eventEmitter)
        {
            eventEmitter = new EventEmitter(target);
        }

        return eventEmitter;
    }

    constructor(target?: any)
    {
        if (target === undefined)
        {
            target = this;
        }
        console.assert(!EventEmitter.targetEmitterMap.has(target), `同一个 ${target} 对象无法对应两个 EventEmitter！`);
        EventEmitter.targetEmitterMap.set(target, this);
        EventEmitter.emitterTargetMap.set(this, target);
    }

    /**
     * 返回监听的事件类型列表。
     */
    eventNames<K extends keyof T & string>()
    {
        const names = Object.keys(this[EVENT_KEY]) as K[];

        return names;
    }

    /**
     * 返回指定事件类型的监听数量。
     *
     * @param type 事件的类型。
     */
    listenerCount<K extends keyof T & string>(type: K): number
    {
        return this[EVENT_KEY]?.[type]?.length || 0;
    }

    /**
     * 监听一次事件后将会被移除
     *
     * @param type						事件的类型。
     * @param listener					处理事件的侦听器函数。
     * @param thisObject                listener函数作用域
     * @param priority					事件侦听器的优先级。数字越大，优先级越高。默认优先级为 0。
     */
    once<K extends keyof T & string>(type: K, listener: (event: IEvent<T[K]>) => void, thisObject?: any, priority = 0): this
    {
        this.on(type, listener, thisObject, priority, true);

        return this;
    }

    /**
     * 派发事件
     *
     * 当事件重复流向一个对象时将不会被处理。
     *
     * @param e   事件对象
     * @returns 返回事件是否被处理
     */
    emitEvent<K extends keyof T & string>(e: IEvent<T[K]>)
    {
        // 初次派发时初始化默认值
        if (!e.target)
        {
            // 初始化事件
            e.target = e.target || null;
            e.currentTarget = e.currentTarget || null;
            e.isStop = e.isStop || false;
            e.isStopBubbles = e.isStopBubbles || false;
            e.isStopBroadcast = e.isStopBroadcast || false;
            e.targets = e.targets || [];
            e.handles = e.handles || [];
        }

        const currentTarget = EventEmitter.emitterTargetMap.get(this);

        if (e.targets.indexOf(currentTarget) !== -1)
        {
            return false;
        }
        e.targets.push(currentTarget);

        // 处理事件
        const eventEmitter = EventEmitter.getOrCreateEventEmitter(currentTarget);
        eventEmitter.handleEvent(e);

        // 处理冒泡
        if (e.bubbles && !e.isStopBubbles)
        {
            eventEmitter.handelEventBubbles(e);
        }

        // 处理广播
        if (e.broadcast && !e.isStopBroadcast)
        {
            eventEmitter.handelEventBroadcast(e);
        }

        return e.handles.length > 0; // 当处理次数大于0时表示已被处理。
    }

    /**
     * 将事件调度到事件流中. 事件目标是对其调用 emitEvent() 方法的 Event 对象。
     *
     * @param type                      事件的类型。类型区分大小写。
     * @param data                      事件携带的自定义数据。
     * @param bubbles                   表示事件是否为冒泡到上级对象中。
     * @param broadcast                 表示事件是否为广播到下级对象中。
     *
     * @returns 返回发出后的事件。
     */
    emit<K extends keyof T & string>(type: K, data?: T[K], bubbles = false, broadcast = false)
    {
        const e = {
            type, data, bubbles, broadcast, target: null,
            currentTarget: null, isStop: false, isStopBubbles: false, isStopBroadcast: false, targets: [], handles: [],
            targetsIndex: 0,
            targetsBubblesIndex: 0,
        } as IEvent<T[K]>;

        this.emitEvent(e);

        return e;
    }

    /**
     * 将事件广播到下级对象中。
     *
     * @param type                      事件的类型。类型区分大小写。
     * @param data                      事件携带的自定义数据。
     *
     * @returns 返回广播后的事件。
     */
    broadcast<K extends keyof T & string>(type: K, data?: T[K])
    {
        return this.emit(type, data, false, true);
    }

    /**
     * 将事件冒泡到上级对象中。
     *
     * @param type                      事件的类型。类型区分大小写。
     * @param data                      事件携带的自定义数据。
     *
     * @returns 返回冒泡后的事件。
     */
    bubbles<K extends keyof T & string>(type: K, data?: T[K])
    {
        return this.emit(type, data, true, false);
    }

    /**
     * 检查 Event 对象是否为特定事件类型注册了任何侦听器.
     *
     * @param type		事件的类型。
     * @return 			如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
     */
    has<K extends keyof T & string>(type: K): boolean
    {
        return this.listenerCount(type) > 0;
    }

    /**
     * 为监听对象新增指定类型的事件监听。
     *
     * @param type						事件的类型。
     * @param listener					处理事件的监听器函数。
     * @param thisObject                监听器的上下文。可选。
     * @param priority					事件监听器的优先级。数字越大，优先级越高。默认为0。
     * @param once                      值为true时在监听一次事件后该监听器将被移除。默认为false。
     */
    on<K extends keyof T & string>(type: K, listener: (event: IEvent<T[K]>) => void, thisObject?: any, priority = 0, once = false): this
    {
        if (listener === null) return this;

        let objectListener: ObjectListener = this[EVENT_KEY];

        if (!objectListener)
        {
            objectListener = { __anyEventType__: [] };
            this[EVENT_KEY] = objectListener;
        }

        thisObject = thisObject || this;
        const listeners: ListenerVO[] = objectListener[type] = objectListener[type] || [];

        let i = 0;

        for (i = 0; i < listeners.length; i++)
        {
            const element = listeners[i];

            if (element.listener === listener && element.thisObject === thisObject)
            {
                listeners.splice(i, 1);
                break;
            }
        }
        for (i = 0; i < listeners.length; i++)
        {
            const element = listeners[i];

            if (priority > element.priority)
            {
                break;
            }
        }
        listeners.splice(i, 0, { listener, thisObject, priority, once });

        return this;
    }

    /**
     * 移除监听
     *
     * @param type						事件的类型。可选。该值为空时所有被监听对象上的监听均将被移除。
     * @param listener					要删除的监听器对象。可选。该值为空时所有指定类型的监听均将被移除。
     * @param thisObject                监听器的上下文。可选。
     */
    off<K extends keyof T & string>(type?: K, listener?: (event: IEvent<T[K]>) => void, thisObject?: any): this
    {
        if (!type)
        {
            this[EVENT_KEY] = undefined;

            return this;
        }

        const objectListener: ObjectListener = this[EVENT_KEY];

        if (!objectListener) return this;

        if (!listener)
        {
            delete objectListener[type];

            return this;
        }

        thisObject = thisObject || this;

        const listeners = objectListener[type];

        if (listeners)
        {
            for (let i = listeners.length - 1; i >= 0; i--)
            {
                const element = listeners[i];

                if (element.listener === listener && element.thisObject === thisObject)
                {
                    listeners.splice(i, 1);
                }
            }
            if (listeners.length === 0)
            {
                delete objectListener[type];
            }
        }

        return this;
    }

    /**
     * 移除所有监听
     *
     * @param type						事件的类型。可选。该值为空时所有被监听对象上的监听均将被移除。
     */
    offAll<K extends keyof T & string>(type?: K)
    {
        this.off(type);

        return this;
    }

    /**
     * 监听对象的任意事件，该对象的任意事件都将触发该监听器的调用。
     *
     * @param listener                  处理事件的监听器函数。
     * @param thisObject                监听器的上下文。可选。
     * @param priority                  事件监听器的优先级。数字越大，优先级越高。默认为0。
     * @param once                      值为true时在监听一次事件后该监听器将被移除。默认为false。
     */
    onAny<K extends keyof T & string>(listener: (event: IEvent<T[K]>) => void, thisObject?: any, priority = 0, once = false)
    {
        let objectListener: ObjectListener = this[EVENT_KEY];

        if (!objectListener)
        {
            objectListener = { __anyEventType__: [] };
            this[EVENT_KEY] = objectListener;
        }

        const listeners: ListenerVO[] = objectListener.__anyEventType__;

        let i = 0;

        for (i = 0; i < listeners.length; i++)
        {
            const element = listeners[i];

            if (element.listener === listener && element.thisObject === thisObject)
            {
                listeners.splice(i, 1);
                break;
            }
        }
        for (i = 0; i < listeners.length; i++)
        {
            const element = listeners[i];

            if (priority > element.priority)
            {
                break;
            }
        }
        listeners.splice(i, 0, { listener, thisObject, priority, once });

        return this;
    }

    /**
     * 移除监听对象的任意事件。
     *
     * @param listener                  处理事件的监听器函数。
     * @param thisObject                监听器的上下文。可选。
     */
    offAny<K extends keyof T & string>(listener?: (event: IEvent<T[K]>) => void, thisObject?: any)
    {
        const objectListener: ObjectListener = this[EVENT_KEY];

        if (!listener)
        {
            if (objectListener)
            {
                objectListener.__anyEventType__.length = 0;
            }

            return;
        }
        if (objectListener)
        {
            const listeners = objectListener.__anyEventType__;

            for (let i = listeners.length - 1; i >= 0; i--)
            {
                const element = listeners[i];

                if (element.listener === listener && element.thisObject === thisObject)
                {
                    listeners.splice(i, 1);
                }
            }
        }

        return this;
    }

    /**
     * 处理事件
     * @param e 事件
     */
    protected handleEvent<K extends keyof T & string>(e: IEvent<T[K]>)
    {
        // 设置目标
        const eventTarget = EventEmitter.emitterTargetMap.get(this);
        e.target = e.target || eventTarget;
        e.currentTarget = eventTarget;
        //
        const objectListener: ObjectListener = this[EVENT_KEY];

        if (!objectListener) return;

        let listeners: ListenerVO[] = objectListener[e.type];

        if (listeners)
        {
            // 遍历调用事件回调函数
            const listeners0 = listeners.concat();

            let i = 0;

            for (i = 0; i < listeners0.length && !e.isStop; i++)
            {
                listeners0[i].listener.call(listeners0[i].thisObject, e);// 此处可能会删除当前事件，所以上面必须拷贝
                e.handles.push(listeners0[i]);
            }
            for (i = listeners.length - 1; i >= 0; i--)
            {
                if (listeners[i].once)
                {
                    listeners.splice(i, 1);
                }
            }
            if (listeners.length === 0)
            {
                delete objectListener[e.type];
            }
        }
        // Any_EVENT_Type
        listeners = objectListener.__anyEventType__;
        if (listeners)
        {
            // 遍历调用事件回调函数
            const listeners0 = listeners.concat();

            for (let i = 0; i < listeners0.length && !e.isStop; i++)
            {
                listeners0[i].listener.call(listeners0[i].thisObject, e);// 此处可能会删除当前事件，所以上面必须拷贝
            }
            for (let i = listeners.length - 1; i >= 0; i--)
            {
                if (listeners[i].once)
                {
                    listeners.splice(i, 1);
                }
            }
        }
    }

    /**
     * 处理事件冒泡
     * @param e 事件
     */
    protected handelEventBubbles<K extends keyof T & string>(e: IEvent<T[K]>)
    {
        const eventTarget = EventEmitter.emitterTargetMap.get(this);
        if (typeof eventTarget?.getBubbleTargets === 'function')
        {
            const bubbleTargets = eventTarget.getBubbleTargets();

            bubbleTargets.forEach((v) =>
            {
                if (v !== undefined && e.targets.indexOf(v) === -1)
                {
                    // 传递事件
                    const eventEmitter = EventEmitter.getOrCreateEventEmitter(v);
                    eventEmitter.emitEvent(e);
                }
            });
        }
    }

    /**
     * 处理事件广播
     * @param e 事件
     */
    protected handelEventBroadcast<K extends keyof T & string>(e: IEvent<T[K]>)
    {
        const eventTarget = EventEmitter.emitterTargetMap.get(this);
        if (typeof eventTarget?.getBroadcastTargets === 'function')
        {
            const broadcastTargets = eventTarget.getBroadcastTargets();

            broadcastTargets.forEach((v) =>
            {
                if (v !== undefined && e.targets.indexOf(v) === -1)
                {
                    // 传递事件
                    const eventEmitter = EventEmitter.getOrCreateEventEmitter(v);
                    eventEmitter.emitEvent(e);
                }
            });
        }
    }
}

interface ObjectListener
{
    [type: string]: ListenerVO[];
    __anyEventType__: ListenerVO[];
}
