module cm {
    const DEFAULT_TIMEOUT = 10000;
    var HTTP_HEADER = {};

    export interface RequestOptions {
        responseIntercept?: Function;
    }

    export class Request {
        private _url: string;
        private _method: string;
        private _data: any;
        private _timeout: number;
        private _times: number = 1;
        private _reject: Function;
        private _resolve: Function;
        private _xhr: XMLHttpRequest = null;
        private _header: Object;
        private _options: RequestOptions;
        constructor(url: string, method: string, data: any, times: number = 1, timeout: number = DEFAULT_TIMEOUT, options: RequestOptions) {
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
        setHeader(key: string, value: string): void {
            this._header = this._header || {};
            this._header[key] = value;
        }

        /**
        * 为所有http request设置头
        */
        static setHeaderForAll(key: string, value: string): void {
            HTTP_HEADER = HTTP_HEADER || {};
            HTTP_HEADER[key] = value;
        }

        static removeHeaderForAll(key: string): void {
            if (!HTTP_HEADER)
                return;
            delete HTTP_HEADER[key];
        }

        /**
         * 单次请求
         */
        request(retry: boolean = false): Promise<any> {
            this._times--;
            var xhr = new XMLHttpRequest();
            this._xhr = xhr;
            xhr.withCredentials = true;
            xhr.timeout = this._timeout;
            if (this._method === 'GET') {
                this._url = this._url + Utils.serializeParam(this._data);
            }
            xhr.open(this._method, this._url);
            if (HTTP_HEADER || this._header) {
                let header = Object.assign({}, HTTP_HEADER, this._header);
                for (var k in header) {
                    xhr.setRequestHeader(k, header[k]);
                }
            }
            if (egret.Capabilities.isMobile) {
                if (cm.tokens.token) {
                    xhr.setRequestHeader('Authorization', `${cm.tokens.token}`)
                }
            }


            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            if (egret.Capabilities.runtimeType === egret.RuntimeType.NATIVE) {
                xhr.setRequestHeader('Cookie', cm.cookies.cookie);
            }
            xhr.ontimeout = () => {
                this._onReject(-1);
            }
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (this._options.responseIntercept) {
                        var jsonRE = /^\[(.*)\]$|^\{(.*)\}$/;
                        if (jsonRE.test(xhr.response)) {
                            this._options.responseIntercept(JSON.parse(xhr.response));
                        } else {
                            this._options.responseIntercept(xhr.response);
                        }
                    }

                    if (xhr.status === 200) {
                        try {
                            let data = JSON.parse(xhr.response);
                            this._onResolve(data);
                        }
                        catch (e) {
                            console.error('invalid json format');
                            this._onReject(-1);
                        }
                    }
                    else {
                        let data = null;
                        if (xhr.response) {
                            try {
                                data = JSON.parse(xhr.response);
                            }
                            catch (e) {
                                console.error('invalid json format');
                                this._onReject(-1);
                                return;
                            }
                        }
                        let err = { status: xhr.status, res: data };
                        /**
                         * TODO 这里关于status的处理有点蛋疼，客户端把200以外的返回都当做是请求失败，
                         * 由于服务器把游戏业务逻辑状态跟http status混用导致判断http是否请求成功要
                         * 判断多个状态，服务器返回204实际上代表业务逻辑处理是成功的，但是没有内容返回,
                         * 服务器应在正确处理请求后全部返回200，具体的游戏业务逻辑状态定义一套状态码
                         */
                        if (xhr.status === 204) {
                            this._times = 0;
                            this._onReject(err);
                        }
                        else {
                            this._onReject(err);
                        }
                    }
                }
            }
            return new Promise((resolve, reject) => {
                if (!retry) {
                    this._resolve = resolve;
                    this._reject = reject;
                }
                if (typeof (this._data) === 'string')
                    xhr.send(this._data);
                else
                    xhr.send(JSON.stringify(this._data));
            });
        }

        private _onReject(data: any): void {
            this._xhr.onreadystatechange = null;
            this._xhr.ontimeout = null;
            this._xhr = null;
            if (this._times > 0) {
                this.request(true);
                return;
            }
            this._reject(data);
        }

        private _onResolve(data: any): void {
            this._reject = null;
            this._xhr.onreadystatechange = null;
            this._xhr.ontimeout = null;
            this._xhr = null;
            this._resolve(data);
        }
    }

    const reserveMethods = ['GET', 'POST', 'PUT'];
    const allowConfig = ['responseIntercept'];

    let serviceProxy = {
        get(target, name) {
            let method = name.toUpperCase();
            if (!!~reserveMethods.indexOf(method)) {
                return function normal_request(url: string, params?: Object, times: number = 1, timeout: number = DEFAULT_TIMEOUT) {
                    return new Promise((resolve, reject) => {
                        let req = new Request(url, method, params, times, timeout, target['options']);
                        req.request().then(res => {
                            resolve(res);
                        }).catch(error => {
                            reject(error);
                        })
                    });
                };
            } else {
                throw new Error(`There is no method named [${name}] in cm.service`);
            }
        },

        set: function (target, property, value, receiver) {
            if (allowConfig.indexOf(property) === -1) {
                throw new Error(`Can't set property named [${property}]!`);
            }

            if (property === "options") {
                target['options'] = value;
            } else {
                target['options'][property] = value;
            }
            return true;
        }
    }

    /**
     * service 是一个可访问对象
     * 现有 get、post、put 方法可访问
     * 参数顺序为 url, params, times, timeout
     */
    export const service = new Proxy({ options: {} }, serviceProxy);
}