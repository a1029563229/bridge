module cm {
    export class BaseScene extends cm.AutoLayoutView{
        protected _skinName: string = '';
        protected _args:any[] = null;
        constructor(args){
            super();
            this._args = args;
        }

        childrenCreated(){
            super.childrenCreated();
            egret.log('scene children created');
        }

        /**
         * 加载场景资源
         * @param group 场景默认资源组
         * @param resArr 需要动态加载的资源
         * @param images 需要预加载的远程服务器上的图片
         */
        loadRes(group: string, resArr: Array<string> = [], images: Array<string> = []){
            this.loadDynamicImage(images).then(() => {
                this.loadResInConfig(group, resArr);
            });
        }

        /**
         * 加载在.res.json中配置好的资源
         */
        loadResInConfig(group: string, resArr: Array<string>){
            let groupResArr = RES.getGroupByName(group).map((item: RES.ResourceItem) => {
                return item.name;
            });
            let newGroupName = 'dynamic_group';
            let arr = groupResArr.concat(resArr);
            RES.createGroup(newGroupName, arr, true);
            RES.addEventListener( RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this );
            RES.addEventListener( RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this );
            RES.addEventListener( RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadErr, this );
            RES.loadGroup(newGroupName);
        }

        /**
         * 加载远程服务器图片
         * @param urls 图片地址数组
         */
        loadDynamicImage(urls: Array<string>){
            return Promise.all(urls.map(url => {
                return new Promise((resolve, reject) => {
                    RES.getResByUrl(url, resolve, null, RES.ResourceItem.TYPE_IMAGE);
                });
            }));
        }

        onLoaded(){
            
        }

        onRemove(){
            super.onRemove();
            this.removeEventListener(eui.UIEvent.COMPLETE, this.onSkinComplete, this);
            RES.removeEventListener( RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this );
            RES.removeEventListener( RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this );
            RES.removeEventListener( RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadErr, this );
        }

        onResourceLoadComplete(e: RES.ResourceEvent){
            if(e.groupName === 'dynamic_group'){
                egret.log('load scene resource compelte');
                if(this._skinName){
                    this.applySkin(this._skinName);
                }
                else{
                    this.onLoaded();
                }
            }
        }

        onResourceProgress(e: RES.ResourceEvent){
            if(e.groupName === 'dynamic_group'){
                this.onProgress(e.itemsLoaded, e.itemsTotal);
            }
        }

        onProgress(loaded: number, total: number){
            
        }

        onResourceLoadErr(e: RES.ResourceEvent){
            egret.log('load scene resource error');
        }

        applySkin(skin){
            egret.log('set scene skin');
            this.addEventListener(eui.UIEvent.COMPLETE, this.onSkinComplete, this);
            this.skinName = skin;
        }

        onSkinComplete(){
            egret.log('load scene skin compelte');
            this.removeEventListener(eui.UIEvent.COMPLETE, this.onSkinComplete, this);
            this.onLoaded();
        }

        exit(): Promise<any>{
            // 直接退出，没有过渡
            return Promise.resolve();
        }
    }
}