/**
 * AppStore Demo Application
 * 
 * @version 1.1.0
 * @creation 2011. 11. 28.
 * 
 * Copyright 2010 KT Innotz, Inc. All rights reserved. KT INNOTZ
 * PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

/**
 * Main Controller Class. This class is registered config.json configuration
 * file
 */
$class('tau.sample.store.AppStore').extend(tau.ui.ParallelNavigator).define({

  /**
   * 
   */
  init: function() {
    tau.sample.store.AppStore.$super.init.apply(this, arguments);
    var ctrls = [ new tau.sample.store.AppNavigator({
      title: '추천'
    }), new tau.sample.store.AppNavigator({
      title: '카테고리'
    }), new tau.sample.store.AppNavigator({
      title: '인기25'
    }), new tau.sample.store.AppNavigator({
      title: '검색'
    }) ];
    this.setControllers(ctrls);
    this.appCtx = tau.getCurrentContext();
    var tabs = this.appCtx.getConfig().tabs;
    var tabBar = this.getTabBar();
    var tabcomps = tabBar.getComponents();
    for (i in tabs) {
      var tabcomp = tabcomps[i];
      var backImage = {
        normal: tabs[i].icon,
        selected: tabs[i].selectedIcon,
        disabled: tabs[i].icon,
        highlighted: tabs[i].icon,
      };
      tabcomp.setBackgroundImage(backImage);
      tabcomp.setStyles({
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        fontSize: '70%',
      });
    }
  },

  /**
   * 
   */
  destroy: function() {
    tau.sample.store.AppStore.$super.destroy.apply(this, arguments);
  }
});

/**
 * 
 */
$class('tau.sample.store.AppNavigator').extend(tau.ui.SequenceNavigator)
    .define({

      init: function() {
        var title = this.getTitle();
        var ctrl;

        if (title === '카테고리') {
          ctrl = new tau.sample.store.CategoryListController({
            'title': title
          });
        } else if (title === '검색') {
          ctrl = new tau.sample.store.AppsSearchController({
            'title': title
          });
        } else if (title === '추천') {
          ctrl = new tau.sample.store.AppsRecommendController({
            'title': title
          });
        } else {
          ctrl = new tau.sample.store.AppsListController({
            'title': title
          });
        }
        this.setRootController(ctrl);
      }
    });

$class('tau.sample.store.CategoryListController')
    .extend(tau.ui.TableSceneController)
    .define(
        {
          /**
           * Default constructor
           */
          CategoryListController: function() {
            this.model = null;
          },

          init: function() {

            tau.sample.store.CategoryListController.$super.init.apply(this,
                arguments);
            var scene = this.getScene();
            var table = new tau.ui.Table({
              styles: {
                backgroundColor: '#ccc',
              }
            });
            scene.add(table);
          },

          makeTableCell: function(index, offset) {
            var cell = new tau.ui.TableCell(
                {
                  styles: {
                    backgroundImage: '-webkit-gradient(linear, left top, left bottom,from(white),color-stop(40%,white),color-stop(80%,#EFEFEF),to(#DDD));',
                    height: '70px',
                    cellLeftItemWidth: '70px',
                    'border-top': '1px solid #F2F2F0',
                    'border-bottom': '1px solid #BFBFBD'
                  }
                }), data = this.model[offset + index];
            cell.setTitle(data.title);
            cell.setLeftItem(new tau.ui.ImageView({
              src: data.img,
              styles: {
                margin: '5px',
                width: '60px',
                height: '60px'
              }
            }));

            cell.setStyle('background-color', index % 2 == 0 ? '#ccc' : '#ddd');
            return cell;
          },

          loadModel: function(start, size) {
            this.model = [ {
              title: '게임',
              img: '/img/icon1.png'
            }, {
              title: '생산성',
              img: '/img/icon2.png'
            }, {
              title: '도서',
              img: '/img/icon3.png'
            }, {
              title: '뉴스',
              img: '/img/icon4.png'
            }, {
              title: '사진 및 비디오',
              img: '/img/icon5.png'
            }, {
              title: '내비게이션',
              img: '/img/icon6.png'
            }, {
              title: '건강 및 피트니스',
              img: '/img/icon7.png'
            }, {
              title: '날씨',
              img: '/img/icon8.png'
            }, {
              title: '소셜네트워크',
              img: '/img/icon9.png'
            }, {
              title: '참고',
              img: '/img/icon0.png'
            } ];
            return this.model.length;
          },

          cellSelected: function(current, before) {
            if (current instanceof tau.ui.TableCell) {
              var path = this.getTable().indexOf(current).pop(); // index is
              // array
              var detail = new tau.sample.store.AppsListController({
                title: this.model[path].title
              });
              this.getParent().pushController(detail);
            }
          },

          destory: function() {
            this.model = null;
          }
        });

