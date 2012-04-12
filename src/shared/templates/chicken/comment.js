/**
 * tau.tmpl.chicken.Comment 이벤트 종료일을 현재 날짜와 비교하여 자동으로 진행중인 이벤트와 종료 된 이벤트를 분리하여 출력하는
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
$class('tau.tmpl.chicken.Comment').extend(tau.ui.SequenceNavigator).define({
  Comment: function () {
    this.setTitle('후기');
  },

  init: function () {
    this.setRootController(new tau.tmpl.chicken.Comments());
  }
});

/**
 * 
 */
$class('tau.tmpl.chicken.Comments').extend(tau.ui.TableSceneController).define({
  /**
   * 
   */
  Comments: function () {
    this.setTitle('후기');
    this.model = null;
  },
  
  sceneLoaded: function () {
    var table = this.getTable();
    table.setHeaderItem(new tau.ui.Label({
        text: '여러분의 후기로 더 맛있는 치킨을 만들겠습니다.'
      }));
    var footer = new tau.ui.Panel({styles: {width: '100%'}});
    footer.add(new tau.ui.TextField({
      id: 'comment_txt',
      type : tau.ui.TextField.TEXT,
      placeholderLabel: '후기를 남겨주세요.',
      styles: { margin: '4px', width: '80%'}
    }));
    var button = new tau.ui.Button({
      label: '입력',
      styles: {margin: '4px', height: '33px', width: '15%'}
    });
    button.onEvent(tau.rt.Event.TAP, this.handleCommentInput, this);
    footer.add(button);
    
    table.setFooterItem(footer);
    table.setStyleClass({cellSize: 'auto'});
    
    tau.tmpl.chicken.Comments.$super.sceneLoaded.apply(this, arguments);
  },

  /**
   * 
   * @param start
   * @param size
   * @returns
   */
  loadModel: function (start, size) {
    var uri = tau.getCurrentContext().getRealPath('/data/comment.data'),
        handler = tau.ctxAware(this._handleDataResponse, this);
    tau.req({async: false}).send(uri, handler); //act as synchronous
    return (this._model) ? this._model.length : 0;
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
   * @param e
   * @param payload
   */
  handleCommentInput: function (e, payload) {
    var date = new Date(),
        comment = this.getScene().getComponent('comment_txt'),
        currentDate = date.getFullYear() + "." + (date.getMonth() + 1)
                      + "." + date.getDate();
    this._model.push({
      "date": currentDate,
      "comment": comment.getText(),
      "grade": "9"
    });
    comment.setText(null);
    this.getTable().addNumOfCells(1);
  },
  
  /**
   * 
   * @param index
   * @param offset
   * @returns {tau.ui.TableCell}
   */
  makeTableCell: function (index, offset) {
    var model = this._model[index + offset];
    return new tau.ui.TableCell({
      title: model.comment,
      subTitle: model.date,
      leftItem: new tau.ui.Label({
        text: (index + offset + 1),
        styles: {
          margin: '10px'
        }
      })
    });
  },

  /**
   * 
   */
  destroy: function () {
    tau.tmpl.chicken.Comments.$super.destroy.apply(this, arguments);
    this.model = null;
  }
});