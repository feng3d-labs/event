namespace feng3d
{

    // /**
    //  * 事件
    //  */
    // export interface Event<T>
    // {
    //     /**
    //      * 表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
    //      */
    //     bubbles: boolean

    //     /**
    //      * 是否停止冒泡
    //      */
    //     isStopBubbles: boolean
    // }

    /**
     * 事件冒泡派发器，可处理冒泡事件。
     */
    export class EventBubbleEmitter<T = any> extends EventEmitter<T>
    {

    }
}