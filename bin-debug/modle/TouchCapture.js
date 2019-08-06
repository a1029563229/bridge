var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var modle;
(function (modle) {
    var FREQUENCY = 20;
    var MAX_TIME = 1000;
    var TouchCaptureEvent = (function (_super) {
        __extends(TouchCaptureEvent, _super);
        function TouchCaptureEvent(type, data) {
            return _super.call(this, type, false, false, data) || this;
        }
        TouchCaptureEvent.ON_PROGRESS = 'on_progress';
        TouchCaptureEvent.ON_COMPLETE = 'on_complete';
        return TouchCaptureEvent;
    }(egret.Event));
    modle.TouchCaptureEvent = TouchCaptureEvent;
    __reflect(TouchCaptureEvent.prototype, "modle.TouchCaptureEvent");
    var TouchCapture = (function (_super) {
        __extends(TouchCapture, _super);
        function TouchCapture() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 绑定节点
         * @param {eui.Component} node eui 节点
         */
        TouchCapture.prototype.bindNode = function (node, onProgress) {
            if (this._node) {
                this._node.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this._touchStartHandler, this);
                this._node.removeEventListener(egret.TouchEvent.TOUCH_END, this._touchEndHandler, this);
            }
            this._init(node, onProgress);
        };
        TouchCapture.prototype._init = function (node, onProgress) {
            this._node = node;
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
                _this.dispatchEvent(new TouchCaptureEvent(TouchCaptureEvent.ON_PROGRESS, Math.floor(time / MAX_TIME * 100)));
                if (time >= MAX_TIME) {
                    _this.dispatchEvent(new TouchCaptureEvent(TouchCaptureEvent.ON_COMPLETE, Math.floor(time / MAX_TIME * 100)));
                    clearInterval(_this._timer);
                }
            }, FREQUENCY);
        };
        TouchCapture.prototype._touchEndHandler = function () {
            var endTime = Date.now();
            var time = endTime - this._startTime;
            this.dispatchEvent(new TouchCaptureEvent(TouchCaptureEvent.ON_COMPLETE, Math.floor(time / MAX_TIME * 100)));
            clearInterval(this._timer);
        };
        return TouchCapture;
    }(egret.EventDispatcher));
    modle.TouchCapture = TouchCapture;
    __reflect(TouchCapture.prototype, "modle.TouchCapture");
})(modle || (modle = {}));
