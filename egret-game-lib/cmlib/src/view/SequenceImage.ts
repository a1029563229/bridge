module cm {
	export class SequenceImage extends eui.Image{
		private _imgArr: Array<string> = [];
		private _time: number = 0;
		private _playing: boolean = false;
		private _startTime: number = 0;
		private _index: number = 0;
		private _playTimes:number = 0;
		private _repeat:number = 0;
		/**
		 * @param prefix 名字前缀
		 * @param bit 几位数
		 * @param start 开始帧
		 * @param end 结束帧
		 */
		public constructor(prefix: string, bit: number, start: number, end: number) {
			super();
			for(var i = start; i <= end; i++){
				let res = i.toString();
				while(res.length < bit){
					res = '0' + res;
				}
				this._imgArr.push(prefix + res);
			}
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
			let init = RES.getRes(this._imgArr[0]);
			this.width = init.textureWidth;
			this.height = init.textureHeight;
		}

		/**
		 * 开始播放
		 * @param time 耗时多少秒播放完，默认0按帧播放
		 */
		play(time: number = 0, repeat:number = 1){
			this._time = time;
			this._playing = true;
			this._startTime = egret.getTimer();
			this._index = 0;
			this._playTimes = 1;
			this._repeat = repeat;
			this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
		}

		private _play(): void{
			this._playing = true;
			this._startTime = egret.getTimer();
			this._index = 0;
		}

		private onAddToStage(e:egret.Event): void{
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
		}

		onRemove(){
			this.removeEventListener(egret.Event.ENTER_FRAME, this.update, this);
			this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
		}

		complete(){
			if(this._repeat === 0){
				this._play();
			}
			else if(this._repeat > 0){
				if(this._playTimes >= this._repeat){
					this.removeEventListener(egret.Event.ENTER_FRAME, this.update, this);
					this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
				}
				else{
					this._playTimes++;
					this._play();
				}
			}
		}

		update(){
			if(this._playing){
				let tex: egret.Texture;
				if(this._time > 0){
					let now = egret.getTimer();
					let passed = now - this._startTime;
					if(passed > this._time){
						this.complete();
						return;
					}
					let p = passed / this._time;
					p = p > 1 ? 1 : p;
					this._index = Math.round(p * (this._imgArr.length - 1));
					tex = RES.getRes(this._imgArr[this._index])
					this.source = tex;
				}
				else{
					if(this._index > this._imgArr.length - 1){
						this.complete();
						return;
					}
					tex = RES.getRes(this._imgArr[this._index]);
					this.source = tex;
					this._index++;
				}
				this.width = tex.textureWidth;
				this.height = tex.textureHeight;
				this.anchorOffsetX = this.width / 2;
				this.anchorOffsetY = this.height / 2;
			}
		}
	}
}