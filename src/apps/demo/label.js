/**
 * Label
 */
$class('tau.demo.Label').extend(tau.ui.SceneController).define( {
  loadScene: function () {
    var label = new tau.ui.Label(); // Label 컴포넌트를 생성한다.
    label.setStyle('width', '100px');
    label.setStyle('height', '100px');
    label.setNumberOfLines(3);  //행의 수를 지정한다.
    label.setText('The UILabel class implements a read-only text view. You can use this class to draw one or multiple lines of static text, such as those you might use to identify other parts of your user interface. The base UILabel class provides control over the appearance of your text, including whether it uses a shadow or draws with a highlight. If needed, you can customize the appearance of your text further by subclassing. The default content mode of the UILabel class is UIViewContentModeRedraw. This mode causes the view to redraw its contents every time its bounding rectangle changes. You can change this mode by modifying the inherited contentMode property of the class. New label objects are configured to disregard user events by default. If you want to handle events in a custom subclass of UILabel, you must explicitly change the value of the userInteractionEnabled property to YES after initializing the object.');
 
    var label2 = new tau.ui.Label();
    label2.setStyles({color : 'blue', width : '100px', bottom : '100px'});
    label2.setText('input line no.');
 
    var textfield = new tau.ui.TextField(); // Label 컴포넌트의 행의 수를 편집하기 위한 TextField 컴포넌트를 생성한다.
    textfield.setType(tau.ui.TextField.TEL); // 타입을 설정한다.
    textfield.setStyles({width : '100px', 'bottom' : '50px'});
    textfield.setMaxLength(2);
    
    var button = new tau.ui.Button(); // Button 컴포넌트를 생성한다.
    button.setLabel('line');
    button.setStyles({left: '110px', 'bottom' : '50px'});
    button.onEvent(tau.rt.Event.TAP, function(){  // 클릭이벤트가 발생하면 TextField에 설정한 값으로 Label 컴포넌트의 행의 수를 적용한다.
      if (tau.isNumber(parseInt(textfield.getText()))){
        label.setNumberOfLines(textfield.getText());
      }
    });
    
    // scene에 컴포넌트를 추가한다.
    this.getScene().add(label); 
    this.getScene().add(label2);
    this.getScene().add(textfield);  
    this.getScene().add(button);
  }
});
