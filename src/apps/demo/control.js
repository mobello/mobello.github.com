/**
 * Checkbox
 */
$class('tau.demo.Checkbox').extend(tau.ui.SceneController).define( {
  loadScene: function () {
  // 선택여부가 true인 Checkbox 컴포넌트를 생성한다.
    var checkbox = new tau.ui.Checkbox({selected : true}); 
    
    // Checkbox가 클릭되었을 때 선택여부에 따른 경고창을 보여준다.
    checkbox.onEvent(tau.rt.Event.TAP, function(e, payload){  
      alert(checkbox.isSelected());
    });
    // scene에 컴포넌트를 추가한다.
    this.getScene().add(checkbox);  
  }
});

/**
 * Radio
 */
$class('tau.demo.Radio').extend(tau.ui.SceneController).define( {
  loadScene: function () {
    // Radio 컴포넌트를 생성한다.
    var radioGroup = new tau.ui.RadioGroup();
    var radio1 = new tau.ui.Radio({value : 1});
    var radio2 = new tau.ui.Radio({value : 2});

    // Radio 컴포넌트에 대한 위치를 설정한다. 
    radio2.setStyles({
      position : 'relative',
      left : '110px'
    });
    
    // Radio 컴포넌트의 값을 설정한다.
    radio1.setValue(1);
    radio2.setValue(2);
    
    // Radio를 RadioGroup으로 추가한다.
    radioGroup.setComponents([radio1, radio2]);
    
    // 클릭되었을 때 선택된 값과 Radio의 인덱스 값을 반환한다.
    radioGroup.onEvent(tau.rt.Event.SELECTCHANGE, function(e, payload){
      alert('value :' + radioGroup.getValue() + ', index :' + radioGroup.getSelectedIndex() +'');
    });
    
    radio1.onEvent(tau.rt.Event.TAP, function(e, payload){
      alert('1');
      e.alwaysBubble;
    });
    
    // scene에 컴포넌트를 추가한다.
    this.getScene().add(radio1);
    this.getScene().add(radio2);
    this.getScene().add(radioGroup);
  }
});

/**
 * TextField
 */
$class('tau.demo.TextField').extend(tau.ui.SceneController).define( {
  init: function () {
    this.appCtx = tau.getCurrentContext();   // 현재 앱의 컨텍스트 정보를 가져온다.
  },  
  loadScene: function () {
    // TextField 컴포넌트를 생성한다.
    var text = new tau.ui.TextField({type : tau.ui.TextField.TEXT});
    // 타입을 설정한다.
//    text.setType(tau.ui.TextField.SEARCH);
    // placeholder를 지정한다.
    text.setPlaceholderLabel('input');
    // placeholer 이미지를 지정한다.
    text.setPlaceholderImage('/img/1.jpg');
    // 클리어 버튼을 사용할지 결정한다.
    text.setClearButtonMode(true);  
    text.setStyle('width', '90%');
    // TextField 컴포넌트를 클릭했을 때 텍스트를 클리어할지 설정한다.
    text.setClearsOnBeginEditing(true); 
    
    this.getScene().add(text); // scene에 TextField 컴포넌트를 추가한다.
  }
});

/**
 * TextArea
 */
$class('tau.demo.TextArea').extend(tau.ui.SceneController).define( {
  loadScene: function () {
    // 컴포넌트를 생성한다.
    var textarea = new tau.ui.TextArea(); 
    // TextArea 컴포넌트 스타일을 설정한다.
    textarea.setStyles({width : '90%', height : '50%'});
    
    // placeholder를 지정한다.
    textarea.setPlaceholderLabel('input text....');
    // scene에 TextArea 컴포넌트를 추가한다.
    this.getScene().add(textarea);
  }
});

/**
 * Slider
 */
