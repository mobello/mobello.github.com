/**
 * Spinner
 */
$class('tau.demo.Spinner').extend(tau.ui.SceneController).define({
  init : function() {
    this.appCtx = tau.getCurrentContext(); // 현재 앱의 컨텍스트 정보를 가져온다.
  },

  loadScene : function() {
    var self = this;
    
    self.setTitle("Spinner");

    
    self.label = new tau.ui.Label();
    self.label.setText("{step:1, min:-150, max:111, acceleration: true, readonly: false, initiate: 33}");
    self.getScene().add(self.label);
    
    self.spinner = new tau.ui.Spinner({
      step:1, 
      min:-150, 
      max:111, 
      readonly: false,
      value: 33,
      //acceleration: false,
      formatFn: function(v){
        v = v.toFixed(2);
        return "$"+v;
      }
    });       
    
    self.spinner.onEvent(tau.rt.Event.VALUECHANGE, function(e, payload){                
        tau.log('callbackFn value='+payload.value+', status='+payload.step);
    });
    
    self.spinner.setReadOnly(true);
    self.getScene().add(self.spinner);
  }
});