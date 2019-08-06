// TypeScript file
namespace cm {

	export interface IAlertOptions{ 
		// 是否带有半透明背景
		bg?: boolean, 
		// 是否点击空白处关闭
		clickBgClose?: boolean, 
		// 是否点视图关闭
		closeOnViewTapped?: boolean,
		// 是否添加到main
		addToMain?:boolean,

		alpha?:number;

		/**
		 * 音效
		 */
		sound?:string
	};
	const defaultAlertOptions = { bg: false, clickBgClose: false, closeOnViewTapped: false, addToMain: true };


	export class Alert extends cm.AutoLayoutView {

		private _bg: egret.Sprite;
		private _content: eui.Component | egret.DisplayObject;
		private _hasBg: boolean = true;
		private _clickBgClose: boolean = true;
		private _showComplete: boolean = false;
		private _closeOnViewTapped: boolean = false;
		private _opt:IAlertOptions = null;
		/**
		 * 默认音效
		 */
		static DEFAULT_SOUND:string;

		/**
		 * @param view 
		 * @param options 
		 */
		static show(view: eui.Component | egret.DisplayObject, options?: IAlertOptions): Alert{
			let alert = new Alert(view, options);
			alert.show();
			
			return alert;
		}

		public constructor(
			content: eui.Component | egret.DisplayObject,
		 	option: IAlertOptions
			) {
			super();
			option = Object.assign({}, defaultAlertOptions, option);
			this._opt = option;
			this._hasBg = option.bg;
			this._clickBgClose = option.clickBgClose;
			this._closeOnViewTapped = option.closeOnViewTapped;
			let w = cm.main.stage.stageWidth;
			let h = cm.main.stage.stageHeight;
			this.width = w;
			this.height = h;
			this._content = content;
			if(content instanceof eui.Component){
				content.horizontalCenter = 0;
				content.verticalCenter = 0;
			}
			else{
				content.anchorOffsetX = content.width / 2;
				content.anchorOffsetY = content.height / 2;
				content.x = w / 2;
				content.y = h / 2;
			}
			if(this._hasBg)
				this.createBg();
			this.addChild(content);
			let sound = this._opt.sound !== undefined ? this._opt.sound : Alert.DEFAULT_SOUND;
			if(sound){
				cm.soundManager.playSound(sound);
			}
			this.addEventListener(egret.Event.RESIZE,this.onResize,this);
		}
		onResize(){
			if(this._bg){
				let w = cm.main.stage.stageWidth;
				let h = cm.main.stage.stageHeight;
				this._bg.graphics.clear();
				this._bg.graphics.beginFill(0x000000, 1);
				this._bg.graphics.drawRect(0, 0, w, h);
				this._bg.graphics.endFill();
				this._bg.width = w;
				this._bg.height = h;
			}
		}

		createBg(){
			let w = cm.main.stage.stageWidth;
			let h = cm.main.stage.stageHeight;
			this._bg = new egret.Sprite();
			this._bg.touchEnabled = true;
			this._bg.graphics.beginFill(0x000000, 1);
			this._bg.graphics.drawRect(0, 0, w, h);
			this._bg.graphics.endFill();
			this._bg.width = w;
			this._bg.height = h;
			this.addChild(this._bg);			
		}

		onBgTap(){
			this._clickBgClose && this.hide();
		}

		hide(){
			egret.Tween.removeTweens(this._content);
			let tw = egret.Tween.get(this._content);
			tw.to({
				scaleX: 0,
				scaleY: 0,
				alpha: 0
			}, 200, egret.Ease.backOut).call(() => {
				this.stage && this.parent.removeChild(this);
			});
			if(this._bg){
				egret.Tween.removeTweens(this._bg);
				let tw2 = egret.Tween.get(this._bg);
				this._bg.alpha = 0.3;
				tw2.to({ alpha: 0 }, 200);
			}
		}

		show(){
			if(this._opt.addToMain){
				cm.main.addChild(this);
			}
			else{
				cm.sceneManager.currentScene.addChild(this);
			}
			this._content.scaleX = this._content.scaleX = 0;
			this._content.alpha = 0;
			egret.Tween.removeTweens(this._content);
			let tw = egret.Tween.get(this._content);
			tw.to({
				scaleX: 1,
				scaleY: 1,
				alpha: 1
			}, 300, egret.Ease.backOut).call(this.onShowComplete, this);
			if(this._bg){
				let alpha = this._opt.alpha || 0.3;
				this._bg.alpha = 0;
				egret.Tween.removeTweens(this._bg);
				let tw2 = egret.Tween.get(this._bg);
				tw2.to({ alpha:alpha }, 300);
			}
		}

		onShowComplete(){
			this._showComplete = true;
			let func: Function = this._content['onShowComplete'];
			func && func.call(this._content);
		}

		get showComplete(): boolean{
			return this._showComplete;
		}

		onAdd(){
			super.onAdd()
			if(this._bg && this._hasBg)
				this._bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBgTap, this);
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onViewTap, this);
		}

		onRemove(){
			super.onRemove();
			if(this._bg && this._hasBg)
				this._bg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBgTap, this);
			this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onViewTap, this);
			egret.Tween.removeTweens(this._content);
			this._bg = null;
			this._content = null;
		}

		onViewTap(e: egret.TouchEvent){
			if(!this._closeOnViewTapped){
				e.stopPropagation();
			}
			else{
				this.hide();
			}
		}
	}
}