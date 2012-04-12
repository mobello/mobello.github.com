$class('tau.demo.Hoyeon')
    .extend(tau.ui.SceneController)
    .define(
        {
          Hoyeon: function() {
            this.setTitle('Hoyeon');
          },

          loadScene: function() {
            var scene = this.getScene();
            scene
                .setStyles({
                  background: 'url(http://taitems.github.com/iOS-Inspired-jQuery-Mobile-Theme/ios_inspired/images/tiling_stripes.gif)'
                });

            var label = new tau.ui.Label({
              text: 'TextArea'
            });
            var textArea = new tau.ui.TextArea({
              styles: {
                height: '100px'
              }
            });

            var textView = new tau.ui.TextView({
              styles: {
                'margin-top': '100px',
                height: '100px'
              },
            });
            textView
                .setText('The UITextView class implements the behavior for a scrollable, multiline text region. The class supports the display of text using a custom font, color, and alignment and also supports text editing. You typically use a text view to display multiple lines of text, such as when displaying the body of a large text document.        This class does not support multiple styles for text. The font, color, and text alignment attributes you specify always apply to the entire contents of the text view. To display more complex styling in your application, you need to use a UIWebView object and render your content using HTML.        Managing the Keyboard       When the user taps in an editable text view, that text view becomes the first responder and automatically asks the system to display the associated keyboard. Because the appearance of the keyboard has the potential to obscure portions of your user interface, it is up to you to make sure that does not happen by repositioning any views that might be obscured. Some system views, like table views, help you by scrolling the first responder into view automatically. If the first responder is at the bottom of the scrolling region, however, you may still need to resize or reposition the scroll view itself to ensure the first responder is visible.        It is your application’s responsibility to dismiss the keyboard at the time of your choosing. You might dismiss the keyboard in response to a specific user action, such as the user tapping a particular button in your user interface. To dismiss the keyboard, send the resignFirstResponder message to the text view that is currently the first responder. Doing so causes the text view object to end the current editing session (with the delegate object’s consent) and hide the keyboard.        The appearance of the keyboard itself can be customized using the properties provided by the UITextInputTraits protocol. Text view objects implement this protocol and support the properties it defines. You can use these properties to specify the type of keyboard (ASCII, Numbers, URL, Email, and others) to display. You can also configure the basic text entry behavior of the keyboard, such as whether it supports automatic capitalization and correction of the text.        Keyboard Notifications       When the system shows or hides the keyboard, it posts several keyboard notifications. These notifications contain information about the keyboard, including its size, which you can use for calculations that involve repositioning or resizing views. Registering for these notifications is the only way to get some types of information about the keyboard. The system delivers the following notifications for keyboard-related events:        UIKeyboardWillShowNotification       UIKeyboardDidShowNotification       UIKeyboardWillHideNotification       UIKeyboardDidHideNotification       For more information about these notifications, see their descriptions in UIWindow Class Reference.');

            var activityIndicator = new tau.ui.ActivityIndicator({
              autoStart: 'true',
                message:'Loading...'
            });
            scene.add(label);
            scene.add(textArea);
            scene.add(textView);
            scene.add(activityIndicator);
          },
        });