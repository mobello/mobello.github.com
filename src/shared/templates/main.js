
$class('tau.tmpl.AppMain').extend(tau.ui.ParallelNavigator).define({

  init: function () {  
    var appCtx = tau.getCurrentContext();
    var config = appCtx.getConfig();
    
    var clazz, ctrls = [];
    for (var i = 0, len = config.templates.length; i < len; i++) {
      clazz = $class.forName(config.templates[i]);
      ctrls.push(new clazz());
    }
    this.setControllers(ctrls);
    
    //FIXME API 미 확정    
    if (config.tabbarImage) {
      
      var tabbar = this.getTabBar();
      var tabs = tabbar.getComponents();
      for ( var index = 0; index < tabs.length; index++) {
        
        if (config.tabbarImage['tab' + index]) {
          var tab = tabs[index];
          var backImgae = {
            normal: config.tabbarImage['tab' + index],
            selected: config.tabbarImage['tab' + index],
            disabled: config.tabbarImage['tab' + index],
            highlighted: config.tabbarImage['tab' + index]
          };
          tab.setBackgroundImage(backImgae);
          tab.setStyles({
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top center'
          });
        }
      }
    }
  },
  
  destroy: function () {
    
  }
});