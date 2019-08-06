module views {
    type FloorProps = { x: number, width: number }

    export class MainScene extends cm.BaseScene {
        grounds: eui.Group;
        floors: eui.Group;
        floor: eui.Image;
        line: eui.Image;

        private _martixFloor: modle.Floor;
        private _currentMartix: number = 0;

        private _character: Character;

        constructor(args) {
            super(args);
            this.skinName = 'resource/views/MainScene.exml';
        }

        onComplete() {
            super.onComplete();
            this._generateFloors();
            this._addCharacter();
            this._addTouchHandler();
            // this._characterWalkHandler();
        }

        private _generateFloors() {
            const floorsGroup = this.floors;
            const floor = this._martixFloor = new modle.Floor(10);
            const floors = floor.getMartix();
            for (let i = this._currentMartix; i < floors.length; i++) {
                const martix = floors[i];
                const floorProps = this._getLocate(martix);
                const floorItem = this._getFloorItem(floorProps);
                floorsGroup.addChild(floorItem);
            }
        }

        private _getLocate(martix: number[]): FloorProps {
            let x = this._getLocalPoint(martix[0])
            let width = this._getLocalPoint(martix[1] - martix[0]);
            return { x, width };
        }

        private _getLocalPoint(locate: number): number {
            const stageWidth = cm.main.stage.stageWidth;
            const itemWidth = stageWidth / 100;
            return locate * itemWidth;
        }

        private _getFloorItem(props: FloorProps): eui.Image {
            const { x, width } = props;
            const floorItem = new eui.Image();
            floorItem.x = x;
            floorItem.width = width;
            floorItem.height = 500;
            floorItem.bottom = 0;
            floorItem.source = 'main_json.widget';
            floorItem.scale9Grid = new egret.Rectangle(41, 43, 11, 7);
            return floorItem;
        }

        private _addCharacter(): void {
            let character = this._character = new views.Character('xiaocha', "");
            const start = this._getLocalPoint(this._martixFloor.getEnd(this._currentMartix)) - 50;
            this.line.x = start + 35;
            character.randomPlayWhenIdle({ actions: ['yawn', 'hello'], interval: 1000, rate: 0.05 });
            character.setDirection(CharacterDirection.RIGHT);
            character.x = start;
            character.y = 0;
            this.grounds.addChild(character);
            this.grounds.setChildIndex(character, 0);
        }

        private _addTouchHandler(): void {
            const touchCapture = new modle.TouchCapture();
            touchCapture.bindNode(this, time => console.log(time));
        }

        private _characterWalkHandler(): void {
            cm.Utils.delay(500, () => {
                this._character.walk();
            });
        }
    }
}