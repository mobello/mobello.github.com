/********************************** MenuController part **********************************/
$class('tau.tmpl.coffee.Menu').extend(tau.ui.SequenceNavigator).define({
  Menu : function(title) {
    this.setTitle('coffee MENU');
  },

  init : function() {
    this.appCtx = tau.getCurrentContext();
    var config = tau.getCurrentContext().getConfig();
    
    var couponBtn = new tau.ui.Button({
      styleClass : {
        shape : 'red'
      },
      label : 'COUPON'
    });
    
    var that = this; 
    couponBtn.onEvent(tau.rt.Event.TAP, function (event) {
      that.getParent().setIndex(1);   
      that.appCtx.setStorage('couponBtn', 'COUPON', 'clicked');
    });
    
    var menusScene = new tau.tmpl.coffee.Menus();
    menusScene.getNavigationBar().setRightItem(couponBtn);
    this.setRootController(menusScene);
  }
});

$class('tau.tmpl.coffee.Menus').extend(tau.ui.SceneController).define({
  Menus: function () {
    this.setTitle('coffee MENUS');
  },
  
  init: function () {  
    this.appCtx = tau.getCurrentContext(); 
    tau.tmpl.coffee.Menus.$super.init.apply(this, arguments);
    var uri = tau.getCurrentContext().getRealPath('/menu.data'),
        handler = tau.ctxAware(this._handleDataResponse, this);
    tau.req({async: false}).send(uri, handler); 
    this._menuData = null;
  },
  
  _handleDataResponse: function (resp) {
    if (resp.status === 200) {
      this._model = tau.parse(resp.responseText);
    } else {
      throw new Error('Can not fetch data: ' + uri);
    }
  },
 
  loadScene: function () {
    var that = this;     
    this.totalSegmentedPanels = [this.best, this.newPanel, this.all];    
    this.model = this._model[0];
 
    this.welcomeImage = new tau.ui.ImageView({
      src : '/img/welcomeImg.png',
      styles : {
        width : '100%',
        height : '100%',
        backgroundSize : '100% 100%'
      }
    });
    
    this.inputButton = new tau.ui.Button({
      label : 'ENTER',
      styles : {
        height : '10%',
        width : '40%',
        top : '75%',
        left : '30%',
        'font-size' : '26px',
        'border-radius' : '30px'
      }
    });
    
    this.inputButton.onEvent(tau.rt.Event.TAP, function (event) {
      that.getScene().remove(that.welcomeImage);
      that.getScene().remove(that.inputButton);

      that.tabMenuBtn;
      
      that.tabMenuBtn = new tau.ui.SegmentedButton({
        components: [
         {label: 'BEST top10'},
         {label: ' NEW menu '},
         {label: ' ALL menu '}
        ],
        multiple: false,
        maxSelectableCnt: 1,
        selectedIndexes: [0],
        valueChange: function (e, payload) {
           that.makeCell(this.getSelectedIndexes()[0]);
        },
        styles: {
         width: '100%'
        }
      });
  
      that.getScene().add(that.tabMenuBtn);  
      
      //default tab
      that.makeCell(0);
    });   
    
    this.getScene().setStyles({
      'background-image' : 'url(/img/coffee1.jpg)',
      'background-repeat': 'no-repeat',
      backgroundSize: '100% 100%'
    });
    
    this.getScene().add(this.welcomeImage);
    this.getScene().add(this.inputButton);

    },
        
    makeCell: function (pushedNum) {
      var that = this;
            
      for(var i=0 ; i<this.totalSegmentedPanels.length ; i++){
        if(this.totalSegmentedPanels[i]){
          this.totalSegmentedPanels[i].hideContent();
        }
      }
     
      if (pushedNum == 0) {
        if (null == this.totalSegmentedPanels[0]) {
          this.totalSegmentedPanels[0] = new tau.tmpl.coffee.TableTemplateC(this.getScene(), this.model.BEST_DATA);
          this.totalSegmentedPanels[0].attachTable(this.getParent(),'tau.tmpl.coffee.MenuDetailPage');
        } else {
          this.totalSegmentedPanels[0].showContent();
        }
      }
      
      else if(pushedNum == 1){
        if(null == this.totalSegmentedPanels[1]){
          this.totalSegmentedPanels[1] = new tau.tmpl.coffee.CarouselTemplateA(this.getScene(), this.model.NEW_DATA);
          this.totalSegmentedPanels[1].attachCarousel(); 
        }
        else{
          this.totalSegmentedPanels[1].showContent();
        }
      }
      
      else if(pushedNum == 2){
        if(null == this.totalSegmentedPanels[2]){
          this.totalSegmentedPanels[2] = new tau.tmpl.coffee.TableTemplateC(this.getScene(), this.model.ALL_DATA);
          this.totalSegmentedPanels[2].attachTable(this.getParent(), 'tau.tmpl.coffee.MenuDetailPage'); 
        }
        else{
          this.totalSegmentedPanels[2].showContent();
        }
      }      
    },  
    
    destroy: function () {
      tau.tmpl.coffee.Menus.$super.destroy.apply(this, arguments);
      this._model = null;
      this._menuData = null;
    }
});
