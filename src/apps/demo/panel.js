/**
 * ScrollPanel
 */
$class('tau.demo.ScrollPanel').extend(tau.ui.ParallelNavigator).define( {

  init: function () {
    this.setControllers([new tau.demo.ScrollPanelSimple() 
    ,new tau.demo.ScrollPanelPullToRefresh()
    ]);
  }
});

$class('tau.demo.ScrollPanelSimple').extend(tau.ui.SceneController).define( {

  ScrollPanelSimple: function (){
    // 탭바 타이틀을 설정한다.
    this.setTitle('simple');
  },
  
  init: function () {
    // 현재 앱의 컨텍스트 정보를 가져온다.
    this.appCtx = tau.getCurrentContext();
  },
  
  loadScene: function (){
    // ScrollPanel 컴포넌트를 생성한다.
    var height = tau.getHeight() / 2,
        width = tau.getWidth(),
        hpanel = new tau.ui.ScrollPanel({
          vScroll : false,
          styles: {width : '100%', height : '50%', display: 'block'}}), 
        vpanel = new tau.ui.ScrollPanel({
          hScroll : false,
          styles: {backgroundColor : 'black', width : '100%', height : '50%'}});
        
    // scene에 ScrollPanel 컴포넌트를 추가한다.
    this.getScene().add(vpanel);
    this.getScene().add(hpanel);
        
    // ScrollPanel에 컴포넌트를 추가해서 스크롤이 생기도록 한다.
    for(var i=0, j=1; i < 10; i++, j++){
      vpanel.add(new tau.ui.ImageView({
        src : '/img/' + j + '.jpg',
        styles : {width : width * 0.9 + 'px', height : height * 0.5 + 'px', margin : '10px 5px'}})
      );
      var x = i * width * 0.7 + i * 10;
      hpanel.add(new tau.ui.ImageView({
        src: '/img/' + j + '.jpg',
        styles: {width : width * 0.7  + 'px', height : height * 0.9 + 'px', left : x  + 'px', top : 0, margin : '5px 10px'}})
      );
    }
  }
});

$class('tau.demo.ScrollPanelPullToRefresh').extend(tau.ui.SceneController).define( {

  ScrollPanelPullToRefresh: function (){
    // 탭바 타이틀을 설정한다.    
    this.setTitle('PullToRefresh');
  },
  
  init: function () {
    // 현재 앱의 컨텍스트 정보를 가져온다.
    this.appCtx = tau.getCurrentContext();
  },
  
  makeVPanelItem: function (height, width, index){
    var that = this;
    that.vpanel.add(new tau.ui.ImageView({
      src : '/img/' + (index + 1) + '.jpg',
      styles : {width : width * 0.9 + 'px', height : height * 0.5 + 'px', margin : '10px 5px'}})
    , 0);
  },
  
  makeHPanelItem: function (height, width, index){
    var that = this, 
        x = index * width * 0.7 + index * 10;
    that.hpanel.add(new tau.ui.ImageView({
      src: '/img/' + (index + 1) + '.jpg',
      styles: {width : width * 0.7  + 'px', height : height * 0.9 + 'px', left : x  + 'px', top : 0, margin : '5px 10px'}})
    , 0);
  },
  
  loadScene: function (){
    // ScrollPanel 컴포넌트를 생성한다.
    // TODO : innerWidth, innerHeight TAU Framework에서 제공해주어야함.
    var that = this,
        vIndex, 
        hIndex,
        height = window.innerHeight / 2,
        width = window.innerWidth;
    
    that.vpanel = new tau.ui.ScrollPanel({
      hScroll : false, 
      pullToRefresh: 'down', 
      pullDownFn: function (){
        if (vIndex < 9) {
          that.makeVPanelItem(height, width, vIndex++);
          that.makeVPanelItem(height, width, vIndex++);
          that.makeVPanelItem(height, width, vIndex++);
          that.getScene().update();
        }
        that.vpanel.refresh();
      },
      styles: {backgroundColor : 'black', width : '100%', height : '50%'}
    });
    
    that.hpanel = new tau.ui.ScrollPanel({
      vScroll : false, 
      pullToRefresh: 'up', 
      pullUpFn: function (){
        if (hIndex < 9) {
          that.makeHPanelItem(height, width, hIndex++);
          that.makeHPanelItem(height, width, hIndex++);
          that.makeHPanelItem(height, width, hIndex++);
          that.getScene().update();
        }
        that.hpanel.refresh();
      },
      styles: {width : '100%', height : '50%'}
    });

    // scene에 ScrollPanel 컴포넌트를 추가한다.
    that.getScene().add(that.vpanel);
    that.getScene().add(that.hpanel);
        
    // ScrollPanel에 컴포넌트를 추가해서 스크롤이 생기도록 한다.
    for(var i=0, j=1; i < 3; i++, j++){
      that.makeVPanelItem(height, width, i);
      that.makeHPanelItem(height, width, i);
    }
    vIndex = 3;
    hIndex = 3;
  }
});

