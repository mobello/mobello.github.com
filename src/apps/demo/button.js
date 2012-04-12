/**
 * Button
 */
$class('tau.demo.Button').extend(tau.ui.SceneController).define( {
  init: function () {
    this.appCtx = tau.getCurrentContext();   // 현재 앱의 컨텍스트 정보를 가져온다.
  },
  
  loadScene: function() {
    var that = this;

    // 버튼 컴포넌트를 생성한다.
    var button = new tau.ui.Button(),
        button1 = new tau.ui.Button(),
        button2 = new tau.ui.Button({styleClass: {shape: 'dark'}}), 
        button3 = new tau.ui.Button({styleClass: {shape: 'red'}}),  
        button4 = new tau.ui.Button({styleClass: {shape: 'khaki'}}),
        button5 = new tau.ui.Button({styleClass: {shape: 'green'}}),
        group = new tau.ui.RadioGroup();
        disabled = new tau.ui.Radio(),
        selected = new tau.ui.Radio(),
        reset = new tau.ui.Radio(),
        disabledLabel = new tau.ui.Label(),
        resetLabel = new tau.ui.Label(),
        selectedLabel = new tau.ui.Label();
        
    group.setComponents([disabled, selected, reset]);
        
    // scene에 컴포넌트를 추가한다.
    this.getScene().add(button);
    this.getScene().add(group);
    this.getScene().add(disabled);
    this.getScene().add(disabledLabel);
    this.getScene().add(selected);
    this.getScene().add(selectedLabel);
    this.getScene().add(reset);
    this.getScene().add(resetLabel);
    
    this.getScene().add(button1);
    this.getScene().add(button2);
    this.getScene().add(button3);
    this.getScene().add(button4);
    this.getScene().add(button5);

    // scene인 현재 absolute layout이기 때문에 좌표를 지정해 준다.
    button.setStyles({height : '100px', width : '100px'});
    button.setLabel( {  // 상태별 라벨을 설정한다.
      normal: 'default',
      disabled: null,
      selected: 'selected',
      highlighted: 'highlighted'
    });

    button.setTextColor( { // 상태별 텍스트 색을 설정한다.
      normal: 'black',
      disabled: 'gray',
      selected: 'red',
      highlighted: 'blue'
    });
    button.setBackgroundColor( { // 상태별 배경색을 설정한다.
      normal: '#AAAAAA',
      disabled: '#DDDDDD',
      selected: '#EEEEEE',
      highlighted: '#CCCCCC'
    });

    button.setBackgroundImage( {// 상태별 배경이미지를 설정한다.
      normal: null,
      disabled: '/img/2.jpg',
      selected: '/img/3.jpg',
      highlighted: '/img/4.jpg'
    });

    selectedLabel.setText('selectAll');
    disabledLabel.setText('disableAll');
    resetLabel.setText('reset');

    disabled.setStyles({top : '25px', right : '100px'});
    disabledLabel.setStyles({top : '20px', right : '10px'});
    selected.setStyles({top : '55px', right : '100px'});
    selectedLabel.setStyles({top : '50px', right : '10px'});
    reset.setStyles({top : '85px', right : '100px'});
    resetLabel.setStyles({top : '80px', right : '10px'});
    
    
    group.onEvent(tau.rt.Event.TAP, function(e, payload){
      if (0 == group.getSelectedIndex()){
        button1.setSelected(false);
        button2.setSelected(false);
        button3.setSelected(false);
        button4.setSelected(false);
        button5.setSelected(false);
        
        button1.setDisabled(true);
        button2.setDisabled(true);
        button3.setDisabled(true);
        button4.setDisabled(true);
        button5.setDisabled(true);
      } else if (1 == group.getSelectedIndex()){
        button1.setDisabled(false);
        button2.setDisabled(false);
        button3.setDisabled(false);
        button4.setDisabled(false);
        button5.setDisabled(false);

        button1.setSelected(true);
        button2.setSelected(true);
        button3.setSelected(true);
        button4.setSelected(true);
        button5.setSelected(true);
      } else if (2 == group.getSelectedIndex()){
        button1.setDisabled(false);
        button2.setDisabled(false);
        button3.setDisabled(false);
        button4.setDisabled(false);
        button5.setDisabled(false);

        button1.setSelected(false);
        button2.setSelected(false);
        button3.setSelected(false);
        button4.setSelected(false);
        button5.setSelected(false);
      }
    });
    
    button1.setLabel('disable');
    button1.setStyle('position', 'relative');
    button1.setStyle('top', '50px');
    button1.setStyle('width', '100%');

    var disabled = button.isDisabled();
    button1.onEvent(tau.rt.Event.TAP, function() { // 버튼이 클릭되었을 때 해당 버튼을 disable 시킨다.
      button.setDisabled(!disabled);
      disabled = button.isDisabled();
      button1.setLabel('disabled : ' + disabled);
    });

    button2.setLabel('highlight');
    button2.setStyle('position', 'relative');
    button2.setStyle('top', '50px');    
    button2.setStyle('width', '100%');
    
    var highlighted = button.isHighlighted();
    button2.onEvent(tau.rt.Event.TAP, function() { // 버튼이 클릭되었을 때 해당 버튼을 highlighted 시킨다.
      button.setHighlighted(!highlighted);
      highlighted = button.isHighlighted();
      button2.setLabel('highlighted : ' + highlighted);
    });

    button3.setLabel('select');
    button3.setStyle('position', 'relative');
    button3.setStyle('top', '50px');    
    button3.setStyle('width', '100%');


    var selected = button.isSelected();
    button3.onEvent(tau.rt.Event.TAP, function() { // 버튼이 클릭되었을 때 해당 버튼을 selected 시킨다.
      button.setSelected(!selected);
      selected = button.isSelected();
      button3.setLabel('selected : ' + selected);
    });
    button4.setLabel('default');
    button4.setStyle('position', 'relative');
    button4.setStyle('top', '50px');    
    button4.setStyle('width', '100%');
    button4.setStyle('width', '100%');
    
    button5.setLabel('default');
    button5.setStyle('position', 'relative');
    button5.setStyle('top', '50px');    
    button5.setStyle('width', '100%');
  }
});