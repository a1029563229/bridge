module cm {

    export interface TextInputOption{
        placeHolder?: string,
        placeHolderColor?: number,
        errorColor?: number,
        textColor?: number,
        maxChar?: number
    }

    const defaultOption: TextInputOption = {
        placeHolder: '',
        placeHolderColor: 0x967047,
        errorColor: 0xcc545c,
        textColor: 0x967047,
        maxChar: 10
    }

    export class TextInput{
        private _option: TextInputOption;
        private _target: eui.EditableText;
        private _clearWhenFocusIn: boolean = true;
        constructor(target: eui.EditableText, options: TextInputOption = defaultOption){
            this._option = Object.assign({}, defaultOption, options);
            this._target = target;
            this._target.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
            this._target.addEventListener(egret.TextEvent.FOCUS_IN, this.focusIn, this);
            this._target.addEventListener(egret.TextEvent.FOCUS_OUT, this.focusOut, this);
            this._target.addEventListener(egret.TextEvent.CHANGE, this.onchange, this);
            this.setHolderplace();
        }

        onchange(e: egret.TextEvent){
            let str = this._target.text;
            if(str.length > this._option.maxChar){
                str = str.substr(0, this._option.maxChar);
                this._target.text = str;
            }
        }

        focusIn(){
            if(this._clearWhenFocusIn){
                this._target.text = '';
                this._target.textColor = this._option.textColor;
                this._clearWhenFocusIn = false;
            }
        }

        setHolderplace(){
            this._target.text = this._option.placeHolder;
            this._target.textColor = this._option.placeHolderColor;
            this._clearWhenFocusIn = true;
        }

        get clearWhenFocusIn(): boolean{
            return this._clearWhenFocusIn;
        }

        focusOut(){
            let s = this._target.text;
            if(s.trim() === ''){
                this.setHolderplace();
            }
        }
        
        onRemove(){
            this._target.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
            this._target.removeEventListener(egret.TextEvent.FOCUS_IN, this.focusIn, this);
            this._target.removeEventListener(egret.TextEvent.FOCUS_OUT, this.focusOut, this);
            this._target.removeEventListener(egret.TextEvent.CHANGE, this.onchange, this);
        }

        error(text: string){
            this._target.textColor = this._option.errorColor;
            this._target.text = text;
            this._clearWhenFocusIn = true;
        }
    }
}