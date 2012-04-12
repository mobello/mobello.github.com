/**
 * SystemDialog application class
 */
$class('tau.demo.SystemDialog').extend(tau.ui.SceneController).define( {
  init: function () {
    this.appCtx = tau.getCurrentContext();   // 현재 앱의 컨텍스트 정보를 가져온다.
  },

  loadScene: function() {
    var scene = this.getScene(), 
        label1 = new tau.ui.Label({styles: {width : '50%'}}), 
        label2 = new tau.ui.Label({styles: {width : '50%'}}), 
        label3 = new tau.ui.Label({styles: {width : '50%'}});
    
    scene.add(new tau.ui.Button({
      label: 'alert',
      styles: {width : '50%'},
      tap: function (e, payload) {
        tau.alert('1. The UITextView class implements the behavior for a scrollable, multiline text region. The class supports the display of text using a custom font, color, and alignment and also supports text editing. You typically use a text view to display multiple lines of text, such as when displaying the body of a large text document.        This class does not support multiple styles for text. The font, color, and text alignment attributes you specify always apply to the entire contents of the text view. To display more complex styling in your application, you need to use a UIWebView object and render your content using HTML.        Managing the Keyboard       When the user taps in an editable text view, that text view becomes the first responder and automatically asks the system to display the associated keyboard. Because the appearance of the keyboard has the potential to obscure portions of your user interface, it is up to you to make sure that does not happen by repositioning any views that might be obscured. Some system views, like table views, help you by scrolling the first responder into view automatically. If the first responder is at the bottom of the scrolling region, however, you may still need to resize or reposition the scroll view itself to ensure the first responder is visible.        It is your application’s responsibility to dismiss the keyboard at the time of your choosing. You might dismiss the keyboard in response to a specific user action, such as the user tapping a particular button in your user interface. To dismiss the keyboard, send the resignFirstResponder message to the text view that is currently the first responder. Doing so causes the text view object to end the current editing session (with the delegate object’s consent) and hide the keyboard.        The appearance of the keyboard itself can be customized using the properties provided by the UITextInputTraits protocol. Text view objects implement this protocol and support the properties it defines. You can use these properties to specify the type of keyboard (ASCII, Numbers, URL, Email, and others) to display. You can also configure the basic text entry behavior of the keyboard, such as whether it supports automatic capitalization and correction of the text.        Keyboard Notifications       When the system shows or hides the keyboard, it posts several keyboard notifications. These notifications contain information about the keyboard, including its size, which you can use for calculations that involve repositioning or resizing views. Registering for these notifications is the only way to get some types of information about the keyboard. The system delivers the following notifications for keyboard-related events:        UIKeyboardWillShowNotification       UIKeyboardDidShowNotification       UIKeyboardWillHideNotification       UIKeyboardDidHideNotification       For more information about these notifications, see their descriptions in UIWindow Class Reference.', {
          title : 'alert', 
          callbackFn: function(returnVal){
            label1.setText(returnVal);
          }
        });
      } 
    }));
    
    scene.add(label1);
    
    scene.add(new tau.ui.Button({
      label: 'confirm',
      styles: {width : '50%'},
      tap: function (e, payload) {
        tau.confirm('The UITextView class implements the behavior for a scrollable, multiline text region. The class supports the display of text using a custom font, color, and alignment and also supports text editing. You typically use a text view to display multiple lines of text, such as when displaying the body of a large text document.        This class does not support multiple styles for text. The font, color, and text alignment attributes you specify always apply to the entire contents of the text view. To display more complex styling in your application, you need to use a UIWebView object and render your content using HTML.        Managing the Keyboard       When the user taps in an editable text view, that text view becomes the first responder and automatically asks the system to display the associated keyboard. Because the appearance of the keyboard has the potential to obscure portions of your user interface, it is up to you to make sure that does not happen by repositioning any views that might be obscured. Some system views, like table views, help you by scrolling the first responder into view automatically. If the first responder is at the bottom of the scrolling region, however, you may still need to resize or reposition the scroll view itself to ensure the first responder is visible.        It is your application’s responsibility to dismiss the keyboard at the time of your choosing. You might dismiss the keyboard in response to a specific user action, such as the user tapping a particular button in your user interface. To dismiss the keyboard, send the resignFirstResponder message to the text view that is currently the first responder. Doing so causes the text view object to end the current editing session (with the delegate object’s consent) and hide the keyboard.        The appearance of the keyboard itself can be customized using the properties provided by the UITextInputTraits protocol. Text view objects implement this protocol and support the properties it defines. You can use these properties to specify the type of keyboard (ASCII, Numbers, URL, Email, and others) to display. You can also configure the basic text entry behavior of the keyboard, such as whether it supports automatic capitalization and correction of the text.        Keyboard Notifications       When the system shows or hides the keyboard, it posts several keyboard notifications. These notifications contain information about the keyboard, including its size, which you can use for calculations that involve repositioning or resizing views. Registering for these notifications is the only way to get some types of information about the keyboard. The system delivers the following notifications for keyboard-related events:        UIKeyboardWillShowNotification       UIKeyboardDidShowNotification       UIKeyboardWillHideNotification       UIKeyboardDidHideNotification       For more information about these notifications, see their descriptions in UIWindow Class Reference.', {
          title : 'confirm', 
          callbackFn: function(returnVal){
            label2.setText(returnVal);
          }
        });
      } 
    }));
    
    scene.add(label2);
    
    scene.add(new tau.ui.Button({
      label: 'prompt',
      styles: {width : '50%'},
      tap: function (e, payload) {
        tau.prompt('Please enter your name', {
          title : 'prompt', 
          placeholderLabel: 'name...',
          callbackFn: function(returnVal){
            label3.setText(returnVal);
          }
        });
      } 
    }));
    
    scene.add(label3);
  }
});

