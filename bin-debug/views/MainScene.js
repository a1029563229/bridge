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
            _this.skinName = 'resource/views/MainScene.exml';
            return _this;
        }
        MainScene.prototype.onComplete = function () {
            _super.prototype.onComplete.call(this);
            this._generateFloors();
            this._addCharacter();
            this._characterWalkHandler();
        };
        MainScene.prototype._generateFloors = function () {
            var floorsGroup = this.floors;
            var floor = new modle.Floor(10);
            var floors = floor.getMartix();
            for (var i = 0; i < floors.length; i++) {
                var martix = floors[i];
                var floorProps = this._getLocate(martix);
                var floorItem = this._getFloorItem(floorProps);
                floorsGroup.addChild(floorItem);
            }
        };
        MainScene.prototype._getLocate = function (martix) {
            var stageWidth = cm.main.stage.stageWidth;
            var itemWidth = stageWidth / 100;
            var x = martix[0] * itemWidth;
            var width = (martix[1] - martix[0]) * itemWidth;
            return { x: x, width: width };
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
            character.randomPlayWhenIdle({ actions: ['yawn', 'hello'], interval: 1000, rate: 0.05 });
            character.setDirection(views.CharacterDirection.RIGHT);
            character.x = 50;
            character.y = 0;
            this.grounds.addChild(character);
            this.grounds.setChildIndex(character, 0);
        };
        MainScene.prototype._characterWalkHandler = function () {
            var _this = this;
            cm.Utils.delay(500, function () {
                var point = new egret.Point(400);
                _this._character.walkTo(point);
            });
        };
        return MainScene;
    }(cm.BaseScene));
    views.MainScene = MainScene;
    __reflect(MainScene.prototype, "views.MainScene");
})(views || (views = {}));
