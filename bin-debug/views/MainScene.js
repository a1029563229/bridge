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
    var MainScene = (function (_super) {
        __extends(MainScene, _super);
        function MainScene(args) {
            var _this = _super.call(this, args) || this;
            _this._currentMartix = 0;
            _this.skinName = 'resource/views/MainScene.exml';
            return _this;
        }
        MainScene.prototype.onComplete = function () {
            _super.prototype.onComplete.call(this);
            this._generateFloors();
            this._addCharacter();
            this._addTouchHandler();
            // this._characterWalkHandler();
        };
        MainScene.prototype._generateFloors = function () {
            var floorsGroup = this.floors;
            var floor = this._martixFloor = new modle.Floor(10);
            var floors = floor.getMartix();
            for (var i = this._currentMartix; i < floors.length; i++) {
                var martix = floors[i];
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
            var character = this._character = new views.Character('xiaocha', "");
            var start = this._getLocalPoint(this._martixFloor.getEnd(this._currentMartix)) - 50;
            character.randomPlayWhenIdle({ actions: ['yawn', 'hello'], interval: 1000, rate: 0.05 });
            character.setDirection(views.CharacterDirection.RIGHT);
            character.x = start;
            character.y = 0;
            this.grounds.addChild(character);
            this.grounds.setChildIndex(character, 0);
        };
        MainScene.prototype._addTouchHandler = function () {
            var touchCapture = new modle.TouchCapture();
            touchCapture.bindNode(this, function (time) { return console.log(time); });
        };
        MainScene.prototype._characterWalkHandler = function () {
            var _this = this;
            cm.Utils.delay(500, function () {
                _this._character.walk();
            });
        };
        return MainScene;
    }(cm.BaseScene));
    views.MainScene = MainScene;
    __reflect(MainScene.prototype, "views.MainScene");
})(views || (views = {}));
