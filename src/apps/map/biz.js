tau.namespace('tau.biz', {
  // URL: 'http://www.ktinnotz.com/data?app=${app}&version=${version}',
  loadData: function (context, callbackFn) {
    context = context || tau.getCurrentContext();
    var uri = context.getRealPath('/data.json'),
        config = context.getConfig();
    
    uri = uri.split('${app}').join(config.title);
    uri = uri.split('${version}').join(config.version);
    
    var req = tau.req({async: false});
    req.send(uri, function(resp) {
      if (resp.status === 200) {
        tau.mixin(config, tau.parse(resp.responseText));
        if (callbackFn) callbackFn();
      }
    });      
  }
});