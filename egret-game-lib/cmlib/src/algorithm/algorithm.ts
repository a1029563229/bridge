namespace cm{
    export class Algorithm{
        /**
         * bresenham-algorithm
         * 计算出一条直线所经过的像素点
         */
        static getLinePoints(x0, y0, x1, y1):{x:number, y:number}[]{
            let result = [];
            var dx = Math.abs(x1-x0);
            var dy = Math.abs(y1-y0);
            var sx = (x0 < x1) ? 1 : -1;
            var sy = (y0 < y1) ? 1 : -1;
            var err = dx-dy;

            while(true){
                result.push({x:x0, y:y0});
                if ((x0==x1) && (y0==y1)) break;
                var e2 = 2*err;
                if (e2 >-dy){ err -= dy; x0  += sx; }
                if (e2 < dx){ err += dx; y0  += sy; }
            }
            return result;
        }
    }
}