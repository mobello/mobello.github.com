/**
 * tau.sample.Event 이벤트 종료일을 현재 날짜와 비교하여 자동으로 진행중인 이벤트와 종료 된 이벤트를 분리하여 출력하는
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
$class('tau.sample.Event1').extend(tau.ui.SequenceNavigator).define({
  Event1 : function() {
    this.setTitle('EVENT');
  },

  init : function() {
    this.setRootController(new tau.sample.Events1());
  }
});

$class('tau.sample.Events1').extend(tau.ui.SceneController).define(
    {
      Events1 : function() {
        this.setTitle('Events');
      },
      init : function() {
        this.appCtx = tau.getCurrentContext();
        this.events = new Array();
        //data load
        this.model = tau.datamanager.loadData('/eventTemplate.json', this.menuDatas);
        this.currentDate = new Date();
      },
      loadScene : function() {
        this.eventTable = new tau.ui.Table({
          moreCellItem : true,
          listSize : 5,
          styles : {
            'background-repeat' : 'repeat',
            'background-image' : 'url(/data/img/menu_bg.gif)'
          }
        });

        this.eventTable.onEvent(tau.rt.Event.SELECTCHANGE, function(event,
            payload) {
          var data = payload.current.key;
          this.getParent().pushController(
              new tau.sample.Events1.DetailPage(data));
        }, this);
        this.getScene().add(this.eventTable);
       
        this.makeCell(true);
      },

      changeCell : function(flag) {
        this.eventTable.removeAll();
        this.makeCell(flag);
      },

      getEventType : function(endDate) {
        var date = endDate.split(".");

        if (this.currentDate.getFullYear() > parseInt(date[0])) {
          return false;
        } else if (this.currentDate.getFullYear() < parseInt(date[0])) {
          return true;
        } else {
          if (this.currentDate.getMonth() > parseInt(date[1])) {
            return false;
          } else if (this.currentDate.getMonth() < parseInt(date[1])) {
            return true;
          } else {
            if (this.currentDate.getDate() > parseInt(date[2])) {
              return false;
            } else
              return true;
          }
        }
      },
      getModel : function(flag) {
        this.event = [];
        var j = 0;
        for ( var i = 0; i < this.model.length; i++) {
          if (flag === this.getEventType(this.model[i].end_date)) {
            this.event[j++] = this.model[i];
          }
        }
        return this.event;
      },
      makeCell : function(flag) {
        var evnetData = this.model;
        
        for ( var i = 0; i < this.model.length; i++) {

          var contentPanel = new tau.ui.Panel({
            styles : {
              height : 'auto',
              width : '100%',
              display : 'block',
              margin : '0px'
            }
          });
          var eventImg = new tau.ui.ImageView({
            src : '/data/img/' + this.model[i].banner_img,
            styles : {
              width : '320px',
              height : '80px',
              backgroundSize : '100% 100%'
            }
          });
          
          if (!this.getEventType(this.model[i].end_date)) {
            //회색처리하려고했지만..ㅠㅠ 안된다.
            eventImg.setStyle('opacity','0.2');
          }
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
          cell.key = this.model[i];
          cell.setContentItem(contentPanel);
          this.eventTable.add(cell);
        }
        this.getScene().update();
      }
    });

$class('tau.sample.Events1.DetailPage').extend(tau.ui.SceneController)
    .define(
        {
          DetailPage : function(data) {
            this.setTitle('EventDetailPage');
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
                height : '500px',
                backgroundSize : '100% 100%'
              }
            });

            var textView = new tau.ui.Label({
              text : this.data.detail,
              styles : {
                color : '#999999',
                display : 'block',
                fontSize : '12px'
              }
            });

            scrollPanel.add(title);
            scrollPanel.add(eventImg);
            scrollPanel.add(textView);

            this.getScene().add(scrollPanel);
          }
        });
