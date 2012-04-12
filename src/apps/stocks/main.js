/**
 * Stocks Demo Application
 * 
 * @version 1.0.0
 * @creation 2012. 3. 27.
 */

/**
 * Main Controller Class. This class is registered config.json 
 * configuration file
 */
$require('/setting.js');
$class('tau.stocks.MainController').extend(tau.ui.SceneController).define({
  
  $static: {
    addStockStorage: function (stock) {
      var stockList = tau.stocks.MainController.getStockListFromStorage() || [];
      stockList.push(stock);
      tau.stocks.MainController.setStockListToStorage(stockList);
    },
    
    getStockListFromStorage: function () {
      var ctx = tau.getCurrentContext();
      var stockList = ctx.getStorage('$stockList');
      
      if (!stockList) {
        var config = ctx.getConfig();
        ctx.setStorage('$stockList', config.STOCK_LIST);
      }
      return ctx.getStorage('$stockList');
    },
    
    getStockValueTypeFromStorage: function () {
      var ctx = tau.getCurrentContext();
      var stockValueType = ctx.getStorage('$stockValueType');
      
      if (tau.isUndefined(stockValueType)) {
        var config = ctx.getConfig();
        ctx.setStorage('$stockValueType', config.STOCK_VALUE_TYPE);
      }
      return ctx.getStorage('$stockValueType');
    },
    
    setStockListToStorage: function (list) {
      var ctx = tau.getCurrentContext();
      ctx.setStorage('$stockList', list);
    },
    
    setStockValueTypeToStorage: function (type) {
      var ctx = tau.getCurrentContext();
      ctx.setStorage('$stockValueType', type || '0');
    },
    
    removeStockStorage: function (symbol) {
      var stockList = tau.stocks.MainController.getStockListFromStorage();
      for(var i=0, len = stockList.length; i < len; i++) {
        if (stockList[i].symbol === symbol) {
          stockList.splice(i);
          break;
        }
      }
      tau.stocks.MainController.setStockListToStorage(stockList);
    }
  },
  
  MainController: function () {
    this._stockList;
    this._stockValueType = 0;
  },
  
  sceneLoaded: function () {
    var table = this.getTable();
    table.loadModel();
  },
  
  loadModel : function(e, payload) {
    this._stockList = tau.stocks.MainController.getStockListFromStorage();
    this._stockValueType = tau.stocks.MainController.getStockValueTypeFromStorage();
    
    var len = this._stockList.length;
    var table = this.getTable();

    table.addNumOfCells(len);
    if (this._stockList && len) {
      var params = [];
      for(var i=0; i < len; i++) {
        params.push(this._stockList[i].symbol);
        if (i < len -1) params.push(',');
      }
      if (params.length) {
        var openapi = new tau.OpenAPI(tau.OpenAPI.FINANCE.STOCK.YAHOO);
        openapi.call({
          fn: tau.OpenAPI.FINANCE.STOCK.YAHOO.getStockInfo,
          param: {
            stockSymbols: params.join("")
          },
          callback: tau.ctxAware(this.handleResult, this)
        });
      }
    }
  },
  
  /**
   * event listener, it will be notified when data to make a cell is ready
   * creates new TableCell instance and adds as a row
   * payload.data: an element of the loaded data(array)
   * payload.index: the index(0-based) of rows
   */
  makeTableCell: function (e, payload) {
    var table = this.getTable();
    var path = payload.index + payload.offset;
    var item = this._stockList[path];
    var cell = new tau.ui.TableCell({
      id: item.symbol,
      selected: path === 0,
      title: item.symbol || '',
      subTitle: item.last_trade || ' ',
      styles: {
        '-webkit-box-align' : 'center'
      },
      rightItem: new tau.ui.Button({
        label: this.getStockValue(item),
        styleClass: {type: this.getStockValueType(item), size: 'small'},
        styles: {
          width: '80px',
          fontSize: '.5em',
          padding: 0,
          '-webkit-box-pack' : 'center'
        }
      })
    });
    if (path == 0) {
      cell.setStyles({
        'border-top-left-radius' : '10px',
        'border-top-right-radius' : '10px',
      });
    }
    table.add(cell);
    if (cell.isSelected()) table._selectedIdx = [path];
  },  
  
  handleResult: function (result) {
    var items, item, cell,
          table = this.getTable();
    
    if (result && (items = result.row)) {
      if (!tau.isArray(items)) {
        items = [items];
      }
      for(var i=0, len = items.length; i < len; i++) {
        item = items[i];
        cell = table.getComponent(item.symbol);
        if (cell) {
          cell.setSubTitle(item.last_trade || '');
          cell.getRightItem().setLabel(this.getStockValue(item));
          
          if (cell.isSelected()) {
            this.changeDetailInfo(item);
          }
        }
      }

      tau.stocks.MainController.setStockListToStorage(items);
      this._stockList = tau.stocks.MainController.getStockListFromStorage();
      this._stockValueType = tau.stocks.MainController.getStockValueTypeFromStorage();
    }
  },
  
  changeDetailInfo: function (item) {
    var scene = this.getScene();
    var stockInfo = scene.getComponent('stockInfo');
    var stockChart = scene.getComponent('stockChart');
    var stockNews = scene.getComponent('stockNews');
    if (stockInfo) {
      stockInfo.getComponent('detail_title').setText(item.name || '-');
      stockInfo.getComponent('detail_open').setText(item.open || '-');
      stockInfo.getComponent('deatil_mktcap').setText(item.market_cap || '-');
      stockInfo.getComponent('detail_high').setText(item.high || '-');
      stockInfo.getComponent('detail_52whigh').setText(item.w52_high || '-');
      stockInfo.getComponent('detail_low').setText(item.low || '-');
      stockInfo.getComponent('detail_52wlow').setText(item.w52_low);
      stockInfo.getComponent('detail_vol').setText(item.volume);
      stockInfo.getComponent('detail_avgvol').setText(item.avg_daily_volume);
      stockInfo.getComponent('detail_pe').setText('-');
      stockInfo.getComponent('detail_yield').setText('-');
    }
    if (stockChart) {
      var url = item.chartURL ? item.chartURL._3m : null;
      stockChart.getComponent('detail_chart').setSrc(url);
    }
  },
  
  getItem: function (symbol) {
    if (this._stockList) {
      for(var i=0, len = this._stockList.length; i < len; i++) {
        if (this._stockList[i].symbol === symbol) return this._stockList[i];
      }
    }
    return null;
  },
  
  getStockValue: function (item) {
    var value = '-';
    if (this._stockValueType == 0) {
      value = item.short_ratio && item.short_ratio !== 'N/A' ? item.short_ratio + '%' : '-';
    } else if (this._stockValueType == 1) {
      value = (item.change || '-');
    } else if (this._stockValueType == 2) {
      value = item.market_cap || '-';
    }
    return value.replace(/N\/A/gi, '-');
  },
  
  getStockValueType: function (item) {
    return (item.change || 0) > 0 ? 'green' : 'red';
  },

  getTable: function () {
    return this.getScene().getComponent(0);
  },
  
  handleTouchStart: function (e, payload) {
    var src = e.getSource();
    if (src instanceof tau.ui.Button) {
      e.preventDefault();
      e.stopPropagation();
    }
  },
  
  handleTap: function (e, payload) {
	  var src = e.getSource();
	  if (src instanceof tau.ui.Button){ // price 버튼에 대한 처리
	    var type = this._stockValueType,
	          table = this.getTable(),
	          children = table.getComponents(), 
	          cell, item, button;

	    e.preventDefault();
	    e.stopPropagation();
	    
	    if (type < 2) {
	      type = type + 1;
	    } else {
	      type = 0;
	    }
	    this._stockValueType = type;
	    
	    for(var i=0, len = children.length; i < len; i++) {
	      cell = children[i]; 
	      item = this.getItem(cell.getId());
	      button = cell.getRightItem();
	      button.setLabel(this.getStockValue(item));
	    }
	  }
  },
  
  handleSetting: function (e, payload) {
    var modalCtrl = new tau.stocks.SettingController();
    modalCtrl.onEvent('dismiss', this.handleDismiss, this);
    this.presentModal(modalCtrl, {'layout': 'FULL', 'animate': 'vertical'});
  },
  
  handleCellSelected: function (e, payload) {
    tau.log('handleCellSelected', 1, this);
    var cell = payload.current;
    if (payload.before) payload.before.setSelected(false);
    if (cell) {
      cell.setSelected(true);
      // detail stock data refresh
      var item = this.getItem(cell.getId());
      if (item) {
        this.changeDetailInfo(item);
      } else {
        tau.log(cell.getId() + ' item이 없습니다. ');
      }
    }
  },
  
  handleDismiss: function (e, payload) {
    this.dismissModal(true);
    if (payload) {
      var table = this.getTable();
      table.removeComponents(true);
      table.loadModel();
    }
  }
});