module cm{
    /**
     * 计时器，以时间戳计算，不受主循环暂停的影响
     */
    export class Ticker{  
        private _timer: egret.Timer = null;  
        private _callback: Function = null;
        private _startTime: number = 0;
        private _timePassed: number = 0;

        start(callback){
            this.stop();
            this._startTime = egret.getTimer();
            if(!this._timer){
                this._timer = new egret.Timer(1000);
            }
            this._callback = callback;
            this._timer.addEventListener(egret.TimerEvent.TIMER, this._onTick, this);
            this._timer.start();
        }

        stop(){
            if(this._timer){
                this._timer.stop();
                this._timer.removeEventListener(egret.TimerEvent.TIMER, this._onTick, this);
            }
            this._callback = null;
        }

        /**
         * 时间过了多少秒
         */
        get timePassed(){
            return this._timePassed;
        }

        private _onTick(){
            this._timePassed = Math.floor((egret.getTimer() - this._startTime) / 1000);
            this._callback && this._callback();
        }
    }
}