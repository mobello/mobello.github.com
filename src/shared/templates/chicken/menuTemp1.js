/**
 * tau.sample.Menu1 
 * 한페이지에 그룹별로 모든 메뉴가 출력되는 템플릿이다. 해당 템플릿을 사용할 경우 
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
$class('tau.sample.Menu1').extend(tau.ui.SequenceNavigator).define({
  Menu1 : function() {
    this.setTitle('MENU');
  },

  init : function() {
    // 쿠폰 버튼을 네비게이션바에 장착
    var couponBtn = new tau.ui.Button({
      styleClass : {
        shape : 'red'
      },
      label : '쿠폰바로가기'
    });
    var menusScene = new tau.sample.Menus1();
    menusScene.getNavigationBar().setRightItem(couponBtn);
    this.setRootController(menusScene);
  }
});

$class('tau.sample.Menus1').extend(tau.ui.SceneController).define(
    {
      Menus1 : function() {
        this.setTitle('Menu');
      },

      init : function() {
        this.appCtx = tau.getCurrentContext();
        // load data
        this.model = tau.datamanager.loadData('/menuTemplate.json', this.model);
        this.menuData;
      },

      loadScene : function() {
        this.groupTable = new tau.ui.Table({
          group:true,
          styles : {
            'background-repeat' : 'repeat',
            'background-image' : 'url(/data/img/menu_bg.gif)'
          }
        });

        this.groupTable.onEvent(tau.rt.Event.SELECTCHANGE, function(event,
            payload) {
          var data = payload.current.key;
          this.getParent().pushController(
              new tau.sample.Menus1.DetailPage(data));
        }, this);

        this.getScene().add(this.groupTable);

        this.makeCell(0);
      },

      // pushedTab : 선택된 인덱스
      changeCell : function(index) {
        this.groupTable.removeAll();
        this.makeCell(index);
      },

      // pushedTab : 선택된 인덱스
      makeCell : function(index) {
        this.menuData = this.model[index];
        for ( var j = 0; j < this.model.length; j++) {

          this.menuData = this.model[j];
          for ( var i = 0; i < this.menuData.data.length; i++) {
            var contentPanel = new tau.ui.Panel({
              styles : {
                height : 'auto',
                width : '100%',
                display : 'block',
                margin : '0px'
              }
            });
            var titleLabel = new tau.ui.Label({
              text : this.menuData.data[i].title,
              styles : {
                color : '#555555',
                width : 'auto',
                display : 'block',
                fontWeight : 'bold',
                fontSize : '18px',
                'padding-top' : '10px'
              }
            });
            var detailLabel = new tau.ui.Label({
              text : this.menuData.data[i].explain,
              numberOfLines : 3,
              styles : {
                color : '#999999',
                // width : '50%',
                display : 'block',
                fontSize : '12px'
              }
            });
            var priceLabel = new tau.ui.Label({
              text : this.menuData.data[i].price + '원',
              styles : {
                color : '#aaaaaa',
                width : 'auto',
                fontWeight : 'bold',
                display : 'block'
              }
            });
            var menuImg = new tau.ui.ImageView({
              src : '/data/img/' + this.menuData.data[i].img,
              styles : {
                width : '180px',
                height : '150px',
                float : 'right',
                backgroundSize : '100% 100%'
              }
            });

            contentPanel.add(menuImg);
            contentPanel.add(titleLabel);
            contentPanel.add(detailLabel);
            contentPanel.add(priceLabel);

            var cell = new tau.ui.TableCell({
              groupName : this.menuData.type,
              styles : {
                height : '100%',
                width : '100%',
                margin : '0px',
                padding : '0px'
              }

            });
            cell.key = this.menuData.data[i];
            cell.setContentItem(contentPanel);
            this.groupTable.add(cell);
          }

        }

        this.getScene().update();

      }
    });

$class('tau.sample.Menus1.DetailPage').extend(tau.ui.SceneController).define(
    {
      DetailPage : function(data) {
        this.setTitle('MenuDetailPage');
        this.data = data;
      },

      loadScene : function() {
        var scrollPanel = new tau.ui.ScrollPanel({
          hScroll : false,
          styles : {
            'background-repeat' : 'repeat',
            'background-image' : 'url(/data/img/bg_event.gif)'
          }
        });

        var title = new tau.ui.Label({
          text : this.data.title,
          styles : {
            color : '#555555',
            width : 'auto',
            display : 'block',
            fontWeight : 'bold',
            fontSize : '18px',
            'padding-top' : '10px'
          }
        });

        var eventImg = new tau.ui.ImageView({
          src : '/data/img/' + this.data.detail_img,
          styles : {
            width : '320px',
            height : '250px',
            backgroundSize : '100% 100%'
          }
        });

        var textView = new tau.ui.Label({
          text : this.data.explain,
          styles : {
            color : '#999999',
            display : 'block',
            fontSize : '12px'
          }
        });

        var priceLabel = new tau.ui.Label({
          text : this.data.price + '원',
          styles : {
            color : '#aaaaaa',
            width : 'auto',
            fontWeight : 'bold',
            display : 'block'
          }
        });

        scrollPanel.add(title);
        scrollPanel.add(eventImg);
        scrollPanel.add(textView);
        scrollPanel.add(priceLabel);

        this.getScene().add(scrollPanel);
      }
    });
