module modle {
    export class TouchCapture {
        private _node: eui.Component;
        private _callback: Function;
        private _startTime: number;
        private _endTime: number;

        constructor(node: eui.Component) {
            this._node = node;
            this._startTouchHandlerListener();
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

            this._node = node;
            this._callback = callback;
            this._startTouchHandlerListener();
        }

        private _startTouchHandlerListener() {
            this._node.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._touchStartHandler, this);
            this._node.addEventListener(egret.TouchEvent.TOUCH_END, this._touchEndHandler, this);
        }

        private _touchStartHandler() {
            this._startTime = Date.now();
        }

        private _touchEndHandler() {
            this._endTime = Date.now();
            const time = this._endTime - this._startTime;
            this._callback && this._callback(time);
        }
    }
}