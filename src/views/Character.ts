module views {

    export enum CharacterDirection { NONE, LEFT, RIGHT };

    export class Character extends cm.EUIComponent {
        public callback: Function;
        
        // 角色移动速度
        moveSpeed = 200;
        // 龙骨动画对象
        private _armature: dragonBones.EgretArmatureDisplay;
        // 动画角色朝左时 xscale 值
        private _leftDirectionXscale: number = 1;
        // 人物方向
        private _direction: CharacterDirection = CharacterDirection.NONE;
        // animation name
        private _name: string = '';
        // username
        private _username: string = '';
        // 移动时回调
        onMoveCallback: Function = null;
        // 空闲时随机播放动作选项
        private _idleOptions: { actions: Array<string>, interval: number, rate: number } = null;
        // timer
        private _timer: egret.Timer = null;
        // 锚点(百分比)
        anchorX: number = 0.5;
        anchorY: number = 1;

        constructor(name: string, username: string, anchorX: number = 0.5, anchorY: number = 1) {
            super();
            this.anchorX = anchorX;
            this.anchorY = anchorY;
            this._name = name;
            this._username = username;
            this.loadRes();
        }

        loadRes() {
            let groupName = 'animation_' + this._name;
            RES.createGroup(groupName, [this._name + '_ske_json', this._name + '_tex_json', this._name + '_tex_png'], true);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResComplete, this);
            RES.loadGroup(groupName);
        }

        onResComplete(event: RES.ResourceEvent) {
            if (event.groupName === 'animation_' + this._name) {
                this.createAnimation();
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResComplete, this);
                if (this.callback) {
                    this.callback();
                }
            }
        }

        createAnimation() {
            var dragonbonesData = RES.getRes(this._name + '_ske_json');
            var textureData = RES.getRes(this._name + '_tex_json');
            var texture = RES.getRes(this._name + '_tex_png');
            let factory = cm.dragonBonesManager.getFactory(this._name, dragonbonesData, textureData, texture);
            let armature: dragonBones.EgretArmatureDisplay = factory.buildArmatureDisplay('armatureName');
            this._armature = armature;
            this.addChild(this._armature);
            let w = this._armature.width, h = this._armature.height;
            this.anchorOffsetX = w * this.anchorX;
            this.anchorOffsetY = h * this.anchorY;
            this.width = w;
            this.height = h;
            this._armature.x = w / 2;
            this._armature.y = h;
            this.updateDirection();
            this.idle();
            this._armature.addEventListener(dragonBones.EventObject.COMPLETE, this.playAnimationComplete, this);
        }

        onRemove() {
            super.onRemove();
            this.stopRandomPlay();
            if (this._armature)
                this._armature.removeEventListener(dragonBones.EventObject.COMPLETE, this.playAnimationComplete, this);
        }

        playAnimationComplete(e: dragonBones.EventObject) {
            let ani = e.animationState.name;
            egret.log(ani + ' complete');
            if (this._idleOptions && this._idleOptions.actions.indexOf(ani) !== -1) {
                this.idle();
            }
            if (ani === 'win') {
                this.idle();
            }
        }

        startRandomPlay() {
            if (!this._timer)
                this._timer = new egret.Timer(this._idleOptions.interval);
            this._timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
            this._timer.start();
        }

        onTimer() {
            if (!this._armature) return;
            let state = this._armature.animation.getState('idle');
            if (state && state.isPlaying) {
                if (Math.random() < this._idleOptions.rate) {
                    this.playRandomAction();
                }
            }
        }

        stopRandomPlay() {
            if (this._timer) {
                this._timer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
                this._timer.stop();
            }
        }

        playRandomAction() {
            let l = this._idleOptions.actions.length;
            let index = Math.floor(Math.random() * l);
            let ani = this._idleOptions.actions[index];
            this.play(ani, 1);
        }

        /**
         * 空闲时随机播放
         * @param opt.actions 动作列表
         * @param opt.interval 间隔
         * @param opt.rate 播放几率
         */
        randomPlayWhenIdle(opt: { actions: Array<string>, interval: number, rate: number }) {
            this._idleOptions = opt;
            this.startRandomPlay();
        }

        walkTo(p: egret.Point) {
            if (!this._armature) return;
            this.walk();
            egret.Tween.removeTweens(this);
            let tw = egret.Tween.get(this, { onChange: this.onChange, onChangeObj: this });
            let startPoint = new egret.Point(this.x, this.y);
            let distance = egret.Point.distance(startPoint, p);
            let time = distance / this.moveSpeed * 1000;
            if (p.x > this.x)
                this.setDirection(CharacterDirection.RIGHT);
            else
                this.setDirection(CharacterDirection.LEFT);
            let promise = new Promise((resolve: Function, reject: Function) => {
                tw.to({ x: p.x, y: p.y }, time).call(() => {
                    resolve();
                    this.idle();
                });
            });
            return promise;
        }

        setDirection(direction: CharacterDirection) {
            this._direction = direction;
            this.updateDirection();
        }

        updateDirection() {
            if (!this._armature) return;
            if (this._direction === CharacterDirection.LEFT) {
                this._armature.scaleX = this._leftDirectionXscale * 1;
            }
            else if (this._direction === CharacterDirection.RIGHT) {
                this._armature.scaleX = this._leftDirectionXscale * -1;
            }
        }

        onChange() {
            if (this.onMoveCallback) {
                this.onMoveCallback();
            }
        }

        /**
         * 空闲(默认动作)
         */
        idle() {
            this.play('idle', 0);
        }

        /**
         * 行走
         */
        walk() {
            this.play('walk', 0);
        }

        /**
         * 赢了
         */
        win(times: number) {
            this.play('win', 3);
        }

        /**
         * 打哈欠
         */
        yawn() {
            this.play('yawn');
        }

        pause() {
            this._armature && this._armature.animation.gotoAndStop('idle');
        }

        play(animation: string, times?: number) {
            if (!this._armature) return;
            let state = this._armature.animation.getState(animation)
            if (!state || !state.isPlaying) {
                this._armature.animation.play(animation, times);
            }
        }
    }
}