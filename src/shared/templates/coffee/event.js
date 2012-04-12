/********************************** EventController part **********************************/
$class('tau.tmpl.coffee.Event').extend(tau.ui.SequenceNavigator).define({
  Event: function () {
    this.setTitle('EVENT');
  },
  
  init: function () {  
    this.setRootController(new tau.tmpl.coffee.Events());
  }

});

$class('tau.tmpl.coffee.Events').extend(tau.ui.SceneController).define({
  Events: function () {
    this.setTitle('EVENTS');
  },
  
  init: function () {  
    this.appCtx = tau.getCurrentContext(); 
    tau.tmpl.coffee.Events.$super.init.apply(this, arguments);
    var uri = tau.getCurrentContext().getRealPath('/event.data'),
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
    this.totalSegmentedPanels = [this.eventPanel, this.noticePanel, this.resultPanel, this.couponPanel];       
    this.model = this._model[0];
    
    that.tabMenuBtn;
    that.tabMenuBtn = new tau.ui.SegmentedButton({
      components: [
       {label: 'EVENT'},
       {label: 'NOTICE'},
       {label: 'RESULT'},
       {label: 'COUPON'}
       ],
      multiple: false,
      maxSelectableCnt: 1,
      selectedIndexes: [0],
      valueChange: function (e, payload) {
        that.makeCell(this.getSelectedIndexes()[0]);
     },
     styles: ({
       width : '100%'
     })
    });
    
    this.getScene().add(that.tabMenuBtn); 
    
    if(this.appCtx.getStorage('couponBtn', 'clicked') == 'COUPON'){    
      that.tabMenuBtn.select(3);  
      that.makeCell(3);
      
      this.appCtx.removeStorage('couponBtn', 'clicked');  
    }
    else{
      //default tab
      that.makeCell(0);
    } 
  },
  
  
  makeCell: function (pushedNum) {
    var that = this;
    
    for(var i=0 ; i<this.totalSegmentedPanels.length ; i++){
      if(this.totalSegmentedPanels[i]){
        this.totalSegmentedPanels[i].hideContent();
      }
    }   

    if(pushedNum == 0){
      if (null == this.totalSegmentedPanels[0]) {
        this.totalSegmentedPanels[0] = new tau.tmpl.coffee.TableTemplateC(this.getScene(), this.model.EVENT_DATA);
        this.totalSegmentedPanels[0].attachTable(this.getParent(),'tau.tmpl.coffee.EventDetailPage');
      } else {
        this.totalSegmentedPanels[0].showContent();
      }
    }

    else if(pushedNum == 1){
      if (null == this.totalSegmentedPanels[1]) {
        this.totalSegmentedPanels[1] = new tau.tmpl.coffee.TableTemplateC(this.getScene(), this.model.NOTICE_DATA);
        this.totalSegmentedPanels[1].attachTable(this.getParent(),'tau.tmpl.coffee.EventDetailPage');
      } else {
        this.totalSegmentedPanels[1].showContent();
      }
    }
    
    else if(pushedNum == 2){
      if (null == this.totalSegmentedPanels[2]) {
        this.totalSegmentedPanels[2] = new tau.tmpl.coffee.TableTemplateC(this.getScene(), this.model.RESULT_DATA);
        this.totalSegmentedPanels[2].attachTable(this.getParent(),'tau.tmpl.coffee.EventDetailPage');
      } else {
        this.totalSegmentedPanels[2].showContent();
      }
    }
    
    else if(pushedNum == 3){
      if (null == this.totalSegmentedPanels[3]) {
        this.totalSegmentedPanels[3] = new tau.tmpl.coffee.TableTemplateC(this.getScene(), this.model.COUPON_DATA);
        this.totalSegmentedPanels[3].attachTable(this.getParent(),'tau.tmpl.coffee.CouponDetailPage');
      } else {
        this.totalSegmentedPanels[3].showContent();
      }
    }
  },  
  
  destroy: function () {
    tau.tmpl.coffee.Events.$super.destroy.apply(this, arguments);
    this._model = null;
    this._menuData = null;
  }
});

