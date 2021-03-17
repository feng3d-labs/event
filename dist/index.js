var feng3d;
(function (feng3d) {
    /**
     * 事件属性名称常量
     */
    feng3d.__event__ = "__event__";
    /**
     * 事件派发器代理的对象
     */
    feng3d.__event_emitter_target__ = "__event_emitter_target__";
    /**
     * 事件冒泡函数名称常量，冒泡的对象需要定义该名称的函数。
     *
     * function __event_bubble_function__(): any[];
     *
     * var bubbleObject: { __event_bubble_function__: () => any[] }
     */
    feng3d.__event_bubble_function__ = "__event_bubble_function__";
    /**
     * 事件派发器
     */
    var EventEmitter = /** @class */ (function () {
        function EventEmitter(target) {
            if (target === undefined) {
                target = this;
            }
            console.assert(!EventEmitter.targetMap.has(target), "\u540C\u4E00\u4E2A " + target + " \u5BF9\u8C61\u65E0\u6CD5\u5BF9\u5E94\u4E24\u4E2A EventEmitter\uFF01");
            EventEmitter.targetMap.set(target, this);
            this[feng3d.__event_emitter_target__] = target;
        }
        /**
         * 获取事件派发器
         * @param target
         */
        EventEmitter.getEventEmitter = function (target) {
            console.assert(target !== undefined && target !== null, "\u88AB\u76D1\u542C\u5BF9\u8C61\u65E0\u6CD5\u4E3Aundefined\u6216\u8005null\uFF01");
            if (target instanceof EventEmitter) {
                return target;
            }
            return this.targetMap.get(target);
        };
        /**
         * 获取事件派发器，当没有找到对应派发器时，返回新建的事件派发器。
         * @param target
         */
        EventEmitter.getOrCreateEventEmitter = function (target) {
            var eventEmitter = this.getEventEmitter(target);
            if (!eventEmitter) {
                eventEmitter = new EventEmitter(target);
            }
            return eventEmitter;
        };
        /**
         * 返回监听的事件类型列表。
         */
        EventEmitter.prototype.eventNames = function () {
            var names = Object.keys(this[feng3d.__event__]);
            return names;
        };
        /**
         * 返回指定事件类型的监听数量。
         *
         * @param type 事件的类型。
         */
        EventEmitter.prototype.listenerCount = function (type) {
            var _a, _b;
            return ((_b = (_a = this[feng3d.__event__]) === null || _a === void 0 ? void 0 : _a[type]) === null || _b === void 0 ? void 0 : _b.length) || 0;
        };
        /**
         * 监听一次事件后将会被移除
         * @param type						事件的类型。
         * @param listener					处理事件的侦听器函数。
         * @param thisObject                listener函数作用域
         * @param priority					事件侦听器的优先级。数字越大，优先级越高。默认优先级为 0。
         */
        EventEmitter.prototype.once = function (type, listener, thisObject, priority) {
            if (priority === void 0) { priority = 0; }
            this.on(type, listener, thisObject, priority, true);
            return this;
        };
        /**
         * 派发事件
         *
         * 当事件重复流向一个对象时将不会被处理。
         *
         * @param e   事件对象
         * @returns 返回事件是否被该对象处理
         */
        EventEmitter.prototype.emitEvent = function (e) {
            // 是否为初次派发
            var isEventStart = !e.target;
            if (isEventStart) {
                // 初始化事件
                e.target = e.target || null;
                e.currentTarget = e.currentTarget || null;
                e.isStop = e.isStop || false;
                e.isStopBubbles = e.isStopBubbles || false;
                e.targets = e.targets || [];
                e.handles = e.handles || [];
                e.targetsIndex = e.targetsIndex || 0;
                e.targetsBubblesIndex = e.targetsBubblesIndex || 0;
            }
            var targets = e.targets;
            if (targets.indexOf(this[feng3d.__event_emitter_target__]) != -1)
                return false;
            targets.push(this[feng3d.__event_emitter_target__]);
            // 
            var index = e.targetsIndex;
            while (targets.length > index) {
                var n = targets.length;
                // 派发事件
                while (e.targetsIndex < n) {
                    var eventEmitter = EventEmitter.getOrCreateEventEmitter(targets[e.targetsIndex++]);
                    eventEmitter.handleEvent(e); // 传递到其它对象中去，将会增加 targets 的长度。
                }
                index = e.targetsIndex;
                if (isEventStart) // 统一在派发事件入口处理冒泡
                 {
                    // 处理冒泡
                    if (e.bubbles && !e.isStopBubbles) {
                        while (e.targetsBubblesIndex < n) {
                            var eventEmitter = EventEmitter.getOrCreateEventEmitter(targets[e.targetsBubblesIndex++]);
                            eventEmitter.handelEventBubbles(e); // 冒泡到其它对象中去，将会增加 targets 的长度。
                        }
                        index = e.targetsBubblesIndex;
                    }
                }
            }
            return true;
        };
        /**
         * 将事件调度到事件流中. 事件目标是对其调用 emitEvent() 方法的 Event 对象。
         * @param type                      事件的类型。类型区分大小写。
         * @param data                      事件携带的自定义数据。
         * @param bubbles                   表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
         */
        EventEmitter.prototype.emit = function (type, data, bubbles) {
            if (bubbles === void 0) { bubbles = false; }
            var e = { type: type, data: data, bubbles: bubbles, target: null, currentTarget: null, isStop: false, isStopBubbles: false, targets: [], handles: [] };
            return this.emitEvent(e);
        };
        /**
         * 检查 Event 对象是否为特定事件类型注册了任何侦听器.
         *
         * @param type		事件的类型。
         * @return 			如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
         */
        EventEmitter.prototype.has = function (type) {
            return this.listenerCount(type) > 0;
        };
        /**
         * 为监听对象新增指定类型的事件监听。
         *
         * @param type						事件的类型。
         * @param listener					处理事件的监听器函数。
         * @param thisObject                监听器的上下文。可选。
         * @param priority					事件监听器的优先级。数字越大，优先级越高。默认为0。
         * @param once                      值为true时在监听一次事件后该监听器将被移除。默认为false。
         */
        EventEmitter.prototype.on = function (type, listener, thisObject, priority, once) {
            if (priority === void 0) { priority = 0; }
            if (once === void 0) { once = false; }
            if (listener == null)
                return;
            var objectListener = this[feng3d.__event__];
            if (!objectListener) {
                objectListener = { __anyEventType__: [] };
                this[feng3d.__event__] = objectListener;
            }
            thisObject = thisObject || this;
            var listeners = objectListener[type] = objectListener[type] || [];
            for (var i = 0; i < listeners.length; i++) {
                var element = listeners[i];
                if (element.listener == listener && element.thisObject == thisObject) {
                    listeners.splice(i, 1);
                    break;
                }
            }
            for (var i = 0; i < listeners.length; i++) {
                var element = listeners[i];
                if (priority > element.priority) {
                    break;
                }
            }
            listeners.splice(i, 0, { listener: listener, thisObject: thisObject, priority: priority, once: once });
            return this;
        };
        /**
         * 移除监听
         *
         * @param type						事件的类型。可选。该值为空时所有被监听对象上的监听均将被移除。
         * @param listener					要删除的监听器对象。可选。该值为空时所有指定类型的监听均将被移除。
         * @param thisObject                监听器的上下文。可选。
         */
        EventEmitter.prototype.off = function (type, listener, thisObject) {
            if (!type) {
                this[feng3d.__event__] = undefined;
                return;
            }
            var objectListener = this[feng3d.__event__];
            if (!objectListener)
                return;
            if (!listener) {
                delete objectListener[type];
                return;
            }
            thisObject = thisObject || this;
            var listeners = objectListener[type];
            if (listeners) {
                for (var i = listeners.length - 1; i >= 0; i--) {
                    var element = listeners[i];
                    if (element.listener == listener && element.thisObject == thisObject) {
                        listeners.splice(i, 1);
                    }
                }
                if (listeners.length == 0) {
                    delete objectListener[type];
                }
            }
            return this;
        };
        /**
         * 移除所有监听
         *
         * @param type						事件的类型。可选。该值为空时所有被监听对象上的监听均将被移除。
         */
        EventEmitter.prototype.offAll = function (type) {
            this.off(type);
            return this;
        };
        /**
         * 监听对象的任意事件，该对象的任意事件都将触发该监听器的调用。
         *
         * @param listener                  处理事件的监听器函数。
         * @param thisObject                监听器的上下文。可选。
         * @param priority                  事件监听器的优先级。数字越大，优先级越高。默认为0。
         * @param once                      值为true时在监听一次事件后该监听器将被移除。默认为false。
         */
        EventEmitter.prototype.onAny = function (listener, thisObject, priority, once) {
            if (priority === void 0) { priority = 0; }
            if (once === void 0) { once = false; }
            var objectListener = this[feng3d.__event__];
            if (!objectListener) {
                objectListener = { __anyEventType__: [] };
                this[feng3d.__event__] = objectListener;
            }
            var listeners = objectListener.__anyEventType__;
            for (var i = 0; i < listeners.length; i++) {
                var element = listeners[i];
                if (element.listener == listener && element.thisObject == thisObject) {
                    listeners.splice(i, 1);
                    break;
                }
            }
            for (var i = 0; i < listeners.length; i++) {
                var element = listeners[i];
                if (priority > element.priority) {
                    break;
                }
            }
            listeners.splice(i, 0, { listener: listener, thisObject: thisObject, priority: priority, once: once });
            return this;
        };
        /**
         * 移除监听对象的任意事件。
         *
         * @param listener                  处理事件的监听器函数。
         * @param thisObject                监听器的上下文。可选。
         */
        EventEmitter.prototype.offAny = function (listener, thisObject) {
            var objectListener = this[feng3d.__event__];
            if (!listener) {
                if (objectListener)
                    objectListener.__anyEventType__.length = 0;
                return;
            }
            if (objectListener) {
                var listeners = objectListener.__anyEventType__;
                for (var i = listeners.length - 1; i >= 0; i--) {
                    var element = listeners[i];
                    if (element.listener == listener && element.thisObject == thisObject) {
                        listeners.splice(i, 1);
                    }
                }
            }
            return this;
        };
        /**
         * 处理事件
         * @param e 事件
         */
        EventEmitter.prototype.handleEvent = function (e) {
            //设置目标
            e.target = e.target || this[feng3d.__event_emitter_target__];
            e.currentTarget = this[feng3d.__event_emitter_target__];
            //
            var objectListener = this[feng3d.__event__];
            if (!objectListener)
                return;
            var listeners = objectListener[e.type];
            if (listeners) {
                //遍历调用事件回调函数
                var listeners0 = listeners.concat();
                for (var i = 0; i < listeners0.length && !e.isStop; i++) {
                    listeners0[i].listener.call(listeners0[i].thisObject, e); //此处可能会删除当前事件，所以上面必须拷贝
                    e.handles.push(listeners0[i]);
                }
                for (var i = listeners.length - 1; i >= 0; i--) {
                    if (listeners[i].once)
                        listeners.splice(i, 1);
                }
                if (listeners.length == 0)
                    delete objectListener[e.type];
            }
            // Any_EVENT_Type
            listeners = objectListener.__anyEventType__;
            if (listeners) {
                //遍历调用事件回调函数
                var listeners0 = listeners.concat();
                for (var i = 0; i < listeners0.length && !e.isStop; i++) {
                    listeners0[i].listener.call(listeners0[i].thisObject, e); //此处可能会删除当前事件，所以上面必须拷贝
                }
                for (var i = listeners.length - 1; i >= 0; i--) {
                    if (listeners[i].once)
                        listeners.splice(i, 1);
                }
            }
        };
        /**
         * 处理事件冒泡
         * @param e 事件
         */
        EventEmitter.prototype.handelEventBubbles = function (e) {
            var _a;
            if (typeof ((_a = this[feng3d.__event_emitter_target__]) === null || _a === void 0 ? void 0 : _a[feng3d.__event_bubble_function__]) === "function") {
                var bubbleTargets = this[feng3d.__event_emitter_target__][feng3d.__event_bubble_function__]();
                bubbleTargets.forEach(function (v) {
                    if (v !== undefined && e.targets.indexOf(v) === -1) {
                        e.targets.push(v);
                    }
                });
            }
        };
        EventEmitter.targetMap = new Map();
        return EventEmitter;
    }());
    feng3d.EventEmitter = EventEmitter;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 可针对（除undefined、null、Symbol外）的任意对象（0, 1, true, false, "1", {}）派发事件
     */
    var FEvent = /** @class */ (function () {
        function FEvent() {
        }
        /**
         * Return an array listing the events for which the emitter has registered
         * listeners.
         */
        FEvent.prototype.eventNames = function (obj) {
            var _a;
            console.assert(obj !== undefined && obj !== null, "\u88AB\u76D1\u542C\u5BF9\u8C61\u65E0\u6CD5\u4E3Aundefined\u6216\u8005null\uFF01");
            var names = ((_a = feng3d.EventEmitter.getEventEmitter(obj)) === null || _a === void 0 ? void 0 : _a.eventNames()) || [];
            return names;
        };
        /**
         * Return the number of listeners listening to a given event.
         */
        FEvent.prototype.listenerCount = function (obj, type) {
            var _a;
            console.assert(obj !== undefined && obj !== null, "\u88AB\u76D1\u542C\u5BF9\u8C61\u65E0\u6CD5\u4E3Aundefined\u6216\u8005null\uFF01");
            var count = ((_a = feng3d.EventEmitter.getEventEmitter(obj)) === null || _a === void 0 ? void 0 : _a.listenerCount(type)) || 0;
            return count;
        };
        /**
         * 监听一次事件后将会被移除
         * @param type						事件的类型。
         * @param listener					处理事件的监听器函数。
         * @param thisObject                listener函数作用域
         * @param priority					事件监听器的优先级。数字越大，优先级越高。默认为0。
         */
        FEvent.prototype.once = function (obj, type, listener, thisObject, priority) {
            if (thisObject === void 0) { thisObject = null; }
            if (priority === void 0) { priority = 0; }
            console.assert(obj !== undefined && obj !== null, "\u88AB\u76D1\u542C\u5BF9\u8C61\u65E0\u6CD5\u4E3Aundefined\u6216\u8005null\uFF01");
            feng3d.EventEmitter.getOrCreateEventEmitter(obj).once(type, listener, thisObject, priority);
            return this;
        };
        /**
         * 派发事件
         *
         * 当事件重复流向一个对象时将不会被处理。
         *
         * @param e                 事件对象。
         * @returns                 返回事件是否被该对象处理。
         */
        FEvent.prototype.emitEvent = function (obj, e) {
            console.assert(obj !== undefined && obj !== null, "\u88AB\u76D1\u542C\u5BF9\u8C61\u65E0\u6CD5\u4E3Aundefined\u6216\u8005null\uFF01");
            var result = feng3d.EventEmitter.getOrCreateEventEmitter(obj).emitEvent(e) || false;
            return result;
        };
        /**
         * 将事件调度到事件流中. 事件目标是对其调用 emitEvent() 方法的 IEvent 对象。
         * @param type                      事件的类型。类型区分大小写。
         * @param data                      事件携带的自定义数据。
         * @param bubbles                   表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
         */
        FEvent.prototype.emit = function (obj, type, data, bubbles) {
            if (bubbles === void 0) { bubbles = false; }
            console.assert(obj !== undefined && obj !== null, "\u88AB\u76D1\u542C\u5BF9\u8C61\u65E0\u6CD5\u4E3Aundefined\u6216\u8005null\uFF01");
            var result = feng3d.EventEmitter.getOrCreateEventEmitter(obj).emit(type, data, bubbles) || false;
            return result;
        };
        /**
         * 检查 被监听对象 是否为特定事件类型注册了任何监听器.
         *
         * @param obj                       被监听对象。
         * @param type		                事件的类型。
         * @return 			                如果指定类型的监听器已注册，则值为 true；否则，值为 false。
         */
        FEvent.prototype.has = function (obj, type) {
            var _a;
            console.assert(obj !== undefined && obj !== null, "\u88AB\u76D1\u542C\u5BF9\u8C61\u65E0\u6CD5\u4E3Aundefined\u6216\u8005null\uFF01");
            var result = ((_a = feng3d.EventEmitter.getEventEmitter(obj)) === null || _a === void 0 ? void 0 : _a.has(type)) || false;
            return result;
        };
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
        FEvent.prototype.on = function (obj, type, listener, thisObject, priority, once) {
            if (priority === void 0) { priority = 0; }
            if (once === void 0) { once = false; }
            console.assert(obj !== undefined && obj !== null, "\u88AB\u76D1\u542C\u5BF9\u8C61\u65E0\u6CD5\u4E3Aundefined\u6216\u8005null\uFF01");
            feng3d.EventEmitter.getOrCreateEventEmitter(obj).on(type, listener, thisObject, priority, once);
            return this;
        };
        /**
         * 移除监听
         *
         * @param obj                       被监听对象。
         * @param type						事件的类型。可选。该值为空时所有被监听对象上的监听均将被移除。
         * @param listener					要删除的监听器对象。可选。该值为空时所有指定类型的监听均将被移除。
         * @param thisObject                监听器的上下文。可选。
         */
        FEvent.prototype.off = function (obj, type, listener, thisObject) {
            var _a;
            console.assert(obj !== undefined && obj !== null, "\u88AB\u76D1\u542C\u5BF9\u8C61\u65E0\u6CD5\u4E3Aundefined\u6216\u8005null\uFF01");
            (_a = feng3d.EventEmitter.getEventEmitter(obj)) === null || _a === void 0 ? void 0 : _a.off(type, listener, thisObject);
            return this;
        };
        /**
         * Remove all listeners, or those of the specified event.
         */
        FEvent.prototype.offAll = function (obj, type) {
            var _a;
            console.assert(obj !== undefined && obj !== null, "\u88AB\u76D1\u542C\u5BF9\u8C61\u65E0\u6CD5\u4E3Aundefined\u6216\u8005null\uFF01");
            (_a = feng3d.EventEmitter.getEventEmitter(obj)) === null || _a === void 0 ? void 0 : _a.offAll(type);
            return this;
        };
        /**
         * 监听对象的任意事件，该对象的任意事件都将触发该监听器的调用。
         *
         * @param obj                       被监听对象。
         * @param listener                  处理事件的监听器函数。
         * @param thisObject                监听器的上下文。可选。
         * @param priority                  事件监听器的优先级。数字越大，优先级越高。默认为0。
         * @param once                      值为true时在监听一次事件后该监听器将被移除。默认为false。
         */
        FEvent.prototype.onAny = function (obj, listener, thisObject, priority, once) {
            if (priority === void 0) { priority = 0; }
            if (once === void 0) { once = false; }
            console.assert(obj !== undefined && obj !== null, "\u88AB\u76D1\u542C\u5BF9\u8C61\u65E0\u6CD5\u4E3Aundefined\u6216\u8005null\uFF01");
            feng3d.EventEmitter.getOrCreateEventEmitter(obj).onAny(listener, thisObject, priority, once);
            return this;
        };
        /**
         * 移除监听对象的任意事件。
         *
         * @param obj                       被监听对象。
         * @param listener                  处理事件的监听器函数。
         * @param thisObject                监听器的上下文。可选。
         */
        FEvent.prototype.offAny = function (obj, listener, thisObject) {
            var _a;
            console.assert(obj !== undefined && obj !== null, "\u88AB\u76D1\u542C\u5BF9\u8C61\u65E0\u6CD5\u4E3Aundefined\u6216\u8005null\uFF01");
            (_a = feng3d.EventEmitter.getEventEmitter(obj)) === null || _a === void 0 ? void 0 : _a.offAny(listener, thisObject);
            return this;
        };
        /**
         * 初始化事件对象
         *
         * @param type                      事件的类型。类型区分大小写。
         * @param data                      事件携带的自定义数据。
         * @param bubbles                   表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
         */
        FEvent.prototype.makeEvent = function (type, data, bubbles) {
            if (bubbles === void 0) { bubbles = false; }
            return { type: type, data: data, bubbles: bubbles };
        };
        return FEvent;
    }());
    feng3d.FEvent = FEvent;
    feng3d.event = new FEvent();
})(feng3d || (feng3d = {}));
//# sourceMappingURL=index.js.map