/**
 * ActionSheet application class
 */
$class('tau.demo.ActionSheet').extend(tau.ui.SceneController).define( {
  init: function () {
    this.appCtx = tau.getCurrentContext();   // 현재 앱의 컨텍스트 정보를 가져온다.
  },

  loadScene: function() {
    var that = this,
        scene = this.getScene(), 
        actionsheet, label, button1;
    
    that.i = 0;

    label = new tau.ui.Label({text: 'selected index : '});
      
    actionsheet = new tau.ui.ActionSheet({
      showCloseBtn: true,
      popupTitle: 'test',
      components: [
        {label: 'button1'},
        new tau.ui.Button({
          label: 'btn2',
          styleClass : {type :'red'},
          tap: function (e, payload) {
            e.alwaysBubble();
            tau.alert('alert');
          }
        }),
        new tau.ui.Button({label : 'btn3',  styleClass : {type :'red'}})/*,
        'button3',
        'button4',
        'button5',
        'button6',
        'button7', 
        'button8',
        'button9'*/
      ],
      selectChange: function (e, payload){
        label.setText('selected index : ' + payload);
      }
    });
    
    button1 = new tau.ui.Button({
      label: 'showby',
      styles: {bottom : 0, right: '0'},
      tap: function (e, payload) {
        actionsheet.open({dir: that.i % 4});
        that.i++;
      } 
    });
    
    scene.add(new tau.ui.Button({
      label: 'actionsheet',
      styles: {width : '50%'},
      tap: function (e, payload) {
        actionsheet.open({comp: label, dir: that.i % 4});
        that.i++;
      } 
    }));
    scene.add(label);
    scene.add(actionsheet);
    scene.add(button1);
    
    
  }
});

/**
 * Dialog application class
 */
$class('tau.demo.Dialog').extend(tau.ui.SceneController).define( {
  init: function () {
    this.appCtx = tau.getCurrentContext();   // 현재 앱의 컨텍스트 정보를 가져온다.
  },

  loadScene: function() {
    var that = this,
        scene = this.getScene(), 
        dialog, label, button1;
    
    that.i = 0;

    label = new tau.ui.Label({text: 'selected index : '});
      
    dialog = new tau.ui.Dialog({
      popupTitle: 'test',
      /*showCloseBtn: true,*/
      modal: true,
      components: [
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn2',  styleClass : {type :'red'}, 'tap': function (e, payload){e.alwaysBubble(); tau.alert('alert')}}),
        new tau.ui.Button({label : 'btn3',  styleClass : {type :'red'}})
      ]
    });
    
    button1 = new tau.ui.Button({
      label: 'full',
      styles: {bottom : 0, right: '0'},
      'tap': function (e, payload) {
        dialog.open({dir: that.i % 4});
        that.i++;
      } 
    });
    
    scene.add(new tau.ui.Button({
      label: 'label',
      styles: {width : '50%'},
      'tap': function (e, payload) {
        dialog.open({comp: label, dir: that.i % 4});
        that.i++;
      } 
    }));
    scene.add(label);
    scene.add(dialog);
    scene.add(button1);
    
    
  }
});