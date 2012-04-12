$require('/biz.js');
$require('/map.js');

$class('tau.sample.Map').extend(tau.ui.SceneController).define(
{
  init: function () {
    tau.biz.loadData();
  },
  
  sceneLoaded: function () {
    var panel = this.getScene().getComponent('map');
    var context = tau.getCurrentContext(),
        config = context.getConfig();
    tau.google.maps.loadMaps(panel.getId(true), config.latitude, config.longitude, {title: config.name});
  }
});