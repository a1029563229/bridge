declare module cm {
    class Component extends egret.DisplayObjectContainer {
        constructor();
        onAdd(): void;
        onRemove(): void;
    }
    class EUIComponent extends eui.Component {
        private _complete;
        private _readyFunc;
        constructor();
        readonly complete: boolean;
        onReady(func: Function): void;
        onComplete(): void;
        onAdd(): void;
        onRemove(): void;
    }
}
declare module cm {
    /**
     * 自适应布局基类
     */
    class AutoLayoutView extends cm.EUIComponent {
        constructor();
        protected childrenCreated(): void;
        layout(): void;
    }
}
declare module cm {
    /**
     * 带有冷却时间的按钮
     */
    class CooldownButton {
        private _time;
        private _text;
        private _target;
        private _timer;
        constructor(target: eui.Button, buttonText: string);
        onRemove(): void;
        cooldown(time: any): void;
        startTimer(): void;
        stopTimer(): void;
        tick(): void;
        normal(): void;
        updateText(): void;
    }
}
declare module cm {
    class DragonBonesManager {
        private _factory;
        getFactory(name: string, dragonbonesData: any, textureData: any, texture: any): dragonBones.EgretFactory;
    }
    const dragonBonesManager: DragonBonesManager;
}
declare namespace cm {
    interface Listener {
        handler: Function;
        target: any;
    }
    class Dispatcher {
        private _listeners;
        on(type: string, handler: Function, target: any): void;
        addListener(list: Array<Listener>, listener: Listener): void;
        off(type: string, handler: Function, target: any): void;
        dispatch(type: string): void;
    }
}
declare module cm {
    interface RequestOptions {
        responseIntercept?: Function;
    }
    class Request {
        private _url;
        private _method;
        private _data;
        private _timeout;
        private _times;
        private _reject;
        private _resolve;
        private _xhr;
        private _header;
        private _options;
        constructor(url: string, method: string, data: any, times: number, timeout: number, options: RequestOptions);
        /**
         * 设置http头
         */
        setHeader(key: string, value: string): void;
        /**
        * 为所有http request设置头
        */
        static setHeaderForAll(key: string, value: string): void;
        static removeHeaderForAll(key: string): void;
        /**
         * 单次请求
         */
        request(retry?: boolean): Promise<any>;
        private _onReject(data);
        private _onResolve(data);
    }
    /**
     * service 是一个可访问对象
     * 现有 get、post、put 方法可访问
     * 参数顺序为 url, params, times, timeout
     */
    const service: any;
}
declare module cm {
    class SoundManager {
        private _music_on;
        private _sound_on;
        private _volume;
        private _music;
        private _volume_saved;
        playMusic(url: any): void;
        playSound(url: any): void;
        sound_on: boolean;
        music_on: boolean;
        volume: number;
        /**
         * 静音
         */
        mute(): void;
        /**
         * 取消静音
         */
        unmute(): void;
        stopMusic(): void;
    }
    const soundManager: SoundManager;
}
declare module cm {
    class Cookies {
        private _cookies;
        constructor();
        cookie: string;
    }
    const cookies: Cookies;
}
declare module cm {
    class Token {
        private _token;
        constructor(tokens: any);
        token: string;
    }
    const tokens: Token;
}
declare namespace cm {
    /**
     * 计时器，受主循环暂停影响
     */
    class Clock {
        private _lastTick;
        private _time;
        /**
         * 开始计时
         */
        start(): void;
        private _tick(time);
        /**
         * 经过的时间
         */
        readonly time: number;
        /**
         * 停止计时
         */
        stop(): void;
    }
}
declare module cm {
    class ScheduleManager {
        private _schedulers;
        private _timeStamp;
        private _ticking;
        constructor();
        private _tick(timeStamp);
        startTick(): void;
        stopTick(): void;
        /**
         * 定时器
         * @param target 目标
         * @param callback 回调函数
         * @param interval 间隔(ms)
         * @param repeat 重复次数 0为次数无限
         * @param canPause 是否可以暂停，true: 主循环暂停之后，不再计算时间
         */
        schedule(target: any, callback: Function, interval: number, repeat?: number, canPause?: boolean): void;
        /**
         * 取消定时器
         * @param target 目标
         * @param callback 回调函数
         */
        unschedule(target: any, callback: Function): void;
        private _getIndexOfScheduler(target, callback);
    }
    const scheduler: ScheduleManager;
}
declare module cm {
    /**
     * 计时器，以时间戳计算，不受主循环暂停的影响
     */
    class Ticker {
        private _timer;
        private _callback;
        private _startTime;
        private _timePassed;
        start(callback: any): void;
        stop(): void;
        /**
         * 时间过了多少秒
         */
        readonly timePassed: number;
        private _onTick();
    }
}
declare namespace cm {
    interface IAlertOptions {
        bg?: boolean;
        clickBgClose?: boolean;
        closeOnViewTapped?: boolean;
        addToMain?: boolean;
        alpha?: number;
        /**
         * 音效
         */
        sound?: string;
    }
    class Alert extends cm.AutoLayoutView {
        private _bg;
        private _content;
        private _hasBg;
        private _clickBgClose;
        private _showComplete;
        private _closeOnViewTapped;
        private _opt;
        /**
         * 默认音效
         */
        static DEFAULT_SOUND: string;
        /**
         * @param view
         * @param options
         */
        static show(view: eui.Component | egret.DisplayObject, options?: IAlertOptions): Alert;
        constructor(content: eui.Component | egret.DisplayObject, option: IAlertOptions);
        onResize(): void;
        createBg(): void;
        onBgTap(): void;
        hide(): void;
        show(): void;
        onShowComplete(): void;
        readonly showComplete: boolean;
        onAdd(): void;
        onRemove(): void;
        onViewTap(e: egret.TouchEvent): void;
    }
}
declare namespace cm {
    interface IConfirmData {
        content: string;
        /**
         * 按钮音效
         */
        sound?: string;
        ok?: {
            text: string;
            callback?: Function;
        };
        cancel?: {
            text: string;
            callback?: Function;
        };
    }
    class ConfirmDialog extends cm.EUIComponent implements eui.Component {
        private _data;
        cancelBtn: eui.Button;
        okBtn: eui.Button;
        content: eui.Label;
        bg: eui.Image;
        /**
         * 默认音效
         */
        static DEFAULT_SOUND: string;
        static show(data: IConfirmData, opt?: IAlertOptions): Alert;
        constructor(data: IConfirmData);
        onComplete(): void;
        onOK(): void;
        onCancel(): void;
        playButtonSound(): void;
        hide(): void;
    }
}
declare namespace cm {
    class Algorithm {
        /**
         * bresenham-algorithm
         * 计算出一条直线所经过的像素点
         */
        static getLinePoints(x0: any, y0: any, x1: any, y1: any): {
            x: number;
            y: number;
        }[];
    }
}
declare namespace cm {
    /**
     * 拖动控制器，限制目标在相对父容器的某个矩形范围内
     */
    class Dragable {
        private _target;
        private _parent;
        private _rect;
        private _prevX;
        private _prevY;
        private _isDraging;
        /**
         * 启用拖动
         */
        enableDrag(target: egret.DisplayObject, rect: egret.Rectangle): void;
        /**
         * 禁用拖动
         */
        disableDrag(): void;
        /**
         * 更新可拖动区域
         */
        updateRect(rect: any): void;
        /**
         * 停止拖动
         */
        stop(): void;
        readonly isDraging: boolean;
        private _onTouchBegin(e);
        private _onTouchMove(e);
        private _onTouchEnd();
    }
}
declare class ForumPage extends cm.AutoLayoutView implements eui.UIComponent {
    QQGroup: eui.Image;
    firstLabel: eui.Label;
    secondLabel: eui.Label;
    constructor();
    onComplete(): void;
}
declare namespace cm {
    class ScrollBar extends cm.EUIComponent implements eui.UIComponent {
        up: eui.Button;
        down: eui.Button;
        bar: eui.Button;
        barArea: eui.Group;
        private _scroller;
        private _step;
        private _miniHeight;
        private _prevX;
        private _prevY;
        private _container;
        constructor(scroller: eui.Scroller, container: eui.UIComponent, up: eui.Button, down: eui.Button, bar: eui.Button, barArea: eui.Group, options?: {
            step: number;
            minHeight: number;
        });
        enable(): void;
        disable(): void;
        onScroll(e: egret.Event): void;
        onResize(e: eui.UIEvent): void;
        resizeBar(): void;
        onUpTap(): void;
        ondownTap(): void;
        onBarBegin(e: egret.TouchEvent): void;
        onBarEnd(): void;
        onBarMove(e: egret.TouchEvent): void;
        move(deltaY: any): void;
        updateScroll(): void;
        updateScrollBar(): void;
        onBarCancel(): void;
        onBarReleaseOutside(): void;
        protected childrenCreated(): void;
    }
}
declare module cm {
    interface TextInputOption {
        placeHolder?: string;
        placeHolderColor?: number;
        errorColor?: number;
        textColor?: number;
        maxChar?: number;
    }
    class TextInput {
        private _option;
        private _target;
        private _clearWhenFocusIn;
        constructor(target: eui.EditableText, options?: TextInputOption);
        onchange(e: egret.TextEvent): void;
        focusIn(): void;
        setHolderplace(): void;
        readonly clearWhenFocusIn: boolean;
        focusOut(): void;
        onRemove(): void;
        error(text: string): void;
    }
}
declare namespace cm {
    class Tip extends eui.Component {
        private _txt;
        private _bg;
        static instance: Tip;
        constructor();
        static show(text: string, x: number, y: number, anchorX: number, anchorY: number): void;
        static hide(): void;
        text: string;
    }
    class TipManager {
        private _tip;
        private _map;
        constructor();
        mouseEnabled(): boolean;
        updateTip(target: egret.DisplayObject, tip: string): void;
        enable(target: egret.DisplayObject, tip: string): void;
        disable(target: egret.DisplayObject): void;
        onMouseOver(e: egret.TouchEvent): void;
        onMouseMove(e: egret.TouchEvent): void;
        onMouseOut(e: egret.TouchEvent): void;
        updatePos(e: egret.TouchEvent): void;
    }
    const tips: TipManager;
}
declare namespace cm {
    /**
     * 用于缓存到缓存池的接口
     */
    interface ICacheObject {
        /**
         * 即将存入缓存迟之前会被调用
         */
        cache(): void;
        /**
         * 取出来使用的时候会被调用
         */
        reuse(): void;
    }
    /**
     * 缓存池
     */
    class CachePool {
        private _objs;
        /**
         * 缓存一个对象
         */
        put(name: string, obj: ICacheObject): void;
        /**
         * 取出一个对象
         */
        get(classType: any): any;
    }
    const cachePool: CachePool;
}
declare module cm {
    class Utils {
        static getDragonBonesRes(resArr: Array<string>): Array<string>;
        /**
         * 从一个数组中随机选一个
         */
        static roll<T>(arr: T[]): T;
        static getQueryParam(param: string): string | false;
        static serializeParam(params: Object): string;
        /**
         * 将时间处理成 xx天 xx:xx:xx 的格式
         * @param seconds 秒数
         */
        static formatTime(seconds: number): string;
        /**
         * 将时间处理成 xx:xx 的格式
         * @param seconds 秒数
         */
        static formatTime2(seconds: number): string;
        static sortOrder(container: egret.DisplayObjectContainer, children: Array<egret.DisplayObject>): void;
        /**
         * 将锚点设置为以对象的宽高为倍数
         */
        static setAnchor(target: egret.DisplayObject, x: number, y: number): void;
        /**
         * 延迟调用函数
         */
        static delay(delay: any, callback: any): void;
        /**
         * 计算出一个合适的缩放比，使w,h能刚好放入limitW,limitH
         * @param maxScale 如果大小小于限制大小，是否缩放至限制大小
         */
        static fitScale(limitW: any, limitH: any, w: any, h: any, maxScale?: boolean): number;
        /**
         * 文字超长省略号
         */
        static stringEllipsis(str: string, max: number): string;
        /**
         * 是否是pc端
         */
        static IsPC(): boolean;
        /**
         * convert res url to res name in egret
         */
        static urlToResName(url: string): string;
        /**
         * 数学角度转换为白鹭坐标系的角度
         * 白鹭的角度是从右开始顺时针
         * math.atan2的角度是从下开始逆时针 0 ~ 180 顺时针 0 ~ -180
         * 判断范围时，将atan2的角度转换至白鹭角度范围
         */
        static mathAngleToRotation(dx: number, dy: number): number;
        /**
         * 添加历史记录
         */
        static addHistoryState(url?: string): void;
        static loadScript: (list: any, callback: any) => void;
        static loadSingleScript: (src: any, callback: any) => void;
    }
}
declare namespace cnUtils {
    function touchTap(target: egret.DisplayObject, handler: Function, thiz?: any): void;
    function onItemTap(target: eui.ListBase, handler: Function, thiz?: any): void;
    function onceTouchTap(target: egret.DisplayObject, handler: Function, thiz?: any): void;
    /**该函数用于修改引擎用 */
    function hackEngine(): void;
    function getLocalStorage(key: string, defualtItem?: any): any;
    function setLocalStorage(key: string, item: any): void;
    function anyaQueryParam(): void;
    function getQuery(key: any): any;
    function IS_Mobile(): any;
    function IS_SDK(): any;
    function getRESUrlByKey(key: string): string;
    function safeGetElement(list: any[], index: any): any;
    function toFixNum(num: number, len: number, char: string): string;
}
declare module cm {
    var main: egret.DisplayObjectContainer;
    function init(m: egret.DisplayObjectContainer): void;
}
declare module cm {
    class BaseScene extends cm.AutoLayoutView {
        protected _skinName: string;
        protected _args: any[];
        constructor(args: any);
        childrenCreated(): void;
        /**
         * 加载场景资源
         * @param group 场景默认资源组
         * @param resArr 需要动态加载的资源
         * @param images 需要预加载的远程服务器上的图片
         */
        loadRes(group: string, resArr?: Array<string>, images?: Array<string>): void;
        /**
         * 加载在.res.json中配置好的资源
         */
        loadResInConfig(group: string, resArr: Array<string>): void;
        /**
         * 加载远程服务器图片
         * @param urls 图片地址数组
         */
        loadDynamicImage(urls: Array<string>): Promise<{}[]>;
        onLoaded(): void;
        onRemove(): void;
        onResourceLoadComplete(e: RES.ResourceEvent): void;
        onResourceProgress(e: RES.ResourceEvent): void;
        onProgress(loaded: number, total: number): void;
        onResourceLoadErr(e: RES.ResourceEvent): void;
        applySkin(skin: any): void;
        onSkinComplete(): void;
        exit(): Promise<any>;
    }
}
declare namespace cm {
    class Animation extends cm.EUIComponent {
        protected _armature: egret.DisplayObject;
        private _username;
        anchorX: number;
        anchorY: number;
        private _name;
        init(name: string, anchorX?: number, anchorY?: number): void;
        readonly armature: egret.DisplayObject;
        loadRes(): void;
        private _onDragonbonesComplete(event);
        createAnimation(): void;
        play(animation: string, times?: number): void;
        stop(): void;
        onRemove(): void;
    }
}
declare module cm {
    class Image {
        static getByUrl(url: string): Promise<any>;
    }
}
declare module cm {
    class Layer {
        static SCENE: number;
        static Middle: number;
        static TOP: number;
    }
}
declare module cm {
    class SceneManager {
        private _currentScene;
        load(scene: any, byCreate?: Function, ...args: any[]): void;
        readonly currentScene: BaseScene;
    }
    const sceneManager: SceneManager;
}
declare module cm {
    class SequenceImage extends eui.Image {
        private _imgArr;
        private _time;
        private _playing;
        private _startTime;
        private _index;
        private _playTimes;
        private _repeat;
        /**
         * @param prefix 名字前缀
         * @param bit 几位数
         * @param start 开始帧
         * @param end 结束帧
         */
        constructor(prefix: string, bit: number, start: number, end: number);
        /**
         * 开始播放
         * @param time 耗时多少秒播放完，默认0按帧播放
         */
        play(time?: number, repeat?: number): void;
        private _play();
        private onAddToStage(e);
        onRemove(): void;
        complete(): void;
        update(): void;
    }
}
