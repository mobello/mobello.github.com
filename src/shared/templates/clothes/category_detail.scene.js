function initScene() {
	var scene = this.getScene();
	var scrollPanel1 = new tau.ui.ScrollPanel({hScroll : false , styles : {backgroundImage: 'transparent', backgroundRepeat: 'repeat'}});
	scene.add(scrollPanel1);
	var label1 = new tau.ui.Label({text : '상품명 : ' , styles : {color: 'pink', fontSize: '12px'}});
	scrollPanel1.add(label1);
	var label2 = new tau.ui.Label({text : this.model.name , styles : {color: 'pink', fontSize: '12px'}});
	scrollPanel1.add(label2);
	var label3 = new tau.ui.Label({text : '가격 :' , styles : {color: 'midnightBlue', fontSize: '12px'}});
	scrollPanel1.add(label3);
	var label4 = new tau.ui.Label({text : this.model.price , styles : {color: 'midnightBlue', fontSize: '12px'}});
	scrollPanel1.add(label4);
	var imageView1 = new tau.ui.ImageView({src : '/img/' + this.model.detail_img , styles : {height: 'auto', margin: '2%', maxWidth: '95%'}});
	scrollPanel1.add(imageView1);
	var textView1 = new tau.ui.TextView({text : this.model.detail , vScroll : false , styles : {backgroundColor: '#ffffff', fontSize: '12px', height: 'auto'}});
	scrollPanel1.add(textView1);
}