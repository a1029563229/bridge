namespace cm{
    export class Animation extends cm.EUIComponent{
        // 龙骨动画对象
        protected _armature: egret.DisplayObject;
        // username
        private _username: string = '';
        // 锚点(百分比)
        anchorX: number = 0.5;
        anchorY: number = 1;
        private _name:string;

        init(name:string, anchorX: number = 0.5, anchorY: number = 1){
            this.anchorX = anchorX;
            this.anchorY = anchorY;
            this._name = name;
            this.loadRes();
        }

        get armature(): egret.DisplayObject{
            return this._armature;
        }

        loadRes(){
            let name = cm.Utils.urlToResName(this._name);
            let groupName = 'animation_' + name;
            RES.createGroup(groupName, [name + '_ske_json', name + '_tex_json', name + '_tex_png'], true);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._onDragonbonesComplete, this);
            RES.loadGroup(groupName);   
        }

        private _onDragonbonesComplete(event: RES.ResourceEvent){
            if(event.groupName === 'animation_' + this._name){
                this.createAnimation();
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._onDragonbonesComplete, this);
            }
        }

        createAnimation(){
            var dragonbonesData = RES.getRes(this._name + '_ske_json' );  
            var textureData = RES.getRes(this._name + '_tex_json' );  
            var texture = RES.getRes(this._name + '_tex_png' );
            let factory = cm.dragonBonesManager.getFactory(name, dragonbonesData, textureData, texture);
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
            this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
        }

        play(animation: string, times?: number){
            if(!this._armature) return;
            let am = this._armature as dragonBones.EgretArmatureDisplay;
            let state = am.animation.getState(animation)
            if(state && state.isPlaying){
                am.animation.stop();
            }
            am.animation.play(animation, times);
        }

        stop(): void{
            if(!this._armature){
                return;
            }
            let am = this._armature as dragonBones.EgretArmatureDisplay;
            am.animation.stop();
        }

        onRemove(): void{
            super.onRemove();
            this.stop();
        }
    }
}