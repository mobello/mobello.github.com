/**
 * ImageView
 */
$class('tau.demo.ImageView').extend(tau.ui.SceneController).define( {
  
  init: function () {
    this.appCtx = tau.getCurrentContext();   // 현재 앱의 컨텍스트 정보를 가져온다.
  },
  
  loadScene: function() {
  // ImageView 컴포넌트를 생성한다.
    var image = new tau.ui.ImageView({src : '/img/1.jpg'}); 
    image.setStyle('width', '100px');
    image.setStyle('height', '100px');
    // scene에 ImageView 컴포넌트를 추가한다.
    this.getScene().add(image); 
  }
});
