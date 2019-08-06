namespace cm {
    var bgColor = 0xffffff;
    var bgRectRadius = 4;
    var fontColor = 0x000000;
    var fontSize = 16;
    export class Tip extends eui.Component{
        private _txt: eui.Label;
        private _bg: egret.Sprite;
        static instance:Tip;
        constructor(){
            super();
            this._bg = new egret.Sprite();
            this.addChild(this._bg);
            this._txt = new eui.Label();
            this._txt.size = fontSize;
            this._txt.textColor = fontColor;
            this._txt.textAlign = egret.HorizontalAlign.CENTER;
            this._txt.verticalAlign = egret.VerticalAlign.MIDDLE;
            this.addChild(this._txt);
        }

        static show(text:string, x:number, y:number, anchorX:number, anchorY:number): void{
            if(!Tip.instance){
                Tip.instance = new Tip();
            }
            Tip.instance.text = text;
            Tip.instance.anchorOffsetX = anchorX * Tip.instance.width;
            Tip.instance.anchorOffsetY = anchorY * Tip.instance.height;
            Tip.instance.x = x;
            Tip.instance.y = y;
            cm.main.stage.addChild(Tip.instance);
        }

        static hide(): void{
            if(Tip.instance && Tip.instance.parent){
                Tip.instance.parent.removeChild(Tip.instance);
            }
        }

        set text(text: string){
            this._txt.text = text;
            this._txt.validateSize();
            this._txt.validateDisplayList();
            let w = this._txt.textWidth + 12;
            let h = this._txt.textHeight + 6;
            let graphics = this._bg.graphics;
            graphics.clear();
            graphics.beginFill(bgColor);
            graphics.drawRoundRect(0, 0, w, h, bgRectRadius, bgRectRadius);
            graphics.endFill();
            this._txt.x = 6;
            this._txt.y = 3;
        }
    }

    export class TipManager{

        private _tip:Tip = null;
        private _map: Map<egret.DisplayObject, string>;

        constructor(){
            this._tip = new Tip();
            this._map = new Map();
        }

        mouseEnabled(): boolean{
            return egret.Capabilities.runtimeType === 'web' && !egret.Capabilities.isMobile;
        }

        updateTip(target: egret.DisplayObject, tip: string){
            this._map.set(target, tip);
        }

        enable(target: egret.DisplayObject, tip: string){
            if(!this.mouseEnabled()) return;
            this._map.set(target, tip);
            target.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.onMouseOver, this);
            target.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.onMouseOut, this);
        }

        disable(target: egret.DisplayObject){
            if(!this.mouseEnabled()) return;
            this._map.delete(target);
            target.removeEventListener(mouse.MouseEvent.MOUSE_OVER, this.onMouseOver, this);
            target.removeEventListener(mouse.MouseEvent.MOUSE_OUT, this.onMouseOut, this);
        }

        onMouseOver(e: egret.TouchEvent){
            egret.log('mouse over');
            this._tip.text = this._map.get(e.currentTarget as egret.DisplayObject);
            cm.main.addChildAt(this._tip, Layer.TOP);
            if(this.mouseEnabled){
                cm.main.stage.addEventListener(mouse.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
            }
            this.updatePos(e);
        }

        onMouseMove(e: egret.TouchEvent){
            egret.log('mouse move');
            this.updatePos(e);
        }

        onMouseOut(e: egret.TouchEvent){
            egret.log('mouse out');
            this._tip.parent && this._tip.parent.removeChild(this._tip);
            if(this.mouseEnabled){
                cm.main.stage.removeEventListener(mouse.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
            }
        }

        updatePos(e: egret.TouchEvent){
            if(this._tip.stage){
                if(e.stageX > cm.main.stage.stageWidth - this._tip.width){
                    this._tip.x = cm.main.stage.stageWidth - this._tip.width;
                }
                else{
                    this._tip.x = e.stageX;
                }
                this._tip.y = e.stageY + 12;
            }
        }
    }

    export const tips = new TipManager();
}