var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var modle;
(function (modle) {
    var MIN_FLOOR = 15;
    var MAX_FLOOR = 50;
    var MIN_LIMIT = 10;
    var MAX_LIMIT = 30;
    var random = function (min, max) {
        return min + Math.floor(Math.random() * max);
    };
    var Floor = (function () {
        function Floor(num) {
            this._num = num;
            this._init();
        }
        Floor.prototype._init = function () {
            this._martix = [];
            // 初始节点恒定宽度为 50
            this._martix[0] = [0, 50];
            var martixs = this._generateMartix(this._num - 1, this._martix[0]);
            this._martix = this._martix.concat(martixs);
        };
        /**
         * 动态添加 martix
         * @param {number} n 新增的数量
         */
        Floor.prototype.addMartix = function (n) {
            var originalLocation = this._martix[this._num - 1];
            this._num += n;
            var martixs = this._generateMartix(n, originalLocation);
            this._martix = this._martix.concat(martixs);
            return martixs;
        };
        Floor.prototype._generateMartix = function (n, original) {
            if (original === void 0) { original = []; }
            var martixs = [];
            var originalLocation = original;
            for (var i = 0; i < n; i++) {
                var location_1 = [];
                if (!originalLocation[1]) {
                    location_1[0] = 0;
                }
                else {
                    location_1[0] = originalLocation[1] + random(MIN_LIMIT, MAX_LIMIT);
                }
                location_1[1] = location_1[0] + random(MIN_FLOOR, MAX_FLOOR);
                originalLocation = location_1;
                martixs.push(location_1);
            }
            return martixs;
        };
        Floor.prototype.getMartix = function () {
            return this._martix;
        };
        Floor.prototype.getStart = function (index) {
            return this._martix[index][0];
        };
        Floor.prototype.getEnd = function (index) {
            return this._martix[index][1];
        };
        return Floor;
    }());
    modle.Floor = Floor;
    __reflect(Floor.prototype, "modle.Floor");
})(modle || (modle = {}));
