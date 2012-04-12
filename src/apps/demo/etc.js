/**
 * Badge application class
 */
$class('tau.demo.Badge').extend(tau.ui.SceneController).define( {
  init: function () {
    this.appCtx = tau.getCurrentContext(); // 현재 앱의 컨텍스트 정보를 가져온다.
  },

  loadScene: function () {
    // Label 컴포넌트 스타일 지정 및 배지가 있는 경우 라벨에 설정한다.'
    var that = this,
        badge = tau.getCurrentContext().getBadge(),
        label = new tau.ui.Label({
          styles: { width : '320px' },
          text: badge ? 'Badge value: ' + badge : 'Badge is not set.'
        }),
        // 배지를 편집하기 위한 Textfiled 컴포넌트에 대한 스타일 지정, 최대 입력값을 설정한다.
        textField = new tau.ui.TextField({
          type: tau.ui.TextField.TEXT,
          styles: { width : '50%'},
          maxLength: 20,
          value: 'new text!'
        });

    this.setScene(new tau.ui.Scene({
      components: [

        label,

        textField,

        new tau.ui.Button({
          label: 'Set Text',
          styles: {display : 'inline-block', width : '50%'},
          'tap': function() {
            var text = textField.getText();
            if (tau.isString(text)) {
              that.appCtx.setBadge(text);
              label.setText('Badge value: ' + text);
            }
          }
        }),

        // 배지가 숫자인 경우 배지수를 감소시킨다.
        new tau.ui.Button({
          label: 'Add',
          styles: {width: '100%'},
          'tap': function() {
            badge = that.appCtx.getBadge();
            if (!tau.isNumber(badge)) {
              badge = 0;
            }
            badge++;
            that.appCtx.setBadge(badge);
            label.setText('Badge value: ' + badge);
          }
        }),

        // 배지가 숫자인 경우 배지수를 증가시킨다.
        new tau.ui.Button({
          label: 'Subract',
          styles: {width: '100%'},
          'tap':  function() {
            badge = that.appCtx.getBadge();
            if (!tau.isNumber(badge)) {
              badge = 0;
            }
            badge--;
            that.appCtx.setBadge(badge);
            label.setText('Badge value: ' + badge);
          }
        }),

        // 배지 설정된 것을 클리어 시켜준다.
        new tau.ui.Button({
          label: 'Clear',
          styles: {width: '100%'},
          'tap': function() {
            badge = that.appCtx.getBadge();
            if (tau.isNumber(badge)) {
              that.appCtx.removeBadge();
              label.setText('Badge is not set.');
            }
          }
        })
      ] 
    }));
  }
});

/**
 * Redraw 
 */
$class('tau.demo.Redraw').extend(tau.ui.SceneController).define( {
  loadScene: function() {
    var that = this,
        button1 = new tau.ui.Button(),
        button2 = new tau.ui.Button(),
        update = new tau.ui.Button(),
        label = new tau.ui.Label(),
        panel = new tau.ui.ScrollPanel();
    
    button1.setStyles({left : '1%', width : '30%'});
    button2.setStyles({left : '34.5%', width : '30%'});
    update.setStyles({right : '1%', width : '30%'});
    
    panel.setStyles({'margin-top' : '100px', height : '300px', background : 'maroon'});
    label.setStyles({top : '0px', right : '0px', color : 'white'});
    
    button1.setLabel('add');
    button2.setLabel('remove');
    update.setLabel('update');
    panel.add(label);
    
    button1.onEvent(tau.rt.Event.TAP, function() {
      var count = panel.getComponents().length - 1,
           item= new tau.ui.Button(), 
           top = (panel.getComponents().length - 1) * 100;
      item.setLabel(count + 'item');
      item.setStyles({top : top +'px'});
      panel.add(item);
      label.setText(count + 'item' + '이 추가되었습니다.');
    });
    button2.onEvent(tau.rt.Event.TAP, function(){
      var count = panel.getComponents().length - 1;
      if (count > 0){
        panel.remove(count);
        label.setText(count + 'item' + '이 삭제되었습니다.');
      }
    });
    
    var rightButton = new tau.ui.Button();
    rightButton.setLabel('Clear');
    update.onEvent(tau.rt.Event.TAP, function(){
      that.getScene().update();
      if (that.getParent() instanceof tau.ui.SequenceNavigator) {
        rightButton.setVisible(true);
        that.getParent().getActiveNavigationBar().setRightItem(rightButton);
        that.getParent().getActiveNavigationBar().setVisible(true);
      }
    });
    rightButton.onEvent(tau.rt.Event.TAP, function () {
      for(var i=1, len = panel.getComponents().length; i < len; i++){
        // label 컴포넌트 삭제하지 않는다.
        panel.remove(1);
      }
      that.getScene().update();
      label.setText('panel의 하위 컴포넌트들이 삭제되었습니다.');
      rightButton.setVisible(false);
      that.getParent().getActiveNavigationBar().setVisible(true);
    });
    
    this.getScene().add(button1);
    this.getScene().add(button2);
    this.getScene().add(update);
    this.getScene().add(panel);
  }
});