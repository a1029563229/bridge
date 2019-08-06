module cm{
    export class Cookies{
        private _cookies: string = '';
        constructor(){
            this._cookies = egret.localStorage.getItem('cookies');
        }

        get cookie(): string{
            return this._cookies;
        }

        set cookie(cookies: string){
            this._cookies = cookies;
        }
    }
    export const cookies = new Cookies();
}