module cm {
    /**
     * 带有冷却时间的按钮
     */
    export class CooldownButton {
        private _time: number = 0;
        private _text: string = '';
        private _target: eui.Button;
        private _timer: cm.Ticker;
        constructor(target: eui.Button, buttonText: string){
            this._text = buttonText;
            this._target = target;
            this._target.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
        }

        onRemove(){
            this._target.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
            this.stopTimer();
        }

        cooldown(time){
            this._time = time;
            if(this._time > 0){
                this.startTimer();
                this.updateText();
            }
        }

        startTimer(){
            if(!this._timer){
                this._timer = new cm.Ticker();
            }
            this._timer.start(this.tick.bind(this));
        }

        stopTimer(){
            if(this._timer){
                this._timer.stop();
            }
        }

        tick(){
            let timeleft = this._time - this._timer.timePassed;
            if(this._time >= 0){
                this.updateText();
            }
            else{
                this.updateText();
                this.stopTimer();
            }
        }

        normal(){
            this._target.label = this._text;
            this._target.enabled = true;
            this.stopTimer();
        }

        updateText(){
            let timeleft = this._time - this._timer.timePassed;
            if(timeleft >= 0){
                this._target.label = cm.Utils.formatTime2(timeleft);
                this._target.enabled = false;
            }
            else{
                this._target.label = this._text;
                this._target.enabled = true;
            }
        }
    }
}