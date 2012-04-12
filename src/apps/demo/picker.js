/**
 * Picker
 */
$class('tau.demo.Picker').extend(tau.ui.SceneController).define(
    {
      init : function() {
        this.appCtx = tau.getCurrentContext(); // 현재 앱의 컨텍스트 정보를 가져온다.
      },

      loadScene : function() {
        var that = this;

        var picker = new tau.ui.Picker();
        var showMore = screen.width > 320 && screen.height > 480;
        var redSlot = picker.addSlot(null, {
          begin : 0,
          end : 255,
          prefix : "R" + (showMore ? "ed" : "") + "(",
          postfix : ")",
          highlight : 189
        });
        var greenSlot = picker.addSlot(null, {
          begin : 0,
          end : 255,
          prefix : "G" + (showMore ? "reen" : "") + "(",
          postfix : ")",
          highlight : 19
        });
        var blueSlot = picker.addSlot(null, {
          begin : 0,
          end : 255,
          prefix : "B" + (showMore ? "lue" : "") + "(",
          postfix : ")",
          highlight : 89
        });

        var dummySlot, fakeSlot, separatorSlot;

        picker.onEvent(tau.rt.Event.TAP, function(e, payload){
          if (payload && payload.buttonType) {
            if(payload.buttonType == tau.ui.Picker.DONE_BUTTON){
              console.log("DONE");
            }else if(payload.buttonType == tau.ui.Picker.CANCEL_BUTTON){
              console.log("CANCEL");              
            }
          }
        });
        
        picker.onEvent(tau.rt.Event.VALUECHANGE, function(e,payload) {          
          var slotIndex = payload.slotIndex;
          var v = payload.values;
          var t = payload.texts;
          console.log(v);
          that.changeColor(v[0], v[1], v[2]);          
        });
        that.getScene().add(picker);

        var toolbar = new tau.ui.ToolBar();

        var buttonOpen = new tau.ui.Button();
        buttonOpen.setLabel("Open RGB");
        buttonOpen.onEvent(tau.rt.Event.TAP, function() {
          picker.open();
        });

        var buttonAddSlot = new tau.ui.Button();
        buttonAddSlot.setLabel("Add Slot");
        buttonAddSlot.onEvent(tau.rt.Event.TAP, function() {
          if (picker.size > 4) {
            tau.alert("that's enough.");
            return;
          }
          if (picker.size == 3) {
            dummySlot = picker.addSlot({
              dummy1 : "dummy1",
              dummy2 : "dummy2",
              dummy3 : "dummy3",
              dummy4 : "dummy4"
            });
          } else if (picker.size == 4) {
            fakeSlot = picker.addSlot({
              fake1 : "fake1",
              fake2 : "fake2",
              fake3 : "fake3",
              fake4 : "fake4"
            });
          }
        });

        var buttonAddSeparator = new tau.ui.Button();
        buttonAddSeparator.setLabel("Separator");
        buttonAddSeparator.onEvent(tau.rt.Event.TAP, function() {
          if (picker.size > 4) {
            tau.alert("that's enough.");
            return;
          }
          separatorSlot = picker.addSeparator("$");
        });

        var buttonRemoveSlot = new tau.ui.Button();
        buttonRemoveSlot.setLabel("remove slot");
        buttonRemoveSlot.onEvent(tau.rt.Event.TAP, function() {
          if (picker.size < 4) {
            tau.alert("that's enough.");
            return;
          }
          var slotID = undefined;

          tau.prompt("input slot number to delete.[4~" + (picker.size) + "]", {
            title : 'delete?',
            placeholderLabel : '4',
            callbackFn : function(returnVal) {
              try {
                slotID = parseInt(returnVal) - 1;
                if (tau.isNumber(slotID) && slotID > 2) {
                  picker.removeSlot(slotID);
                }
              } catch (exx) {
                slotID = undefined;
                tau.log.debug(ex);
              }
            }
          });

        });

        var buttonDisable = new tau.ui.Button();
        buttonDisable.setLabel("disable");
        buttonDisable.onEvent(tau.rt.Event.TAP, function() {
          picker.setDisabledItem(0, 0, 2);
          picker.setDisabledItem(0, 54, 1);
          picker.setDisabledItem(0, 35, 15);
          picker.setDisabledItem(0, 99, 2);
          picker.setDisabledItem(1, 0, 1);
          picker.setDisabledItem(1, 55, 12);
          picker.setDisabledItem(1, 93, 1);
          picker.setDisabledItem(1, 159, 50);
          picker.setDisabledItem(1, 204, 50);
          picker.setDisabledItem(2, 0, 11);
          picker.setDisabledItem(2, 23, 1);
          picker.setDisabledItem(2, 123, 40);
          picker.setDisabledItem(2, 223, 11);
        });
        
        
        var buttonGetValues = new tau.ui.Button();
        buttonGetValues.setLabel("values");
        buttonGetValues.onEvent(tau.rt.Event.TAP, function() {
          tau.alert(picker.getValues());
        });

        var buttonGetTexts = new tau.ui.Button();
        buttonGetTexts.setLabel("texts");
        buttonGetTexts.onEvent(tau.rt.Event.TAP, function() {
          tau.alert(picker.getTexts());
        });

        var buttonMoveTo = new tau.ui.Button();
        buttonMoveTo.setLabel("cherry");
        buttonMoveTo.onEvent(tau.rt.Event.TAP, function() {
          // that.changeColor(toolbar, 255,255,0);
          if (!picker.isOpened()) {
            tau.alert("please, open the picker.");
            return;
          }
          picker.spinTo(redSlot, 189);
          picker.spinTo(greenSlot, 19);
          picker.spinTo(blueSlot, 89);
        });

        toolbar.add(buttonOpen);
        toolbar.add(buttonAddSlot);
        toolbar.add(buttonAddSeparator);
        toolbar.add(buttonDisable);
        toolbar.add(buttonRemoveSlot);
        toolbar.add(buttonGetValues);
        toolbar.add(buttonGetTexts);
        toolbar.add(buttonMoveTo);
        this.getScene().add(toolbar);

        var toolbar3 = new tau.ui.ToolBar({dock: 'bottom'});
        toolbar3.add(new tau.ui.Button({label : 'btn1'}));
        toolbar3.add(new tau.ui.Button({label : 'btn2'}));
        this.getScene().add(toolbar3);
        
        this.getScene().setStyles({
          backgroundColor : "#000000"
        });
      },
      changeColor : function(red, green, blue) {
        var hexValue = this.colorToHex('rgb(' + red + ', ' + green + ', '
            + blue + ')');
        // toolbar.setBackgroundColor({normal:hexValue});
        this.getScene().setStyles({
          backgroundColor : hexValue
        });
      },

      colorToHex : function(color) {
        if (color.substr(0, 1) === '#') {
          return color;
        }
        var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

        var red = parseInt(digits[2]);
        var green = parseInt(digits[3]);
        var blue = parseInt(digits[4]);

        var rgb = blue | (green << 8) | (red << 16);

        var padded = rgb.toString(16) + "";

        for ( var i = 6 - padded.length; i > 0; i--) {
          padded = "0" + padded;
        }
        return digits[1] + '#' + padded;
      }
    });