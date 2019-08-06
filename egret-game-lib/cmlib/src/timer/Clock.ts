namespace cm{
    /**
     * 计时器，受主循环暂停影响
     */
    export class Clock{
        private _lastTick:number = 0;
        private _time:number = 0;
        /**
         * 开始计时
         */
        start(): void{
            this._lastTick = egret.getTimer();
            this._time = 0;
            egret.startTick(this._tick, this);
        }

        private _tick(time:number): boolean{
            let dt = time - this._lastTick;
            dt = dt > 100 ? 100 : dt;
            this._time += dt;
            this._lastTick = time;
            return false;
        }

        /**
         * 经过的时间
         */
        get time(): number{
            return this._time;
        }

        /**
         * 停止计时
         */
        stop(): void{
            egret.stopTick(this._tick, this);
        }
    }
}