/**
 * Theme
 */
$class('tau.demo.Theme').extend(tau.ui.SceneController).define( {
  init: function () {
    this.appCtx = tau.getCurrentContext();   // 현재 앱의 컨텍스트 정보를 가져온다.
  },
  
  loadScene: function() {
    var that = this;
    var groupId = tau.genId('radio');
  // 버튼 컴포넌트를 생성한다.
    var button1 = new tau.ui.Button(),
        button2 = new tau.ui.Button(),
        button3 = new tau.ui.Button(),
        button4 = new tau.ui.Button(),
        selectedLabel = new tau.ui.Label();
        
        
    // scene에 컴포넌트를 추가한다.
    this.getScene().add(button1);
    this.getScene().add(button2);
    this.getScene().add(button3);
    this.getScene().add(button4);

    button1.setStyles({top : '0px', width : '90%'});
    button1.setLabel( {  // 상태별 라벨을 설정한다.
      label: 'default'
    });
    
    button2.setStyles({top : '50px', width : '90%'});
    button2.setLabel( {  // 상태별 라벨을 설정한다.
      label: 'def simple'
    });
    
    button3.setStyles({top : '100px', width : '90%'});
    button3.setLabel( {  // 상태별 라벨을 설정한다.
      label: 'reset theme'
    });
    
    button4.setStyles({top : '150px', width : '90%'});
    button4.setLabel( {  // 상태별 라벨을 설정한다.
      label: 'reset def theme'
    });

    that.getScene().onEvent(tau.rt.Event.TAP, function(e) { 
      if (e.getSource() == button1){
        that.appCtx.setTheme('default');
      } else if (e.getSource() == button2){
        tau.getRuntime().setTheme('simple');
      } else if (e.getSource() == button3){
        that.appCtx.resetTheme();
      } else if (e.getSource() == button4){
        tau.getRuntime().resetTheme();
      }
    });
  }
});