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
    var CharacterDirection;
    (function (CharacterDirection) {
        CharacterDirection[CharacterDirection["NONE"] = 0] = "NONE";
        CharacterDirection[CharacterDirection["LEFT"] = 1] = "LEFT";
        CharacterDirection[CharacterDirection["RIGHT"] = 2] = "RIGHT";
    })(CharacterDirection = views.CharacterDirection || (views.CharacterDirection = {}));
    ;
    var Character = (function (_super) {
        __extends(Character, _super);
        function Character(name, username, anchorX, anchorY) {
            if (anchorX === void 0) { anchorX = 0.5; }
            if (anchorY === void 0) { anchorY = 1; }
            var _this = _super.call(this) || this;
            // 角色移动速度
            _this.moveSpeed = 200;
            // 动画角色朝左时 xscale 值
            _this._leftDirectionXscale = 1;
            // 人物方向
            _this._direction = CharacterDirection.NONE;
            // animation name
            _this._name = '';
            // username
            _this._username = '';
            // 移动时回调
            _this.onMoveCallback = null;
            // 空闲时随机播放动作选项
            _this._idleOptions = null;
            // timer
            _this._timer = null;
            // 锚点(百分比)
            _this.anchorX = 0.5;
            _this.anchorY = 1;
            _this.anchorX = anchorX;
            _this.anchorY = anchorY;
            _this._name = name;
            _this._username = username;
            _this.loadRes();
            return _this;
        }
        Character.prototype.loadRes = function () {
            var groupName = 'animation_' + this._name;
            RES.createGroup(groupName, [this._name + '_ske_json', this._name + '_tex_json', this._name + '_tex_png'], true);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResComplete, this);
            RES.loadGroup(groupName);
        };
        Character.prototype.onResComplete = function (event) {
            if (event.groupName === 'animation_' + this._name) {
                this.createAnimation();
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResComplete, this);
                if (this.callback) {
                    this.callback();
                }
            }
        };
        Character.prototype.createAnimation = function () {
            var dragonbonesData = RES.getRes(this._name + '_ske_json');
            var textureData = RES.getRes(this._name + '_tex_json');
            var texture = RES.getRes(this._name + '_tex_png');
            var factory = cm.dragonBonesManager.getFactory(this._name, dragonbonesData, textureData, texture);
            var armature = factory.buildArmatureDisplay('armatureName');
            this._armature = armature;
            this.addChild(this._armature);
            var w = this._armature.width, h = this._armature.height;
            this.anchorOffsetX = w * this.anchorX;
            this.anchorOffsetY = h * this.anchorY;
            this.width = w;
            this.height = h;
            this._armature.x = w / 2;
            this._armature.y = h;
            this.updateDirection();
            this.idle();
            this._armature.addEventListener(dragonBones.EventObject.COMPLETE, this.playAnimationComplete, this);
        };
        Character.prototype.onRemove = function () {
            _super.prototype.onRemove.call(this);
            this.stopRandomPlay();
            if (this._armature)
                this._armature.removeEventListener(dragonBones.EventObject.COMPLETE, this.playAnimationComplete, this);
        };
        Character.prototype.playAnimationComplete = function (e) {
            var ani = e.animationState.name;
            egret.log(ani + ' complete');
            if (this._idleOptions && this._idleOptions.actions.indexOf(ani) !== -1) {
                this.idle();
            }
            if (ani === 'win') {
                this.idle();
            }
        };
        Character.prototype.startRandomPlay = function () {
            if (!this._timer)
                this._timer = new egret.Timer(this._idleOptions.interval);
            this._timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
            this._timer.start();
        };
        Character.prototype.onTimer = function () {
            if (!this._armature)
                return;
            var state = this._armature.animation.getState('idle');
            if (state && state.isPlaying) {
                if (Math.random() < this._idleOptions.rate) {
                    this.playRandomAction();
                }
            }
        };
        Character.prototype.stopRandomPlay = function () {
            if (this._timer) {
                this._timer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
                this._timer.stop();
            }
        };
        Character.prototype.playRandomAction = function () {
            var l = this._idleOptions.actions.length;
            var index = Math.floor(Math.random() * l);
            var ani = this._idleOptions.actions[index];
            this.play(ani, 1);
        };
        /**
         * 空闲时随机播放
         * @param opt.actions 动作列表
         * @param opt.interval 间隔
         * @param opt.rate 播放几率
         */
        Character.prototype.randomPlayWhenIdle = function (opt) {
            this._idleOptions = opt;
            this.startRandomPlay();
        };
        Character.prototype.walkTo = function (p) {
            var _this = this;
            if (!this._armature)
                return;
            this.walk();
            egret.Tween.removeTweens(this);
            var tw = egret.Tween.get(this, { onChange: this.onChange, onChangeObj: this });
            var startPoint = new egret.Point(this.x, this.y);
            var distance = egret.Point.distance(startPoint, p);
            var time = distance / this.moveSpeed * 1000;
            if (p.x > this.x)
                this.setDirection(CharacterDirection.RIGHT);
            else
                this.setDirection(CharacterDirection.LEFT);
            var promise = new Promise(function (resolve, reject) {
                tw.to({ x: p.x, y: p.y }, time).call(function () {
                    resolve();
                    _this.idle();
                });
            });
            return promise;
        };
        Character.prototype.setDirection = function (direction) {
            this._direction = direction;
            this.updateDirection();
        };
        Character.prototype.updateDirection = function () {
            if (!this._armature)
                return;
            if (this._direction === CharacterDirection.LEFT) {
                this._armature.scaleX = this._leftDirectionXscale * 1;
            }
            else if (this._direction === CharacterDirection.RIGHT) {
                this._armature.scaleX = this._leftDirectionXscale * -1;
            }
        };
        Character.prototype.onChange = function () {
            if (this.onMoveCallback) {
                this.onMoveCallback();
            }
        };
        /**
         * 空闲(默认动作)
         */
        Character.prototype.idle = function () {
            this.play('idle', 0);
        };
        /**
         * 行走
         */
        Character.prototype.walk = function () {
            this.play('walk', 0);
        };
        /**
         * 赢了
         */
        Character.prototype.win = function (times) {
            this.play('win', 3);
        };
        /**
         * 打哈欠
         */
        Character.prototype.yawn = function () {
            this.play('yawn');
        };
        Character.prototype.pause = function () {
            this._armature && this._armature.animation.gotoAndStop('idle');
        };
        Character.prototype.play = function (animation, times) {
            if (!this._armature)
                return;
            var state = this._armature.animation.getState(animation);
            if (!state || !state.isPlaying) {
                this._armature.animation.play(animation, times);
            }
        };
        return Character;
    }(cm.EUIComponent));
    views.Character = Character;
    __reflect(Character.prototype, "views.Character");
})(views || (views = {}));
