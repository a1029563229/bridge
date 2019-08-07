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
        count: eui.Label;


        private _martixFloor: modle.Floor;
        private _touchCapture: modle.TouchCapture;
        // 当前位置，用于角色行走计算
        private _currentPosition: number = 0;
        // 当前节点，由 _currentPosition 计算得出的当前本地坐标
        private _currentPoint: number = 0;
        // 当前阶梯，用于动态生成新的阶梯
        private _currentMartix: number = 0;
        // 积分
        private _count: number = 0;
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
            // 等待角色移动到第一个阶梯开始添加游戏事件
            cm.Utils.delay(500, () => {
                this._addTouchHandler();
            });
        }

        private _reStart(): void {
            this._currentMartix = 0;
            this._currentPosition = 0;
            this._count = 0;
            this._isComeDown = false;

            this.prompt.text = '长按屏幕开始游戏';
            this.count.text = '得分：0';
            this.floors.removeChildren();
            this.floors.x = 0;
            this._character.y = 500;
            this._init();
            this._move();
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
            if (this._character) return;
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
            if (this._touchCapture) return this._enableTouchHandler();
            this._touchCapture = new modle.TouchCapture();
            this._touchCapture.bindNode(this);
            this._enableTouchHandler();
        }

        private _enableTouchHandler(): void {
            if (!this._touchCapture) return;
            this._touchCapture.addEventListener(modle.TouchCaptureEvent.ON_PROGRESS, this._onLineProgressHandler, this);
            this._touchCapture.addEventListener(modle.TouchCaptureEvent.ON_COMPLETE, this._rotationLine, this);
        }

        private _disableTouchHandler(): void {
            if (!this._touchCapture) return;
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
                if (this._currentPosition > 0) {
                    this._addCount();
                }
                this._clear();
            });
        }

        private _comeDown(): void {
            this.prompt.text = '您已坠落，游戏结束\n\n点击屏幕重新开始';
            this._character.idle();
            egret.Tween.get(this._character).to({
                y: 1500
            }, 1000).call(() => {
                this.once(egret.TouchEvent.TOUCH_END, this._reStart, this);
            });
        }

        private _addCount(): void {
            this._count += 10;
            this.count.text = `得分：${this._count}`;
        }

        private _clear(): void {
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