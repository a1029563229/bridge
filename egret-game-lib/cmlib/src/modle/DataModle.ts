namespace cm{

    export interface Listener{
        handler: Function,
        target: any
    }

    export class Dispatcher{
        private _listeners = {};

        on(type: string, handler: Function, target: any){
            let list = this._listeners[type];
            if(!list){
                this._listeners[type] = [{ handler, target }];
            }
            else{
                this.addListener(list, {handler, target} );
            }
        }

        addListener(list: Array<Listener>, listener: Listener): void{
            for(let i = 0; i < list.length; i++){
                let item = list[i];
                if(item.handler === listener.handler && item.target === listener.target){
                    return;
                }
            }
            list.push(listener);
        }

        off(type: string, handler: Function, target: any){
            let list = this._listeners[type];
            if(!list || list.length <= 0)
                return;
            let l = list.length - 1;
            for(let i = l; i >= 0; i--){
                let item = list[i];
                if(item.handler === handler && item.target === target){
                    list.splice(i, 1);
                }
            }
        }

        dispatch(type: string){
            let list = this._listeners[type];
            if(!list || list.length <= 0){
                return;
            }
            for(let i = 0; i < list.length; i++){
                let item = list[i];
                item.handler.call(item.target);
            }
        }
    }
}