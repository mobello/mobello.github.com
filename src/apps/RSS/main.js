/**
 * 
 */
$class('tau.sample.RSS').extend(tau.ui.SequenceNavigator).define({
  init: function () {
    var tableCtrl = new tau.sample.RSSTableController({title: 'Bloter.net'});
    this.setRootController(tableCtrl);
  }
});

/**
 * 
 */
$class('tau.sample.RSSTableController').extend(tau.ui.TableSceneController).define({
  
  /**
   * 
   */
  RSSTableController: function () {
    this.feeds = null;
  },
  
  /**
   * 
   */
  init: function () {
    tau.sample.RSSTableController.$super.init.apply(this, arguments);
    var nav = this.getNavigationBar();
    nav.setBackButtonText('리스트 보기');
  },
  
  /**
   * 
   */
  loadScene: function () {
    var table = new tau.ui.Table({moreCell: true, listSize: 10});
    this.getScene().add(table);
  },
  
  /**
   * 
   * @param start
   * @param size
   * @returns {Number}
   */
  loadModel: function (start, size) {
    var table = this.getTable(),
        url = 'http://feeds.feedburner.com/Bloter?format=xml';
    if (!this.feeds) {
      function loaded(resp) {
        if (resp.status === 200) {
          var doc = resp.responseXML;
          if (!doc) {
            throw new Error('Unable to fetch RSS feed from ' + url);
          }
          this.feeds = doc.getElementsByTagName('item');
          table.addNumOfCells(size);
        } else {
          alert('Error: ' + resp.statusText);
        }
      };
      tau.req({
        'url': url,
        'callbackFn': tau.ctxAware(loaded, this)
      }).send();
    } else {
      size = (start < this.feeds.length) ? size : 0;
      table.addNumOfCells(size);
    }
    return -1;
  },
  
  /**
   * 
   * @param index
   * @param offset
   * @returns {tau.ui.TableCell}
   */
  makeTableCell: function (index, offset) {
    var imgView,
        cell = new tau.ui.TableCell({styleClass: {size: 'auto'}}),
        data = this.feeds[offset + index],
        title = data.getElementsByTagName('title'),
        desc = data.getElementsByTagName('description');
    cell.setTitle(title[0].firstChild.nodeValue);
    cell.setSubTitle(desc[0].firstChild.nodeValue);
    imgView = new tau.ui.ImageView({
      src: 'http://www.feedburner.com/fb/feed-styles/images/itemqube2.gif',
      styles: {width: '16px', height: '16px'}
    });
    cell.setLeftItem(imgView);
    return cell;
  },
  
  /**
   * 
   * @param current
   * @param before
   */
  cellSelected: function (current, before) {
    var path, title, detail,
        table = this.getTable();
    if (current instanceof tau.ui.TableCell) {
      path = table.indexOf(current).pop(); // index is array
      title = (path + 1) + " of " + table.getNumberOfCells();
      detail = new tau.sample.RSSDeatilController({'title': title, 'model': this.feeds[path]});
      this.getParent().pushController(detail); 
    }
  },
  
  /**
   * 
   */
  destroy: function () {
    this.feeds = null;
  }
});

/**
 * RSSFeed sample application class
 */
$class('tau.sample.RSSDeatilController').extend(tau.ui.SceneController).define({
  
  setModel: function (model) {
    this.model = model;
  },

  loadScene: function () { 
    var link = new tau.ui.LinkUrl();
    link.setStyle('height', '60px');
    var title = this.model.getElementsByTagName('title');
    link.setTitle(title[0].firstChild.nodeValue);

    var url = this.model.getElementsByTagName('link');
    link.setUrl(url[0].firstChild.nodeValue);
    
    var creator = this.model.getElementsByTagName('creator');
    var pubDate = this.model.getElementsByTagName('pubDate');
    link.setSubTitle(creator[0].firstChild.nodeValue + '<br/>'+pubDate[0].firstChild.nodeValue);

    var textView = new tau.ui.TextView();  
    textView.setStyle('top', '60px');
    var desc = this.model.getElementsByTagName('encoded');
    textView.setText(desc[0].firstChild.nodeValue);

    // scene에 TextView컴포넌트를 추가한다.
    this.getScene().add(link);
    this.getScene().add(textView); 
  }
});