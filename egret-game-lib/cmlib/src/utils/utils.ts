module cm {
    export class Utils {
        static getDragonBonesRes(resArr: Array<string>): Array<string> {
            let arr = [];
            resArr.forEach(res => {
                arr.push.apply(arr, [res + '_ske_json', res + '_tex_json', res + '_tex_png']);
            });
            return arr;
        }

        /**
         * 从一个数组中随机选一个
         */
        static roll<T>(arr:T[]): T {
            let l = arr.length;
            return arr[Math.floor(Math.random() * l)];
        }

        static getQueryParam(param: string) {
            var result = window.location.search.match(
                new RegExp("(\\?|&)" + param + "(\\[\\])?=([^&]*)")
            );

            return result ? result[3] : false;
        }

        static serializeParam(params: Object): string {
            let result = '';
            for (var k in params) {
                let val = params[k];
                if (val !== undefined && val !== null) {
                    result += (result === '' ? '?' : '&') + k + '=' + val;
                }
            }
            return result;
        }

        /**
         * 将时间处理成 xx天 xx:xx:xx 的格式
         * @param seconds 秒数
         */
        static formatTime(seconds: number): string {
            let result = '';
            let daySeconds = 60 * 60 * 24;
            let day = seconds > daySeconds ? Math.floor(seconds / daySeconds) : 0;
            seconds %= daySeconds;
            let hourSeconds = 60 * 60;
            let hours = seconds > hourSeconds ? Math.floor(seconds / hourSeconds) : 0;
            seconds %= hourSeconds;
            let minutes = seconds > 60 ? Math.floor(seconds / 60) : 0;
            seconds %= 60;
            if (day > 0)
                result += day + '天' + ' ';
            result += hours < 10 ? '0' + hours : hours;
            result += ':';
            result += minutes < 10 ? '0' + minutes : minutes;
            result += ':';
            result += seconds < 10 ? '0' + seconds : seconds;
            return result;
        }

        /**
         * 将时间处理成 xx:xx 的格式
         * @param seconds 秒数
         */
        static formatTime2(seconds: number): string {
            let result = '';
            let minutes = seconds > 60 ? Math.floor(seconds / 60) : 0;
            seconds %= 60;
            result = minutes < 10 ? '0' + minutes : minutes + '';
            result += ':';
            result += seconds < 10 ? '0' + seconds : seconds;
            return result;
        }

        static sortOrder(container: egret.DisplayObjectContainer, children: Array<egret.DisplayObject>) {
            children.sort((a, b) => {
                if (a.y > b.y)
                    return 1;
                if (a.y < b.y)
                    return -1;
                return 0;
            })
            let deeps = children.map(item => container.getChildIndex(item));
            deeps.sort();
            children.forEach((item, index) => {
                container.setChildIndex(item, deeps[index]);
            });
        }

        /**
         * 将锚点设置为以对象的宽高为倍数
         */
        static setAnchor(target: egret.DisplayObject, x: number, y: number): void {
            target.anchorOffsetX = target.width * x;
            target.anchorOffsetY = target.height * y;
        }

        /**
         * 延迟调用函数
         */
        static delay(delay, callback) {
            let t = new egret.Timer(delay, 1);
            let cb = function () {
                t.removeEventListener(egret.TimerEvent.TIMER, cb, this);
                callback();
            }
            t.addEventListener(egret.TimerEvent.TIMER, cb, this);
            t.start();
        }

        /**
         * 计算出一个合适的缩放比，使w,h能刚好放入limitW,limitH
         * @param maxScale 如果大小小于限制大小，是否缩放至限制大小
         */
        static fitScale(limitW, limitH, w, h, maxScale: boolean = false): number {
            if (w <= limitW && h <= limitH && !maxScale) {
                return 1;
            }
            else {
                let scale_w = limitW / w;
                let scale_h = limitH / h;
                return scale_w < scale_h ? scale_w : scale_h;
            }
        }

        /**
         * 文字超长省略号
         */
        static stringEllipsis(str: string, max: number): string {
            if (str.length > max) {
                str = str.substr(0, max);
                str += '.';
                return str;
            }
            else {
                return str;
            }
        }

        /**
         * 是否是pc端
         */
        static IsPC(): boolean {
            let userAgentInfo = navigator.userAgent;
            let Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
            let flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
            }
            return flag;
        }

        /**
         * convert res url to res name in egret
         */
        static urlToResName(url: string): string {
            let index = url.lastIndexOf('/');
            if (index !== -1) {
                url = url.substring(index + 1);
            }
            return url.replace('.', '_');
        }

        /**
         * 数学角度转换为白鹭坐标系的角度
         * 白鹭的角度是从右开始顺时针
         * math.atan2的角度是从下开始逆时针 0 ~ 180 顺时针 0 ~ -180
         * 判断范围时，将atan2的角度转换至白鹭角度范围
         */
        static mathAngleToRotation(dx: number, dy: number): number {
            let angle = Math.atan2(dx, dy) * 180 / Math.PI;
            if (angle <= 180 && angle > 90) {
                return 450 - angle;
            }
            else if (angle > -180 && angle <= 90) {
                return 90 - angle;
            }
            else {
                throw new Error('error angle range!');
            }
        }

        /**
         * 添加历史记录
         */
        static addHistoryState(url = location.origin + '/tower'): void {
            egret.log("addUrl");
            let origin = location.href;
            history.pushState({}, "", location.origin + '/tower');
            history.pushState({}, "", origin);

            window.addEventListener("popstate", e => {
                if (history.state) {
                    egret.log("test");
                    location.href = url;
                }
            })
        }

        static loadScript = function (list, callback) {
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
                })
            };
            loadNext();
        };

        static loadSingleScript = function (src, callback) {
            var s = document.createElement('script');
            s.async = false;
            s.src = src;
            s.addEventListener('load', function () {
                s.parentNode.removeChild(s);
                s.removeEventListener('load', arguments.callee as EventListenerOrEventListenerObject, false);
                callback();
            }, false);
            document.body.appendChild(s);
        };
    }
}

