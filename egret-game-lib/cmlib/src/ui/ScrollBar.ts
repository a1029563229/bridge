namespace cm {
	export class ScrollBar extends cm.EUIComponent implements eui.UIComponent{
		up: eui.Button;
		down: eui.Button;
		bar: eui.Button;
		barArea: eui.Group;
		private _scroller: eui.Scroller;
		private _step: number = 50;
		private _miniHeight: number = 35;
		private _prevX: number = 0;
		private _prevY: number = 0;
		private _container: eui.UIComponent;
		public constructor(
            scroller: eui.Scroller, 
            container: eui.UIComponent, 
            up: eui.Button, 
            down:eui.Button, 
            bar:eui.Button,
            barArea:eui.Group, 
            options?:{step:number, minHeight:number}) 
        {
			super();
            this.up = up;
            this.down = down;
            this.bar = bar;
            this.barArea = barArea;
            this._scroller = scroller;
			this._container = container;
            if(options){
                if(options.minHeight !== undefined)
                    this._miniHeight = options.minHeight;
                if(options.step !== undefined)
                    this._step = options.step;
            }
		}

		enable(){
			egret.log('init scrollbar');
			this.validateNow();
			this.up && this.up.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpTap, this);
			this.down && this.down.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ondownTap, this);
			this.bar && this.bar.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBarBegin, this);
			this.bar && this.bar.addEventListener(egret.TouchEvent.TOUCH_END, this.onBarEnd, this);
			this.bar && this.bar.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onBarCancel, this);
			this.bar && this.bar.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onBarReleaseOutside, this);
			this.bar && this._container.addEventListener(eui.UIEvent.RESIZE, this.onResize, this);
			this.bar && this._scroller.addEventListener(egret.Event.CHANGE, this.onScroll, this);
			this.resizeBar();
			this.bar.top = 0;
		}

		disable(){
			super.onRemove();
			this.up && this.up.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpTap, this);
			this.down && this.down.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.ondownTap, this);
			this.bar && this.bar.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBarBegin, this);
			this.bar && this.bar.removeEventListener(egret.TouchEvent.TOUCH_END, this.onBarEnd, this);
		    this.bar && this.bar.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onBarMove, this);
			this.bar && this.bar.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onBarCancel, this);
			this.bar && this.bar.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onBarReleaseOutside, this);
			this._container && this._container.removeEventListener(eui.UIEvent.RESIZE, this.onResize, this);
			this._scroller && this._scroller.removeEventListener(egret.Event.CHANGE, this.onScroll, this);
		}

		onScroll(e: egret.Event){
			egret.log('on scroll');
			this.updateScrollBar();
		}

		onResize(e: eui.UIEvent){
			egret.log('on resize');
			this.resizeBar();
			this.move(0);
		}

		resizeBar(){
            if(!this._scroller || !this.bar || !this.barArea){
                return;
            }
			this._scroller.viewport.validateNow();
			let h = (this._scroller.height / this._scroller.viewport.measuredHeight) * this.barArea.height;
			if(h < this._miniHeight) h = this._miniHeight;
			if(h > this.barArea.height) h = this.barArea.height;
			this.bar.height = h;
		}

		onUpTap(){
			this.move(-this._step);
		}

		ondownTap(){
			this.move(this._step);
		}

		onBarBegin(e: egret.TouchEvent){
			this.bar.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onBarMove, this);
			this._prevX = e.stageX;
			this._prevY = e.stageY;
		}

		onBarEnd(){
			this.bar.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onBarMove, this);
		}

		onBarMove(e: egret.TouchEvent){
			let deltaY = e.stageY - this._prevY;
			this.move(deltaY);
			this._prevX = e.stageX;
			this._prevY = e.stageY;
		}

		move(deltaY){
			egret.log('move:' + deltaY);
			let next_top = this.bar.top + deltaY;
			if(next_top < 0){
				this.bar.top = 0;
			}
			else if(next_top > this.barArea.height - this.bar.height){
				this.bar.top = this.barArea.height - this.bar.height;
			}
			else{
				this.bar.top = next_top;
			}
			this.updateScroll();
		}

		updateScroll(){
			let p = this.bar.top / (this.barArea.height - this.bar.height);
			this._scroller.viewport.scrollV = p * (this._scroller.viewport.contentHeight - this._scroller.height)
		}

		updateScrollBar(){
			let p = this._scroller.viewport.scrollV / (this._scroller.viewport.contentHeight - this._scroller.height);
			if(p < 0) p = 0;
			if(p > 1) p = 1;
			let top = p * (this.barArea.height - this.bar.height);
			this.bar.top = top;
		}

		onBarCancel(){
			this.bar.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onBarMove, this);
		}

		onBarReleaseOutside(){
			this.bar.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onBarMove, this);
		}

		protected childrenCreated():void
		{
			super.childrenCreated();
		}
	}
}