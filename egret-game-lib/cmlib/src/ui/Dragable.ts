namespace cm{
    /**
     * 拖动控制器，限制目标在相对父容器的某个矩形范围内
     */
    export class Dragable{
        private _target: egret.DisplayObject;
        private _parent: egret.DisplayObject;
        private _rect: egret.Rectangle;
        private _prevX: number = 0;
        private _prevY: number = 0;
        private _isDraging:boolean = false;
        /**
         * 启用拖动
         */
        enableDrag(target: egret.DisplayObject, rect: egret.Rectangle){
            this._target = target;
            this._parent = target.parent;
            this._parent.touchEnabled = true;
            this._rect = rect;
            this._prevX = 0;
            this._prevY = 0;
            this._parent.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
            this._parent.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
            this._parent.addEventListener(egret.TouchEvent.TOUCH_END, this._onTouchEnd, this);
            this._parent.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this._onTouchEnd, this);
        }

        /**
         * 禁用拖动
         */
        disableDrag(){
            this._isDraging = false;
            if(!this._parent) return;
            this._parent.touchEnabled = false;
            this._parent.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
            this._parent.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
            this._parent.removeEventListener(egret.TouchEvent.TOUCH_END, this._onTouchEnd, this);
            this._parent.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this._onTouchEnd, this);
        }

        /**
         * 更新可拖动区域
         */
        updateRect(rect): void{
            this._rect = rect;
        }

        /**
         * 停止拖动
         */
        stop(): void{
            this._onTouchEnd();
        }

        get isDraging(): boolean{
            return this._isDraging;
        }

        private _onTouchBegin(e: egret.TouchEvent):void{
            this._prevX = e.stageX;
            this._prevY = e.stageY;
            this._isDraging = true;
        }

        private _onTouchMove(e: egret.TouchEvent):void{
            if(!this._isDraging){
                return;
            }
            let dx = e.stageX - this._prevX;
            let dy = e.stageY - this._prevY;
            this._prevX = e.stageX;
            this._prevY = e.stageY;
            let x = this._target.x, y = this._target.y;

            if(this._rect.width < this._target.width){
                if(x + dx > this._rect.x){
                    x = this._rect.x;
                }
                else if(x + dx < this._rect.width - this._target.width){
                    x = this._rect.width - this._target.width;
                }
                else{
                    x += dx;
                }
            }

            if(this._rect.height < this._target.height){
                if(y + dy > this._rect.y){
                    y = this._rect.y;
                }
                else if(y + dy < this._rect.height - this._target.height){
                    y = this._rect.height - this._target.height;
                }
                else{
                    y += dy;
                }
            }
            
            this._target.x = x;
            this._target.y = y;
        }

        private _onTouchEnd():void{
            this._isDraging = false;
        }
    }
}