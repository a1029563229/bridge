var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var cm;
(function (cm) {
    var Component = (function (_super) {
        __extends(Component, _super);
        function Component() {
            var _this = _super.call(this) || this;
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAdd, _this);
            return _this;
        }
        Component.prototype.onAdd = function () {
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
        };
        Component.prototype.onRemove = function () {
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
        };
        return Component;
    }(egret.DisplayObjectContainer));
    cm.Component = Component;
    __reflect(Component.prototype, "cm.Component");
    var EUIComponent = (function (_super) {
        __extends(EUIComponent, _super);
        function EUIComponent() {
            var _this = _super.call(this) || this;
            _this._complete = false;
            _this._readyFunc = null;
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAdd, _this);
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            return _this;
            // this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onCreationComplete, this);
        }
        Object.defineProperty(EUIComponent.prototype, "complete", {
            get: function () {
                return this._complete;
            },
            enumerable: true,
            configurable: true
        });
        EUIComponent.prototype.onReady = function (func) {
            this._readyFunc = func;
        };
        // onCreationComplete(){
        // 	egret.log('creation complete');
        // }
        EUIComponent.prototype.onComplete = function () {
            this._complete = true;
            this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
            this._readyFunc && this._readyFunc();
            this._readyFunc = null;
        };
        EUIComponent.prototype.onAdd = function () {
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
        };
        EUIComponent.prototype.onRemove = function () {
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
            this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
            this._readyFunc = null;
        };
        return EUIComponent;
    }(eui.Component));
    cm.EUIComponent = EUIComponent;
    __reflect(EUIComponent.prototype, "cm.EUIComponent");
})(cm || (cm = {}));
// TypeScript file
var cm;
(function (cm) {
    /**
     * 自适应布局基类
     */
    var AutoLayoutView = (function (_super) {
        __extends(AutoLayoutView, _super);
        function AutoLayoutView() {
            return _super.call(this) || this;
        }
        AutoLayoutView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.layout();
        };
        AutoLayoutView.prototype.layout = function () {
            /**
             * 横屏模式下，将组件左右约束调整为与舞台大小一致
             */
            if (this.stage.scaleMode === egret.StageScaleMode.FIXED_WIDE || this.stage.scaleMode === egret.StageScaleMode.FIXED_HEIGHT) {
                this.left = -this.stage.stageWidth / 2;
                this.right = this.stage.stageWidth / 2;
                this.horizontalCenter = 0;
            }
        };
        return AutoLayoutView;
    }(cm.EUIComponent));
    cm.AutoLayoutView = AutoLayoutView;
    __reflect(AutoLayoutView.prototype, "cm.AutoLayoutView");
})(cm || (cm = {}));
var cm;
(function (cm) {
    /**
     * 带有冷却时间的按钮
     */
    var CooldownButton = (function () {
        function CooldownButton(target, buttonText) {
            this._time = 0;
            this._text = '';
            this._text = buttonText;
            this._target = target;
            this._target.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
        }
        CooldownButton.prototype.onRemove = function () {
            this._target.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
            this.stopTimer();
        };
        CooldownButton.prototype.cooldown = function (time) {
            this._time = time;
            if (this._time > 0) {
                this.startTimer();
                this.updateText();
            }
        };
        CooldownButton.prototype.startTimer = function () {
            if (!this._timer) {
                this._timer = new cm.Ticker();
            }
            this._timer.start(this.tick.bind(this));
        };
        CooldownButton.prototype.stopTimer = function () {
            if (this._timer) {
                this._timer.stop();
            }
        };
        CooldownButton.prototype.tick = function () {
            var timeleft = this._time - this._timer.timePassed;
            if (this._time >= 0) {
                this.updateText();
            }
            else {
                this.updateText();
                this.stopTimer();
            }
        };
        CooldownButton.prototype.normal = function () {
            this._target.label = this._text;
            this._target.enabled = true;
            this.stopTimer();
        };
        CooldownButton.prototype.updateText = function () {
            var timeleft = this._time - this._timer.timePassed;
            if (timeleft >= 0) {
                this._target.label = cm.Utils.formatTime2(timeleft);
                this._target.enabled = false;
            }
            else {
                this._target.label = this._text;
                this._target.enabled = true;
            }
        };
        return CooldownButton;
    }());
    cm.CooldownButton = CooldownButton;
    __reflect(CooldownButton.prototype, "cm.CooldownButton");
})(cm || (cm = {}));
var cm;
(function (cm) {
    var DragonBonesManager = (function () {
        function DragonBonesManager() {
            this._factory = {};
        }
        DragonBonesManager.prototype.getFactory = function (name, dragonbonesData, textureData, texture) {
            if (!this._factory[name]) {
                var egretFactory = new dragonBones.EgretFactory();
                egretFactory.parseDragonBonesData(dragonbonesData);
                egretFactory.parseTextureAtlasData(textureData, texture);
                this._factory[name] = egretFactory;
                return egretFactory;
            }
            else {
                return this._factory[name];
            }
        };
        return DragonBonesManager;
    }());
    cm.DragonBonesManager = DragonBonesManager;
    __reflect(DragonBonesManager.prototype, "cm.DragonBonesManager");
    cm.dragonBonesManager = new DragonBonesManager();
})(cm || (cm = {}));
var cm;
(function (cm) {
    var Dispatcher = (function () {
        function Dispatcher() {
            this._listeners = {};
        }
        Dispatcher.prototype.on = function (type, handler, target) {
            var list = this._listeners[type];
            if (!list) {
                this._listeners[type] = [{ handler: handler, target: target }];
            }
            else {
                this.addListener(list, { handler: handler, target: target });
            }
        };
        Dispatcher.prototype.addListener = function (list, listener) {
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (item.handler === listener.handler && item.target === listener.target) {
                    return;
                }
            }
            list.push(listener);
        };
        Dispatcher.prototype.off = function (type, handler, target) {
            var list = this._listeners[type];
            if (!list || list.length <= 0)
                return;
            var l = list.length - 1;
            for (var i = l; i >= 0; i--) {
                var item = list[i];
                if (item.handler === handler && item.target === target) {
                    list.splice(i, 1);
                }
            }
        };
        Dispatcher.prototype.dispatch = function (type) {
            var list = this._listeners[type];
            if (!list || list.length <= 0) {
                return;
            }
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                item.handler.call(item.target);
            }
        };
        return Dispatcher;
    }());
    cm.Dispatcher = Dispatcher;
    __reflect(Dispatcher.prototype, "cm.Dispatcher");
})(cm || (cm = {}));
var cm;
(function (cm) {
    var DEFAULT_TIMEOUT = 10000;
    var HTTP_HEADER = {};
    var Request = (function () {
        function Request(url, method, data, times, timeout, options) {
            if (times === void 0) { times = 1; }
            if (timeout === void 0) { timeout = DEFAULT_TIMEOUT; }
            this._times = 1;
            this._xhr = null;
            this._url = url;
            this._method = method;
            this._data = data;
            this._timeout = timeout;
            this._times = times;
            this._options = options;
        }
        /**
         * 设置http头
         */
        Request.prototype.setHeader = function (key, value) {
            this._header = this._header || {};
            this._header[key] = value;
        };
        /**
        * 为所有http request设置头
        */
        Request.setHeaderForAll = function (key, value) {
            HTTP_HEADER = HTTP_HEADER || {};
            HTTP_HEADER[key] = value;
        };
        Request.removeHeaderForAll = function (key) {
            if (!HTTP_HEADER)
                return;
            delete HTTP_HEADER[key];
        };
        /**
         * 单次请求
         */
        Request.prototype.request = function (retry) {
            var _this = this;
            if (retry === void 0) { retry = false; }
            this._times--;
            var xhr = new XMLHttpRequest();
            this._xhr = xhr;
            xhr.withCredentials = true;
            xhr.timeout = this._timeout;
            if (this._method === 'GET') {
                this._url = this._url + cm.Utils.serializeParam(this._data);
            }
            xhr.open(this._method, this._url);
            if (HTTP_HEADER || this._header) {
                var header = Object.assign({}, HTTP_HEADER, this._header);
                for (var k in header) {
                    xhr.setRequestHeader(k, header[k]);
                }
            }
            if (egret.Capabilities.isMobile) {
                if (cm.tokens.token) {
                    xhr.setRequestHeader('Authorization', "" + cm.tokens.token);
                }
            }
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            if (egret.Capabilities.runtimeType === egret.RuntimeType.NATIVE) {
                xhr.setRequestHeader('Cookie', cm.cookies.cookie);
            }
            xhr.ontimeout = function () {
                _this._onReject(-1);
            };
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (_this._options.responseIntercept) {
                        var jsonRE = /^\[(.*)\]$|^\{(.*)\}$/;
                        if (jsonRE.test(xhr.response)) {
                            _this._options.responseIntercept(JSON.parse(xhr.response));
                        }
                        else {
                            _this._options.responseIntercept(xhr.response);
                        }
                    }
                    if (xhr.status === 200) {
                        try {
                            var data = JSON.parse(xhr.response);
                            _this._onResolve(data);
                        }
                        catch (e) {
                            console.error('invalid json format');
                            _this._onReject(-1);
                        }
                    }
                    else {
                        var data = null;
                        if (xhr.response) {
                            try {
                                data = JSON.parse(xhr.response);
                            }
                            catch (e) {
                                console.error('invalid json format');
                                _this._onReject(-1);
                                return;
                            }
                        }
                        var err = { status: xhr.status, res: data };
                        /**
                         * TODO 这里关于status的处理有点蛋疼，客户端把200以外的返回都当做是请求失败，
                         * 由于服务器把游戏业务逻辑状态跟http status混用导致判断http是否请求成功要
                         * 判断多个状态，服务器返回204实际上代表业务逻辑处理是成功的，但是没有内容返回,
                         * 服务器应在正确处理请求后全部返回200，具体的游戏业务逻辑状态定义一套状态码
                         */
                        if (xhr.status === 204) {
                            _this._times = 0;
                            _this._onReject(err);
                        }
                        else {
                            _this._onReject(err);
                        }
                    }
                }
            };
            return new Promise(function (resolve, reject) {
                if (!retry) {
                    _this._resolve = resolve;
                    _this._reject = reject;
                }
                if (typeof (_this._data) === 'string')
                    xhr.send(_this._data);
                else
                    xhr.send(JSON.stringify(_this._data));
            });
        };
        Request.prototype._onReject = function (data) {
            this._xhr.onreadystatechange = null;
            this._xhr.ontimeout = null;
            this._xhr = null;
            if (this._times > 0) {
                this.request(true);
                return;
            }
            this._reject(data);
        };
        Request.prototype._onResolve = function (data) {
            this._reject = null;
            this._xhr.onreadystatechange = null;
            this._xhr.ontimeout = null;
            this._xhr = null;
            this._resolve(data);
        };
        return Request;
    }());
    cm.Request = Request;
    __reflect(Request.prototype, "cm.Request");
    var reserveMethods = ['GET', 'POST', 'PUT'];
    var allowConfig = ['responseIntercept'];
    var serviceProxy = {
        get: function (target, name) {
            var method = name.toUpperCase();
            if (!!~reserveMethods.indexOf(method)) {
                return function normal_request(url, params, times, timeout) {
                    if (times === void 0) { times = 1; }
                    if (timeout === void 0) { timeout = DEFAULT_TIMEOUT; }
                    return new Promise(function (resolve, reject) {
                        var req = new Request(url, method, params, times, timeout, target['options']);
                        req.request().then(function (res) {
                            resolve(res);
                        }).catch(function (error) {
                            reject(error);
                        });
                    });
                };
            }
            else {
                throw new Error("There is no method named [" + name + "] in cm.service");
            }
        },
        set: function (target, property, value, receiver) {
            if (allowConfig.indexOf(property) === -1) {
                throw new Error("Can't set property named [" + property + "]!");
            }
            if (property === "options") {
                target['options'] = value;
            }
            else {
                target['options'][property] = value;
            }
            return true;
        }
    };
    /**
     * service 是一个可访问对象
     * 现有 get、post、put 方法可访问
     * 参数顺序为 url, params, times, timeout
     */
    cm.service = new Proxy({ options: {} }, serviceProxy);
})(cm || (cm = {}));
var cm;
(function (cm) {
    var Sound = (function () {
        function Sound(type, url, autoplay) {
            if (autoplay === void 0) { autoplay = true; }
            // 类型
            this._type = 'sound_type_effect';
            // url
            this._url = '';
            // 是否正在播放
            this._playing = false;
            // 是否已经停止播放
            this._stoped = false;
            this._type = type;
            this._url = cm.Utils.urlToResName(url);
            if (autoplay)
                this.playSound();
        }
        Sound.prototype.playSound = function () {
            RES.getResAsync(this._url, this.onLoadSoundComplete, this);
        };
        Sound.prototype.setVolume = function (value) {
            if (this._channel) {
                this._channel.volume = value;
            }
        };
        Sound.prototype.stop = function () {
            this._stoped = true;
            this._playing = false;
            if (this._channel) {
                this._channel.stop();
                this._channel = null;
            }
            if (this._sound) {
                this._sound = null;
            }
        };
        Sound.prototype.onLoadSoundComplete = function () {
            if (this._stoped)
                return;
            var resName = cm.Utils.urlToResName(this._url);
            this._sound = RES.getRes(resName);
            var sound = this._sound;
            if (this._type === Sound.MUSIC) {
                if (cm.soundManager.music_on) {
                    this._channel = sound.play();
                    this._playing = true;
                    this._channel.volume = cm.soundManager.volume;
                }
            }
            else if (this._type === Sound.EFFECT) {
                if (cm.soundManager.sound_on) {
                    var channel = sound.play(0, 1);
                    this._playing = true;
                    channel.volume = cm.soundManager.volume;
                }
            }
        };
        Object.defineProperty(Sound.prototype, "url", {
            get: function () {
                return this._url;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sound.prototype, "playing", {
            get: function () {
                return this._playing;
            },
            enumerable: true,
            configurable: true
        });
        Sound.prototype.onLoadSoundError = function (event) {
            var sound = event.currentTarget;
        };
        // 背景音乐 同时只存在一个音乐播放 循环播放
        Sound.MUSIC = 'sound_type_music';
        // 音效 播放一次
        Sound.EFFECT = 'sound_type_effect';
        return Sound;
    }());
    __reflect(Sound.prototype, "Sound");
    var SoundManager = (function () {
        function SoundManager() {
            this._music_on = true;
            this._sound_on = true;
            this._volume = 1;
            this._music = null;
            this._volume_saved = 1;
        }
        SoundManager.prototype.playMusic = function (url) {
            if (this._music && this._music.url === url && this._music.playing) {
                return;
            }
            if (this._music) {
                this._music.stop();
            }
            this._music = new Sound(Sound.MUSIC, url);
        };
        SoundManager.prototype.playSound = function (url) {
            new Sound(Sound.EFFECT, url);
        };
        Object.defineProperty(SoundManager.prototype, "sound_on", {
            get: function () {
                return this._sound_on;
            },
            set: function (on) {
                this._sound_on = on;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SoundManager.prototype, "music_on", {
            get: function () {
                return this._music_on;
            },
            set: function (value) {
                this._music_on = value;
                if (this._music) {
                    value ? this._music.playSound() : this._music.stop();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SoundManager.prototype, "volume", {
            get: function () {
                return this._volume;
            },
            set: function (value) {
                this._volume = value;
                if (this._music) {
                    this._music.setVolume(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 静音
         */
        SoundManager.prototype.mute = function () {
            this._volume_saved = this._volume;
            this.volume = 0;
        };
        /**
         * 取消静音
         */
        SoundManager.prototype.unmute = function () {
            this.volume = this._volume_saved;
        };
        SoundManager.prototype.stopMusic = function () {
            if (this._music) {
                this._music.stop();
            }
        };
        return SoundManager;
    }());
    cm.SoundManager = SoundManager;
    __reflect(SoundManager.prototype, "cm.SoundManager");
    cm.soundManager = new SoundManager();
})(cm || (cm = {}));
var cm;
(function (cm) {
    var Cookies = (function () {
        function Cookies() {
            this._cookies = '';
            this._cookies = egret.localStorage.getItem('cookies');
        }
        Object.defineProperty(Cookies.prototype, "cookie", {
            get: function () {
                return this._cookies;
            },
            set: function (cookies) {
                this._cookies = cookies;
            },
            enumerable: true,
            configurable: true
        });
        return Cookies;
    }());
    cm.Cookies = Cookies;
    __reflect(Cookies.prototype, "cm.Cookies");
    cm.cookies = new Cookies();
})(cm || (cm = {}));
var cm;
(function (cm) {
    var Token = (function () {
        function Token(tokens) {
            this._token = '';
            this._token = egret.localStorage.getItem('_token');
        }
        Object.defineProperty(Token.prototype, "token", {
            get: function () {
                return this._token;
            },
            set: function (tokens) {
                this._token = tokens;
                egret.localStorage.setItem('_token', tokens);
            },
            enumerable: true,
            configurable: true
        });
        return Token;
    }());
    cm.Token = Token;
    __reflect(Token.prototype, "cm.Token");
    cm.tokens = new Token('');
})(cm || (cm = {}));
var cm;
(function (cm) {
    /**
     * 计时器，受主循环暂停影响
     */
    var Clock = (function () {
        function Clock() {
            this._lastTick = 0;
            this._time = 0;
        }
        /**
         * 开始计时
         */
        Clock.prototype.start = function () {
            this._lastTick = egret.getTimer();
            this._time = 0;
            egret.startTick(this._tick, this);
        };
        Clock.prototype._tick = function (time) {
            var dt = time - this._lastTick;
            dt = dt > 100 ? 100 : dt;
            this._time += dt;
            this._lastTick = time;
            return false;
        };
        Object.defineProperty(Clock.prototype, "time", {
            /**
             * 经过的时间
             */
            get: function () {
                return this._time;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 停止计时
         */
        Clock.prototype.stop = function () {
            egret.stopTick(this._tick, this);
        };
        return Clock;
    }());
    cm.Clock = Clock;
    __reflect(Clock.prototype, "cm.Clock");
})(cm || (cm = {}));
var cm;
(function (cm) {
    var Scheduler = (function () {
        function Scheduler(target, callback, interval, repeat, canPause) {
            if (interval === void 0) { interval = 1; }
            if (repeat === void 0) { repeat = 0; }
            if (canPause === void 0) { canPause = true; }
            this._target = null;
            this._callback = null;
            this._interval = 0;
            this._repeat = 0;
            this._timepassed = 0;
            this._times = 0;
            this._canPause = true;
            this._target = target;
            this._callback = callback;
            this._interval = interval;
            this._repeat = repeat;
            this._canPause = canPause;
        }
        /**
         * 重设定时器
         */
        Scheduler.prototype.reset = function (interval, repeat) {
            this._interval = interval;
            this._repeat = repeat;
            this._times = 0;
            this._timepassed = 0;
        };
        /**
         * 匹配定时器是否是target上的callback函数
         */
        Scheduler.prototype.match = function (target, callback) {
            return this._target === target && this._callback === callback;
        };
        /**
         * 更新时间，如果该计时器已失效应被移除则返回false，否则返回true
         */
        Scheduler.prototype.update = function (dt) {
            if (this._canPause)
                dt = dt > 100 ? 100 : dt;
            this._timepassed += dt;
            if (this._timepassed >= this._interval) {
                this._times++;
                this._timepassed = 0;
                this._callback.call(this._target);
            }
            if (this._repeat !== 0 && this._times >= this._repeat) {
                return false;
            }
            return true;
        };
        return Scheduler;
    }());
    __reflect(Scheduler.prototype, "Scheduler");
    var ScheduleManager = (function () {
        function ScheduleManager() {
            this._schedulers = [];
            this._timeStamp = 0;
            this._ticking = false;
        }
        ScheduleManager.prototype._tick = function (timeStamp) {
            var dt = timeStamp - this._timeStamp;
            this._timeStamp = timeStamp;
            var l = this._schedulers.length;
            for (var i = l - 1; i >= 0; i--) {
                var scheduler_1 = this._schedulers[i];
                if (!scheduler_1) {
                    continue;
                }
                var invalid = scheduler_1.update(dt);
                if (!invalid) {
                    this._schedulers.splice(i, 1);
                }
            }
            if (this._schedulers.length === 0) {
                this.stopTick();
            }
            return false;
        };
        ScheduleManager.prototype.startTick = function () {
            if (!this._ticking) {
                egret.startTick(this._tick, this);
                this._timeStamp = egret.getTimer();
                this._ticking = true;
            }
        };
        ScheduleManager.prototype.stopTick = function () {
            if (this._ticking) {
                egret.stopTick(this._tick, this);
                this._ticking = false;
            }
        };
        /**
         * 定时器
         * @param target 目标
         * @param callback 回调函数
         * @param interval 间隔(ms)
         * @param repeat 重复次数 0为次数无限
         * @param canPause 是否可以暂停，true: 主循环暂停之后，不再计算时间
         */
        ScheduleManager.prototype.schedule = function (target, callback, interval, repeat, canPause) {
            if (repeat === void 0) { repeat = 0; }
            if (canPause === void 0) { canPause = true; }
            var index = this._getIndexOfScheduler(target, callback);
            if (index >= 0) {
                var scheduler_2 = this._schedulers[index];
                scheduler_2.reset(interval, repeat);
            }
            else {
                this._schedulers.push(new Scheduler(target, callback, interval, repeat, canPause));
            }
            if (this._schedulers.length > 0) {
                this.startTick();
            }
        };
        /**
         * 取消定时器
         * @param target 目标
         * @param callback 回调函数
         */
        ScheduleManager.prototype.unschedule = function (target, callback) {
            var index = this._getIndexOfScheduler(target, callback);
            if (index >= 0) {
                this._schedulers.splice(index, 1);
            }
        };
        ScheduleManager.prototype._getIndexOfScheduler = function (target, callback) {
            for (var i = 0; i < this._schedulers.length; i++) {
                var scheduler_3 = this._schedulers[i];
                if (scheduler_3.match(target, callback)) {
                    return i;
                }
            }
            return -1;
        };
        return ScheduleManager;
    }());
    cm.ScheduleManager = ScheduleManager;
    __reflect(ScheduleManager.prototype, "cm.ScheduleManager");
    cm.scheduler = new ScheduleManager();
})(cm || (cm = {}));
var cm;
(function (cm) {
    /**
     * 计时器，以时间戳计算，不受主循环暂停的影响
     */
    var Ticker = (function () {
        function Ticker() {
            this._timer = null;
            this._callback = null;
            this._startTime = 0;
            this._timePassed = 0;
        }
        Ticker.prototype.start = function (callback) {
            this.stop();
            this._startTime = egret.getTimer();
            if (!this._timer) {
                this._timer = new egret.Timer(1000);
            }
            this._callback = callback;
            this._timer.addEventListener(egret.TimerEvent.TIMER, this._onTick, this);
            this._timer.start();
        };
        Ticker.prototype.stop = function () {
            if (this._timer) {
                this._timer.stop();
                this._timer.removeEventListener(egret.TimerEvent.TIMER, this._onTick, this);
            }
            this._callback = null;
        };
        Object.defineProperty(Ticker.prototype, "timePassed", {
            /**
             * 时间过了多少秒
             */
            get: function () {
                return this._timePassed;
            },
            enumerable: true,
            configurable: true
        });
        Ticker.prototype._onTick = function () {
            this._timePassed = Math.floor((egret.getTimer() - this._startTime) / 1000);
            this._callback && this._callback();
        };
        return Ticker;
    }());
    cm.Ticker = Ticker;
    __reflect(Ticker.prototype, "cm.Ticker");
})(cm || (cm = {}));
// TypeScript file
var cm;
(function (cm) {
    ;
    var defaultAlertOptions = { bg: false, clickBgClose: false, closeOnViewTapped: false, addToMain: true };
    var Alert = (function (_super) {
        __extends(Alert, _super);
        function Alert(content, option) {
            var _this = _super.call(this) || this;
            _this._hasBg = true;
            _this._clickBgClose = true;
            _this._showComplete = false;
            _this._closeOnViewTapped = false;
            _this._opt = null;
            option = Object.assign({}, defaultAlertOptions, option);
            _this._opt = option;
            _this._hasBg = option.bg;
            _this._clickBgClose = option.clickBgClose;
            _this._closeOnViewTapped = option.closeOnViewTapped;
            var w = cm.main.stage.stageWidth;
            var h = cm.main.stage.stageHeight;
            _this.width = w;
            _this.height = h;
            _this._content = content;
            if (content instanceof eui.Component) {
                content.horizontalCenter = 0;
                content.verticalCenter = 0;
            }
            else {
                content.anchorOffsetX = content.width / 2;
                content.anchorOffsetY = content.height / 2;
                content.x = w / 2;
                content.y = h / 2;
            }
            if (_this._hasBg)
                _this.createBg();
            _this.addChild(content);
            var sound = _this._opt.sound !== undefined ? _this._opt.sound : Alert.DEFAULT_SOUND;
            if (sound) {
                cm.soundManager.playSound(sound);
            }
            _this.addEventListener(egret.Event.RESIZE, _this.onResize, _this);
            return _this;
        }
        /**
         * @param view
         * @param options
         */
        Alert.show = function (view, options) {
            var alert = new Alert(view, options);
            alert.show();
            return alert;
        };
        Alert.prototype.onResize = function () {
            if (this._bg) {
                var w = cm.main.stage.stageWidth;
                var h = cm.main.stage.stageHeight;
                this._bg.graphics.clear();
                this._bg.graphics.beginFill(0x000000, 1);
                this._bg.graphics.drawRect(0, 0, w, h);
                this._bg.graphics.endFill();
                this._bg.width = w;
                this._bg.height = h;
            }
        };
        Alert.prototype.createBg = function () {
            var w = cm.main.stage.stageWidth;
            var h = cm.main.stage.stageHeight;
            this._bg = new egret.Sprite();
            this._bg.touchEnabled = true;
            this._bg.graphics.beginFill(0x000000, 1);
            this._bg.graphics.drawRect(0, 0, w, h);
            this._bg.graphics.endFill();
            this._bg.width = w;
            this._bg.height = h;
            this.addChild(this._bg);
        };
        Alert.prototype.onBgTap = function () {
            this._clickBgClose && this.hide();
        };
        Alert.prototype.hide = function () {
            var _this = this;
            egret.Tween.removeTweens(this._content);
            var tw = egret.Tween.get(this._content);
            tw.to({
                scaleX: 0,
                scaleY: 0,
                alpha: 0
            }, 200, egret.Ease.backOut).call(function () {
                _this.stage && _this.parent.removeChild(_this);
            });
            if (this._bg) {
                egret.Tween.removeTweens(this._bg);
                var tw2 = egret.Tween.get(this._bg);
                this._bg.alpha = 0.3;
                tw2.to({ alpha: 0 }, 200);
            }
        };
        Alert.prototype.show = function () {
            if (this._opt.addToMain) {
                cm.main.addChild(this);
            }
            else {
                cm.sceneManager.currentScene.addChild(this);
            }
            this._content.scaleX = this._content.scaleX = 0;
            this._content.alpha = 0;
            egret.Tween.removeTweens(this._content);
            var tw = egret.Tween.get(this._content);
            tw.to({
                scaleX: 1,
                scaleY: 1,
                alpha: 1
            }, 300, egret.Ease.backOut).call(this.onShowComplete, this);
            if (this._bg) {
                var alpha = this._opt.alpha || 0.3;
                this._bg.alpha = 0;
                egret.Tween.removeTweens(this._bg);
                var tw2 = egret.Tween.get(this._bg);
                tw2.to({ alpha: alpha }, 300);
            }
        };
        Alert.prototype.onShowComplete = function () {
            this._showComplete = true;
            var func = this._content['onShowComplete'];
            func && func.call(this._content);
        };
        Object.defineProperty(Alert.prototype, "showComplete", {
            get: function () {
                return this._showComplete;
            },
            enumerable: true,
            configurable: true
        });
        Alert.prototype.onAdd = function () {
            _super.prototype.onAdd.call(this);
            if (this._bg && this._hasBg)
                this._bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBgTap, this);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onViewTap, this);
        };
        Alert.prototype.onRemove = function () {
            _super.prototype.onRemove.call(this);
            if (this._bg && this._hasBg)
                this._bg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBgTap, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onViewTap, this);
            egret.Tween.removeTweens(this._content);
            this._bg = null;
            this._content = null;
        };
        Alert.prototype.onViewTap = function (e) {
            if (!this._closeOnViewTapped) {
                e.stopPropagation();
            }
            else {
                this.hide();
            }
        };
        return Alert;
    }(cm.AutoLayoutView));
    cm.Alert = Alert;
    __reflect(Alert.prototype, "cm.Alert");
})(cm || (cm = {}));
var cm;
(function (cm) {
    var ConfirmDialog = (function (_super) {
        __extends(ConfirmDialog, _super);
        function ConfirmDialog(data) {
            var _this = _super.call(this) || this;
            _this._data = null;
            _this._data = data;
            _this.skinName = 'ConfirmDialog';
            return _this;
        }
        ConfirmDialog.show = function (data, opt) {
            var dialog = new ConfirmDialog(data);
            return cm.Alert.show(dialog, opt);
        };
        ConfirmDialog.prototype.onComplete = function () {
            _super.prototype.onComplete.call(this);
            this.top = this.right = this.bottom = this.left = 0;
            this.content.text = this._data.content;
            this.currentState = this._data.cancel ? 'hasCancel' : 'noCancel';
            if (this._data.ok) {
                this.okBtn.label = this._data.ok.text;
                this.okBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOK, this);
            }
            if (this._data.cancel) {
                this.cancelBtn.label = this._data.cancel.text;
                this.cancelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancel, this);
            }
        };
        ConfirmDialog.prototype.onOK = function () {
            this.playButtonSound();
            this.hide();
            if (this._data.ok.callback) {
                this._data.ok.callback();
            }
        };
        ConfirmDialog.prototype.onCancel = function () {
            this.playButtonSound();
            this.hide();
            if (this._data.cancel.callback) {
                this._data.cancel.callback();
            }
        };
        ConfirmDialog.prototype.playButtonSound = function () {
            var sound = this._data.sound !== undefined ? this._data.sound : ConfirmDialog.DEFAULT_SOUND;
            if (sound) {
                cm.soundManager.playSound(sound);
            }
        };
        ConfirmDialog.prototype.hide = function () {
            var alert = this.parent;
            console.log(alert);
            alert.hide();
        };
        return ConfirmDialog;
    }(cm.EUIComponent));
    cm.ConfirmDialog = ConfirmDialog;
    __reflect(ConfirmDialog.prototype, "cm.ConfirmDialog");
})(cm || (cm = {}));
var cm;
(function (cm) {
    var Algorithm = (function () {
        function Algorithm() {
        }
        /**
         * bresenham-algorithm
         * 计算出一条直线所经过的像素点
         */
        Algorithm.getLinePoints = function (x0, y0, x1, y1) {
            var result = [];
            var dx = Math.abs(x1 - x0);
            var dy = Math.abs(y1 - y0);
            var sx = (x0 < x1) ? 1 : -1;
            var sy = (y0 < y1) ? 1 : -1;
            var err = dx - dy;
            while (true) {
                result.push({ x: x0, y: y0 });
                if ((x0 == x1) && (y0 == y1))
                    break;
                var e2 = 2 * err;
                if (e2 > -dy) {
                    err -= dy;
                    x0 += sx;
                }
                if (e2 < dx) {
                    err += dx;
                    y0 += sy;
                }
            }
            return result;
        };
        return Algorithm;
    }());
    cm.Algorithm = Algorithm;
    __reflect(Algorithm.prototype, "cm.Algorithm");
})(cm || (cm = {}));
var cm;
(function (cm) {
    /**
     * 拖动控制器，限制目标在相对父容器的某个矩形范围内
     */
    var Dragable = (function () {
        function Dragable() {
            this._prevX = 0;
            this._prevY = 0;
            this._isDraging = false;
        }
        /**
         * 启用拖动
         */
        Dragable.prototype.enableDrag = function (target, rect) {
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
        };
        /**
         * 禁用拖动
         */
        Dragable.prototype.disableDrag = function () {
            this._isDraging = false;
            if (!this._parent)
                return;
            this._parent.touchEnabled = false;
            this._parent.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
            this._parent.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
            this._parent.removeEventListener(egret.TouchEvent.TOUCH_END, this._onTouchEnd, this);
            this._parent.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this._onTouchEnd, this);
        };
        /**
         * 更新可拖动区域
         */
        Dragable.prototype.updateRect = function (rect) {
            this._rect = rect;
        };
        /**
         * 停止拖动
         */
        Dragable.prototype.stop = function () {
            this._onTouchEnd();
        };
        Object.defineProperty(Dragable.prototype, "isDraging", {
            get: function () {
                return this._isDraging;
            },
            enumerable: true,
            configurable: true
        });
        Dragable.prototype._onTouchBegin = function (e) {
            this._prevX = e.stageX;
            this._prevY = e.stageY;
            this._isDraging = true;
        };
        Dragable.prototype._onTouchMove = function (e) {
            if (!this._isDraging) {
                return;
            }
            var dx = e.stageX - this._prevX;
            var dy = e.stageY - this._prevY;
            this._prevX = e.stageX;
            this._prevY = e.stageY;
            var x = this._target.x, y = this._target.y;
            if (this._rect.width < this._target.width) {
                if (x + dx > this._rect.x) {
                    x = this._rect.x;
                }
                else if (x + dx < this._rect.width - this._target.width) {
                    x = this._rect.width - this._target.width;
                }
                else {
                    x += dx;
                }
            }
            if (this._rect.height < this._target.height) {
                if (y + dy > this._rect.y) {
                    y = this._rect.y;
                }
                else if (y + dy < this._rect.height - this._target.height) {
                    y = this._rect.height - this._target.height;
                }
                else {
                    y += dy;
                }
            }
            this._target.x = x;
            this._target.y = y;
        };
        Dragable.prototype._onTouchEnd = function () {
            this._isDraging = false;
        };
        return Dragable;
    }());
    cm.Dragable = Dragable;
    __reflect(Dragable.prototype, "cm.Dragable");
})(cm || (cm = {}));
var ForumPage = (function (_super) {
    __extends(ForumPage, _super);
    function ForumPage() {
        var _this = _super.call(this) || this;
        _this.skinName = 'ForumPageSkin';
        return _this;
    }
    ForumPage.prototype.onComplete = function () {
        _super.prototype.onComplete.call(this);
    };
    return ForumPage;
}(cm.AutoLayoutView));
__reflect(ForumPage.prototype, "ForumPage", ["eui.UIComponent", "egret.DisplayObject"]);
var cm;
(function (cm) {
    var ScrollBar = (function (_super) {
        __extends(ScrollBar, _super);
        function ScrollBar(scroller, container, up, down, bar, barArea, options) {
            var _this = _super.call(this) || this;
            _this._step = 50;
            _this._miniHeight = 35;
            _this._prevX = 0;
            _this._prevY = 0;
            _this.up = up;
            _this.down = down;
            _this.bar = bar;
            _this.barArea = barArea;
            _this._scroller = scroller;
            _this._container = container;
            if (options) {
                if (options.minHeight !== undefined)
                    _this._miniHeight = options.minHeight;
                if (options.step !== undefined)
                    _this._step = options.step;
            }
            return _this;
        }
        ScrollBar.prototype.enable = function () {
            egret.log('init scrollbar');
            this.validateNow();
            this.up && this.up.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpTap, this);
            this.down && this.down.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ondownTap, this);
            this.bar && this.bar.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBarBegin, this);
            this.bar && this.bar.addEventListener(egret.TouchEvent.TOUCH_END, this.onBarEnd, this);
            this.bar && this.bar.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onBarCancel, this);
            this.bar && this.bar.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onBarReleaseOutside, this);
            this.bar && this._container.addEventListener(eui.UIEvent.RESIZE, this.onResize, this);
            this.bar && this._scroller.addEventListener(egret.Event.CHANGE, this.onScroll, this);
            this.resizeBar();
            this.bar.top = 0;
        };
        ScrollBar.prototype.disable = function () {
            _super.prototype.onRemove.call(this);
            this.up && this.up.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpTap, this);
            this.down && this.down.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.ondownTap, this);
            this.bar && this.bar.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBarBegin, this);
            this.bar && this.bar.removeEventListener(egret.TouchEvent.TOUCH_END, this.onBarEnd, this);
            this.bar && this.bar.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onBarMove, this);
            this.bar && this.bar.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onBarCancel, this);
            this.bar && this.bar.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onBarReleaseOutside, this);
            this._container && this._container.removeEventListener(eui.UIEvent.RESIZE, this.onResize, this);
            this._scroller && this._scroller.removeEventListener(egret.Event.CHANGE, this.onScroll, this);
        };
        ScrollBar.prototype.onScroll = function (e) {
            egret.log('on scroll');
            this.updateScrollBar();
        };
        ScrollBar.prototype.onResize = function (e) {
            egret.log('on resize');
            this.resizeBar();
            this.move(0);
        };
        ScrollBar.prototype.resizeBar = function () {
            if (!this._scroller || !this.bar || !this.barArea) {
                return;
            }
            this._scroller.viewport.validateNow();
            var h = (this._scroller.height / this._scroller.viewport.measuredHeight) * this.barArea.height;
            if (h < this._miniHeight)
                h = this._miniHeight;
            if (h > this.barArea.height)
                h = this.barArea.height;
            this.bar.height = h;
        };
        ScrollBar.prototype.onUpTap = function () {
            this.move(-this._step);
        };
        ScrollBar.prototype.ondownTap = function () {
            this.move(this._step);
        };
        ScrollBar.prototype.onBarBegin = function (e) {
            this.bar.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onBarMove, this);
            this._prevX = e.stageX;
            this._prevY = e.stageY;
        };
        ScrollBar.prototype.onBarEnd = function () {
            this.bar.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onBarMove, this);
        };
        ScrollBar.prototype.onBarMove = function (e) {
            var deltaY = e.stageY - this._prevY;
            this.move(deltaY);
            this._prevX = e.stageX;
            this._prevY = e.stageY;
        };
        ScrollBar.prototype.move = function (deltaY) {
            egret.log('move:' + deltaY);
            var next_top = this.bar.top + deltaY;
            if (next_top < 0) {
                this.bar.top = 0;
            }
            else if (next_top > this.barArea.height - this.bar.height) {
                this.bar.top = this.barArea.height - this.bar.height;
            }
            else {
                this.bar.top = next_top;
            }
            this.updateScroll();
        };
        ScrollBar.prototype.updateScroll = function () {
            var p = this.bar.top / (this.barArea.height - this.bar.height);
            this._scroller.viewport.scrollV = p * (this._scroller.viewport.contentHeight - this._scroller.height);
        };
        ScrollBar.prototype.updateScrollBar = function () {
            var p = this._scroller.viewport.scrollV / (this._scroller.viewport.contentHeight - this._scroller.height);
            if (p < 0)
                p = 0;
            if (p > 1)
                p = 1;
            var top = p * (this.barArea.height - this.bar.height);
            this.bar.top = top;
        };
        ScrollBar.prototype.onBarCancel = function () {
            this.bar.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onBarMove, this);
        };
        ScrollBar.prototype.onBarReleaseOutside = function () {
            this.bar.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onBarMove, this);
        };
        ScrollBar.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
        };
        return ScrollBar;
    }(cm.EUIComponent));
    cm.ScrollBar = ScrollBar;
    __reflect(ScrollBar.prototype, "cm.ScrollBar", ["eui.UIComponent", "egret.DisplayObject"]);
})(cm || (cm = {}));
var cm;
(function (cm) {
    var defaultOption = {
        placeHolder: '',
        placeHolderColor: 0x967047,
        errorColor: 0xcc545c,
        textColor: 0x967047,
        maxChar: 10
    };
    var TextInput = (function () {
        function TextInput(target, options) {
            if (options === void 0) { options = defaultOption; }
            this._clearWhenFocusIn = true;
            this._option = Object.assign({}, defaultOption, options);
            this._target = target;
            this._target.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
            this._target.addEventListener(egret.TextEvent.FOCUS_IN, this.focusIn, this);
            this._target.addEventListener(egret.TextEvent.FOCUS_OUT, this.focusOut, this);
            this._target.addEventListener(egret.TextEvent.CHANGE, this.onchange, this);
            this.setHolderplace();
        }
        TextInput.prototype.onchange = function (e) {
            var str = this._target.text;
            if (str.length > this._option.maxChar) {
                str = str.substr(0, this._option.maxChar);
                this._target.text = str;
            }
        };
        TextInput.prototype.focusIn = function () {
            if (this._clearWhenFocusIn) {
                this._target.text = '';
                this._target.textColor = this._option.textColor;
                this._clearWhenFocusIn = false;
            }
        };
        TextInput.prototype.setHolderplace = function () {
            this._target.text = this._option.placeHolder;
            this._target.textColor = this._option.placeHolderColor;
            this._clearWhenFocusIn = true;
        };
        Object.defineProperty(TextInput.prototype, "clearWhenFocusIn", {
            get: function () {
                return this._clearWhenFocusIn;
            },
            enumerable: true,
            configurable: true
        });
        TextInput.prototype.focusOut = function () {
            var s = this._target.text;
            if (s.trim() === '') {
                this.setHolderplace();
            }
        };
        TextInput.prototype.onRemove = function () {
            this._target.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
            this._target.removeEventListener(egret.TextEvent.FOCUS_IN, this.focusIn, this);
            this._target.removeEventListener(egret.TextEvent.FOCUS_OUT, this.focusOut, this);
            this._target.removeEventListener(egret.TextEvent.CHANGE, this.onchange, this);
        };
        TextInput.prototype.error = function (text) {
            this._target.textColor = this._option.errorColor;
            this._target.text = text;
            this._clearWhenFocusIn = true;
        };
        return TextInput;
    }());
    cm.TextInput = TextInput;
    __reflect(TextInput.prototype, "cm.TextInput");
})(cm || (cm = {}));
var cm;
(function (cm) {
    var bgColor = 0xffffff;
    var bgRectRadius = 4;
    var fontColor = 0x000000;
    var fontSize = 16;
    var Tip = (function (_super) {
        __extends(Tip, _super);
        function Tip() {
            var _this = _super.call(this) || this;
            _this._bg = new egret.Sprite();
            _this.addChild(_this._bg);
            _this._txt = new eui.Label();
            _this._txt.size = fontSize;
            _this._txt.textColor = fontColor;
            _this._txt.textAlign = egret.HorizontalAlign.CENTER;
            _this._txt.verticalAlign = egret.VerticalAlign.MIDDLE;
            _this.addChild(_this._txt);
            return _this;
        }
        Tip.show = function (text, x, y, anchorX, anchorY) {
            if (!Tip.instance) {
                Tip.instance = new Tip();
            }
            Tip.instance.text = text;
            Tip.instance.anchorOffsetX = anchorX * Tip.instance.width;
            Tip.instance.anchorOffsetY = anchorY * Tip.instance.height;
            Tip.instance.x = x;
            Tip.instance.y = y;
            cm.main.stage.addChild(Tip.instance);
        };
        Tip.hide = function () {
            if (Tip.instance && Tip.instance.parent) {
                Tip.instance.parent.removeChild(Tip.instance);
            }
        };
        Object.defineProperty(Tip.prototype, "text", {
            set: function (text) {
                this._txt.text = text;
                this._txt.validateSize();
                this._txt.validateDisplayList();
                var w = this._txt.textWidth + 12;
                var h = this._txt.textHeight + 6;
                var graphics = this._bg.graphics;
                graphics.clear();
                graphics.beginFill(bgColor);
                graphics.drawRoundRect(0, 0, w, h, bgRectRadius, bgRectRadius);
                graphics.endFill();
                this._txt.x = 6;
                this._txt.y = 3;
            },
            enumerable: true,
            configurable: true
        });
        return Tip;
    }(eui.Component));
    cm.Tip = Tip;
    __reflect(Tip.prototype, "cm.Tip");
    var TipManager = (function () {
        function TipManager() {
            this._tip = null;
            this._tip = new Tip();
            this._map = new Map();
        }
        TipManager.prototype.mouseEnabled = function () {
            return egret.Capabilities.runtimeType === 'web' && !egret.Capabilities.isMobile;
        };
        TipManager.prototype.updateTip = function (target, tip) {
            this._map.set(target, tip);
        };
        TipManager.prototype.enable = function (target, tip) {
            if (!this.mouseEnabled())
                return;
            this._map.set(target, tip);
            target.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.onMouseOver, this);
            target.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.onMouseOut, this);
        };
        TipManager.prototype.disable = function (target) {
            if (!this.mouseEnabled())
                return;
            this._map.delete(target);
            target.removeEventListener(mouse.MouseEvent.MOUSE_OVER, this.onMouseOver, this);
            target.removeEventListener(mouse.MouseEvent.MOUSE_OUT, this.onMouseOut, this);
        };
        TipManager.prototype.onMouseOver = function (e) {
            egret.log('mouse over');
            this._tip.text = this._map.get(e.currentTarget);
            cm.main.addChildAt(this._tip, cm.Layer.TOP);
            if (this.mouseEnabled) {
                cm.main.stage.addEventListener(mouse.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
            }
            this.updatePos(e);
        };
        TipManager.prototype.onMouseMove = function (e) {
            egret.log('mouse move');
            this.updatePos(e);
        };
        TipManager.prototype.onMouseOut = function (e) {
            egret.log('mouse out');
            this._tip.parent && this._tip.parent.removeChild(this._tip);
            if (this.mouseEnabled) {
                cm.main.stage.removeEventListener(mouse.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
            }
        };
        TipManager.prototype.updatePos = function (e) {
            if (this._tip.stage) {
                if (e.stageX > cm.main.stage.stageWidth - this._tip.width) {
                    this._tip.x = cm.main.stage.stageWidth - this._tip.width;
                }
                else {
                    this._tip.x = e.stageX;
                }
                this._tip.y = e.stageY + 12;
            }
        };
        return TipManager;
    }());
    cm.TipManager = TipManager;
    __reflect(TipManager.prototype, "cm.TipManager");
    cm.tips = new TipManager();
})(cm || (cm = {}));
var cm;
(function (cm) {
    /**
     * 缓存池
     */
    var CachePool = (function () {
        function CachePool() {
            this._objs = {};
        }
        /**
         * 缓存一个对象
         */
        CachePool.prototype.put = function (name, obj) {
            if (!this._objs[name]) {
                this._objs[name] = [];
            }
            obj.cache();
            if (this._objs[name].length > 100) {
                console.warn("\"" + name + "\" object cached over 50");
            }
            this._objs[name].push(obj);
        };
        /**
         * 取出一个对象
         */
        CachePool.prototype.get = function (classType) {
            var name = classType.prototype.__class__;
            var arr = this._objs[name];
            if (arr && arr.length > 0) {
                var obj = arr.pop();
                obj.reuse();
                return obj;
            }
            if (classType) {
                return new classType();
            }
            return null;
        };
        return CachePool;
    }());
    cm.CachePool = CachePool;
    __reflect(CachePool.prototype, "cm.CachePool");
    cm.cachePool = new CachePool();
})(cm || (cm = {}));
var cm;
(function (cm) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.getDragonBonesRes = function (resArr) {
            var arr = [];
            resArr.forEach(function (res) {
                arr.push.apply(arr, [res + '_ske_json', res + '_tex_json', res + '_tex_png']);
            });
            return arr;
        };
        /**
         * 从一个数组中随机选一个
         */
        Utils.roll = function (arr) {
            var l = arr.length;
            return arr[Math.floor(Math.random() * l)];
        };
        Utils.getQueryParam = function (param) {
            var result = window.location.search.match(new RegExp("(\\?|&)" + param + "(\\[\\])?=([^&]*)"));
            return result ? result[3] : false;
        };
        Utils.serializeParam = function (params) {
            var result = '';
            for (var k in params) {
                var val = params[k];
                if (val !== undefined && val !== null) {
                    result += (result === '' ? '?' : '&') + k + '=' + val;
                }
            }
            return result;
        };
        /**
         * 将时间处理成 xx天 xx:xx:xx 的格式
         * @param seconds 秒数
         */
        Utils.formatTime = function (seconds) {
            var result = '';
            var daySeconds = 60 * 60 * 24;
            var day = seconds > daySeconds ? Math.floor(seconds / daySeconds) : 0;
            seconds %= daySeconds;
            var hourSeconds = 60 * 60;
            var hours = seconds > hourSeconds ? Math.floor(seconds / hourSeconds) : 0;
            seconds %= hourSeconds;
            var minutes = seconds > 60 ? Math.floor(seconds / 60) : 0;
            seconds %= 60;
            if (day > 0)
                result += day + '天' + ' ';
            result += hours < 10 ? '0' + hours : hours;
            result += ':';
            result += minutes < 10 ? '0' + minutes : minutes;
            result += ':';
            result += seconds < 10 ? '0' + seconds : seconds;
            return result;
        };
        /**
         * 将时间处理成 xx:xx 的格式
         * @param seconds 秒数
         */
        Utils.formatTime2 = function (seconds) {
            var result = '';
            var minutes = seconds > 60 ? Math.floor(seconds / 60) : 0;
            seconds %= 60;
            result = minutes < 10 ? '0' + minutes : minutes + '';
            result += ':';
            result += seconds < 10 ? '0' + seconds : seconds;
            return result;
        };
        Utils.sortOrder = function (container, children) {
            children.sort(function (a, b) {
                if (a.y > b.y)
                    return 1;
                if (a.y < b.y)
                    return -1;
                return 0;
            });
            var deeps = children.map(function (item) { return container.getChildIndex(item); });
            deeps.sort();
            children.forEach(function (item, index) {
                container.setChildIndex(item, deeps[index]);
            });
        };
        /**
         * 将锚点设置为以对象的宽高为倍数
         */
        Utils.setAnchor = function (target, x, y) {
            target.anchorOffsetX = target.width * x;
            target.anchorOffsetY = target.height * y;
        };
        /**
         * 延迟调用函数
         */
        Utils.delay = function (delay, callback) {
            var t = new egret.Timer(delay, 1);
            var cb = function () {
                t.removeEventListener(egret.TimerEvent.TIMER, cb, this);
                callback();
            };
            t.addEventListener(egret.TimerEvent.TIMER, cb, this);
            t.start();
        };
        /**
         * 计算出一个合适的缩放比，使w,h能刚好放入limitW,limitH
         * @param maxScale 如果大小小于限制大小，是否缩放至限制大小
         */
        Utils.fitScale = function (limitW, limitH, w, h, maxScale) {
            if (maxScale === void 0) { maxScale = false; }
            if (w <= limitW && h <= limitH && !maxScale) {
                return 1;
            }
            else {
                var scale_w = limitW / w;
                var scale_h = limitH / h;
                return scale_w < scale_h ? scale_w : scale_h;
            }
        };
        /**
         * 文字超长省略号
         */
        Utils.stringEllipsis = function (str, max) {
            if (str.length > max) {
                str = str.substr(0, max);
                str += '.';
                return str;
            }
            else {
                return str;
            }
        };
        /**
         * 是否是pc端
         */
        Utils.IsPC = function () {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        };
        /**
         * convert res url to res name in egret
         */
        Utils.urlToResName = function (url) {
            var index = url.lastIndexOf('/');
            if (index !== -1) {
                url = url.substring(index + 1);
            }
            return url.replace('.', '_');
        };
        /**
         * 数学角度转换为白鹭坐标系的角度
         * 白鹭的角度是从右开始顺时针
         * math.atan2的角度是从下开始逆时针 0 ~ 180 顺时针 0 ~ -180
         * 判断范围时，将atan2的角度转换至白鹭角度范围
         */
        Utils.mathAngleToRotation = function (dx, dy) {
            var angle = Math.atan2(dx, dy) * 180 / Math.PI;
            if (angle <= 180 && angle > 90) {
                return 450 - angle;
            }
            else if (angle > -180 && angle <= 90) {
                return 90 - angle;
            }
            else {
                throw new Error('error angle range!');
            }
        };
        /**
         * 添加历史记录
         */
        Utils.addHistoryState = function (url) {
            if (url === void 0) { url = location.origin + '/tower'; }
            egret.log("addUrl");
            var origin = location.href;
            history.pushState({}, "", location.origin + '/tower');
            history.pushState({}, "", origin);
            window.addEventListener("popstate", function (e) {
                if (history.state) {
                    egret.log("test");
                    location.href = url;
                }
            });
        };
        Utils.loadScript = function (list, callback) {
            var loaded = 0;
            var loadNext = function () {
                Utils.loadSingleScript(list[loaded], function () {
                    loaded++;
                    if (loaded >= list.length) {
                        callback();
                    }
                    else {
                        loadNext();
                    }
                });
            };
            loadNext();
        };
        Utils.loadSingleScript = function (src, callback) {
            var s = document.createElement('script');
            s.async = false;
            s.src = src;
            s.addEventListener('load', function () {
                s.parentNode.removeChild(s);
                s.removeEventListener('load', arguments.callee, false);
                callback();
            }, false);
            document.body.appendChild(s);
        };
        return Utils;
    }());
    cm.Utils = Utils;
    __reflect(Utils.prototype, "cm.Utils");
})(cm || (cm = {}));
var cnUtils;
(function (cnUtils) {
    function touchTap(target, handler, thiz) {
        if (target) {
            target.addEventListener(egret.TouchEvent.TOUCH_TAP, handler, thiz);
        }
        else {
            egret.error("target is null!");
        }
    }
    cnUtils.touchTap = touchTap;
    function onItemTap(target, handler, thiz) {
        if (target) {
            target.addEventListener(eui.ItemTapEvent.ITEM_TAP, handler, thiz);
        }
        else {
            egret.error("target is null!");
        }
    }
    cnUtils.onItemTap = onItemTap;
    function onceTouchTap(target, handler, thiz) {
        if (target) {
            target.once(egret.TouchEvent.TOUCH_TAP, handler, thiz);
        }
        else {
            egret.error("target is null!");
        }
    }
    cnUtils.onceTouchTap = onceTouchTap;
    /**该函数用于修改引擎用 */
    function hackEngine() {
        // eui.Button.prototype['buttonReleased'] = function () {
        //     codearena.Sound.button();
        // }
        eui.Label.default_fontFamily = "SimHei";
        egret.TextField.default_fontFamily = "SimHei";
        var tiled = window['tiled'];
        if (tiled) {
            tiled.getRes = function (url, compFunc, thisObject, type) {
                var index = url.lastIndexOf('/');
                var key = url.slice(index + 1);
                key = key.replace('.', '_');
                url = cnUtils.getRESUrlByKey(key);
                RES.getResByUrl(url, compFunc, thisObject, type);
                egret.log(url);
            };
        }
    }
    cnUtils.hackEngine = hackEngine;
    function getLocalStorage(key, defualtItem) {
        var ret = egret.localStorage.getItem(key) || defualtItem;
        if (ret)
            ret = JSON.parse(ret);
        return ret;
    }
    cnUtils.getLocalStorage = getLocalStorage;
    function setLocalStorage(key, item) {
        var str = JSON.stringify(item);
        egret.localStorage.setItem(key, str);
    }
    cnUtils.setLocalStorage = setLocalStorage;
    var queryParam;
    function anyaQueryParam() {
        queryParam = {};
        var link = window.location.search.substr(1);
        var paramStrs = link.split('&');
        for (var i = 0, len = paramStrs.length; i < len; i++) {
            var paramStr = paramStrs[i];
            var params = paramStr.split('=');
            var key = params[0];
            var value = params[1];
            queryParam[key] = value;
        }
    }
    cnUtils.anyaQueryParam = anyaQueryParam;
    function getQuery(key) {
        if (queryParam == null) {
            anyaQueryParam();
        }
        return queryParam[key];
    }
    cnUtils.getQuery = getQuery;
    function IS_Mobile() {
        return (egret.Capabilities.isMobile || getQuery('isMobile'));
    }
    cnUtils.IS_Mobile = IS_Mobile;
    function IS_SDK() {
        return (egret.Capabilities.isMobile && window["cordova"]);
    }
    cnUtils.IS_SDK = IS_SDK;
    function getRESUrlByKey(key) {
        var keyMap = RES["configInstance"].keyMap;
        if (keyMap[key]) {
            return keyMap[key].url;
        }
        return key;
    }
    cnUtils.getRESUrlByKey = getRESUrlByKey;
    function safeGetElement(list, index) {
        if (list.length <= index) {
            return list[list.length - 1];
        }
        return list[index];
    }
    cnUtils.safeGetElement = safeGetElement;
    function toFixNum(num, len, char) {
        var ret = num + "";
        while (ret.length < len) {
            ret = char + ret;
        }
        return ret;
    }
    cnUtils.toFixNum = toFixNum;
})(cnUtils || (cnUtils = {}));
var cm;
(function (cm) {
    cm.main = null;
    function init(m) {
        cm.main = m;
    }
    cm.init = init;
})(cm || (cm = {}));
var cm;
(function (cm) {
    var BaseScene = (function (_super) {
        __extends(BaseScene, _super);
        function BaseScene(args) {
            var _this = _super.call(this) || this;
            _this._skinName = '';
            _this._args = null;
            _this._args = args;
            return _this;
        }
        BaseScene.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            egret.log('scene children created');
        };
        /**
         * 加载场景资源
         * @param group 场景默认资源组
         * @param resArr 需要动态加载的资源
         * @param images 需要预加载的远程服务器上的图片
         */
        BaseScene.prototype.loadRes = function (group, resArr, images) {
            var _this = this;
            if (resArr === void 0) { resArr = []; }
            if (images === void 0) { images = []; }
            this.loadDynamicImage(images).then(function () {
                _this.loadResInConfig(group, resArr);
            });
        };
        /**
         * 加载在.res.json中配置好的资源
         */
        BaseScene.prototype.loadResInConfig = function (group, resArr) {
            var groupResArr = RES.getGroupByName(group).map(function (item) {
                return item.name;
            });
            var newGroupName = 'dynamic_group';
            var arr = groupResArr.concat(resArr);
            RES.createGroup(newGroupName, arr, true);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadErr, this);
            RES.loadGroup(newGroupName);
        };
        /**
         * 加载远程服务器图片
         * @param urls 图片地址数组
         */
        BaseScene.prototype.loadDynamicImage = function (urls) {
            return Promise.all(urls.map(function (url) {
                return new Promise(function (resolve, reject) {
                    RES.getResByUrl(url, resolve, null, RES.ResourceItem.TYPE_IMAGE);
                });
            }));
        };
        BaseScene.prototype.onLoaded = function () {
        };
        BaseScene.prototype.onRemove = function () {
            _super.prototype.onRemove.call(this);
            this.removeEventListener(eui.UIEvent.COMPLETE, this.onSkinComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadErr, this);
        };
        BaseScene.prototype.onResourceLoadComplete = function (e) {
            if (e.groupName === 'dynamic_group') {
                egret.log('load scene resource compelte');
                if (this._skinName) {
                    this.applySkin(this._skinName);
                }
                else {
                    this.onLoaded();
                }
            }
        };
        BaseScene.prototype.onResourceProgress = function (e) {
            if (e.groupName === 'dynamic_group') {
                this.onProgress(e.itemsLoaded, e.itemsTotal);
            }
        };
        BaseScene.prototype.onProgress = function (loaded, total) {
        };
        BaseScene.prototype.onResourceLoadErr = function (e) {
            egret.log('load scene resource error');
        };
        BaseScene.prototype.applySkin = function (skin) {
            egret.log('set scene skin');
            this.addEventListener(eui.UIEvent.COMPLETE, this.onSkinComplete, this);
            this.skinName = skin;
        };
        BaseScene.prototype.onSkinComplete = function () {
            egret.log('load scene skin compelte');
            this.removeEventListener(eui.UIEvent.COMPLETE, this.onSkinComplete, this);
            this.onLoaded();
        };
        BaseScene.prototype.exit = function () {
            // 直接退出，没有过渡
            return Promise.resolve();
        };
        return BaseScene;
    }(cm.AutoLayoutView));
    cm.BaseScene = BaseScene;
    __reflect(BaseScene.prototype, "cm.BaseScene");
})(cm || (cm = {}));
var cm;
(function (cm) {
    var Animation = (function (_super) {
        __extends(Animation, _super);
        function Animation() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            // username
            _this._username = '';
            // 锚点(百分比)
            _this.anchorX = 0.5;
            _this.anchorY = 1;
            return _this;
        }
        Animation.prototype.init = function (name, anchorX, anchorY) {
            if (anchorX === void 0) { anchorX = 0.5; }
            if (anchorY === void 0) { anchorY = 1; }
            this.anchorX = anchorX;
            this.anchorY = anchorY;
            this._name = name;
            this.loadRes();
        };
        Object.defineProperty(Animation.prototype, "armature", {
            get: function () {
                return this._armature;
            },
            enumerable: true,
            configurable: true
        });
        Animation.prototype.loadRes = function () {
            var name = cm.Utils.urlToResName(this._name);
            var groupName = 'animation_' + name;
            RES.createGroup(groupName, [name + '_ske_json', name + '_tex_json', name + '_tex_png'], true);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._onDragonbonesComplete, this);
            RES.loadGroup(groupName);
        };
        Animation.prototype._onDragonbonesComplete = function (event) {
            if (event.groupName === 'animation_' + this._name) {
                this.createAnimation();
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._onDragonbonesComplete, this);
            }
        };
        Animation.prototype.createAnimation = function () {
            var dragonbonesData = RES.getRes(this._name + '_ske_json');
            var textureData = RES.getRes(this._name + '_tex_json');
            var texture = RES.getRes(this._name + '_tex_png');
            var factory = cm.dragonBonesManager.getFactory(name, dragonbonesData, textureData, texture);
            var armature = factory.buildArmatureDisplay('armatureName');
            this._armature = armature;
            this.addChild(this._armature);
            var w = this._armature.width, h = this._armature.height;
            this.anchorOffsetX = w * this.anchorX;
            this.anchorOffsetY = h * this.anchorY;
            this.width = w;
            this.height = h;
            this._armature.x = w / 2;
            this._armature.y = h;
            this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
        };
        Animation.prototype.play = function (animation, times) {
            if (!this._armature)
                return;
            var am = this._armature;
            var state = am.animation.getState(animation);
            if (state && state.isPlaying) {
                am.animation.stop();
            }
            am.animation.play(animation, times);
        };
        Animation.prototype.stop = function () {
            if (!this._armature) {
                return;
            }
            var am = this._armature;
            am.animation.stop();
        };
        Animation.prototype.onRemove = function () {
            _super.prototype.onRemove.call(this);
            this.stop();
        };
        return Animation;
    }(cm.EUIComponent));
    cm.Animation = Animation;
    __reflect(Animation.prototype, "cm.Animation");
})(cm || (cm = {}));
var cm;
(function (cm) {
    var Image = (function () {
        function Image() {
        }
        Image.getByUrl = function (url) {
            return new Promise(function (resolve, reject) {
                var loader = new egret.ImageLoader();
                loader.crossOrigin = 'anonymous';
                loader.addEventListener(egret.Event.COMPLETE, function () {
                    var tex = new egret.Texture();
                    tex.bitmapData = loader.data;
                    resolve(tex);
                }, null);
                loader.addEventListener(egret.IOErrorEvent.IO_ERROR, function (event) {
                    reject(event);
                }, null);
                loader.load(url);
            });
        };
        return Image;
    }());
    cm.Image = Image;
    __reflect(Image.prototype, "cm.Image");
})(cm || (cm = {}));
var cm;
(function (cm) {
    var Layer = (function () {
        function Layer() {
        }
        // 场景层 场景内容
        Layer.SCENE = 0;
        // 中间层 如 Loading, alert
        Layer.Middle = 1;
        // 顶层 如tips，用户引导层
        Layer.TOP = 2;
        return Layer;
    }());
    cm.Layer = Layer;
    __reflect(Layer.prototype, "cm.Layer");
})(cm || (cm = {}));
var cm;
(function (cm) {
    var SceneManager = (function () {
        function SceneManager() {
        }
        SceneManager.prototype.load = function (scene, byCreate) {
            var _this = this;
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            if (this._currentScene && this._currentScene.stage) {
                this._currentScene.exit().then(function () {
                    _this._currentScene.parent.removeChild(_this._currentScene);
                    _this._currentScene = new scene(args);
                    _this._currentScene.onReady(byCreate);
                    cm.main.addChildAt(_this._currentScene, cm.Layer.SCENE);
                });
            }
            else {
                this._currentScene = new scene(args);
                cm.main.addChildAt(this._currentScene, cm.Layer.SCENE);
            }
        };
        Object.defineProperty(SceneManager.prototype, "currentScene", {
            get: function () {
                return this._currentScene;
            },
            enumerable: true,
            configurable: true
        });
        return SceneManager;
    }());
    cm.SceneManager = SceneManager;
    __reflect(SceneManager.prototype, "cm.SceneManager");
    cm.sceneManager = new SceneManager();
})(cm || (cm = {}));
var cm;
(function (cm) {
    var SequenceImage = (function (_super) {
        __extends(SequenceImage, _super);
        /**
         * @param prefix 名字前缀
         * @param bit 几位数
         * @param start 开始帧
         * @param end 结束帧
         */
        function SequenceImage(prefix, bit, start, end) {
            var _this = _super.call(this) || this;
            _this._imgArr = [];
            _this._time = 0;
            _this._playing = false;
            _this._startTime = 0;
            _this._index = 0;
            _this._playTimes = 0;
            _this._repeat = 0;
            for (var i = start; i <= end; i++) {
                var res = i.toString();
                while (res.length < bit) {
                    res = '0' + res;
                }
                _this._imgArr.push(prefix + res);
            }
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
            var init = RES.getRes(_this._imgArr[0]);
            _this.width = init.textureWidth;
            _this.height = init.textureHeight;
            return _this;
        }
        /**
         * 开始播放
         * @param time 耗时多少秒播放完，默认0按帧播放
         */
        SequenceImage.prototype.play = function (time, repeat) {
            if (time === void 0) { time = 0; }
            if (repeat === void 0) { repeat = 1; }
            this._time = time;
            this._playing = true;
            this._startTime = egret.getTimer();
            this._index = 0;
            this._playTimes = 1;
            this._repeat = repeat;
            this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
        };
        SequenceImage.prototype._play = function () {
            this._playing = true;
            this._startTime = egret.getTimer();
            this._index = 0;
        };
        SequenceImage.prototype.onAddToStage = function (e) {
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
        };
        SequenceImage.prototype.onRemove = function () {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.update, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
        };
        SequenceImage.prototype.complete = function () {
            if (this._repeat === 0) {
                this._play();
            }
            else if (this._repeat > 0) {
                if (this._playTimes >= this._repeat) {
                    this.removeEventListener(egret.Event.ENTER_FRAME, this.update, this);
                    this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
                }
                else {
                    this._playTimes++;
                    this._play();
                }
            }
        };
        SequenceImage.prototype.update = function () {
            if (this._playing) {
                var tex = void 0;
                if (this._time > 0) {
                    var now = egret.getTimer();
                    var passed = now - this._startTime;
                    if (passed > this._time) {
                        this.complete();
                        return;
                    }
                    var p = passed / this._time;
                    p = p > 1 ? 1 : p;
                    this._index = Math.round(p * (this._imgArr.length - 1));
                    tex = RES.getRes(this._imgArr[this._index]);
                    this.source = tex;
                }
                else {
                    if (this._index > this._imgArr.length - 1) {
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
        };
        return SequenceImage;
    }(eui.Image));
    cm.SequenceImage = SequenceImage;
    __reflect(SequenceImage.prototype, "cm.SequenceImage");
})(cm || (cm = {}));
