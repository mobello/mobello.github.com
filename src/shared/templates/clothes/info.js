/**
 * tau.tmpl.chicken.Info 사용자가 입력한 매장정보 및 Google map으로 위치를 표시해주는 템플릿이다 해당 템플릿의 데이터는
 * infoTemplate.json에 다음과 같이 정의되어야 한다.
 * 
 * <pre>
 * { 
 *    icon:아이콘 이미지 파일명,
 *    name: 지점명,
 *    latitude:위도,
 *    longitude:경도,
 *    homepage:모바일홈페이지주소,
 *    tel:전화번호,
 *    details:지점 소개 HTML
 *  }
 * </pre>
 */
$require('http://www.google.com/jsapi?key=AIzaSyA5m1Nc8ws2BbmPRwKu5gFradvD_hgq6G0');

/**
 * 
 */
$class('tau.tmpl.chicken.Info').extend(tau.ui.SequenceNavigator).define({
  /**
   * 
   */
  Info: function () {
    this.setTitle('매장 정보');
  },

  /**
   * 
   */
  init : function () {
    this.setRootController(new tau.tmpl.chicken.InfoDetail());
  }
});

/**
 * 
 */
$class('tau.tmpl.chicken.InfoDetail').extend(tau.ui.SceneController).define({
  /**
   * 
   */
  InfoDetail: function () {
    this.setTitle('매장정보');
  },

  /**
   * 
   */
  init: function () {
    tau.tmpl.chicken.InfoDetail.$super.init.apply(this, arguments);
    var uri = tau.getCurrentContext().getRealPath('/info.data'),
        handler = tau.ctxAware(this._handleDataResponse, this);
    tau.req({async: false}).send(uri, handler);
  },

  /**
   * 
   * @param resp
   */
  _handleDataResponse: function (resp) {
    if (resp.status === 200) {
      this._model = tau.parse(resp.responseText);
    } else {
      throw new Error('Can not fetch data: ' + uri);
    }
  },
  
  /**
   * 
   */
  sceneLoaded: function () {
    var panel = this.getScene().getComponent('map');
    if (panel) {
      var map = new tau.sample.google.Maps({
        id: panel.getId(true),
        latitude: this._model.latitude,
        longitude: this._model.longitude,
        options: {
          title : this._model.name,
          icon : this._model.icon
        }});
      map.load();
    }
  }
});

/**
 * 
 */
$class('tau.sample.google.Maps').define({
  
  /**
   * 
   * @param id
   */
  setId: function (id) {
    this.id = id;
  },
  
  /**
   * 
   * @param latitude
   */
  setLatitude: function (latitude) {
    this.latitude = latitude;
  },
  
  /**
   * 
   * @param longitude
   */
  setLongitude: function (longitude) {
    this.longitude = longitude;
  },
  
  /**
   * 
   * @param options
   */
  setOptions: function (options) {
    this.options = options;
  },
  
  /**
   * @private
   */
  _callbackHandler: function () {
    var opt = tau.mixin({
      title: null,
      icon: null,
      callback: null
    }, this.options, true);
    var latlng = new google.maps.LatLng(this.latitude, this.longitude);
    var myOptions = {
        zoom: 16,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(tau.util.dom.elementOf(this.id), myOptions);
    new google.maps.Marker({
      position: latlng,
      map: map,
      title: opt.title
    // , icon : 'img/'+opt.icon
    });
  },
  
  /**
   * 
   */
  load: function() {
    google.load("maps", "3", {
      "callback": tau.ctxAware(this._callbackHandler, this),
      other_params: "sensor=false"
    });
  }
});