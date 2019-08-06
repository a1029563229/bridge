module cm {
    export class Image{

        static getByUrl(url: string): Promise<any>{
            return new Promise((resolve, reject) => {
                let loader = new egret.ImageLoader();
                loader.crossOrigin='anonymous';
                loader.addEventListener(egret.Event.COMPLETE, function(){
                    let tex = new egret.Texture();
                    tex.bitmapData = loader.data;
                    resolve(tex);
                }, null);
                loader.addEventListener(egret.IOErrorEvent.IO_ERROR, function(event: egret.IOErrorEvent){
                    reject(event);
                }, null);
                loader.load(url);
            });
        }
    }
}