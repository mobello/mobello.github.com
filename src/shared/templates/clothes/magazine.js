$class('tau.tmpl.clothes.Magazine').extend(tau.ui.SequenceNavigator).define({
	Magazine : function(opts) {
    this.setTitle('Magazine');
    this.appCtx = tau.getCurrentContext();
  },

  init : function() {
    this.setRootController(new ninegirl.Magazines());
  }
});

$class('ninegirl.Magazines')
    .extend(tau.ui.SceneController)
    .define(
        {
        	Magazines : function(opts) {
            this.setTitle('2011 Magazine');
            this.appCtx = tau.getCurrentContext();
          },

          init : function() {
            ninegirl.Magazines.$super.init.apply(this, arguments);
            var uri = tau.getCurrentContext().getRealPath('/magazine.json'), handler = tau
                .ctxAware(this._handleDataResponse, this);
            tau.req({
              async : false
            }).send(uri, handler);
            
            var scene = this.getScene();
            scene.setStyles({
              'background-color' : 'black'
            });

            var scrollPanel = new tau.ui.ScrollPanel({
              hScroll : false,
              styles : {
                'background-repeat' : 'repeat',
                'background-image' : 'transparent'
              }
            });

            scene.add(scrollPanel);
            for ( var i = 0; i < this._model.length; i++) {
              var imageView = new tau.ui.ImageView({
                src : '/img/' + this._model[i].img,
                display : 'inline',
                styles : {
                  width : '33%',
                  border : '1px',
                  'border-style' : 'solid'
                }
              });
              imageView.key = this._model[i];
              imageView.onEvent(tau.rt.Event.TAP, function(event, payload) {
                var data = event._source.key;
                this.getParent().pushController(new ninegirl.Magazine_detail(data));

              }, this);
              scrollPanel.add(imageView);
            }
            
            
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
          destroy : function() {

          }
        });

$class('ninegirl.Magazine_detail').extend(tau.ui.SceneController).define({
  Magazine_detail : function(opts) {
    this.appCtx = tau.getCurrentContext();
    this.model = opts;
    this.setTitle(this.model.month +" 매거진");
  },

  init : function() {
    var scene = this.getScene();
    scene.setStyles({
      'background-color' : 'black'
    });

    var scrollPanel = new tau.ui.ScrollPanel({
      hScroll : false,
      styles : {
        'background-repeat' : 'repeat',
        'background-image' : 'transparent'
      }
    });

    scene.add(scrollPanel);
    var imageView = new tau.ui.ImageView({
      src : '/img/' + this.model.detail_img,
      styles : {
        width : '100%'
      }
    });
    scrollPanel.add(imageView);

  },

  destroy : function() {

  }
});