/**
 * Activityindicator 
 */
$class('tau.demo.ActivityIndicator').extend(tau.ui.SceneController).define( {
  loadScene: function() {
    this.setTitle('ActivityIndicator');
    var button, activityindicator, bStart = true;  
    activityindicator = new tau.ui.ActivityIndicator({message : 'Loading...', styles : {height : '50%'}});  // ActivityIndicator 생성
    activityindicator.start(); // 컴포넌트를 화면에 보여줌.
    
    button = new tau.ui.Button({label : 'end', styles : {top : '50%'}}); // 버튼 컴포넌트를 생성한다.
    button.onEvent(tau.rt.Event.TAP, function(){ // 클릭 이벤트가 발생했을 때 ActivityIndicator을 start, stop시킨다.
      if (bStart){
        button.setLabel('start');
        activityindicator.end();
        bStart = false; 
      } else {
        button.setLabel('end');
        activityindicator.start(1000);
        bStart = true;
      }
    });
    // 컴포넌트를 scene에 추가한다.
    this.getScene().add(button);
    this.getScene().add(activityindicator);  
  }
});