module modle {
    export type Martix = Array<number[]>;

    const MIN_FLOOR = 15;
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
            // 初始节点恒定宽度为 50
            this._martix[0] = [0, 50];
            const martixs = this._generateMartix(this._num - 1, this._martix[0]);
            this._martix = [...this._martix, ...martixs];
        }

        /**
         * 动态添加 martix
         * @param {number} n 新增的数量
         */
        public addMartix(n: number): Martix {
            const originalLocation = this._martix[this._num - 1];
            this._num += n;
            const martixs = this._generateMartix(n, originalLocation);
            this._martix = [...this._martix, ...martixs];
            return martixs;
        }

        private _generateMartix(n: number, original: number[] = []): Martix {
            const martixs = [];
            let originalLocation = original;
            for (let i = 0; i < n; i++) {
                let location = [];
                if (!originalLocation[1]) {
                    location[0] = 0;
                } else {
                    location[0] = originalLocation[1] + random(MIN_LIMIT, MAX_LIMIT);
                }
                location[1] = location[0] + random(MIN_FLOOR, MAX_FLOOR);
                originalLocation = location;
                martixs.push(location);
            }
            return martixs;
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