/**
 * Class for FlickerListController This class will be loading scene using
 * compiled scene file(list.scene.js)
 */
$class('tau.sample.store.AppsSearchController')
    .extend(tau.ui.TableSceneController)
    .define(
        {
          /**
           * Default constructor
           */
          AppsSearchController: function() {
            this.model = null;
            this.loadRawModel();
          },

          init: function() {

            tau.sample.store.AppsSearchController.$super.init.apply(this,
                arguments);
            var scene = this.getScene();

            var headerPanel = new tau.ui.Panel({
              styles: {
                width: '100%',
                padding: '5px'
              }
            });
            var searchBar = new tau.ui.TextField({
              placeholderImage: '/img/06-magnify.png',
              clearButtonMode: true,
              styles: {
                width: '100%'
              }
            });

            searchBar.onEvent('keyup', this._handleModelLoad, this);

            headerPanel.add(searchBar);

            var table = new tau.ui.Table({
              headerItem: headerPanel,
              styles: {
                backgroundColor: '#ccc',
              }
            });
            scene.add(table);
          },

          /**
           * event listener, it will be notified when data to make a cell is
           * ready creates new TableCell instance and adds as a row
           * payload.data: an element of the loaded data(array) payload.index:
           * the index(0-based) of rows
           */
          makeTableCell: function(index, offset) {
            var cell = new tau.ui.TableCell(
                {
                  styles: {
                    backgroundImage: '-webkit-gradient(linear, left top, left bottom,from(white),color-stop(40%,white),color-stop(80%,#EFEFEF),to(#DDD));',
                    height: '70px',
                    cellLeftItemWidth: '70px',
                    'border-top': '1px solid #F2F2F0',
                    'border-bottom': '1px solid #BFBFBD'
                  }
                }), data = this.model[offset + index];
            cell.setTitle(data.title);
            if (!data.icon) {
              data.icon = '/icon.png';
            }
            // FIXME 자신의 app, shared resource만 접근할 수 있다.
            cell.setLeftItem(new tau.ui.ImageView({
              src: '/../' + data.name + data.icon,
              styles: {
                margin: '5px',
                width: '60px',
                height: '60px'
              }
            }));
            cell.setStyle('background-color', index % 2 == 0 ? '#ccc' : '#ddd');
            cell.setSubTitle(data.vendor);
            return cell;
          },

          _handleModelLoad: function(e, payload) {
            if (e._name === "keyup") {

              var table = this.getTable();
              var count = this.loadModel(payload.start, payload.size,
                  payload.value);
              table.removeComponents();
              if (count && count >= 0) {
                table.addNumOfCells(count);
              } else {
                table.draw();
              }
            }
          },
          /**
           * event listener, it will be notified when the table component is
           * ready load flickr data from flickr server
           */
          loadModel: function(start, size, word) {
            if (word === "") {
              return 0;
            }
            this.model = new Array();
            for ( var i = 0; i < this.rawModel.length; i++) {
              if (this.rawModel[i].title.toLowerCase().indexOf(
                  word.toLowerCase()) != -1) {
                this.model.push(this.rawModel[i]);
              }
            }
            return this.model.length;
          },

          loadRawModel: function() {

            if (true || document.URL.indexOf('http://') == -1
                || !window.navigator.onLine) { // read

              // from
              // local
              this.appCtx = tau.getCurrentContext();
              this.rawModel = this.appCtx.getConfig().appData;
            }
            if (!this.rawModel) {
              function loaded(resp) {
                if (resp.status === 200) {
                  this.rawModel = resp.responseJSON;
                } else {
                  alert('Error: ' + resp.statusText);
                }
              }
              ;
              tau.req({
                'url': '/tau/appstore/recommend',
                'callbackFn': tau.ctxAware(loaded, this)
              }).send();
            }
          },

          /**
           * event listener, it will be notified when a user touches table cell
           */
          cellSelected: function(current, before) {
            if (current instanceof tau.ui.TableCell) {
              var idx = this.getTable().indexOf(current).pop(); // index is
              // array
              this.model[idx].$optionize = false; // disables optionizing
              var detail = new tau.sample.store.AppDetailController(
                  this.model[idx]);
              this.getParent().pushController(detail);
            }
          },

          /**
           * Frees resources no longer used
           */
          destroy: function() {
            tau.sample.store.AppsSearchController.$super.destroy.apply(this,
                arguments);
            this.model = null;
          }
        });

