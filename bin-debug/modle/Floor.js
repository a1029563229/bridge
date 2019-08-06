var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var modle;
(function (modle) {
    var MIN_FLOOR = 10;
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
            var originalLocation = [];
            for (var i = 0; i < this._num; i++) {
                var location_1 = [];
                if (!originalLocation[1]) {
                    location_1[0] = 0;
                }
                else {
                    location_1[0] = originalLocation[1] + random(MIN_LIMIT, MAX_LIMIT);
                }
                location_1[1] = location_1[0] + random(MIN_FLOOR, MAX_FLOOR);
                originalLocation = location_1;
                this._martix.push(location_1);
            }
        };
        Floor.prototype.getMartix = function () {
            return this._martix;
        };
        return Floor;
    }());
    modle.Floor = Floor;
    __reflect(Floor.prototype, "modle.Floor");
})(modle || (modle = {}));
