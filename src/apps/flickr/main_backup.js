/**
 * Flickr Demo Application
 * 
 * @version 1.0.0
 * @creation 2010. 11. 17.
 * 
 * Copyright 2010 KT Innotz, Inc. All rights reserved. KT INNOTZ
 * PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
$require('/flickritems.js');

/**
 * Main Controller Class. This class is registered config.json 
 * configuration file
 */
$class('tau.sample.fr.Flickr').extend(tau.ui.SequenceNavigator).define({

  init: function () {
    var config = tau.getCurrentContext().getConfig();
    this.url = config.flickrUrl + '?tags=' + config.flickrTags 
      + '&tagmode=any&format=json';
    this.pushController(new tau.sample.fr.ListController(this.url));
  },

  /**
   * frees resource no more needed
   */
  destroy: function (){ 
    this.url = null; 
  }
});

/** 
 * Class for FlickerListController
 */
$class('tau.sample.fr.ListController').extend(tau.ui.SceneController).define({
  /**
   * Default constructor
   */
  ListController: function (url) {
    this.url = url;
    this.flickr = null;
    this.table = null;
  },
  
  /**
   * loads Flickr list scene. In this method request for Flickr is sent using
   * Ajax mechanism.
   */
  loadScene: function () {
    var that = this;
    that.setTitle('Flickr');
    that.table = new tau.ui.Table();
    that.table.setNumberOfData(10);
    that.getScene().add(that.table);

    // callback method when the table object requires date to render its content
    that.table.onDemand(function (data, start, end) {
      var i, count;
      if (that.flickr == null) {
        tau.req({
          type: 'JSONP',
          jsonpCallback:'jsoncallback',
          url: that.url,
          callbackFn: function(resp) {
            if (resp.status === 200) {
              that.flickr = new tau.sample.fr.FlickrItems(resp.responseJSON);
              //that.table.update();
            } else {
              alert('Error: ' + resp.statusText);
            }
          }
        }).send();
      } else {
        count = that.flickr.getCount();
        for (i = start; i < count && i <= end; i++) {
          data.push(that.flickr.getItem(i));
        }
      }
    });
    // call back method when table is loaded and rendered on screen
    that.table.onDraw(function (data, index) {
      var cell = new tau.ui.TableCell();
      cell.setTitle(data.title);
      return cell;
    });
    // when user clicks specific table row
    that.table.onEvent(tau.rt.Event.TAP, function(event, payload) {
      if (event.getSource() instanceof tau.ui.TableCell
          && event.getSource().getPath() != null) { 
        var detailController = new tau.sample.fr.DetailController();
        var item = that.flickr.getItem(event.getSource().getPath());
        detailController.setItem(item);
        that.getParent().pushController(detailController); 
      }
    });
  },
  
  /**
   * Frees resources no longer used
   */
  destroy: function () {
    this.url = null;
    this.flickr = null;
    this.table = null;
  }
});


/**
 * Scene controller for showing Flickr Detail information. 
 */
$class('tau.sample.fr.DetailController').extend(tau.ui.SceneController).define({
  /**
   * set flickr items
   * @param {Object} item flickr individual item
   */
  setItem: function(item) { 
    this._item = item;
  },

  /**
   * Loads Flickr detail scene
   */
  loadScene: function () { 
    this.setTitle(this._item.title);
    
    var link = new tau.ui.LinkUrl();
    link.setStyle('height', '50px');
    link.setTitle(this._item.author);
    var subTitle = this._item.published;
    link.setSubTitle(subTitle);
    link.setUrl(this._item.link);

    var textView = new tau.ui.TextView();  
    textView.setStyles({top: '50px', height : '370px'});
    textView.setText(this._item.description);

    this.getScene().add(link);
    this.getScene().add(textView); 
  },
  
  /**
   * Frees resources no longer used
   */
  destroy: function () {
    this._item = null;
  }
});