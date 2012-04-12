/********************************** PostingController part *********************************/
$class('tau.tmpl.coffee.Posting').extend(tau.ui.SequenceNavigator).define({
  Posting: function () {
    this.setTitle('게시판');
  },
  
  init: function () {  
    this.setRootController(new tau.tmpl.coffee.Postings());
  }

});

$class('tau.tmpl.coffee.Postings').extend(tau.ui.SceneController).define({
  Postings : function() {
    this.setTitle('Postings');
  },

  init : function() {
    this.appCtx = tau.getCurrentContext();
    tau.tmpl.coffee.Postings.$super.init.apply(this, arguments);
    var uri = tau.getCurrentContext().getRealPath('/posting.data'),
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

  loadScene : function() {
    var tabMenuBtn, that = this;
    this.totalSegmentedPanels = [this.storyPanel, this.photoPanel];
    this.model = this._model[0];
    
    tabMenuBtn = new tau.ui.SegmentedButton({
      components: [ 
        {label: 'STORY'}, 
        {label: 'PHOTO'} 
      ],
      multiple: false,
      maxSelectableCnt: 1,
      selectedIndexes: [0],
      valueChange : function(e, payload) {
        that.makeCell(this.getSelectedIndexes()[0]);
      },
      styles: ({
        width: '100%',
        'font-size' : '12px'
      })
    });

    this.getScene().add(tabMenuBtn);

    // default tab
    this.makeCell(0);
  },

  makeCell : function(pushedNum) {
    var that = this;
    this.selectedIndex = 1;
    
    for(var i=0 ; i<this.totalSegmentedPanels.length ; i++){
      if(this.totalSegmentedPanels[i]){
        this.totalSegmentedPanels[i].hideContent();
      }
    }
    
    if (pushedNum == 0) {
      if (null == this.totalSegmentedPanels[0]) {
        this.totalSegmentedPanels[0] = new tau.tmpl.coffee.TableTemplateD(this.getScene(), this.model.STORY_DATA);
        this.totalSegmentedPanels[0].attachTable();
      } else {
        this.totalSegmentedPanels[0].showContent();
      }
    }
    
    else if(pushedNum == 1){
      if(null == this.totalSegmentedPanels[1]){
        this.totalSegmentedPanels[1] = new tau.tmpl.coffee.CarouselTemplateA(this.getScene(), this.model.PHOTO_DATA);
        this.totalSegmentedPanels[1].attachCarousel(); 
      }
      else{
        this.totalSegmentedPanels[1].showContent();
      }
    }
  },  
  
  destroy: function () {
    tau.tmpl.coffee.Postings.$super.destroy.apply(this, arguments);
    this._model = null;
    this._menuData = null;
  }
});
