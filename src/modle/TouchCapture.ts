module modle {
    const FREQUENCY = 20;
    const MAX_TIME = 1000;

    export class TouchCaptureEvent extends egret.Event {
        static ON_PROGRESS: string = 'on_progress';
        static ON_COMPLETE: string = 'on_complete';
        constructor(type: string, data?: any) {
            super(type, false, false, data);
        }
    }

    export class TouchCapture extends egret.EventDispatcher {
        private _node: eui.Component;
        private _startTime: number;
        private _endTime: number;
        private _timer: number;

        /**
         * 绑定节点
         * @param {eui.Component} node eui 节点
         */
        public bindNode(node: eui.Component, onProgress?: Function) {
            if (this._node) {
                this._node.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this._touchStartHandler, this);
                this._node.removeEventListener(egret.TouchEvent.TOUCH_END, this._touchEndHandler, this);
            }

            this._init(node, onProgress);
        }

        private _init(node?: eui.Component, onProgress?: Function) {
            this._node = node;
            this._startTouchHandlerListener();
        }

        private _startTouchHandlerListener() {
            if (!this._node) return;

            this._node.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._touchStartHandler, this);
            this._node.addEventListener(egret.TouchEvent.TOUCH_END, this._touchEndHandler, this);
        }

        private _touchStartHandler() {
            this._startTime = Date.now();
            this._timer = setInterval(() => {
                const endTime = Date.now();
                const time = endTime - this._startTime;
                this.dispatchEvent(new TouchCaptureEvent(TouchCaptureEvent.ON_PROGRESS, Math.floor(time / MAX_TIME * 100)));
                if (time >= MAX_TIME) {
                    this.dispatchEvent(new TouchCaptureEvent(TouchCaptureEvent.ON_COMPLETE, Math.floor(time / MAX_TIME * 100)));
                    clearInterval(this._timer);
                }
            }, FREQUENCY);
        }

        private _touchEndHandler() {
            const endTime = Date.now();
            const time = endTime - this._startTime;
            this.dispatchEvent(new TouchCaptureEvent(TouchCaptureEvent.ON_COMPLETE, Math.floor(time / MAX_TIME * 100)));
            clearInterval(this._timer);
        }
    }
}