// TypeScript file
module cm{
    /**
     * 自适应布局基类
     */
    export class AutoLayoutView extends cm.EUIComponent{

        constructor(){
            super();
        }

        protected childrenCreated(){
            super.childrenCreated();
            this.layout();
        }

        layout(){
            /**
             * 横屏模式下，将组件左右约束调整为与舞台大小一致
             */
            if(this.stage.scaleMode === egret.StageScaleMode.FIXED_WIDE || this.stage.scaleMode === egret.StageScaleMode.FIXED_HEIGHT){
                this.left = -this.stage.stageWidth / 2;
                this.right = this.stage.stageWidth / 2;
                this.horizontalCenter = 0;
            }
        }
    }
}