/**
 * Class for FlickerListController This class will be loading scene using
 * compiled scene file(list.scene.js)
 */
$class('tau.sample.store.AppsRecommendController')
    .extend(tau.ui.TableSceneController)
    .define(
        {
          /**
           * Default constructor
           */
          AppsRecommendController: function() {
            this.model = null;
          },

          init: function() {

            tau.sample.store.AppsListController.$super.init.apply(this,
                arguments);
            var scene = this.getScene();
            var table = new tau.ui.Table({
              styles: {
                backgroundColor: '#ccc',
              }
            });

            /** **************************** 임시 코드****************** */
            var panel1 = new tau.ui.Panel({
              styles: {
                width: '312px'
              }
            });
            var imageView1 = new tau.ui.ImageView({
              src: '/img/temp1.png',
              styles: {
                height: '50px',
                width: '48%',
                'border-radius': '10px',
                margin: '1%'
              }
            });
            panel1.add(imageView1);
            var imageView2 = new tau.ui.ImageView({
              src: '/img/temp2.png',
              styles: {
                height: '50px',
                width: '48%',
                'border-radius': '10px',
                margin: '1%'
              }
            });
            panel1.add(imageView2);
            var tableCell1 = new tau.ui.TableCell({
              disabled: true,
              contentItem: panel1,
              styles: {
                height: '70px',
              }
            });
            table.add(tableCell1);
            var panel2 = new tau.ui.Panel({
              styles: {
                width: '312px'
              }
            });
            var imageView3 = new tau.ui.ImageView({
              src: '/img/temp3.png',
              styles: {
                height: '50px',
                width: '48%',
                'border-radius': '10px',
                margin: '1%'
              }
            });
            panel2.add(imageView3);
            var imageView4 = new tau.ui.ImageView({
              src: '/img/temp4.png',
              styles: {
                height: '50px',
                width: '48%',
                'border-radius': '10px',
                margin: '1%'
              }
            });
            panel2.add(imageView4);
            var tableCell2 = new tau.ui.TableCell({
              disabled: true,
              contentItem: panel2,
              styles: {
                height: '70px',
              }
            });
            table.add(tableCell2);
            /** ******************************************************************************* */
            scene.add(table);
          },
          /**
           * event listener, it will be notified when data to make a cell is
           * ready creates new TableCell instance and adds as a row
           * payload.data: an element of the loaded data(array) payload.index:
           * the index(0-based) of rows
           */
          makeTableCell: function(index, offset) {
            var cell = new tau.ui.TableCell(
                {
                  styles: {
                    backgroundImage: '-webkit-gradient(linear, left top, left bottom,from(white),color-stop(40%,white),color-stop(80%,#EFEFEF),to(#DDD));',
                    height: '70px',
                    cellLeftItemWidth: '70px',
                    'border-top': '1px solid #F2F2F0',
                    'border-bottom': '1px solid #BFBFBD'
                  }
                }), data = this.model[index];
            cell.setTitle(data.title);
            if (!data.icon) {
              data.icon = '/icon.png';
            }
            // FIXME 자신의 app, shared resource만 접근할 수 있다.
            cell.setLeftItem(new tau.ui.ImageView({
              src: '/../' + data.name + data.icon,
              styles: {
                margin: '5px',
                width: '60px',
                height: '60px'
              }
            }));
            cell.setStyle('background-color', index % 2 == 0 ? '#ccc' : '#ddd');
            cell.setSubTitle(data.vendor);
            return cell;
          },

          /**
           * event listener, it will be notified when the table component is
           * ready load flickr data from flickr server
           */
          loadModel: function(start, size) {
            if (true || document.URL.indexOf('http://') == -1
                || !window.navigator.onLine) { // read
              // from
              // local
              this.appCtx = tau.getCurrentContext();
              this.model = this.appCtx.getConfig().appData;
              this.getTable().addNumOfCells(this.model.length);
            }
            if (!this.model) {
              function loaded(resp) {
                if (resp.status === 200) {
                  this.model = resp.responseJSON;
                  this.getTable().addNumOfCells(this.model.length);
                } else {
                  alert('Error: ' + resp.statusText);
                }
              }
              ;
              tau.req({
                'url': '/tau/appstore/recommend',
                'callbackFn': tau.ctxAware(loaded, this)
              }).send();
            }
            return -1;
          },

          /**
           * event listener, it will be notified when a user touches table cell
           */
          cellSelected: function(current, before) {
            if (current instanceof tau.ui.TableCell) {
              var idx = this.getTable().indexOf(current).pop(); // index is
              if (idx < 2) {
                return;
              }
              idx -= 2;
              this.model[idx].$optionize = false; // disables optionizing
              var detail = new tau.sample.store.AppDetailController(
                  this.model[idx]);
              this.getParent().pushController(detail);
            }
          },

          /**
           * Frees resources no longer used
           */
          destroy: function() {
            tau.sample.store.AppsRecommendController.$super.destroy.apply(this,
                arguments);
            this.model = null;
          }
        });

