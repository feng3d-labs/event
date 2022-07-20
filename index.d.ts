declare namespace feng3d {
    /**
     * 任意事件发射器。
     *
     * 可以为任何对象甚至基础类型发射事件。
     *
     * 可针对（除undefined、null、Symbol外）的任意对象（0, 1, true, false, "1", {}）发射事件
     */
    class AnyEmitter<O = any, T = any> {
        /**
         * Return an array listing the events for which the emitter has registered
         * listeners.
         */
        eventNames(obj: O): string[];
        /**
         * Return the number of listeners listening to a given event.
         */
        listenerCount<K extends keyof T & string>(obj: O, type: K): number;
        /**
         * 监听一次事件后将会被移除
         * @param type						事件的类型。
         * @param listener					处理事件的监听器函数。
         * @param thisObject                listener函数作用域
         * @param priority					事件监听器的优先级。数字越大，优先级越高。默认为0。
         */
        once<K extends keyof T & string>(obj: O, type: K, listener: (event: IEvent<T[K]>) => void, thisObject?: any, priority?: number): this;
        /**
         * 发射事件
         *
         * 当事件重复流向一个对象时将不会被处理。
         *
         * @param event                 事件对象。
         * @returns                 返回事件是否被该对象处理。
         */
        emitEvent<K extends keyof T & string>(obj: O, event: IEvent<T[K]>): IEvent<T[K]>;
        /**
         * 将事件调度到事件流中. 事件目标是对其调用 emitEvent() 方法的 IEvent 对象。
         *
         * @param type 事件的类型。类型区分大小写。
         * @param data 事件携带的自定义数据。
         * @param bubbles 是否向上级报告事件。默认为`false`。
         * @param broadcast 是否向下级广播事件。默认为`false`。
         * @param share 是否向平级分享事件。默认为`true`。
         */
        emit<K extends keyof T & string>(obj: O, type: K, data?: T[K], bubbles?: boolean, broadcast?: boolean, share?: boolean): IEvent<T[K]>;
        /**
         * 检查 被监听对象 是否为特定事件类型注册了任何监听器.
         *
         * @param obj                       被监听对象。
         * @param type		                事件的类型。
         * @return 			                如果指定类型的监听器已注册，则值为 true；否则，值为 false。
         */
        has<K extends keyof T & string>(obj: O, type: K): boolean;
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
        on<K extends keyof T & string>(obj: O, type: K, listener: (event: IEvent<T[K]>) => any, thisObject?: any, priority?: number, once?: boolean): this;
        /**
         * 移除监听
         *
         * @param obj                       被监听对象。
         * @param type						事件的类型。可选。该值为空时所有被监听对象上的监听均将被移除。
         * @param listener					要删除的监听器对象。可选。该值为空时所有指定类型的监听均将被移除。
         * @param thisObject                监听器的上下文。可选。
         */
        off<K extends keyof T & string>(obj: O, type?: K, listener?: (event: IEvent<T[K]>) => any, thisObject?: any): this;
        /**
         * Remove all listeners, or those of the specified event.
         */
        offAll<K extends keyof T & string>(obj: O, type?: K): this;
        /**
         * 监听对象的任意事件，该对象的任意事件都将触发该监听器的调用。
         *
         * @param obj                       被监听对象。
         * @param listener                  处理事件的监听器函数。
         * @param thisObject                监听器的上下文。可选。
         * @param priority                  事件监听器的优先级。数字越大，优先级越高。默认为0。
         * @param once                      值为true时在监听一次事件后该监听器将被移除。默认为false。
         */
        onAny<K extends keyof T & string>(obj: O, listener: (event: IEvent<T[K]>) => void, thisObject?: any, priority?: number, once?: boolean): this;
        /**
         * 移除监听对象的任意事件。
         *
         * @param obj                       被监听对象。
         * @param listener                  处理事件的监听器函数。
         * @param thisObject                监听器的上下文。可选。
         */
        offAny<K extends keyof T & string>(obj: O, listener?: (event: IEvent<T[K]>) => void, thisObject?: any): this;
    }
    /**
     * 事件
     */
    const anyEmitter: AnyEmitter<any, any>;
}
declare namespace feng3d {
    /**
     * 事件发射器
     */
    class EventEmitter<T = any> {
        /**
         * 目标与发射器映射。
         */
        private static targetEmitterMap;
        /**
         * 发射器与目标映射。
         */
        private static emitterTargetMap;
        /**
         * 发射器与监听器映射。
         */
        private static emitterListenerMap;
        /**
         * 获取事件发射器
         * @param target
         */
        static getEventEmitter(target: any): EventEmitter<any>;
        /**
         * 获取事件发射器，当没有找到对应发射器时，返回新建的事件发射器。
         * @param target
         */
        static getOrCreateEventEmitter(target: any): EventEmitter<any>;
        constructor(target?: any);
        /**
         * 返回监听的事件类型列表。
         */
        eventNames<K extends keyof T & string>(): K[];
        /**
         * 返回指定事件类型的监听数量。
         *
         * @param type 事件的类型。
         */
        listenerCount<K extends keyof T & string>(type: K): number;
        /**
         * 监听一次事件后将会被移除
         *
         * @param type						事件的类型。
         * @param listener					处理事件的侦听器函数。
         * @param thisObject                listener函数作用域
         * @param priority					事件侦听器的优先级。数字越大，优先级越高。默认优先级为 0。
         */
        once<K extends keyof T & string>(type: K, listener: (event: IEvent<T[K]>) => void, thisObject?: any, priority?: number): this;
        /**
         * 发射事件。
         *
         * 当事件重复流向一个对象时将不会被处理。
         *
         * @param event   事件对象
         * @returns 返回事件是否被处理
         */
        emitEvent<K extends keyof T & string>(event: IEvent<T[K]>): IEvent<T[K]>;
        /**
         * 发射事件。
         *
         * @param type 事件的类型。类型区分大小写。
         * @param data 事件携带的自定义数据。
         * @param bubbles 是否向上级报告事件。默认为`false`。
         * @param broadcast 是否向下级广播事件。默认为`false`。
         * @param share 是否向平级分享事件。默认为`true`。
         *
         * @returns 返回发射后的事件。
         */
        emit<K extends keyof T & string>(type: K, data?: T[K], bubbles?: boolean, broadcast?: boolean, share?: boolean): IEvent<T[K]>;
        /**
         * 将事件广播到下级对象中。
         *
         * @param type                      事件的类型。类型区分大小写。
         * @param data                      事件携带的自定义数据。
         *
         * @returns 返回广播后的事件。
         */
        broadcast<K extends keyof T & string>(type: K, data?: T[K]): IEvent<T[K]>;
        /**
         * 将事件冒泡到上级对象中。
         *
         * @param type                      事件的类型。类型区分大小写。
         * @param data                      事件携带的自定义数据。
         *
         * @returns 返回冒泡后的事件。
         */
        bubbles<K extends keyof T & string>(type: K, data?: T[K]): IEvent<T[K]>;
        /**
         * 检查 Event 对象是否为特定事件类型注册了任何侦听器.
         *
         * @param type		事件的类型。
         * @return 			如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
         */
        has<K extends keyof T & string>(type: K): boolean;
        /**
         * 为监听对象新增指定类型的事件监听。
         *
         * @param type						事件的类型。
         * @param listener					处理事件的监听器函数。
         * @param thisObject                监听器的上下文。可选。
         * @param priority					事件监听器的优先级。数字越大，优先级越高。默认为0。
         * @param once                      值为true时在监听一次事件后该监听器将被移除。默认为false。
         */
        on<K extends keyof T & string>(type: K, listener: (event: IEvent<T[K]>) => void, thisObject?: any, priority?: number, once?: boolean): this;
        /**
         * 移除监听
         *
         * @param type						事件的类型。可选。该值为空时所有被监听对象上的监听均将被移除。
         * @param listener					要删除的监听器对象。可选。该值为空时所有指定类型的监听均将被移除。
         * @param thisObject                监听器的上下文。可选。
         */
        off<K extends keyof T & string>(type?: K, listener?: (event: IEvent<T[K]>) => void, thisObject?: any): this;
        /**
         * 移除所有监听
         *
         * @param type						事件的类型。可选。该值为空时所有被监听对象上的监听均将被移除。
         */
        offAll<K extends keyof T & string>(type?: K): this;
        /**
         * 监听对象的任意事件，该对象的任意事件都将触发该监听器的调用。
         *
         * @param listener                  处理事件的监听器函数。
         * @param thisObject                监听器的上下文。可选。
         * @param priority                  事件监听器的优先级。数字越大，优先级越高。默认为0。
         * @param once                      值为true时在监听一次事件后该监听器将被移除。默认为false。
         */
        onAny<K extends keyof T & string>(listener: (event: IEvent<T[K]>) => void, thisObject?: any, priority?: number, once?: boolean): this;
        /**
         * 移除监听对象的任意事件。
         *
         * @param listener                  处理事件的监听器函数。
         * @param thisObject                监听器的上下文。可选。
         */
        offAny<K extends keyof T & string>(listener?: (event: IEvent<T[K]>) => void, thisObject?: any): this;
        /**
         * 处理事件
         * @param e 事件
         */
        protected handleEvent<K extends keyof T & string>(e: IEvent<T[K]>): void;
        /**
         * 向平级分享事件
         *
         * @param event 事件
         */
        protected handelEventShare<K extends keyof T & string>(event: IEvent<T[K]>): void;
        /**
         * 向上级报告事件
         *
         * @param event 事件
         */
        protected handelEventBubbles<K extends keyof T & string>(event: IEvent<T[K]>): void;
        /**
         * 向下级广播事件
         *
         * @param event 事件
         */
        protected handelEventBroadcast<K extends keyof T & string>(event: IEvent<T[K]>): void;
    }
}
declare namespace feng3d {
    /**
     * 全局事件发射器。
     */
    const globalEmitter: EventEmitter<MixinsGlobalEvents>;
    /**
     * 事件列表
     */
    interface MixinsGlobalEvents {
    }
}
declare namespace feng3d {
    /**
     * 事件
     */
    interface IEvent<T = any> {
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
        target: IEventTarget;
        /**
         * 当前正在处理事件监听的事件对象。
         */
        currentTarget: IEventTarget;
        /**
         * 是否向平级分享事件。
         *
         * 如果值为`true`，则向平级分享事件，分享对象将由`IEventTarget.getShareTargets?()`获取。
         */
        share: boolean;
        /**
         * 是否停止向平级分享事件。
         */
        isStopShare: boolean;
        /**
         * 是否向上级报告事件。
         *
         * 如果值为`true`，则向上级报告事件，报告对象将由`IEventTarget.getBubbleTargets?()`获取。
         */
        bubbles: boolean;
        /**
         * 是否停止向上级报告事件。
         */
        isStopBubbles: boolean;
        /**
         * 是否向下级广播事件。
         *
         * 如果值为`true`，则向下级广播事件，广播对象将由`IEventTarget.getBroadcastTargets?()`获取。
         */
        broadcast: boolean;
        /**
         * 是否停止向下级广播事件。
         */
        isStopBroadcast: boolean;
        /**
         * 是否停止传播事件。
         *
         * 如果值为`true`，则停止事件传递（向平级分享、向上级报告、向下级广播）。
         */
        isStopTransmit: boolean;
        /**
         * 是否停止事件。
         *
         * 如果值为`true`，则停止事件传递（向平级分享、向上级报告、向下级广播），并且停止后续的事件监听器的执行。
         */
        isStop: boolean;
        /**
         * 事件流过的对象列表，事件路径
         */
        targets: any[];
        /**
         * 已处理的监听器列表。
         */
        handles: IEventListener[];
    }
}
declare namespace feng3d {
    /**
     * 事件监听器。
     */
    interface IEventListener {
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
}
declare namespace feng3d {
    /**
     * 派发事件的对象。
     */
    interface IEventTarget {
        /**
         * 获取分享的平级目标列表。
         */
        getShareTargets?(): IEventTarget[];
        /**
         * 获取报告的上级目标列表。默认返回 `[this.parent]` 。
         */
        getBubbleTargets?(): IEventTarget[];
        /**
         * 获取广播的下级目标列表。默认返回 `this.children` 。
         */
        getBroadcastTargets?(): IEventTarget[];
    }
}
declare namespace feng3d {
    /**
     * 只针对Object的事件
     */
    const objectEmitter: AnyEmitter<any, ObjectEventType>;
    /**
     * Object 事件类型
     */
    interface ObjectEventType {
        /**
         * 属性值变化
         */
        propertyValueChanged: {
            property: string;
            oldValue: any;
            newValue: any;
        };
    }
}
//# sourceMappingURL=index.d.ts.map