/**
 * ToolBar
 */
$class('tau.demo.ToolBar').extend(tau.ui.SceneController).define( {
  loadScene: function () {
    // ToolBar 컴포넌트를 생성한다.
    var toolbar = new tau.ui.ToolBar();
    toolbar.add(new tau.ui.Button({label : 'btn1'}));
    toolbar.add(new tau.ui.Button({label : 'btn2'}));
    var space = new tau.ui.Space({type : 'sep'});
    space.setStyles({width : '20px'});
    toolbar.add(space);
    toolbar.add(new tau.ui.Button({label : 'btn3'}));
    toolbar.add(new tau.ui.Space({type : 'fixed'}));
    toolbar.add(new tau.ui.Button({label : 'btn4'}));
    toolbar.add(new tau.ui.Space());    
    toolbar.add(new tau.ui.Button({label : 'btn5'}));
    this.getScene().add(toolbar);
    
    var toolbar2 = new tau.ui.ToolBar();
    toolbar2.add(new tau.ui.Button({label : 'btn1'}));
    toolbar2.add(new tau.ui.Button({label : 'btn2'}));
    toolbar2.add(new tau.ui.Button({label : 'btn3'}));
    toolbar2.add(new tau.ui.Button({label : 'btn4'}));
    toolbar2.add(new tau.ui.Button({label : 'btn5'}));
    toolbar2.add(new tau.ui.Button({label : 'btn6'}));
    toolbar2.add(new tau.ui.Button({label : 'btn7'}));
    toolbar2.add(new tau.ui.Button({label : 'btn8'}));
    toolbar2.add(new tau.ui.Button({label : 'btn9'}));
    this.getScene().add(toolbar2);
    
    toolbar2.onEvent(tau.rt.Event.TAP, function (e){
      if (e.getSource() === toolbar2.getComponent(0)){
        alert('test');
      }
    });
    
    var toolbar3 = new tau.ui.ToolBar({dock: 'bottom'});
    toolbar3.add(new tau.ui.Button({label : 'btn1'}));
    toolbar3.add(new tau.ui.Button({label : 'btn2'}));
    this.getScene().add(toolbar3);
    
    var toolbar4 = new tau.ui.ToolBar({dock: 'bottom'});
    toolbar4.add(new tau.ui.Button({label : 'btn3'}));
    var label = new tau.ui.Label({text : 'toolbar'});
    label.setStyles({width : '100px'});
    toolbar4.add(label);
    toolbar4.add(new tau.ui.Button({label : 'btn4'}));
    this.getScene().add(toolbar4);
    
  }
});