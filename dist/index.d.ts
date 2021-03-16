declare namespace feng3d {
    /**
     * 事件派发器
     */
    export class EventEmitter<T = any> {
        private static targetMap;
        private __events__;
        constructor(target?: any);
        /**
         * Return an array listing the events for which the emitter has registered
         * listeners.
         */
        eventNames(): string[];
        /**
         * Return the number of listeners listening to a given event.
         */
        listenerCount<K extends keyof T & string>(type: K): number;
        /**
         * 监听一次事件后将会被移除
         * @param type						事件的类型。
         * @param listener					处理事件的侦听器函数。
         * @param thisObject                listener函数作用域
         * @param priority					事件侦听器的优先级。数字越大，优先级越高。默认优先级为 0。
         */
        once<K extends keyof T & string>(type: K, listener: (event: Event<T[K]>) => void, thisObject?: any, priority?: number): this;
        /**
         * 派发事件
         *
         * 当事件重复流向一个对象时将不会被处理。
         *
         * @param e   事件对象
         * @returns 返回事件是否被该对象处理
         */
        emitEvent<K extends keyof T & string>(e: Event<T[K]>): boolean;
        /**
         * 将事件调度到事件流中. 事件目标是对其调用 dispatchEvent() 方法的 IEvent 对象。
         * @param type                      事件的类型。类型区分大小写。
         * @param data                      事件携带的自定义数据。
         * @param bubbles                   表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
         */
        emit<K extends keyof T & string>(type: K, data?: T[K]): boolean;
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
        on<K extends keyof T & string>(type: K, listener: (event: Event<T[K]>) => void, thisObject?: any, priority?: number, once?: boolean): this;
        /**
         * 移除监听
         *
         * @param type						事件的类型。可选。该值为空时所有被监听对象上的监听均将被移除。
         * @param listener					要删除的监听器对象。可选。该值为空时所有指定类型的监听均将被移除。
         * @param thisObject                监听器的上下文。可选。
         */
        off<K extends keyof T & string>(type?: K, listener?: (event: Event<T[K]>) => void, thisObject?: any): this;
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
         */
        onAny<K extends keyof T & string>(listener: (event: Event<T[K]>) => void, thisObject?: any, priority?: number): this;
        /**
         * 移除监听对象的任意事件。
         *
         * @param listener                  处理事件的监听器函数。
         * @param thisObject                监听器的上下文。可选。
         */
        offAny<K extends keyof T & string>(listener?: (event: Event<T[K]>) => void, thisObject?: any): this;
        /**
         * 处理事件
         * @param e 事件
         */
        protected handleEvent<K extends keyof T & string>(e: Event<T[K]>): void;
    }
    /**
     * 事件
     */
    export interface Event<T> {
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
        target: any;
        /**
         * 当前正在使用某个事件监听器处理 Event 对象的对象。
         */
        currentTarget: any;
        /**
         * 是否停止处理事件监听器
         */
        isStop: boolean;
        /**
         * 事件流过的对象列表，事件路径
         */
        targets: any[];
        /**
         * 处理列表
         */
        handles: ListenerVO[];
    }
    /**
     * 监听数据
     */
    interface ListenerVO {
        /**
         * 监听函数
         */
        listener: (event: Event<any>) => void;
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
    export {};
}
declare namespace feng3d {
    /**
     * 事件
     */
    interface Event<T> {
        /**
         * 表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
         */
        bubbles?: boolean;
        /**
         * 是否停止冒泡
         */
        isStopBubbles?: boolean;
    }
    /**
     * 事件冒泡派发器，可处理冒泡事件。
     */
    class EventBubbleEmitter<T = any> extends EventEmitter<T> {
        /**
         * 将事件调度到事件流中. 事件目标是对其调用 dispatchEvent() 方法的 IEvent 对象。
         * @param type                      事件的类型。类型区分大小写。
         * @param data                      事件携带的自定义数据。
         * @param bubbles                   表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
         */
        emit<K extends keyof T & string>(type: K, data?: T[K], bubbles?: boolean): boolean;
        /**
         * 派发事件
         *
         * 当事件重复流向一个对象时将不会被处理。
         *
         * @param e   事件对象
         * @returns 返回事件是否被该对象处理
         */
        emitEvent<K extends keyof T & string>(e: Event<T[K]>): boolean;
        /**
         * 获取冒泡对象，由子类实现。
         */
        protected getBubbleTargets(): EventEmitter[];
        /**
         * 处理事件冒泡
         * @param e 事件
         */
        protected handelEventBubbles<K extends keyof T & string>(e: Event<T[K]>): void;
    }
}
declare namespace feng3d {
    /**
     * 事件
     */
    var event: FEvent;
    /**
     * 事件
     */
    class FEvent {
        private feventMap;
        private getBubbleTargets;
        /**
         * Return an array listing the events for which the emitter has registered
         * listeners.
         */
        eventNames(obj: any): string[];
        /**
         * Return the number of listeners listening to a given event.
         */
        listenerCount(obj: any, type: string): any;
        /**
         * 监听一次事件后将会被移除
         * @param type						事件的类型。
         * @param listener					处理事件的监听器函数。
         * @param thisObject                listener函数作用域
         * @param priority					事件监听器的优先级。数字越大，优先级越高。默认为0。
         */
        once(obj: Object, type: string, listener: (event: Event<any>) => void, thisObject?: any, priority?: number): this;
        /**
         * 派发事件
         *
         * 当事件重复流向一个对象时将不会被处理。
         *
         * @param e                 事件对象。
         * @returns                 返回事件是否被该对象处理。
         */
        dispatchEvent(obj: Object, e: Event<any>): boolean;
        /**
         * 将事件调度到事件流中. 事件目标是对其调用 dispatchEvent() 方法的 IEvent 对象。
         * @param type                      事件的类型。类型区分大小写。
         * @param data                      事件携带的自定义数据。
         * @param bubbles                   表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
         */
        emit(obj: Object, type: string, data?: any, bubbles?: boolean): Event<any>;
        /**
         * 检查 被监听对象 是否为特定事件类型注册了任何监听器.
         *
         * @param obj                       被监听对象。
         * @param type		                事件的类型。
         * @return 			                如果指定类型的监听器已注册，则值为 true；否则，值为 false。
         */
        has(obj: Object, type: string): boolean;
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
        on(obj: Object, type: string, listener: (event: Event<any>) => any, thisObject?: any, priority?: number, once?: boolean): this;
        /**
         * 移除监听
         *
         * @param obj                       被监听对象。
         * @param type						事件的类型。可选。该值为空时所有被监听对象上的监听均将被移除。
         * @param listener					要删除的监听器对象。可选。该值为空时所有指定类型的监听均将被移除。
         * @param thisObject                监听器的上下文。可选。
         */
        off(obj: Object, type?: string, listener?: (event: Event<any>) => any, thisObject?: any): this;
        /**
         * Remove all listeners, or those of the specified event.
         */
        offAll(obj: any, type?: string): this;
        /**
         * 监听对象的任意事件，该对象的任意事件都将触发该监听器的调用。
         *
         * @param obj                       被监听对象。
         * @param listener                  处理事件的监听器函数。
         * @param thisObject                监听器的上下文。可选。
         * @param priority                  事件监听器的优先级。数字越大，优先级越高。默认为0。
         */
        onAny(obj: Object, listener: (event: Event<any>) => void, thisObject?: any, priority?: number): this;
        /**
         * 移除监听对象的任意事件。
         *
         * @param obj                       被监听对象。
         * @param listener                  处理事件的监听器函数。
         * @param thisObject                监听器的上下文。可选。
         */
        offAny(obj: Object, listener?: (event: any) => void, thisObject?: any): this;
        /**
         * 初始化事件对象
         *
         * @param type                      事件的类型。类型区分大小写。
         * @param data                      事件携带的自定义数据。
         * @param bubbles                   表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
         */
        makeEvent<T>(type: string, data: T, bubbles?: boolean): Event<T>;
        /**
         * 处理事件
         * @param e 事件
         */
        protected handleEvent(obj: Object, e: Event<any>): void;
        /**
         * 处理事件冒泡
         * @param e 事件
         */
        protected handelEventBubbles(obj: Object, e: Event<any>): void;
    }
}
//# sourceMappingURL=index.d.ts.map