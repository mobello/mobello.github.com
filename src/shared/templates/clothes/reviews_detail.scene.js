function initScene() {
  var scene = this.getScene();

  var scrollPanel = new tau.ui.ScrollPanel({
    hScroll : false,
    styles : {
      'background-repeat' : 'repeat',
      'background-image' : 'transparent'
    }
  });

  scene.add(scrollPanel);

  var label1 = new tau.ui.Label({
    text : "상품명 : " + this.model.name,
    styles : {
      "font-size" : "16px",
      "color" : "pink",
      "display" : "block"

    }
  });
  scrollPanel.add(label1);
  var label2 = new tau.ui.Label({
    text : "리뷰 : " + this.model.title,
    styles : {
      "font-size" : "12px",
      "color" : "midnightBlue",
      "display" : "block"
    }
  });
  scrollPanel.add(label2);
  var imageView1 = new tau.ui.ImageView({
    src : '/img/' + this.model.img,
    styles : {
      'max-width' : '95%',
      height : 'auto',
      margin : '2%'
    }
  });
  scrollPanel.add(imageView1);
  var textView1 = new tau.ui.TextView({
    text : this.model.review,
    vScroll : false,
    styles : {
      "font-size" : "12px",
      backgroundColor : 'transparent',
      height : 'auto'
    }
  });
  scrollPanel.add(textView1);
}