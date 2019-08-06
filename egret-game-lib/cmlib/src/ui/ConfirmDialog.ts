namespace cm {
    export interface IConfirmData {
            content:string,
            /**
             * 按钮音效
             */
            sound?:string,
            ok?:{ text:string, callback?:Function },
            cancel?:{ text:string,callback?:Function }
        }
    export class ConfirmDialog extends cm.EUIComponent implements eui.Component{
        private _data: IConfirmData = null;
        cancelBtn: eui.Button;
        okBtn: eui.Button;
        content: eui.Label;
        bg: eui.Image;
        /**
         * 默认音效
         */
        static DEFAULT_SOUND:string;

        static show (data:IConfirmData,opt?:IAlertOptions): Alert{
            let dialog = new ConfirmDialog(data);
            return Alert.show(dialog,opt);
        }
        public constructor (data: IConfirmData){
            super();
            this._data = data;
            this.skinName = 'ConfirmDialog';
        }

        onComplete() {
            super.onComplete();
            this.top = this.right = this.bottom = this.left = 0;
            this.content.text = this._data.content;
            this.currentState = this._data.cancel ? 'hasCancel' : 'noCancel';
            if(this._data.ok){
                this.okBtn.label = this._data.ok.text;
                this.okBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onOK,this);
            }
            if(this._data.cancel){
                this.cancelBtn.label = this._data.cancel.text;
                this.cancelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCancel,this);
            }
        }

        onOK() {
            this.playButtonSound();
            this.hide();
            if (this._data.ok.callback) {
                this._data.ok.callback();
            }
        }
        onCancel() {
            this.playButtonSound();
            this.hide();
            if (this._data.cancel.callback) {
                this._data.cancel.callback();
            }
        }

        playButtonSound(): void{
            let sound = this._data.sound !== undefined ? this._data.sound : ConfirmDialog.DEFAULT_SOUND;
            if(sound){
                soundManager.playSound(sound);
            }
        }

        hide() {
            let alert = this.parent as Alert;
            console.log(alert);
            alert.hide()
        }
    }
}