$class('tau.tmpl.clothes.Category').extend(tau.ui.SequenceNavigator).define({
  Category : function() {
    this.setTitle('Category');
  },

  init : function() {
    this.setRootController(new tau.tmpl.clothes.Major_categoryController());
  }
});

$class('tau.tmpl.clothes.Major_categoryController').extend(tau.ui.TableSceneController)
    .define(
        {
          Major_categoryController : function(opts) {
            this.setTitle('Category');
          },

          /**
           * @param start
           * @param size
           * @returns
           */
          loadModel : function(start, size) {
            var uri = tau.getCurrentContext().getRealPath(
                '/category_template.json'), handler = tau.ctxAware(
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
           * @param index
           * @param offset
           * @returns {tau.ui.TableCell}
           */
          makeTableCell : function(index, offset) {
            var model = this._model[index + offset];
            return new tau.ui.TableCell({
              title : model.type
            });
          },

          /**
           * event listener, it will be notified when a user touches table cell
           */
          cellSelected : function(current, before) {
            if (current instanceof tau.ui.TableCell) {
              var path = this.getTable().indexOf(current).pop(); // index
              // is
              // array
              var detail = new tau.tmpl.clothes.Sub_categoryController(
                  this._model[path]);
              this.getParent().pushController(detail);
            }
          },
          /**
           * 
           */
          destroy : function() {
          }
        });

$class('tau.tmpl.clothes.Sub_categoryController').extend(tau.ui.TableSceneController)
    .define(
        {
          Sub_categoryController : function(opts) {
            this.model = opts;
            this.setTitle(this.model.type);
          },

          /**
           * @param start
           * @param size
           * @returns
           */
          loadModel : function(start, size) {
            this.model = this.model.data;
            return (this.model) ? this.model.length : 0;
          },

          makeTableCell : function(index, offset) {
            var model = this.model[index + offset];
            return new tau.ui.TableCell({
              title : model.name,
              subTitle : "상품 가격 : " + model.price + "원",
              title : model.name,
              leftItem : new tau.ui.ImageView({
                src : '/img/' + model.img,
                styles : {
                  width : '100px',
                  height : '130px'
                }
              }),
              styles : {
                cellLeftItemWidth : '100px',
                cellLeftItemHeight : '100px',
                height : '130px'
              }
            });
          },
          /**
           * event listener, it will be notified when a user touches table cell
           */
          cellSelected : function(current, before) {
            if (current instanceof tau.ui.TableCell) {
              var path = this.getTable().indexOf(current).pop(); // index
              // is
              // array
              var detail = new tau.tmpl.clothes.Category_detailController(
                  this.model[path]);
              this.getParent().pushController(detail);
            }
          },
          /**
           * 
           */
          destroy : function() {
          }

        });

$class('tau.tmpl.clothes.Category_detailController').extend(tau.ui.SceneController)
    .define({
      Category_detailController : function(opts) {
        this.model = opts;
        this.appCtx = tau.getCurrentContext();
        this.setTitle(this.model.name);
      },

      init : function() {

      },
      destroy : function() {

      }

    });