namespace cnUtils {
    export function touchTap(target: egret.DisplayObject, handler: Function, thiz?: any) {
        if (target) {
            target.addEventListener(egret.TouchEvent.TOUCH_TAP, handler, thiz);
        }
        else {
            egret.error("target is null!");
        }
    }
    export function onItemTap(target: eui.ListBase, handler: Function, thiz?: any) {
        if (target) {
            target.addEventListener(eui.ItemTapEvent.ITEM_TAP, handler, thiz);
        }
        else {
            egret.error("target is null!");
        }
    }
    export function onceTouchTap(target: egret.DisplayObject, handler: Function, thiz?: any) {
        if (target) {
            target.once(egret.TouchEvent.TOUCH_TAP, handler, thiz);
        }
        else {
            egret.error("target is null!");
        }
    }
    /**该函数用于修改引擎用 */
    export function hackEngine() {
        // eui.Button.prototype['buttonReleased'] = function () {
        //     codearena.Sound.button();
        // }
        eui.Label.default_fontFamily = "SimHei";
        egret.TextField.default_fontFamily = "SimHei";
        let tiled:any = window['tiled'];
        if(tiled){
            tiled.getRes = function(url,compFunc,thisObject,type){
                let index = url.lastIndexOf('/');
                let key = url.slice(index+1);
                key = key.replace('.','_');
                url = cnUtils.getRESUrlByKey(key);
                RES.getResByUrl(url,compFunc,thisObject,type);
                egret.log(url);
            };
        }
    }
    export function getLocalStorage(key: string, defualtItem?: any) {
        let ret = egret.localStorage.getItem(key) || defualtItem;
        if(ret) ret = JSON.parse(ret);
        return ret;
    }
    export function setLocalStorage(key: string, item: any) {
        let str = JSON.stringify(item);
        egret.localStorage.setItem(key, str);

    }
    var queryParam: { [key: string]: any };
    export function anyaQueryParam() {
        queryParam = {};
        let link = window.location.search.substr(1);
        let paramStrs = link.split('&');
        for (let i = 0, len = paramStrs.length; i < len; i++) {
            let paramStr = paramStrs[i];
            let params = paramStr.split('=');
            let key = params[0];
            let value = params[1];
            queryParam[key] = value;
        }
    }
    export function getQuery(key){
        if(queryParam == null){
            anyaQueryParam();
        }
        return queryParam[key];
    }
    export function IS_Mobile() {
        return (egret.Capabilities.isMobile || getQuery('isMobile')) ;
    }

    export function IS_SDK() {
        return (egret.Capabilities.isMobile && window["cordova"]) ;
    }

    export function getRESUrlByKey(key:string):string{
        let keyMap = RES["configInstance"].keyMap;
        if (keyMap[key]) {
            return keyMap[key].url;
        }
        return key
    }
    export function safeGetElement(list:any[],index){
        if(list.length <= index){
            return list[list.length - 1];
        }
        return list[index];
    }
    export function toFixNum(num:number,len:number,char:string){
        let ret = num +"";
        while(ret.length < len){
            ret = char + ret;
        }
        return ret;
    }
}