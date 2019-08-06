namespace cm{
    /**
     * 用于缓存到缓存池的接口
     */
    export interface ICacheObject{
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
    export class CachePool{
        private _objs:{[index:string]:ICacheObject[]} = {};
        /**
         * 缓存一个对象
         */
        put(name:string, obj:ICacheObject): void{
            if(!this._objs[name]){
                this._objs[name] = [];
            }
            obj.cache();
            if(this._objs[name].length > 100){
                console.warn(`"${name}" object cached over 50`);
            }
            this._objs[name].push(obj);
        }

        /**
         * 取出一个对象
         */
        get(classType:any): any{
            let name = classType.prototype.__class__;
            let arr = this._objs[name];
            if(arr && arr.length > 0){
                let obj = arr.pop();
                obj.reuse();
                return obj;
            }
            if(classType){
                return new classType();
            }
            return null;
        }
    }
    export const cachePool = new CachePool();
}