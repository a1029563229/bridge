module cm{
    export class SceneManager{
        private _currentScene: BaseScene;
        load(scene: any,byCreate?:Function, ...args){
            if(this._currentScene && this._currentScene.stage){
                this._currentScene.exit().then(() => {
                    this._currentScene.parent.removeChild(this._currentScene);
                    this._currentScene = new scene(args);
                    this._currentScene.onReady(byCreate);
                    cm.main.addChildAt(this._currentScene, Layer.SCENE);
                });
            }
            else{
                this._currentScene = new scene(args);
                cm.main.addChildAt(this._currentScene, Layer.SCENE);
            }
        }

        get currentScene(): BaseScene{
            return this._currentScene;
        }
    }

    export const sceneManager = new SceneManager();
}