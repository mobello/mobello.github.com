function initScene() {
  var scene = this.getScene();
  
  scene.setStyles({
    display: '-webkit-box',
    '-webkit-box-orient' : 'vertical'
  });

  var panel = new tau.ui.ScrollPanel({
    hScroll: false,
    styles: {
      width: '100%',
      'background-repeat' : 'repeat',
      'background-image' : 'url(/data/img/bg.png)'
    }
  });

  var loc = new tau.ui.Label({
    text: this._model.name,
    styles: {
      color: 'white',
      display: 'block'
    }
  });

  var map = new tau.ui.Panel({
    id: 'map',
    styles: {
      '-webkit-box-flex': 1,
      display: 'block',
      width: '100%',
      height: '200px'
    }
  });
  panel.add(loc);
  panel.add(map);

  var infopanel = new tau.ui.Panel();
  infopanel.getDOM().innerHTML = this._model.details;
  panel.add(infopanel);
  
  scene.add(panel);
}