/**
 * Class for FlickerListController This class will be loading scene using
 * compiled scene file(list.scene.js)
 */
$class('tau.sample.store.AppsListController')
    .extend(tau.ui.TableSceneController)
    .define(
        {
          /**
           * Default constructor
           */
          AppsListController: function() {
            this.model = null;
          },

          init: function() {

            tau.sample.store.AppsListController.$super.init.apply(this,
                arguments);
            var scene = this.getScene();
            var table = new tau.ui.Table({
              styles: {
                backgroundColor: '#ccc',
              }
            });
            scene.add(table);
          },
          /**
           * event listener, it will be notified when data to make a cell is
           * ready creates new TableCell instance and adds as a row
           * payload.data: an element of the loaded data(array) payload.index:
           * the index(0-based) of rows
           */
          makeTableCell: function(index, offset) {
            var cell = new tau.ui.TableCell(
                {
                  styles: {
                    backgroundImage: '-webkit-gradient(linear, left top, left bottom,from(white),color-stop(40%,white),color-stop(80%,#EFEFEF),to(#DDD));',
                    height: '70px',
                    cellLeftItemWidth: '70px',
                    'border-top': '1px solid #F2F2F0',
                    'border-bottom': '1px solid #BFBFBD'
                  }
                }), data = this.model[offset + index];
            cell.setTitle(data.title);
            if (!data.icon) {
              data.icon = '/icon.png';
            }
            // FIXME 자신의 app, shared resource만 접근할 수 있다.
            cell.setLeftItem(new tau.ui.ImageView({
              src: '/../' + data.name + data.icon,
              styles: {
                margin: '5px',
                width: '60px',
                height: '60px'
              }
            }));
            cell.setStyle('background-color', index % 2 == 0 ? '#ccc' : '#ddd');
            cell.setSubTitle(data.vendor);
            return cell;
          },

          /**
           * event listener, it will be notified when the table component is
           * ready load flickr data from flickr server
           */
          loadModel: function(start, size) {
            if (true || document.URL.indexOf('http://') == -1
                || !window.navigator.onLine) { // read
              // from
              // local
              this.appCtx = tau.getCurrentContext();
              this.model = this.appCtx.getConfig().appData;
              this.getTable().addNumOfCells(this.model.length);
            }
            if (!this.model) {
              function loaded(resp) {
                if (resp.status === 200) {
                  this.model = resp.responseJSON;
                  this.getTable().addNumOfCells(this.model.length);
                } else {
                  alert('Error: ' + resp.statusText);
                }
              }
              ;
              tau.req({
                'url': '/tau/appstore/recommend',
                'callbackFn': tau.ctxAware(loaded, this)
              }).send();
            }
            return -1;
          },

          /**
           * event listener, it will be notified when a user touches table cell
           */
          cellSelected: function(current, before) {
            if (current instanceof tau.ui.TableCell) {
              var idx = this.getTable().indexOf(current).pop(); // index is
              // array
              this.model[idx].$optionize = false; // disables optionizing
              var detail = new tau.sample.store.AppDetailController(
                  this.model[idx]);
              this.getParent().pushController(detail);
            }
          },

          /**
           * Frees resources no longer used
           */
          destroy: function() {
            tau.sample.store.AppsListController.$super.destroy.apply(this,
                arguments);
            this.model = null;
          }
        });

