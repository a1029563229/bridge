module cm{
    class Scheduler{
        private _target: any = null;
        private _callback: Function = null;
        private _interval: number = 0;
        private _repeat: number = 0;
        private _timepassed: number = 0;
        private _times: number = 0;
        private _canPause: boolean = true;
        constructor(target: any, callback: Function, interval: number = 1, repeat: number = 0, canPause: boolean = true){
            this._target = target;
            this._callback = callback;
            this._interval = interval;
            this._repeat = repeat;
            this._canPause = canPause;
        }

        /**
         * 重设定时器
         */
        reset(interval: number, repeat: number){
            this._interval = interval;
            this._repeat = repeat;
            this._times = 0;
            this._timepassed = 0;
        }

        /**
         * 匹配定时器是否是target上的callback函数
         */
        match(target: any, callback: Function){
            return this._target === target && this._callback === callback;
        }

        /**
         * 更新时间，如果该计时器已失效应被移除则返回false，否则返回true
         */
        update(dt: number): boolean{
            if(this._canPause)
                dt = dt > 100 ? 100 : dt;
            this._timepassed += dt;
            if(this._timepassed >= this._interval){
                this._times++;
                this._timepassed = 0;
                this._callback.call(this._target);
            }
            if(this._repeat !== 0 && this._times >= this._repeat){
                return false;
            }
            return true;
        }
    }
    export class ScheduleManager{
        private _schedulers: Array<Scheduler> = [];
        private _timeStamp: number = 0;
        private _ticking: boolean = false;
        constructor(){
            
        }

        private _tick(timeStamp: number): boolean{
            let dt = timeStamp - this._timeStamp;
            this._timeStamp = timeStamp;
            let l = this._schedulers.length;
            for(let i = l - 1; i >= 0; i--){
                let scheduler = this._schedulers[i];
                if(!scheduler){
                    continue;
                }
                let invalid = scheduler.update(dt);
                if(!invalid){
                    this._schedulers.splice(i ,1);
                }
            }
            if(this._schedulers.length === 0){
                this.stopTick();
            }
            return false;
        }

        startTick(){
            if(!this._ticking){
                egret.startTick(this._tick,this);
                this._timeStamp = egret.getTimer();
                this._ticking = true;
            }
        }

        stopTick(){
            if(this._ticking){
                egret.stopTick(this._tick, this);
                this._ticking = false;
            }
        }

        /**
         * 定时器
         * @param target 目标
         * @param callback 回调函数
         * @param interval 间隔(ms)
         * @param repeat 重复次数 0为次数无限
         * @param canPause 是否可以暂停，true: 主循环暂停之后，不再计算时间
         */
        schedule(target:any, callback:Function, interval:number, repeat:number = 0, canPause:boolean = true){
            let index = this._getIndexOfScheduler(target, callback);
            if(index >= 0){
                let scheduler = this._schedulers[index];
                scheduler.reset(interval, repeat);
            }
            else{
                this._schedulers.push(new Scheduler(target, callback, interval, repeat, canPause));
            }
            if(this._schedulers.length > 0){
                this.startTick();
            }
        }

        /**
         * 取消定时器
         * @param target 目标
         * @param callback 回调函数
         */
        unschedule(target:any, callback:Function){
            let index = this._getIndexOfScheduler(target, callback);
            if(index >= 0){
                this._schedulers.splice(index, 1);
            }
        }

        private _getIndexOfScheduler(target:any, callback:Function){
            for(let i = 0; i < this._schedulers.length; i++){
                let scheduler = this._schedulers[i];
                if(scheduler.match(target, callback)){
                    return i;
                }
            }
            return -1;
        }
    }
    export const scheduler = new ScheduleManager();
}