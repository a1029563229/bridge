module cm {
	export class Component extends egret.DisplayObjectContainer {
		public constructor() {
			super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdd, this);
		}

		onAdd(){
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
		}

		onRemove(){
			this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
		}
	}

	export class EUIComponent extends eui.Component {
		private _complete: boolean = false;
		private _readyFunc: Function = null;
		public constructor() {
			super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdd, this);
			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			// this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onCreationComplete, this);
		}

		get complete(): boolean{
			return this._complete;
		}

		onReady(func: Function){
			this._readyFunc = func;
		}

		// onCreationComplete(){
		// 	egret.log('creation complete');
		// }

		onComplete(){
			this._complete = true;
			this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this._readyFunc && this._readyFunc();
			this._readyFunc = null;
		}

		onAdd(){
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
		}

		onRemove(){
			this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
			this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this._readyFunc = null;
		}
	}
}