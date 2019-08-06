class ForumPage extends cm.AutoLayoutView implements  eui.UIComponent {
	QQGroup: eui.Image;
	firstLabel: eui.Label;
	secondLabel: eui.Label;
	public constructor() {
		super();
		this.skinName = 'ForumPageSkin';
 
	}
	onComplete() {
		super.onComplete();
	}
}

