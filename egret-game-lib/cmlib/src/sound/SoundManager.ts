module cm{
    class Sound{
        // 背景音乐 同时只存在一个音乐播放 循环播放
        static MUSIC: string = 'sound_type_music';
        // 音效 播放一次
        static EFFECT: string = 'sound_type_effect';
        // 当前播放的音乐
        private _channel: egret.SoundChannel;
        // Sound
        private _sound: egret.Sound;
        // 类型
        private _type: string = 'sound_type_effect';
        // url
        private _url: string = '';
        // 是否正在播放
        private _playing:boolean = false;
        // 是否已经停止播放
        private _stoped:boolean = false;

        constructor(type: string , url: string, autoplay: boolean = true){
            this._type = type;
            this._url = Utils.urlToResName(url);
            if(autoplay)
                this.playSound();
        }

        playSound(){
            RES.getResAsync(this._url,this.onLoadSoundComplete,this);
        }

        setVolume(value){
            if(this._channel){
                this._channel.volume = value;
            }
        }

        stop(){
            this._stoped = true;
            this._playing = false;
            if(this._channel){
                this._channel.stop();
                this._channel = null;
            }
            if(this._sound){
                this._sound = null;
            }
        }

        onLoadSoundComplete(){
            if(this._stoped)
                return;
            let resName = Utils.urlToResName(this._url);
            this._sound = RES.getRes(resName);
            let sound = this._sound;
            if(this._type === Sound.MUSIC){
                if(soundManager.music_on){
                    this._channel = sound.play();
                    this._playing = true;
                    this._channel.volume = soundManager.volume;
                }
            }
            else if(this._type === Sound.EFFECT){
                if(soundManager.sound_on){
                    let channel = sound.play(0, 1);
                    this._playing = true;
                    channel.volume = soundManager.volume;
                }
            }
        }

        get url(): string{
            return this._url;
        }

        get playing(): boolean{
            return this._playing;
        }

        onLoadSoundError(event: egret.Event){
            let sound = <egret.Sound>event.currentTarget;
        }
    }

    export class SoundManager{
        
        private _music_on: boolean = true;
        private _sound_on: boolean = true;
        private _volume: number = 1;
        private _music: Sound = null;
        private _volume_saved: number = 1;

        playMusic(url){
            if(this._music && this._music.url === url && this._music.playing){
                return;
            }
            if(this._music){
                this._music.stop();
            }
            this._music = new Sound(Sound.MUSIC, url);
        }

        playSound(url){
            new Sound(Sound.EFFECT, url);
        }

        get sound_on(): boolean{
            return this._sound_on;
        }

        set sound_on(on: boolean){
            this._sound_on = on;
        }

        get music_on(): boolean{
            return this._music_on;
        }

        set music_on(value: boolean){
            this._music_on = value;
            if(this._music){
                value ? this._music.playSound() : this._music.stop();
            }

        }

        get volume(): number{
            return this._volume;
        }

        set volume(value: number){
            this._volume = value;
            if(this._music){
                this._music.setVolume(value);
            }
        }

        /**
         * 静音
         */
        mute(): void{
            this._volume_saved = this._volume;
            this.volume = 0;
        }

        /**
         * 取消静音
         */
        unmute(): void{
            this.volume = this._volume_saved;
        }

        stopMusic(){
            if(this._music){
                this._music.stop();
            }
        }
    }

    export const soundManager = new SoundManager();
}