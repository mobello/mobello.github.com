/**
 * tau.tmpl.chicken.Event 이벤트 종료일을 현재 날짜와 비교하여 자동으로 진행중인 이벤트와 종료 된 이벤트를 분리하여 출력하는
 * 템플릿이다. 해당 템플릿의 데이터는 eventTemplate.json에 다음과 같이 정의되어야 한다.
 * 
 * <pre>
 * [{
 *    title:event 명,
 *    start_date:event 시작일,
 *    end_date:event 종료일,
 *    banner_img:이벤트 배너이미지 파일명,
 *    detail_img:이벤트 디테일이미지 파일명,
 *    detail: 이벤트 설명
 *  },{
 *  ....
 *  
 *  }]
 * </pre>
 */
$class('tau.tmpl.chicken.Event').extend(tau.ui.SequenceNavigator).define({
  Event : function() {
    this.setTitle('EVENT');
  },

  init : function() {
    this.setRootController(new tau.tmpl.chicken.Events());
  }
});

/**
 * 
 */
$class('tau.tmpl.chicken.Events').extend(tau.ui.TableSceneController).define({
  Events : function() {
    this.setTitle('Events');
  },
  
  /**
   * 
   */
  init : function() {
    tau.tmpl.chicken.Events.$super.init.apply(this, arguments);
    var uri = tau.getCurrentContext().getRealPath('/data/event.data'),
        handler = tau.ctxAware(this._handleDataResponse, this);
    tau.req({async: false}).send(uri, handler); 
    
    this.getScene().add(new tau.ui.Table({moreCellItem: true, listSize: 5}));
  },
  
  sceneLoaded: function () {
    var table = this.getTable();
    table.setStyles({
      'background-repeat' : 'repeat',
      'background-image' : 'url('
          + tau.getCurrentContext().getRealPath('/data/img/' + 'menu_bg.gif') + ')'
    });
    
    var toolBar = new tau.ui.ToolBar({dock: tau.ui.ToolBar.TOP_DOCK});
    var underway = new tau.ui.Button({
      label: "진행중인 이벤트",
      styles: {
        width: '49%'
      }
    });
    var ended = new tau.ui.Button({
      label: "종료된 이벤트",
      styles: {
        width: '49%'
      }
    });
    
    toolBar.add(underway);
    toolBar.add(ended);
    toolBar.onEvent(tau.rt.Event.TAP, this.handleToolbarTouch, this);
    this.getScene().add(toolBar);
    tau.tmpl.chicken.Events.$super.sceneLoaded.apply(this, arguments);
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
   * @param start
   * @param size
   */
  loadModel: function (start, size) {
    this._events = this._loadEventsFor(new Date(), true);
    if (this._events) {
      this.getTable().addNumOfCells(this._events.length);
    }
  },

  /**
   * 
   * @param current
   * @param before
   */
  cellSelected: function (current, before) {
    var table = this.getTable();
    var data = this._events[table.indexOf(current)];
    this.getParent().pushController(
        new tau.tmpl.chicken.EventDetailPage(data));
  },
  
  /**
   * 
   * @param e
   * @param payload
   */
  handleToolbarTouch: function (e, payload) {
    var table = this.getTable();
    table.removeAll(true);
    this._events = this._loadEventsFor(new Date(),
          (e.getSource().getLabel().normal === '진행중인 이벤트'));
    if (this._events) {
      table.addNumOfCells(this._events.length);
    }
  },
  
  /**
   * @private
   * @param today
   * @returns
   */
  _loadEventsFor: function (today, underway) {
    var events = [];
    for (var i = 0, len = this._model.length; i < len; i++) {
      var dd = this._model[i].end_date.split('.');
      var finish = new Date(dd[0], dd[1], dd[2]); // yyyy.mm.dd
      if (underway && finish.getTime() >= today.getTime()) {
        events.push(this._model[i]);
      } else if (!underway && finish.getTime() < today.getTime()) {
        events.push(this._model[i]);
      }
    }
    return events;
  },
  
  /**
   * 
   * @param index
   * @param offset
   * @returns {tau.ui.TableCell}
   */
  makeTableCell: function (index, offset) {
    var event = this._events[index + offset];
    var contentPanel = new tau.ui.Panel({
      styles : {
        height : 'auto',
        width : '100%',
        display : 'block',
        margin : '0px'
      }
    });
    
    var eventImg = new tau.ui.ImageView({
      src : '/data/img/' + event.banner_img,
      styles : {
        'max-width' : '100%',
        backgroundSize : '100% 100%'
      }
    });
    contentPanel.add(eventImg);
    var cell = new tau.ui.TableCell({
      styles : {
        height : '100%',
        width : '100%',
        margin : '0px',
        'padding-top' : '10px',
        'padding-bottom' : '10px'
      }
    });
    cell.setContentItem(contentPanel);
    return cell;
  },

  /**
   * 
   */
  destroy: function () {
    tau.tmpl.chicken.Events.$super.destroy.apply(this, arguments);
    this._model = null;
    this._events = null;
  }
});

/**
 * 
 */
$class('tau.tmpl.chicken.EventDetailPage').extend(tau.ui.SceneController).define({
  /**
   * 
   * @param data
   */
  EventDetailPage: function (data) {
    this.data = data;
  },
  
  /**
   * 
   */
  destroy: function () {
    tau.tmpl.chicken.EventDetailPage.$super.destroy.apply(this, arguments);
    this.data = null;
  }
});