$class('tau.demo.Slider').extend(tau.ui.SceneController).define( {
  loadScene: function () {
    // 수평/수직 방향, 최소값, 최대값, 기본값, 틱사이즈를 지정한 Slider 컴포넌트를 생성한다.
    var slider, slider1, slider2, 
        label, label1, label2;

    slider = new tau.ui.Slider({
      tickSize : 0.1,
      enabledBarTouch: true,
      enabledThreshold: 50,
      styles: {width : '80%'}
    });
    
    slider1 = new tau.ui.Slider({
      vertical : false, 
      minValue : 0, 
      maxValue : 200, 
      value : 50, 
      tickSize : 50,
      enabledBarTouch: true,
      styles: {width : '80%'}
    });
    
    slider2 = new tau.ui.Slider({
      vertical : true, 
      minValue : 0, 
      maxValue : 4, 
      value : 1, 
      tickSize : 1,
      styles: {width : '80%'}
    });
    
    label = new tau.ui.Label({
      text : slider.getValue(),
      styles: {width: '15%'}
     });
    label1 = new tau.ui.Label({
      text : slider1.getValue(),
      styles: {width: '15%'}
    });
    label2 = new tau.ui.Label({
      text : slider2.getValue(),
      styles: {width: '15%'}
    });
    

    // Slider 값이 변경되면 라벨에 값을 출력해준다.
    this.getScene().onEvent(tau.rt.Event.VALUECHANGE, function(e, payload){
      var source = e.getSource();
      if (source === slider){
        label.setText(source.getValue());
      } else if (source === slider1){
        label1.setText(source.getValue());
      } else if (source === slider2){
        label2.setText(source.getValue());
      }
    });
    
    // scene에 컴포넌트를 추가한다.
    this.getScene().add(slider);
    this.getScene().add(label);
    this.getScene().add(slider1);
    this.getScene().add(label1);
    this.getScene().add(slider2);
    this.getScene().add(label2);
  }
});

/**
 * Switch
 */
$class('tau.demo.Switch').extend(tau.ui.SceneController).define( {
  loadScene: function () {
    // 수평, 수직방향의 Switch 컴포넌트를 생성한다.
    var defaultSwitch, verticalSwitch, label;
    
    defaultSwitch = new tau.ui.Switch({
      styles: {width : '50%'},
      onText: 'on', 
      offText: 'off'
    });
    verticalSwitch = new tau.ui.Switch({
      styles: {width : '50%'},
      vertical : true, 
      enabledThreshold: true,
      enabledBarTouch: true
    });
    
    label = new tau.ui.Label({
      text: defaultSwitch.getValue() + ',' + verticalSwitch.getValue()
    });
    this.getScene().onEvent(tau.rt.Event.VALUECHANGE, function(e, payload){
      label.setText(defaultSwitch.getValue() + ',' + verticalSwitch.getValue());
    });
    
    // scene에 Swith 컴포넌트를 추가한다.
    this.getScene().add(defaultSwitch);
    this.getScene().add(verticalSwitch);
    this.getScene().add(label);
  }
});

/**
 * Select
 */
$class('tau.demo.Select').extend(tau.ui.SceneController).define( {
  
  loadScene: function () {
  // 선택여부가 true인 Checkbox 컴포넌트를 생성한다.
    var select1, select2, select3, 
        button = new tau.ui.Button({
          label : 'refresh', 
          'tap': function (e, payload){
            select1.refresh();
            select2.refresh();
            select3.refresh();},
          styles: {width: '100%'}
        }); 

    
    select1 = new tau.ui.Select({
      components: [
        {label : 'option1', value :1},
        {label : 'option2', value :2},
        {label : 'option3', value :3},
        {label : 'option4', value :4},
        {label : 'option5', value :5},
        {label : 'option6', value :6},
        {label : 'option7', value :7},
        {label : 'option8', value :8},
        {label : 'option9', value :9},
        {label : 'option10', value :10},
        {label : 'option11', value :11},
        {label : 'option12', value :12},
        {label : 'option13', value :13},
        {label : 'option14', value :14},
        {label : 'option15', value :15}
      ],
      placeHolder: 'select',
      fullscreen: true,
      modal: true,
      maxSelectableCnt: 2,
      valueChange: function (e, payload) {
        
      }
    }); 
    
    select2 = new tau.ui.Select({
      components: [
        {label : 'option1', value :1},
        {label : 'option2', value :2},
        {label : 'option3', value :3},
        {label : 'option4', value :4},
        {label : 'option5', value :5},
        {label : 'option6', value :6}
      ],      
      maxSelectableCnt: 2,
      selectedIndexes: [1, 2],
      togglable: false,
      valueChange: function (e, payload) {},
    }); 
    
    select3 = new tau.ui.Select({
      components: [
        {label : '1234567890', value :1},
        {label : 'abcdefghijklmnopqrstuvwxyz', value :2},
        {label : 'ㄱㄴㄷ', value :3}
      ],
      /*toggle: true,*/
      selectedIndexes: [1],
      valueChange: function (e, payload) {
        alert(payload.selectedIndexes[0]);
      },
      styles: {top : '50%'}
    }); 
    
    // scene에 컴포넌트를 추가한다.
    this.getScene().add(button);  
    this.getScene().add(select1);  
    this.getScene().add(select2);  
    this.getScene().add(select3);  
  }
});

