$class('tau.openapi.finance.stock.Yahoo').define({
  getStockInfo: function(param, userCallBack){
    var stockSymbols = param.stockSymbols ? param.stockSymbols : "030200.KS";//,GOOG,AAPL";
    var format = "snohgvrj1kja2s7l1c1c";
    var columns = "symbol,name,open,high,low,volume,per,market_cap,w52_high,w52_low,avg_daily_volume,short_ratio,last_trade,change,percent_change";
    var url, q;
    
    q = "select * from csv where url='http://download.finance.yahoo.com/d/quotes.csv?s="+stockSymbols+"&f="+format+"&e=.csv' and columns='"+columns+"'";    
    q = encodeURIComponent(q);    
    url = "http://query.yahooapis.com/v1/public/yql?q="+q+"&format=json&diagnostics=false";    
    var self = this;
    tau.req({
      type: 'JSONP',
      jsonpCallback:'callback',
      'url': url,
      callbackFn: function(_response){
        var row = _response.responseJSON.query.results.row;
        if(row.length){
          for(var i=0; i<row.length; i++){
            row[i].chartURL = {};
            row[i].chartURL._1d = self._generateChartURL({stockSymbol:row[i].symbol, timeSpan: '1d'});
            row[i].chartURL._1w = self._generateChartURL({stockSymbol:row[i].symbol, timeSpan: '1w'});
            row[i].chartURL._1m = self._generateChartURL({stockSymbol:row[i].symbol, timeSpan: '1m'});
            row[i].chartURL._3m = self._generateChartURL({stockSymbol:row[i].symbol, timeSpan: '3m'});
            row[i].chartURL._6m = self._generateChartURL({stockSymbol:row[i].symbol, timeSpan: '6m'});
            row[i].chartURL._1y = self._generateChartURL({stockSymbol:row[i].symbol, timeSpan: '1y'});
            row[i].chartURL._2y = self._generateChartURL({stockSymbol:row[i].symbol, timeSpan: '2y'});
          }          
        }else{
          row.chartURL = {};
          row.chartURL._1d = self._generateChartURL({stockSymbol:row.symbol, timeSpan: '1d'});
          row.chartURL._1w = self._generateChartURL({stockSymbol:row.symbol, timeSpan: '1w'});
          row.chartURL._1m = self._generateChartURL({stockSymbol:row.symbol, timeSpan: '1m'});
          row.chartURL._3m = self._generateChartURL({stockSymbol:row.symbol, timeSpan: '3m'});
          row.chartURL._6m = self._generateChartURL({stockSymbol:row.symbol, timeSpan: '6m'});
          row.chartURL._1y = self._generateChartURL({stockSymbol:row.symbol, timeSpan: '1y'});
          row.chartURL._2y = self._generateChartURL({stockSymbol:row.symbol, timeSpan: '2y'});
        }
        userCallBack(_response.responseJSON.query.results);
     }
    }).send();
  },
  
  lookupStockSymbols: function(param, userCallBack){
    var query = param.query ? param.query : "KT";//,GOOG,AAPL";
    var  url = "http://autoc.finance.yahoo.com/autoc?callback=YAHOO.Finance.SymbolSuggest.ssCallback&query="+query;
    YAHOO = {Finance: {SymbolSuggest: {}}};
    YAHOO.Finance.SymbolSuggest.ssCallback = function (_response) {
    	userCallBack(_response.ResultSet);
    	delete YAHOO;
    };
    
    tau.req({
      type: 'JSONP',
      'url': url
    }).send();
  },
  
  getChartURL: function(param, callback){
    callback(this._generateChartURL(param));
  },
  
  _generateChartURL: function(param){
    param.timeSpan = param.timeSpan ? param.timeSpan : "3m";
    param.chartType = param.chartType ? param.chartType : "l";
    return 'http://ichart.yahoo.com/z?z=s&s='+(param.stockSymbol)+'&t='+(param.timeSpan)+'&q='+(param.chartType);
  }

});
//
tau.OpenAPI.FINANCE.STOCK.YAHOO.clazz = tau.openapi.finance.stock.Yahoo;
tau.log.debug("LOADED");