/**
 * Table application class
 */
$require('/table1data.js');
$class('tau.demo.Table').extend(tau.ui.ParallelNavigator).define({
  
  init: function () {
    this.setControllers([new tau.demo.Simple() 
    ,new tau.demo.Group()
    ,new tau.demo.PaginationDefault()
    ,new tau.demo.PaginationSlider()
    ,new tau.demo.PullToRefresh()
    ]);
  }
});

$class('tau.demo.Simple').extend(tau.ui.SceneController).define({
  
  Simple: function () {
    this.setTitle('simple');
  },
  
  init: function () {
    this.appCtx = tau.getCurrentContext();   // 현재 앱의 컨텍스트 정보를 가져온다.
  },
  
  loadScene: function () {
    var that = this;
    that.table = new tau.ui.Table({
      headerItem: new tau.ui.Label({text: 'Scientific name: Amphibia'}),
      footerItem: new tau.ui.ImageView({
        src : '/img/' + 'main_bug.jpg',
        styles : {width : '50%', height : '100%', backgroundSize : '100% 100%'}
      }),
      styles: {
        cellLeftItemWidth: '20%'
      }
    });

    
    that.getScene().add(that.table);
    for(var i=0, length = DATA.length; i < length; i++) {
      var cell = new tau.ui.TableCell({
        title: DATA[i].title,
        subTitle: DATA[i].group,
        leftItem: new tau.ui.ImageView({
          src : '/img/' + DATA[i].image, 
          styles : {backgroundSize : 'auto'}})
      });
      if (i == 0) {
        cell.setStyles({
          cellLeftItemWidth: '30%'
        });
      }
      that.table.add(cell);
    }
  }
});

$class('tau.demo.Group').extend(tau.ui.SceneController).define({
  
  Group: function () {
    this.setTitle('Group');
  },
  
  init: function () {
    this.appCtx = tau.getCurrentContext();   // 현재 앱의 컨텍스트 정보를 가져온다.
  },
  
  loadScene: function () {
    var table = new tau.ui.Table({
      group: true, 
      foldable: true,
      foldedSections: ['BBC']
    });
    this.getScene().add(table);
    
    table.add(new tau.ui.TableCell({title: 'Top News story', groupName: 'BBC'}));
    table.add(new tau.ui.TableCell({title: 'Technology of Business', groupName: 'BBC'}));
    
    table.add(new tau.ui.TableCell({title: 'Latest news', groupName: 'CNN'}));
    table.add(new tau.ui.TableCell({title: '시청자와 함께하는', groupName: 'KBS'}));
  }
});

