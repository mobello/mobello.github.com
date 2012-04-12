/********************************** IntroduceCotroller part *********************************/
$class('tau.tmpl.coffee.Info').extend(tau.ui.SequenceNavigator).define({
  Info: function (title) {
    this.setTitle('BRAND INFO');   
  },
  
  init: function () {  
    this.setRootController(new tau.tmpl.coffee.Introduce());
  }

});

$class('tau.tmpl.coffee.Introduce').extend(tau.ui.SceneController).define({
  Introduce: function () {
    this.setTitle('Introduce Page');
  },
  
  init: function () {  
    this.appCtx = tau.getCurrentContext(); 
    tau.tmpl.coffee.Introduce.$super.init.apply(this, arguments);
    var uri = tau.getCurrentContext().getRealPath('/info.data'),
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
    var tabMenuBtn, that = this;
    this.totalSegmentedPanels = [this.overviewPanel, this.historyPanel, this.goalPanel, this.servicePanel];  
    this.model = this._model[0];
    
    tabMenuBtn = new tau.ui.SegmentedButton({
      components: [
       {label: 'OVERVIEW'},
       {label: 'HISTORY'},
       {label: 'GOAL'},
       {label: 'SERVICE'}
      ],
      multiple: false,
      maxSelectableCnt: 1,
      selectedIndexes: [0],
      valueChange: function (e, payload) {
        that.makeCell(this.getSelectedIndexes()[0]);
     },
     styles: ({
       width: '100%',
       'font-size' : '12px'
     })
    });
    
    this.getScene().add(tabMenuBtn); 
    
    //default tab
    this.makeCell(0);
    
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
        this.totalSegmentedPanels[0] = new tau.tmpl.coffee.TableTemplateD(this.getScene(), this.model.OVERVIEW_DATA);
        this.totalSegmentedPanels[0].attachTable();
      } else {
        this.totalSegmentedPanels[0].showContent();
      }
    }
    
    else if(pushedNum == 1){
      if(null == this.totalSegmentedPanels[1]){
        this.totalSegmentedPanels[1] = new tau.tmpl.coffee.TableTemplateD(this.getScene(), this.model.HISTORY_DATA);
        this.totalSegmentedPanels[1].attachTable(); 
      }
      else{
        this.totalSegmentedPanels[1].showContent();
      }
    }
    
    else if(pushedNum == 2){
      if(null == this.totalSegmentedPanels[2]){
        this.totalSegmentedPanels[2] = new tau.tmpl.coffee.TableTemplateD(this.getScene(), this.model.GOAL_DATA);
        this.totalSegmentedPanels[2].attachTable(); 
      }
      else{
        this.totalSegmentedPanels[2].showContent();
      }
    }
    
    else if(pushedNum == 3){
      if(null == this.totalSegmentedPanels[3]){
        this.totalSegmentedPanels[3] = new tau.tmpl.coffee.CarouselTemplateA(this.getScene(), this.model.SERVICE_DATA);
        this.totalSegmentedPanels[3].attachCarousel(); 
      }
      else{
        this.totalSegmentedPanels[3].showContent();
      }
    }
  },  
  
  destroy: function () {
    tau.tmpl.coffee.Introduce.$super.destroy.apply(this, arguments);
    this._model = null;
    this._menuData = null;
  } 
});
