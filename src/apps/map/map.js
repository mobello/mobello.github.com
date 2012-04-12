$require('http://www.google.com/jsapi?key=AIzaSyA5m1Nc8ws2BbmPRwKu5gFradvD_hgq6G0');

tau.namespace('tau.google.maps', {
  /**
   * @param {String} id
   * @param {Number} latitude
   * @param {Number} longitude
   * @param {Object} [options]
   * @param {String} [options.title]
   * @param {String} [options.icon]
   * @param {Fuction} [options.callback]
   * @param {Object} [options.context]
   */
  loadMaps: function (id, latitude, longitude, options) {
    var that = this;
    
    function initialize() {
      
      var opt = tau.mixin({
        title: null,
        icon: null,
        callback: null,
        context: that,
      }, options, true);
      
      var latlng = new google.maps.LatLng(latitude, longitude),
          myOptions = {
            zoom: 8,  
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          },
          map = new google.maps.Map(tau.util.dom.elementOf(id), myOptions);
      
      new google.maps.Marker({
          position: latlng,
          map: map,
          title: opt.title,
          icon: opt.icon
      });
      
      
      if (opt.callback) {
        opt.callback.call(opt.context);
      }
    }
    
    google.load("maps", "3", {"callback": initialize, other_params: "sensor=false"} );
  }
});