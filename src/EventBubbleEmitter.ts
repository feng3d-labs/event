namespace feng3d
{

    /**
     * 事件
     */
    export interface Event<T>
    {
        /**
         * 表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
         */
        bubbles?: boolean

        /**
         * 是否停止冒泡
         */
        isStopBubbles?: boolean
    }

    /**
     * 事件冒泡派发器，可处理冒泡事件。
     */
    export class EventBubbleEmitter<T = any> extends EventEmitter<T>
    {

        /**
         * 将事件调度到事件流中. 事件目标是对其调用 dispatchEvent() 方法的 IEvent 对象。
         * @param type                      事件的类型。类型区分大小写。
         * @param data                      事件携带的自定义数据。
         * @param bubbles                   表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
         */
        emit<K extends keyof T & string>(type: K, data?: T[K], bubbles = false)
        {
            var e: Event<T[K]> = { type: type, data: data, bubbles: bubbles, target: null, currentTarget: null, isStop: false, isStopBubbles: false, targets: [], handles: [] };
            return this.emitEvent(e);
        }

        /**
         * 派发事件
         * 
         * 当事件重复流向一个对象时将不会被处理。
         * 
         * @param e   事件对象
         * @returns 返回事件是否被该对象处理
         */
        emitEvent<K extends keyof T & string>(e: Event<T[K]>)
        {
            super.emitEvent(e);

            this.handelEventBubbles(e);

            return true;
        }

        /**
         * 获取冒泡对象，由子类实现。
         */
        protected getBubbleTargets(): EventEmitter[]
        {
            return [];
        }

        /**
         * 处理事件冒泡
         * @param e 事件
         */
        protected handelEventBubbles<K extends keyof T & string>(e: Event<T[K]>)
        {
            if (e.bubbles && !e.isStopBubbles)
            {
                var bubbleTargets = this.getBubbleTargets();
                for (var i = 0, n = bubbleTargets.length; i < n; i++)
                {
                    var bubbleTarget = bubbleTargets[i];
                    if (!e.isStop && bubbleTarget)
                    {
                        bubbleTarget.emitEvent(e);
                    }
                }
            }
        }
    }
}