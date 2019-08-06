module cm{
    export class DragonBonesManager{
        private _factory: { [name: string]: dragonBones.EgretFactory } = {};
        getFactory(name: string, dragonbonesData: any, textureData: any, texture: any): dragonBones.EgretFactory{
            if(!this._factory[name]){
                let egretFactory: dragonBones.EgretFactory = new dragonBones.EgretFactory();
                egretFactory.parseDragonBonesData(dragonbonesData);  
                egretFactory.parseTextureAtlasData(textureData, texture);
                this._factory[name] = egretFactory;
                return egretFactory;
            }
            else{
                return this._factory[name];
            }
        }
    }

    export const dragonBonesManager = new DragonBonesManager();
}