$class('tau.demo.PaginationDefault').extend(tau.ui.SceneController).define({
  
  PaginationDefault: function () {
    this.setTitle('page default');
  },
  
  init: function () {
    this.appCtx = tau.getCurrentContext();   // 현재 앱의 컨텍스트 정보를 가져온다.
  },
  
  loadScene: function () {
    var table = new tau.ui.Table({pagination : {pageSize : 5, dock : tau.ui.PaginationBar.BOTTOM_DOCK}});
    table.setHeaderItem('header');
    table.setFooterItem('footer');
    
    this.getScene().add(table);
    // setTotalCount를 명시적으로 호출해야함. 그렇지 않은 경우 페이지네이션이 제대로 동작하지 않음. 
    // TODO : 설정하지 않은 경우 이전, 다음만 보여주도록 처리?
    //table.setTotalCount(94);
    for(var i=0, j=1; i < 94; i++, j++){
      var cell = new tau.ui.TableCell();
      cell.setTitle(j);
      table.add(cell);
    }
  }
});

$class('tau.demo.PaginationSlider').extend(tau.ui.TableSceneController).define({
  
  PaginationSlider: function () {
    this.setTitle('page slider');
  },
  
  init: function () {
    this.appCtx = tau.getCurrentContext();   // 현재 앱의 컨텍스트 정보를 가져온다.
  },
  
  loadScene: function () {
    var table = new tau.ui.Table({pagination : {
      type: tau.ui.PaginationBar.SLIDER_TYPE, dock : tau.ui.PaginationBar.LEFT_DOCK}});
    
    this.getScene().add(table);
  },
  
  /**
   * loads model to display content on the table component
   * @param {Number} start start index(inclusive 0)
   * @param {Number} size the number of cells to display  on the current page
   * @returns {Number} the number of cells to load
   */
  loadModel: function () {
    return 94;
  },
  
  /**
   * Create table cell object and returns that 
   * @param {Number} index current index of the model at which the table cell
   * object is created. 
   * @param {Number} offset the offset from the beginning   
   * @returns {tau.ui.TableCell} newly created TabelCell object
   */
  makeTableCell: function (index, offset) {
    return new tau.ui.TableCell({title: (index + offset)});
  }
});


$class('tau.demo.PullToRefresh').extend(tau.ui.SceneController).define({
  
  PullToRefresh: function () {
    this.setTitle('pullToRefresh');
  },
  
  init: function () {
    this.appCtx = tau.getCurrentContext();   // 현재 앱의 컨텍스트 정보를 가져온다.
  },
  
  loadScene: function () {
    var that = this, index = 0, prevIndex = 999;
    that.table = new tau.ui.Table({
      pullToRefresh: 'both',
      
      pullDownFn: function () {
        for(var j=0; j < 3; j++, index++) {
          that.table.add(new tau.ui.TableCell({title : index + ' cell'}), 0);
        }
        that.getScene().update();
      },
      
      pullUpFn: function () {
        if (prevIndex > 0) {
          for(var j=0; j < 3 && prevIndex > 0; j++, prevIndex--){
            that.table.add(new tau.ui.TableCell({title : prevIndex + ' cell'}));
          }
          that.getScene().update();
        }
      }
    });
    that.getScene().add(that.table);

    for(var i=0, index=1000; i < 5; i++, index++){
      var cell = new tau.ui.TableCell();
      cell.setTitle(index + ' cell');
      that.table.add(cell, 0);
    }
  }
});

/**
 * TextView
 */
