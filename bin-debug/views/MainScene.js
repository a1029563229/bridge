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
var views;
(function (views) {
    var LINE_SCALE = .5;
    var CHARACTER_WIDTH = 100;
    var SPEED = 40;
    var MainScene = (function (_super) {
        __extends(MainScene, _super);
        function MainScene(args) {
            var _this = _super.call(this, args) || this;
            // 当前位置，用于角色行走计算
            _this._currentPosition = 0;
            // 当前节点，由 _currentPosition 计算得出的当前本地坐标
            _this._currentPoint = 0;
            // 当前阶梯，用于动态生成新的阶梯
            _this._currentMartix = 0;
            // 积分
            _this._count = 0;
            _this._progress = 50;
            _this._isComeDown = false;
            _this.skinName = 'resource/views/MainScene.exml';
            return _this;
        }
        MainScene.prototype.onComplete = function () {
            _super.prototype.onComplete.call(this);
            this._init();
        };
        MainScene.prototype._init = function () {
            var _this = this;
            this._martixFloor = new modle.Floor(10);
            var martixs = this._martixFloor.getMartix();
            this._currentPoint = this._martixFloor.getEnd(this._currentMartix);
            this._generateFloors(martixs);
            this._addCharacter();
            // 等待角色移动到第一个阶梯开始添加游戏事件
            cm.Utils.delay(500, function () {
                _this._addTouchHandler();
            });
        };
        MainScene.prototype._reStart = function () {
            this._currentMartix = 0;
            this._currentPosition = 0;
            this._count = 0;
            this._isComeDown = false;
            this.prompt.text = '长按屏幕开始游戏';
            this.count.text = '得分：0';
            this.floors.removeChildren();
            this.floors.x = 0;
            this._character.y = 500;
            this._init();
            this._move();
        };
        MainScene.prototype._generateFloors = function (martixs) {
            var floorsGroup = this.floors;
            for (var i = this._currentMartix; i < martixs.length; i++) {
                var martix = martixs[i];
                var floorProps = this._getLocate(martix);
                var floorItem = this._getFloorItem(floorProps);
                floorsGroup.addChild(floorItem);
            }
        };
        MainScene.prototype._getLocate = function (martix) {
            var x = this._getLocalPoint(martix[0]);
            var width = this._getLocalPoint(martix[1] - martix[0]);
            return { x: x, width: width };
        };
        MainScene.prototype._getLocalPoint = function (locate) {
            var stageWidth = cm.main.stage.stageWidth;
            var itemWidth = stageWidth / 100;
            return locate * itemWidth;
        };
        MainScene.prototype._getFloorItem = function (props) {
            var x = props.x, width = props.width;
            var floorItem = new eui.Image();
            floorItem.x = x;
            floorItem.width = width;
            floorItem.height = 500;
            floorItem.bottom = 0;
            floorItem.source = 'main_json.widget';
            floorItem.scale9Grid = new egret.Rectangle(41, 43, 11, 7);
            return floorItem;
        };
        MainScene.prototype._addCharacter = function () {
            if (this._character)
                return;
            var character = this._character = new views.Character('xiaocha', "");
            character.randomPlayWhenIdle({ actions: ['yawn', 'hello'], interval: 1000, rate: 0.05 });
            character.setDirection(views.CharacterDirection.RIGHT);
            character.x = CHARACTER_WIDTH / 2;
            this.line.x = character.x + 40;
            character.y = 500;
            this.grounds.addChild(character);
            this.grounds.setChildIndex(character, 0);
            character.callback = this._move.bind(this);
        };
        MainScene.prototype._addTouchHandler = function () {
            if (this._touchCapture)
                return this._enableTouchHandler();
            this._touchCapture = new modle.TouchCapture();
            this._touchCapture.bindNode(this);
            this._enableTouchHandler();
        };
        MainScene.prototype._enableTouchHandler = function () {
            if (!this._touchCapture)
                return;
            this._touchCapture.addEventListener(modle.TouchCaptureEvent.ON_PROGRESS, this._onLineProgressHandler, this);
            this._touchCapture.addEventListener(modle.TouchCaptureEvent.ON_COMPLETE, this._rotationLine, this);
        };
        MainScene.prototype._disableTouchHandler = function () {
            if (!this._touchCapture)
                return;
            this._touchCapture.removeEventListener(modle.TouchCaptureEvent.ON_PROGRESS, this._onLineProgressHandler, this);
            this._touchCapture.removeEventListener(modle.TouchCaptureEvent.ON_COMPLETE, this._rotationLine, this);
        };
        MainScene.prototype._onLineProgressHandler = function (e) {
            var progress = e.data;
            var locateLength = Math.round(this._getLocalPoint(progress * LINE_SCALE));
            this.line.height = locateLength;
        };
        MainScene.prototype._rotationLine = function (e) {
            var _this = this;
            this._disableTouchHandler();
            var progress = e.data;
            this.line.rotation = -180;
            egret.Tween.get(this.line).to({
                rotation: -90
            }, 500).call(function () {
                _this._currentPosition += 1;
                _this._currentPoint = _this._getTargetPoint(progress);
                _this._move();
            }, this);
        };
        MainScene.prototype._getTargetPoint = function (point) {
            var targetPoint = this._currentPoint + Math.floor(point * LINE_SCALE);
            var martixs = this._martixFloor.getMartix();
            var _a = martixs[this._currentPosition], start = _a[0], end = _a[1];
            if (targetPoint > start && targetPoint < end) {
                targetPoint = end;
            }
            else {
                this._isComeDown = true;
            }
            return targetPoint;
        };
        MainScene.prototype._move = function () {
            var _this = this;
            var target = this._getLocalPoint(this._currentPoint);
            var originalX = this.floors.x;
            var x = -target + CHARACTER_WIDTH;
            this._character.walk();
            egret.Tween.get(this.line).to({
                x: x - originalX
            }, Math.abs(originalX - x) * 100 / SPEED).call(function () {
                if (_this._isComeDown)
                    return;
                _this.line.x = _this._character.x + 40;
            });
            egret.Tween.get(this.floors).to({
                x: x
            }, Math.abs(originalX - x) * 100 / SPEED).call(function () {
                if (_this._isComeDown) {
                    _this._comeDown();
                    return;
                }
                if (_this._currentPosition > 0) {
                    _this._addCount();
                }
                _this._clear();
            });
        };
        MainScene.prototype._comeDown = function () {
            var _this = this;
            this.prompt.text = '您已坠落，游戏结束\n\n点击屏幕重新开始';
            this._character.idle();
            egret.Tween.get(this._character).to({
                y: 1500
            }, 1000).call(function () {
                _this.once(egret.TouchEvent.TOUCH_END, _this._reStart, _this);
            });
        };
        MainScene.prototype._addCount = function () {
            this._count += 10;
            this.count.text = "\u5F97\u5206\uFF1A" + this._count;
        };
        MainScene.prototype._clear = function () {
            this._character.idle();
            this.line.x = this._character.x + 40;
            this.line.rotation = 0;
            this.line.height = 0;
            this._enableTouchHandler();
            var martixLength = this._martixFloor.getMartix().length;
            var currentPosition = this._currentPosition;
            if (martixLength - currentPosition < 5) {
                var martixs = this._martixFloor.addMartix(10);
                this._generateFloors(martixs);
            }
        };
        return MainScene;
    }(cm.BaseScene));
    views.MainScene = MainScene;
    __reflect(MainScene.prototype, "views.MainScene");
})(views || (views = {}));
