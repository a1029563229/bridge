module modle {
    export type Martix = Array<number[]>;
    
    const MIN_FLOOR = 10;
    const MAX_FLOOR = 50;
    const MIN_LIMIT = 10;
    const MAX_LIMIT = 30;

    const random = (min, max) => {
        return min + Math.floor(Math.random() * max);
    }

    export class Floor {
        private _num: number;
        private _martix: Martix;

        constructor(num: number) {
            this._num = num;
            this._init();
        }

        private _init(): void {
            this._martix = [];
            let originalLocation = [];
            for (let i = 0; i < this._num; i++) {
                let location = [];
                if (!originalLocation[1]) {
                    location[0] = 0;
                } else {
                    location[0] = originalLocation[1] + random(MIN_LIMIT, MAX_LIMIT);
                }
                location[1] = location[0] + random(MIN_FLOOR, MAX_FLOOR);
                originalLocation = location;
                this._martix.push(location);
            }
        }

        public getMartix(): Martix {
            return this._martix;
        }

        public getStart(index: number) {
            return this._martix[index][0];
        }

        public getEnd(index: number) {
            return this._martix[index][1];
        }
    }
}