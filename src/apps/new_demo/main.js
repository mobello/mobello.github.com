$require('/default.js');
$require('/toolbar.js');
$require('/button.js');
$require('/hoyeon.js');
$require('/table.js');
$require('/groupTable.js');
$class('tau.new_demo.Main').extend(tau.ui.ParallelNavigator).define({

  init: function() {
    var ctrls = [ new tau.new_demo.Form(),
        new tau.new_demo.GroupTable(false),
        new tau.new_demo.GroupTable(true),
        new tau.new_demo.Table(tau.ui.PaginationBar.SLIDER_TYPE),
        new tau.new_demo.Table(tau.ui.PaginationBar.NORMAL_TYPE),
        new tau.demo.Hoyeon(), new tau.new_demo.Toolbar(),
        new tau.new_demo.Button(), ];

    this.appCtx = tau.getCurrentContext();
    this.setControllers(ctrls);

    var tabs = [ { icon : '/star.png', }, { icon : '/star.png', },
                 { icon : '/star.png', }, { icon : '/star.png', },
                 { icon : '/star.png', }, { icon : '/star.png', },
                 { icon : '/star.png', }, { icon : '/star.png', } ];

    var tabBar = this.getTabBar();
    var tabcomps = tabBar.getComponents();
    for (var i = 0, len = tabs.length; i < len; i++) {
      var tabcomp = tabcomps[i];
      var backImage = {
        normal : tabs[i].icon,
        selected : tabs[i].icon,
        disabled : tabs[i].icon,
        highlighted : tabs[i].icon,
      };
      tabcomp.setBackgroundImage(backImage);
      tabcomp.setStyles({
        backgroundRepeat : 'no-repeat',
        backgroundPosition : 'top center',
        fontSize : '70%',
      });
    }
  },
});
