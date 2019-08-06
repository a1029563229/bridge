var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var modle;
(function (modle) {
    var FREQUENCY = 20;
    var MAX_TIME = 1500;
    var TouchCapture = (function () {
        function TouchCapture(node, callback) {
            this._init(node, callback);
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
            this._init(node, callback);
        };
        TouchCapture.prototype._init = function (node, callback) {
            this._node = node;
            this._callback = callback;
            this._startTouchHandlerListener();
        };
        TouchCapture.prototype._startTouchHandlerListener = function () {
            if (!this._node)
                return;
            this._node.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._touchStartHandler, this);
            this._node.addEventListener(egret.TouchEvent.TOUCH_END, this._touchEndHandler, this);
        };
        TouchCapture.prototype._touchStartHandler = function () {
            var _this = this;
            this._startTime = Date.now();
            this._timer = setInterval(function () {
                var endTime = Date.now();
                var time = endTime - _this._startTime;
                _this._callback && _this._callback(time);
                if (time >= MAX_TIME) {
                    clearInterval(_this._timer);
                }
            }, FREQUENCY);
        };
        TouchCapture.prototype._touchEndHandler = function () {
            clearInterval(this._timer);
        };
        return TouchCapture;
    }());
    modle.TouchCapture = TouchCapture;
    __reflect(TouchCapture.prototype, "modle.TouchCapture");
})(modle || (modle = {}));