$class('tau.demo.TextView').extend(tau.ui.SceneController).define( {
  loadScene: function () {
    // TextView 컴포넌트를 생성한다.
    var textView = new tau.ui.TextView();
    // 크기를 지정한다.
    textView.setStyles({width : '320px', height : '300px'});
    // 텍스트를 설정한다.
    textView.setText('The UITextView class \nimplements the behavior for a scrollable, multiline text region. \nThe class supports the display of text using a custom font, \ncolor, and alignment and also supports text editing. You typically use a text view to display multiple lines of text, such as when displaying the body of a large text document.        This class does not support multiple styles for text. The font, color, and text alignment attributes you specify always apply to the entire contents of the text view. To display more complex styling in your application, you need to use a UIWebView object and render your content using HTML.        Managing the Keyboard       When the user taps in an editable text view, that text view becomes the first responder and automatically asks the system to display the associated keyboard. Because the appearance of the keyboard has the potential to obscure portions of your user interface, it is up to you to make sure that does not happen by repositioning any views that might be obscured. Some system views, like table views, help you by scrolling the first responder into view automatically. If the first responder is at the bottom of the scrolling region, however, you may still need to resize or reposition the scroll view itself to ensure the first responder is visible.        It is your application’s responsibility to dismiss the keyboard at the time of your choosing. You might dismiss the keyboard in response to a specific user action, such as the user tapping a particular button in your user interface. To dismiss the keyboard, send the resignFirstResponder message to the text view that is currently the first responder. Doing so causes the text view object to end the current editing session (with the delegate object’s consent) and hide the keyboard.        The appearance of the keyboard itself can be customized using the properties provided by the UITextInputTraits protocol. Text view objects implement this protocol and support the properties it defines. You can use these properties to specify the type of keyboard (ASCII, Numbers, URL, Email, and others) to display. You can also configure the basic text entry behavior of the keyboard, such as whether it supports automatic capitalization and correction of the text.        Keyboard Notifications       When the system shows or hides the keyboard, it posts several keyboard notifications. These notifications contain information about the keyboard, including its size, which you can use for calculations that involve repositioning or resizing views. Registering for these notifications is the only way to get some types of information about the keyboard. The system delivers the following notifications for keyboard-related events:        UIKeyboardWillShowNotification       UIKeyboardDidShowNotification       UIKeyboardWillHideNotification       UIKeyboardDidHideNotification       For more information about these notifications, see their descriptions in \nUIWindow Class Reference.');
    // scene에 TextView 컴포넌트를 추가한다.
    this.getScene().add(textView);
  }
});

/**
 * Carousel
 */
$class('tau.demo.Carousel').extend(tau.ui.SceneController).define(
{
  loadScene: function() {
 // 수평, 수직 방향의 Carousel 컴포넌트를 생성한다.
    var carousel1 = new tau.ui.Carousel({vertical : true}),
        carousel2 = new tau.ui.Carousel(),
        panel1 = new tau.ui.Panel(),
        panel2 = new tau.ui.Panel(),
        panel3 = new tau.ui.Panel(),
        panel4 = new tau.ui.Panel(),
        panel5 = new tau.ui.Panel(),
        panel6 = new tau.ui.Panel(),
        panel7 = new tau.ui.Panel();
    
    // 높이, 위치를 지정해 준다.
    carousel1.setStyles({'top' : '0px', 'height' : '50%'});
    carousel2.setStyles({'top' : '50%', 'height' : '50%'});
    
    // Panel 컴포넌트의 배경색을 지정한다.
    panel1.setStyle('backgroundColor', 'red');
    panel1.setComponents([ new tau.ui.Button({label: '12222222222222222222222222222222222222'})
                          ]);
    panel2.setStyle('backgroundColor', 'orange');
    panel3.setStyle('backgroundColor', 'yellow');
    panel4.setStyle('backgroundColor', 'green');
    
    panel5.setStyle('backgroundColor', 'blue');
    panel6.setStyle('backgroundColor', 'indigo');
    panel7.setStyle('backgroundColor', 'violet');
    
    // Carousel 컴포넌트에 Panel 컴포넌트를 추가한다.
    carousel1.setComponents([panel1, panel2, panel3, panel4]);
    carousel2.setComponents([panel5, panel6, panel7]);
    // scene에 Carousel 컴포넌트를 추가한다.
    this.getScene().add(carousel1);
    this.getScene().add(carousel2);
  }
});