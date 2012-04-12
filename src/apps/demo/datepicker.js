/**
 * Picker
 */
$class('tau.demo.DatePicker').extend(tau.ui.SceneController).define(
    {
      init : function() {
        this.appCtx = tau.getCurrentContext(); // 현재 앱의 컨텍스트 정보를 가져온다.
      },

      loadScene : function() {
        var that = this;
        var minDate = new Date();
        var maxDate = new Date();
        //minDate.setFullYear(2011, 1, date)
        
        var dateTimePicker = new tau.ui.DatePicker(tau.ui.DatePicker.DATETIME, {locale:"us"});
        
        var dateOnlyPicker = new tau.ui.DatePicker(tau.ui.DatePicker.DATE_ONLY, {locale:"us"});
        var timeOnlyPicker = new tau.ui.DatePicker(tau.ui.DatePicker.TIME_ONLY, {locale:"us"});
        
        var toolbar = new tau.ui.ToolBar();

        var datetimeButton = new tau.ui.Button();
        
        
        datetimeButton.setLabel("DateTime");
        datetimeButton.onEvent(tau.rt.Event.TAP, function() {          
          dateTimePicker.open();          
          dateTimePicker.moveToNow();
        });
        dateTimePicker.onEvent(tau.rt.Event.TAP, function(e, payload){
          if(payload && payload.buttonType){
            if(payload.buttonType == tau.ui.Picker.CANCEL_BUTTON){
              dateTimePicker.moveToNow();
              dateTimePicker.close();
            }else{
              alert(dateTimePicker.getDate());
              dateTimePicker.close();
            }
          }
        });
        
        var dateOnlyButton = new tau.ui.Button();
        dateOnlyButton.setLabel("DateOnly");
        dateOnlyButton.onEvent(tau.rt.Event.TAP, function() {
          dateOnlyPicker.open();
          dateOnlyPicker.moveToNow();
        });
        
        dateOnlyPicker.onEvent(tau.rt.Event.TAP, function(e, payload){
          if(payload && payload.buttonType){
            if(payload.buttonType == tau.ui.Picker.CANCEL_BUTTON){
              dateOnlyPicker.moveToNow();
              dateOnlyPicker.close();
            }else{
              alert(dateOnlyPicker.getDate());
              dateOnlyPicker.close();
            }
          }
        });
        
        var timeOnlyButton = new tau.ui.Button();
        timeOnlyButton.setLabel("TimeOnly");
        timeOnlyButton.onEvent(tau.rt.Event.TAP, function() {
          timeOnlyPicker.open();
          timeOnlyPicker.moveToNow();
        });

        timeOnlyPicker.onEvent(tau.rt.Event.TAP, function(e, payload){
          if(payload && payload.buttonType){
            if(payload.buttonType == tau.ui.Picker.CANCEL_BUTTON){
              timeOnlyPicker.moveToNow();
              timeOnlyPicker.close();
            }else{
              alert(timeOnlyPicker.getDate());
              timeOnlyPicker.close();
            }
          }
        });
        
        toolbar.add(datetimeButton);
        toolbar.add(dateOnlyButton);
        toolbar.add(timeOnlyButton);

        that.getScene().add(toolbar);
        that.getScene().add(dateTimePicker);
        that.getScene().add(dateOnlyPicker);
        that.getScene().add(timeOnlyPicker);
      }
 });