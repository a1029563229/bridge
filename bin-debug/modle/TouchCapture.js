var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var modle;
(function (modle) {
    var TouchCapture = (function () {
        function TouchCapture(node) {
            this._node = node;
            this._startTouchHandlerListener();
        }
        /**
         * 绑定节点
         * @param {eui.Component} node eui 节点
         */
        TouchCapture.prototype.bindNode = function (node, callback) {
            if (this._node) {
                this._node.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this._touchStartHandler, this);
                this._node.removeEventListener(egret.TouchEvent.TOUCH_END, this._touchEndHandler, this);
            }
            this._node = node;
            this._callback = callback;
            this._startTouchHandlerListener();
        };
        TouchCapture.prototype._startTouchHandlerListener = function () {
            this._node.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._touchStartHandler, this);
            this._node.addEventListener(egret.TouchEvent.TOUCH_END, this._touchEndHandler, this);
        };
        TouchCapture.prototype._touchStartHandler = function () {
            this._startTime = Date.now();
        };
        TouchCapture.prototype._touchEndHandler = function () {
            this._endTime = Date.now();
            var time = this._endTime - this._startTime;
            this._callback && this._callback(time);
        };
        return TouchCapture;
    }());
    modle.TouchCapture = TouchCapture;
    __reflect(TouchCapture.prototype, "modle.TouchCapture");
})(modle || (modle = {}));
