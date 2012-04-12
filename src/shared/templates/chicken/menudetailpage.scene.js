function initScene() {
  var ctx = tau.getCurrentContext();
  var scrollPanel = new tau.ui.ScrollPanel({
    hScroll: false,
    styles: {
      'background-repeat': 'repeat',
      'background-image': 'url(/data/img/bg_event.gif)'
    }
  });

  var title = new tau.ui.Label({
    text: this._model.title,
    styles: {
      color: '#555555',
      width: 'auto',
      display: 'block',
      fontWeight: 'bold',
      fontSize: '18px',
      'padding-top': '10px'
    }
  });

  var eventImg = new tau.ui.ImageView({
    src: '/data/img/' + this._model.detail_img,
    styles: {
      'max-width': '100%',
      height: 'auto',
      backgroundSize: '100% 100%'
    }
  });

  var textView = new tau.ui.Label({
    text: this._model.explain,
    styles: {
      color: '#999999',
      display: 'block',
      fontSize: '12px'
    }
  });

  var priceLabel = new tau.ui.Label({
    text: this._model.price + '원',
    styles: {
      color: '#aaaaaa',
      width: 'auto',
      fontWeight: 'bold',
      display: 'block'
    }
  });

  scrollPanel.add(title);
  scrollPanel.add(eventImg);
  scrollPanel.add(textView);
  scrollPanel.add(priceLabel);

  this.getScene().add(scrollPanel);
}