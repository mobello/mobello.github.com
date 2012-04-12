/**
 * tau.sample.Comment 이벤트 종료일을 현재 날짜와 비교하여 자동으로 진행중인 이벤트와 종료 된 이벤트를 분리하여 출력하는
 * 템플릿이다. 해당 템플릿의 데이터 형식은 commentTemplate.json에 다음과 같이 정의되어야 한다.
 * 
 * <pre>
 * [{
 *    date:작성일,
 *    comment:후기 text,
 *    grade:별점(10점 만점)
 *  },{
 *  ....
 *  
 *  }]
 * </pre>
 */
$class('tau.tmpl.clothes.Review').extend(tau.ui.SequenceNavigator).define({
	Review : function() {
    this.setTitle('Review');
  },

  init : function() {
    this.setRootController(new ninegirl.Reviews());
  }
});

/**
 * 
 */
$class('ninegirl.Reviews').extend(tau.ui.TableSceneController)
    .define(
        {
          /**
           * 
           */
          Reviews : function() {
            this.setTitle('REVIEW');
            this.model = null;
          },

          /**
           * @param start
           * @param size
           * @returns
           */
          loadModel : function(start, size) {
            var uri = tau.getCurrentContext().getRealPath(
                '/review_template.json'), handler = tau.ctxAware(
                this._handleDataResponse, this);
            tau.req({
              async : false
            }).send(uri, handler); // act as synchronous
            return (this._model) ? this._model.length : 0;
          },

          /**
           * @param resp
           */
          _handleDataResponse : function(resp) {
            if (resp.status === 200) {
              this._model = tau.parse(resp.responseText);
            } else {
              throw new Error('Can not fetch data: ' + uri);
            }
          },

          /**
           * 
           */
          loadScene : function() {
            var table;

            table = new tau.ui.Table({
              styleClass : {
                cellSize : 'auto'
              },
              styles : {
                'background-repeat' : 'repeat',
                'background-image' : 'url(/img/05.jpg)',
                color : '#ff6a89'
              }
            });
            this.getScene().add(table);
          },

          /**
           * @param e
           * @param payload
           */
          handleCommentInput : function(e, payload) {
            var date = new Date(), comment = this.getScene().getComponent(
                'comment_txt'), currentDate = date.getFullYear() + "."
                + (date.getMonth() + 1) + "." + date.getDate();
            this._model.push({
              "date" : currentDate,
              "comment" : comment.getText(),
              "grade" : "9"
            });
            comment.setText(null);
            this.getTable().addNumOfCells(1);
          },

          /**
           * @param index
           * @param offset
           * @returns {tau.ui.TableCell}
           */
          makeTableCell : function(index, offset) {
            var model = this._model[index + offset];
            var cell = new tau.ui.TableCell({
              title : model.name + " - " + model.title,
              subTitle : model.date,
              leftItem : new tau.ui.Label({
                text : (index + offset + 1),
                styles : {
                  margin : '10px'
                }
              })
            });
            return cell;
          },
          /**
           * event listener, it will be notified when a user touches table cell
           */
          cellSelected : function(current, before) {
            if (current instanceof tau.ui.TableCell) {
              var path = this.getTable().indexOf(current).pop(); // index is
              // array
              var detail = new ninegirl.Reviews_detail(this._model[path]);
              this.getParent().pushController(detail);
            }
          },

          /**
           * 
           */
          destroy : function() {
            this.model = null;
          }
        });

$class('ninegirl.Reviews_detail').extend(tau.ui.SceneController).define(
    {
      Reviews_detail : function(opts) {
        this.model = opts;
        this.appCtx = tau.getCurrentContext();
        this.setTitle(this.model.name);
      },

      init : function() {
        this.getScene().setStyles(
            {
              'background-repeat' : 'repeat',
              'background-image' : 'url(/img/05.jpg)'
            });
      },
      destroy : function() {

      }

    });