/**
 * SegmentedButton
 */
$class('tau.demo.SegmentedButton').extend(tau.ui.SceneController).define( {
  
  init: function () {
    this.appCtx = tau.getCurrentContext();   // 현재 앱의 컨텍스트 정보를 가져온다.
  },
  
  loadScene: function () {
  // 선택여부가 true인 Checkbox 컴포넌트를 생성한다.
    var segmentedButton1, segmentedButton2, segmentedButton3, 
        panel = new tau.ui.Panel({styles : {padding : '10%', marginTop : '10px', height : '30%', width: '90%'}}),
        imageView1 = [],
        button = new tau.ui.Button({
          label : 'refresh', 
          'tap': function (e, payload){
            segmentedButton1.refresh();
            segmentedButton2.refresh();
            segmentedButton3.refresh();
            
            var selectedIndexes = segmentedButton1.getSelectedIndexes();
              
            for(var i= imageView1.length; i--;){
              imageView1[i].setStyles({opacity : 0.3});
            };
            for(var i= selectedIndexes.length; i--;){
              imageView1[selectedIndexes[i]].setStyles({opacity : 1});
            }
            if (segmentedButton3.getSelectedIndexes[0] === 1){
              panel.setStyles({backgroundColor : 'red'});
            } else {
              panel.setStyles({backgroundColor : ''});
            }
          },
          styles: {width: '100%'}
        }); 
    
    segmentedButton1 = new tau.ui.SegmentedButton({
      maxSelectableCnt: 2,
      components: 
      [{label: 'option1', value: 1},
       {label: 'option2', value: 2},
       {label: 'option3', value: 3}
       ],
      valueChange: function (e, payload) {
       var selectedIndexes = payload.selectedIndexes;
       var deselectedIndexes = payload.deselectedIndexes;
       for(var i= deselectedIndexes.length; i--;){
         imageView1[deselectedIndexes[i]].setStyles({opacity : 0.3});
       }
       for(var i= selectedIndexes.length; i--;){
         imageView1[selectedIndexes[i]].setStyles({opacity : 1});
       }
     }
    });
    for(var i=0; i < 3; i++){
      imageView1[i] = new tau.ui.ImageView({
        src: '/img/' + 'baskin' + i +'.png',
        styles: {height: '100%', width: '33%', opacity: 0.3}
      });
      panel.add(imageView1[i]);
    }
    
    segmentedButton2 = new tau.ui.SegmentedButton({
      vertical: true,
      components: [
        {label: 'pint', value :1},
        {label: 'quarter', value :2},
        {label: 'family', value :3},
        {label: 'half gallon', value :4}
      ],
      selectedIndexes: [2]
    }); 
    
    segmentedButton3 = new tau.ui.SegmentedButton({
      components: 
        [{label: 'Syrup no', value :false},
         {label: 'Syrup yes', value :true}
        ],
      selectedIndexes: [0],
      valueChange: function (e, payload) {
         if (payload.selectedIndexes[0] === 1){
           panel.setStyles({backgroundColor : 'red'});
         } else {
           panel.setStyles({backgroundColor : ''});
         }
       }
    }); 
    
    // scene에 컴포넌트를 추가한다.
    this.getScene().add(button);  
    this.getScene().add(segmentedButton1);  
    this.getScene().add(panel);  
    this.getScene().add(segmentedButton2);  
    this.getScene().add(segmentedButton3);  
  },
  
  selectedFn: function (item) {
    alert('pint는 현재 take out 되지 않습니다.');
  }
});