/**
 */
$class('tau.sample.store.AppDetailController')
    .extend(tau.ui.SceneController)
    .define(
        {
          /**
           * Constructor
           * @param {Object} item flickr individual item
           */
          AppDetailController: function(detail) {
            this._detail = detail;
            this.setTitle('정보');
          },

          /**
           * 
           */
          loadScene: function() {

            var scene = this.getScene();
            scene
                .setStyles({
                  'background-image': '-webkit-gradient(linear, left top, left bottom,from(#999),color-stop(20%,#ccc),to(#ccc))'
                });

            var panel = new tau.ui.Panel({
              styles: {
                width: '100%',
                height: '100px'
              }
            });

            // FIXME 자신의 app, shared resource만 접근할 수 있다.
            var src = '/../' + this._detail.name + this._detail.icon;
            var img = new tau.ui.ImageView(
                {
                  'src': src,
                  styles: {
                    left: '10px',
                    top: '10px',
                    width: '60px',
                    '-webkit-box-reflect': 'below 0px -webkit-gradient(linear, 0% 70%, 0% 100%, from(transparent), to(rgba(0, 0, 0, 0.398438)))'
                  }
                });

            var vendor = new tau.ui.Label({
              text: this._detail.vendor,
              styles: {
                top: '30px',
                left: '80px',
                color: '#555',
                'font-weight': 'bold',
                'font-size': '0.8em',
                'text-shadow': 'rgba(255,255,255, 0.5) 0 1px'
              }
            });
            var title = new tau.ui.Label({
              text: this._detail.title,
              styles: {
                top: '10px',
                left: '80px',
                'font-weight': 'bold',
                'font-size': '1.4em',
                'text-shadow': 'rgba(255,255,255, 0.5) 0 1px'
              }
            });
            var install = new tau.ui.Button({
              'label': '설치',
              styleClass: {
                type: 'sanmarino'
              },
              styles: {
                top: '50px',
                right: '10px'
              }
            });

            var desc = new tau.ui.Label({
              text: this._detail.desc,
              styles: {
                'border-bottom': '1px dashed gray',
                padding: '10px'
              }
            });

            panel.add(img);
            panel.add(vendor);
            panel.add(title);
            panel.add(install);
            scene.add(panel);
            scene.add(desc);

            panel = new tau.ui.Panel({
              styles: {
                width: '100%',
                height: '30px',
                'font-size': '14px',
                'border-bottom': '1px dashed gray',
                'border-top': '1px dashed lightgray'
              }
            });

            var vendorLabel = new tau.ui.Label({
              text: '회사',
              styles: {
                right: '80%',
                color: '#555',
                'font-weight': 'bold',
                margin: '6px'
              }
            });

            var vendorName = new tau.ui.Label({
              text: this._detail.vendor,
              styles: {
                left: '25%',
                margin: '6px'
              }
            });

            panel.add(vendorLabel);
            panel.add(vendorName);
            scene.add(panel);

            panel = new tau.ui.Panel({
              styles: {
                width: '100%',
                height: '30px',
                'font-size': '14px',
                'border-bottom': '1px dashed gray',
                'border-top': '1px dashed lightgray'
              }
            });
            var versionLabel = new tau.ui.Label({
              text: '버전',
              styles: {
                right: '80%',
                color: '#555',
                'font-weight': 'bold',
                margin: '6px'
              }
            });

            var versionName = new tau.ui.Label({
              text: this._detail.version,
              styles: {
                left: '25%',
                margin: '6px'
              }
            });
            panel.add(versionLabel);
            panel.add(versionName);
            scene.add(panel);
            install.onEvent(tau.rt.Event.TAP, this.handleInstallTouched, this);
          },

          /**
           * 
           * @param e
           * @param payload
           */
          handleInstallTouched: function(e, payload) {
            var scene = this.getScene();
            scene.fireEvent(tau.rt.Event.RT_START, '$dashboard');
            scene.fireEvent(tau.rt.Event.RT_INSTALL, {
              name: this._detail.name,
              sys: false
            });
          },

          /**
           * Frees resources no longer used
           */
          destroy: function() {
            tau.sample.store.AppDetailController.$super.destroy.apply(this,
                arguments);
            this._item = null;
          }
        });