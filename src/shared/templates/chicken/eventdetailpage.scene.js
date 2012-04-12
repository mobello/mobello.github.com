function initScene() {
  var ctx = tau.getCurrentContext();
  var scrollPanel = new tau.ui.ScrollPanel({
    hScroll : false,
    styles : {
      'background-repeat' : 'repeat',
      'background-image' : 'url(/data/img/bg_event.gif)'
    }
  });

  var title = new tau.ui.Label({
    text: this.data.title,
    styles: {
      color: '#555555',
      width: 'auto',
      display: 'block',
      fontWeight: 'bold',
      fontSize: '18px',
      'padding-top': '10px'
    }
  });
  scrollPanel.add(title);
  
  var eventImg = new tau.ui.ImageView({
    src: '/data/img/' + this.data.detail_img,
    styles: {
      height: 'auto',
      'max-width': '100%',
      backgroundSize: '100% 100%'
    }
  });
  scrollPanel.add(eventImg);
  
  var textView = new tau.ui.Label({
    text: this.data.detail,
    styles: {
      color: '#999999',
      display: 'block',
      fontSize: '12px'
    }
  });
  scrollPanel.add(textView);

  this.getScene().add(scrollPanel);
}