module modle {
    const FREQUENCY = 20;
    const MAX_TIME = 1500;

    export class TouchCapture {
        private _node: eui.Component;
        private _callback: Function;
        private _startTime: number;
        private _endTime: number;
        private _timer: number;

        constructor(node?: eui.Component, callback?: Function) {
            this._init(node, callback);
        }

        /**
         * 绑定节点
         * @param {eui.Component} node eui 节点
         */
        public bindNode(node: eui.Component, callback?: Function) {
            if (this._node) {
                this._node.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this._touchStartHandler, this);
                this._node.removeEventListener(egret.TouchEvent.TOUCH_END, this._touchEndHandler, this);
            }

            this._init(node, callback);
        }

        private _init(node?: eui.Component, callback?: Function) {
            this._node = node;
            this._callback = callback;
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
                this._callback && this._callback(time);
                if (time >= MAX_TIME) {
                    clearInterval(this._timer);
                }
            }, FREQUENCY);
        }

        private _touchEndHandler() {
            clearInterval(this._timer);
        }
    }
}