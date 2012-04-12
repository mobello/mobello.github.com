/**
 * tau.tmpl.chicken.Menu 
 * menu 내용에 따라 자동으로 상단 toolbar를 구성하는 메뉴 템플릿 해당 템플릿을 사용할 경우 
 * data는 menuTemplate.json에 다음과 같은 형식으로 정의되어야 한다.
 * 
 * <pre>
 * { type:메뉴 타입,
 *    data : [
 *      {
 *        name : 메뉴명,
 *        small_img : 테이블에 표시될 이미지 파일명,
 *        big_img : detail정보에 표시될 큰 이미지 파일명,
 *        detail_info : 메뉴 정보,
 *        price : 메뉴 가격
 *      },
 *      {}....
 *    ]
 * } ,{
 *  type:메뉴 타입,
 *  data : []
 * }
 * ...
 * </pre>
 */
$class('tau.tmpl.chicken.Menu').extend(tau.ui.SequenceNavigator).define({
  /**
   * 
   */
  Menu : function() {
    this.setTitle('MENU'); // fixed
  },

  /**
   * 
   */
  init: function() {
    this.setRootController(new tau.tmpl.chicken.Menus());
  }
});

/**
 * 
 */
$class('tau.tmpl.chicken.Menus').extend(tau.ui.TableSceneController).define({
  /**
   * 
   */
  Menus: function() {
    this.setTitle('메뉴선택');// fixed
  },
  
  /**
   * 
   */
  init: function() {
    tau.tmpl.chicken.Menus.$super.init.apply(this, arguments);
    var uri = tau.getCurrentContext().getRealPath('/data/menu.data'),
        handler = tau.ctxAware(this._handleDataResponse, this);
    tau.req({async: false}).send(uri, handler); 
    this._menuData = null;
  },
  
  sceneLoaded: function () {
    var table = this.getTable();
    table.setStyles({
      'background-repeat' : 'repeat',
      'background-image' : 'url('.concat(
          tau.getCurrentContext().getRealPath('/data/img/menu_bg.gif'), ')')
    });
    var toolbar = new tau.ui.ToolBar({dock: tau.ui.ToolBar.TOP_DOCK});
    toolbar.onEvent(tau.rt.Event.TAP, this.handleToolbarTouch, this);
    for (var i = 0, len = this._model.length; i < len; i++) {
      toolbar.add(new tau.ui.Button({label : this._model[i].type}));
    }
    this.getScene().add(toolbar);
    tau.tmpl.chicken.Menus.$super.sceneLoaded.apply(this, arguments);
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
    this._menuData = this._loadMenuFor(this._model[0].type);
    return (this._menuData) ? this._menuData.length : 0;
  },
  
  /**
   * @private
   * @param type
   * @returns
   */
  _loadMenuFor: function (type) {
    for (var i = 0, len = this._model.length; i < len; i++) {
      if (this._model[i].type === type) {
        return this._model[i].data;
      }
    }
    return null;
  },
  
  /**
   * 
   * @param e
   * @param payload
   */
  handleToolbarTouch: function (e, payload) {
    var table = this.getTable();
    table.removeAll();
    this._menuData = this._loadMenuFor(e.getSource().getLabel().normal);
    if (this._menuData) {
      table.addNumOfCells(this._menuData.length);
    }
  },
  
  /**
   * 
   * @param current
   * @param before
   */
  cellSelected: function (current, before) {
    var table = this.getTable();
    var data = this._menuData[table.indexOf(current)];
    this.getParent().pushController(
        new tau.tmpl.chicken.MenuDetailPage(data));
  },

  /**
   * 
   * @param index
   * @param offset
   */
  makeTableCell: function (index, offset) {
    var menu = this._menuData[index + offset];
    var contentPanel = new tau.ui.Panel({
      styles: {
        height: 'auto',
        width: '100%',
        display: 'block',
        margin: '0px'
      }
    });
    var titleLabel = new tau.ui.Label({
      text: menu.title,
      styles: {
        color: '#555555',
        width: 'auto',
        display: 'block',
        fontWeight: 'bold',
        fontSize: '18px',
        'padding-top': '10px'
      }
    });
    var detailLabel = new tau.ui.Label({
      text: menu.explain,
      numberOfLines: 3,
      styles: {
        color: '#999999',
        // width : '50%',
        display: 'block',
        fontSize: '12px'
      }
    });
    var priceLabel = new tau.ui.Label({
      text: menu.price + '원',
      styles: {
        color: '#aaaaaa',
        width: 'auto',
        fontWeight: 'bold',
        display: 'block'
      }
    });
    var menuImg = new tau.ui.ImageView({
      src: '/data/img/' + menu.img,
      styles: {
        width: '180px',
        height: '150px',
        float: 'right',
        backgroundSize: '100% 100%'
      }
    });

    contentPanel.add(menuImg);
    contentPanel.add(titleLabel);
    contentPanel.add(detailLabel);
    contentPanel.add(priceLabel);

    var cell = new tau.ui.TableCell({
      styles: {
        height: 'auto',
        margin: '0px',
        padding: '0px'
      }
    });
    cell.setContentItem(contentPanel);
    return cell;
  },
  
  /**
   * 
   */
  destroy: function () {
    tau.tmpl.chicken.Menus.$super.destroy.apply(this, arguments);
    this._model = null;
    this._menuData = null;
  }
});

/**
 * 
 */
$class('tau.tmpl.chicken.MenuDetailPage').extend(tau.ui.SceneController).define({
  /**
   * 
   * @param data
   */
  MenuDetailPage: function (data) {
    this._model = data;
  },

  /**
   * 
   */
  destroy: function () {
    tau.tmpl.chicken.MenuDetailPage.$super.destroy.apply(this, arguments);
    this._model = null;
  }
});