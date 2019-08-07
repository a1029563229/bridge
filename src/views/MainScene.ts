module views {
    type FloorProps = { x: number, width: number }
    const LINE_SCALE = .5;
    const CHARACTER_WIDTH = 100;
    const SPEED = 40;

    export class MainScene extends cm.BaseScene {
        grounds: eui.Group;
        floors: eui.Group;
        floor: eui.Image;
        line: eui.Image;
        prompt: eui.Label;


        private _martixFloor: modle.Floor;
        private _touchCapture: modle.TouchCapture;
        private _currentPosition: number = 0;
        private _currentPoint: number = 0;
        private _currentMartix: number = 0;
        private _progress: number = 50;
        private _isComeDown: boolean = false;

        private _character: Character;

        constructor(args) {
            super(args);
            this.skinName = 'resource/views/MainScene.exml';
        }

        onComplete() {
            super.onComplete();
            this._init();
        }

        private _init(): void {
            this._martixFloor = new modle.Floor(10);
            const martixs = this._martixFloor.getMartix();
            this._currentPoint = this._martixFloor.getEnd(this._currentMartix);
            this._generateFloors(martixs);
            this._addCharacter();
            this._addTouchHandler();
        }

        private _generateFloors(martixs: modle.Martix) {
            const floorsGroup = this.floors;
            for (let i = this._currentMartix; i < martixs.length; i++) {
                const martix = martixs[i];
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
            character.randomPlayWhenIdle({ actions: ['yawn', 'hello'], interval: 1000, rate: 0.05 });
            character.setDirection(CharacterDirection.RIGHT);
            character.x = CHARACTER_WIDTH / 2;
            this.line.x = character.x + 40;
            character.y = 500;
            this.grounds.addChild(character);
            this.grounds.setChildIndex(character, 0);
            character.callback = this._move.bind(this);
        }

        private _addTouchHandler(): void {
            this._touchCapture = new modle.TouchCapture();
            this._touchCapture.bindNode(this);
            this._enableTouchHandler();
        }

        private _enableTouchHandler(): void {
            this._touchCapture.addEventListener(modle.TouchCaptureEvent.ON_PROGRESS, this._onLineProgressHandler, this);
            this._touchCapture.addEventListener(modle.TouchCaptureEvent.ON_COMPLETE, this._rotationLine, this);
        }

        private _disableTouchHandler(): void {
            this._touchCapture.removeEventListener(modle.TouchCaptureEvent.ON_PROGRESS, this._onLineProgressHandler, this);
            this._touchCapture.removeEventListener(modle.TouchCaptureEvent.ON_COMPLETE, this._rotationLine, this);
        }

        private _onLineProgressHandler(e: modle.TouchCaptureEvent): void {
            const { data: progress } = e;
            const locateLength = Math.round(this._getLocalPoint(progress * LINE_SCALE));
            this.line.height = locateLength;
        }

        private _rotationLine(e: modle.TouchCaptureEvent): void {
            this._disableTouchHandler();
            const { data: progress } = e;
            this.line.rotation = -180;
            egret.Tween.get(this.line).to({
                rotation: -90
            }, 500).call(() => {
                this._currentPosition += 1;
                this._currentPoint = this._getTargetPoint(progress);
                this._move();
            }, this);
        }

        private _getTargetPoint(point: number): number {
            let targetPoint = this._currentPoint + Math.floor(point * LINE_SCALE);
            const martixs = this._martixFloor.getMartix()
            const [start, end] = martixs[this._currentPosition];
            if (targetPoint > start && targetPoint < end) {
                targetPoint = end;
            } else {
                this._isComeDown = true;
            }
            return targetPoint;
        }

        private _move(): void {
            const target = this._getLocalPoint(this._currentPoint);
            const originalX = this.floors.x;
            const x = -target + CHARACTER_WIDTH;
            this._character.walk();
            egret.Tween.get(this.line).to({
                x: x - originalX
            }, Math.abs(originalX - x) * 100 / SPEED).call(() => {
                if (this._isComeDown) return;
                this.line.x = this._character.x + 40;
            });
            egret.Tween.get(this.floors).to({
                x
            }, Math.abs(originalX - x) * 100 / SPEED).call(() => {
                if (this._isComeDown) {
                    this._comeDown();
                    return;
                }
                this._reset();
            });
        }

        private _comeDown(): void {
            this.prompt.text = '您已坠落，游戏结束';
            this._character.idle();
            egret.Tween.get(this._character).to({
                y: 1500
            }, 1000).call(() => {

            });
        }

        private _reset(): void {
            this._character.idle();
            this.line.x = this._character.x + 40;
            this.line.rotation = 0;
            this.line.height = 0;
            this._enableTouchHandler();

            const martixLength = this._martixFloor.getMartix().length;
            const currentPosition = this._currentPosition;
            if (martixLength - currentPosition < 5) {
                const martixs = this._martixFloor.addMartix(10);
                this._generateFloors(martixs);
            }
        }
    }
}