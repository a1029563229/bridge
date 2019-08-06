module cm {
    export class Token{
        private _token:string = '';
        constructor(tokens) {
            this._token = egret.localStorage.getItem('_token');
        }
        get token():string{
            return this._token;
        }
        set token(tokens:string){
            this._token = tokens;
            egret.localStorage.setItem('_token',tokens);
        }
    }
    export const tokens = new Token('');
}    
