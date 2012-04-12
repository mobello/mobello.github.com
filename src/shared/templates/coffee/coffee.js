
/*********************** sub template part ***********************/
$class('tau.tmpl.coffee.CarouselTemplateA').define({
  CarouselTemplateA: function (outerLayer, data) {
    this.outerLayer = outerLayer; 
    this.data = data;    
    this.appCtx = tau.getCurrentContext();
  },

  attachCarousel: function () {
    var that = this;
    
    this.basePanel = new tau.ui.Panel({
      styles: ({
        width: '100%',
        height: '100%'
      })
    }); 
    
    this.newCarousel = new tau.ui.Carousel({
      styles: ({
        height: '90%',
        width: '100%'
      })
    });
    for(var i=0 ; i<that.data.length ; i++){
      var newImg = new tau.ui.ImageView({
        src: that.data[i].img,
        styles: ({
          height: '100%',
          width: '100%',
          backgroundSize: '100% 100%'
        })
      });
      var panel = new tau.ui.Panel();
      panel.add(newImg);
      that.newCarousel.add(panel);
    }
    
    this.basePanel.add(that.newCarousel);
    this.outerLayer.add(this.basePanel);
    this.outerLayer.update();
  },
  
  hideContent: function () {
    if(this.basePanel){
      this.basePanel.setStyles({
        'display' : 'none'
      });
    }    
  },
  
  showContent: function () {
    if(this.basePanel){
      this.basePanel.setStyles({
        'display' : 'block'
      });
    }    
  },
  
  getCarousel: function () {
    return this.newCarousel;
  }
  
});


$class('tau.tmpl.coffee.CarouselTemplateB').define({
  CarouselTemplateB: function (outerLayer, data) {
    this.outerLayer = outerLayer; 
    this.data = data;    
    this.appCtx = tau.getCurrentContext();
  },

  attachCarousel: function () {
    var that = this;
    
    this.basePanel = new tau.ui.Panel({
      styles: ({
        width: '100%',
        height: '100%'
      })
    }); 
    
    var contentPanel = new tau.ui.ScrollPanel({
      options : {
      vScroll : false
      },
      styles : {
      top : '20%',
      height : '60%',
      'border-top' : '3px solid #262626',
      'border-bottom' : '3px solid #262626',
      'border-left' : '0',
      'border-right' : '0',
      display : 'block'
      }
    });

    var width = tau.getWidth();
    
    var pic1 = new tau.ui.Panel({
      styles : {
      top : '0%',
      left : width * 0 + 'px',
      height : '100%',
      width : width * 30 / 100 + 'px',
      backgroundColor : 'black',
      opacity : '1.0'
      }
    });

    var image1 = new tau.ui.ImageView({
      src : that.data[1].img,
      styles : {
      height : '100%',
      width : '100%'
      }
    });
    pic1.add(image1);
    
    contentPanel.add(pic1);

    this.basePanel.add(contentPanel);
    this.outerLayer.add(this.basePanel);
    this.outerLayer.update();
  },
  
  hideContent: function () {
    if(this.basePanel){
      this.basePanel.setStyles({
        'display' : 'none'
      });
    }    
  },
  
  showContent: function () {
    if(this.basePanel){
      this.basePanel.setStyles({
        'display' : 'block'
      });
    }    
  },
  
  getCarousel: function () {
    return this.newCarousel;
  }
  
});


$class('tau.tmpl.coffee.ImageTemplateA').define({
  ImageTemplateA: function (outerLayer, data) {
    this.outerLayer = outerLayer; 
    this.data = data;    
    this.appCtx = tau.getCurrentContext();
  },

  attachCarousel: function () {
    var that = this;
    
    this.basePanel = new tau.ui.Panel({
      styles: ({
        width: '100%',
        height: '100%'
      })
    }); 
    
    var contentPanel = new tau.ui.ScrollPanel({
      options : {
      vScroll : false
      },
      styles : {
      top : '10%',
      left : '5%',
      height : '30%',
      width : '90%',
      'border-top' : '3px solid #262626',
      'border-bottom' : '3px solid #262626',
      'border-left' : '3px solid #262626',
      'border-right' : '3px solid #262626',
      display : 'block'
      }
    });

    var width = tau.getWidth();
    
    var tempPic = [];
    var tempImage = [];
    
    for(var i=0 ; i<this.data.length ; i++){
      tempPic[i] = new tau.ui.Panel({
        styles : {
          top : '0%',
          left : width * i * 35 / 100 + 'px',
          height : '100%',
          width : width * 30 / 100 + 'px',
          backgroundColor : 'black',
          opacity : '0.5'
        }
      });
      
      tempImage[i] = new tau.ui.ImageView({
        src : that.data[i].img,
        styles : {
        height : '100%',
        width : '100%',
        backgroundSize: '100% 100%'
        }
      });
      
      tempImage[i].id = i;
      
      tempImage[i].onEvent(tau.rt.Event.TAP, function(event, payload) {
        var test = event.getSource().id;
        for(var j=0 ; j<that.data.length ; j++){
          tempPic[j].setStyles({
            opacity : '0.5'
          });
        }
        tempPic[test].setStyles({
          opacity : '1.0'
        });
      });
      
      tempPic[i].add(tempImage[i]);
      contentPanel.add(tempPic[i]);
    }
    
    tempPic[1].setStyles({
      opacity : '1.0'
    });
    
    this.basePanel.add(contentPanel);
    this.outerLayer.add(this.basePanel);
    this.outerLayer.update();
  },
  
  hideContent: function () {
    if(this.basePanel){
      this.basePanel.setStyles({
        'display' : 'none'
      });
    }    
  },
  
  showContent: function () {
    if(this.basePanel){
      this.basePanel.setStyles({
        'display' : 'block'
      });
    }    
  },
  
  getCarousel: function () {
    return this.newCarousel;
  }
  
});


$class('tau.tmpl.coffee.TableTemplateC').define({
  TableTemplateC: function (outerLayer, data) {
    this.outerLayer = outerLayer; 
    this.data = data;
    this.btb;
    
    this.appCtx = tau.getCurrentContext();
  },
  
  attachTable: function (sequenceController, attachSceneName) {
    var that = this;
    this.currentCtrl = sequenceController;  
    
    this.basePanel = new tau.ui.Panel({
      styles: ({
        width: '100%',
        height: '100%'
      })
    }); 
    
    if(this.getTable() == null){
      var isGroup = false;
      if(that.data[0].group != null){
        isGroup = true;
      }
      

      this.table = new tau.ui.Table({
        pullToRefresh:'down', 
        pullDownFn : function (){
          that.text = new tau.ui.TextField({
            type: tau.ui.TextField.search,
            placeholderLabel: 'search',
            clearButtonMode: true,
            placeholderImage : '/img/icon_search.gif',
            styles: ({
              top : '11%',
              left : '10%',
              width : '60%'
            })
          });
          
          that.searchBtn = new tau.ui.Button({
            styleClass: {shape: 'red'},
            label: '검색',
            styles: ({
              top : '11%',
              left : '75%',
              width : '15%',
              height: '5%'
            })
          });
          that.basePanel.add(that.text);
          that.basePanel.add(that.searchBtn);
          that.outerLayer.add(that.basePanel);          
          that.table.setStyles({
            top : '20%'
          });
          that.outerLayer.update();
          that.table.refresh();
        },
        group : isGroup,
        styleClass: {section: 'sectiongroup'},
        
        styles: ({
          'background-image' : 'url(/img/coffeeGray.png)',
          'background-repeat': 'no-repeat',
          'background-position': 'center',
          backgroundSize: '100% 100%'
        })
      });

      if(that.data[0].group != null){
        this.table.setFoldable(true);
        this.table.setFoldedSections([that.data[0].group]);
      }

      for(var i=0 ; i<that.data.length ; i++){
        var cell = new tau.ui.TableCell();
        if(that.data[i].group != null){
          cell.setGroupName(that.data[i].group);
        }
        cell.setTitle(that.data[i].title);
        
        if(that.data[i].subtitle){
          cell.setSubTitle(that.data[i].subtitle);
        }
        else if(that.data[i].long_subtitle){
          cell.setSubTitle(that.data[i].long_subtitle);
          this.table.setStyleClass({
            cellSize : 'auto'
          });
        }
        
        
        if(that.data[i].img){
          cell.setLeftItem(
              new tau.ui.ImageView({
                src: that.data[i].img,
                styles: ({
                  backgroundSize: '100% 100%'
                })
              })
            );
        }
        
        cell.setRightItem(           
          new tau.ui.ImageView({
            src: 'http://www.hollys.co.kr/mobile/img/menu/ar.png',
            styles: ({
              top: '45%',
              height: '9px',
              left: '45%',
              width: '6px'
            })
          })
        );     
      
        cell.id = i;
        
        that.table.add(cell);
      }
      
      this.btb = attachSceneName;
      
      that.table.onEvent(tau.rt.Event.SELECTCHANGE, function(event, payload) {
        var ajkdlasdjlk = payload.current.id;
        if (payload.current instanceof tau.ui.TableCell) {
            var test = payload.current.id;
          if(attachSceneName == 'tau.tmpl.coffee.MenuDetailPage'){
            that.currentCtrl.pushController(new tau.tmpl.coffee.MenuDetailPage(test, that.data));
          }
          
          else if(attachSceneName == 'tau.tmpl.coffee.EventDetailPage'){
            that.currentCtrl.pushController(new tau.tmpl.coffee.EventDetailPage(test, that.data));
          }
          
          else if(attachSceneName == 'tau.tmpl.coffee.CouponDetailPage'){
            that.currentCtrl.pushController(new tau.tmpl.coffee.CouponDetailPage(test, that.data));
          }
        }

      });
      
    }
    this.basePanel.add(this.table);
    this.outerLayer.add(this.basePanel);
    this.outerLayer.update();
  },
  
  hideContent: function () {
    if(this.basePanel){
      this.basePanel.setStyles({
        'display' : 'none'
      });
    }    
  },
  
  showContent: function () {
    if(this.basePanel){
      this.basePanel.setStyles({
        'display' : 'block'
      });
    }    
  },
  
  setTable: function (table) {
    this.table = table;
  },
  
  getTable: function () {
    return this.table;
  }
});

/** TableTemplateC copy and change */
$class('tau.tmpl.coffee.TableTemplateC1').define({
  TableTemplateC1: function (outerLayer, data) {
    this.outerLayer = outerLayer; 
    this.data = data;
    this.btb;
    
    this.appCtx = tau.getCurrentContext();
  },
  
  attachTable: function (sequenceController, attachSceneName) {
    var that = this;
    this.currentCtrl = sequenceController;  
    
    this.basePanel = new tau.ui.Panel({
      styles: ({
        width: '100%',
        height: '100%'
      })
    }); 
    
    if(this.getTable() == null){
      var isGroup = false;
      if(that.data[0].group != null){
        isGroup = true;
      }
      

      this.table = new tau.ui.Table({
        pullToRefresh:'down', 
        pullDownFn : function (){
          that.text = new tau.ui.TextField({
            type: tau.ui.TextField.search,
            placeholderLabel: 'search',
            clearButtonMode: true,
            placeholderImage : '/img/icon_search.gif',
            styles: ({
              top : '11%',
              left : '10%',
              width : '60%'
            })
          });
          
          that.searchBtn = new tau.ui.Button({
            styleClass: {shape: 'red'},
            label: '검색',
            styles: ({
              top : '11%',
              left : '75%',
              width : '15%',
              height: '5%'
            })
          });
          that.basePanel.add(that.text);
          that.basePanel.add(that.searchBtn);
          that.outerLayer.add(that.basePanel);          
          that.table.setStyles({
            top : '20%'
          });
          that.outerLayer.update();
          that.table.refresh();
        },
        group : isGroup,        
        styles: ({
          'background-image' : 'url(/img/coffeeGray.png)',
          'background-repeat': 'no-repeat',
          'background-position': 'center',
          backgroundSize: '100% 100%'
        })
      });

      if(that.data[0].group != null){
        this.table.setFoldable(true);
      }

      for(var i=0 ; i<that.data.length ; i++){
        var cell = new tau.ui.TableCell();
        if(that.data[i].group != null){
          cell.setGroupName(that.data[i].group);
        }
        cell.setTitle(that.data[i].title);
        
        if(that.data[i].subtitle){
          cell.setSubTitle(that.data[i].subtitle);
        }
        else if(that.data[i].long_subtitle){
          cell.setSubTitle(that.data[i].long_subtitle);
          this.table.setStyleClass({
            cellSize : 'auto'
          });
        }
        
        
        if(that.data[i].img){
          cell.setLeftItem(
              new tau.ui.ImageView({
                src: that.data[i].img,
                styles: ({
                  backgroundSize: '100% 100%'
                })
              })
            );
        }
        
        cell.setRightItem(           
          new tau.ui.ImageView({
            src: 'http://www.hollys.co.kr/mobile/img/menu/ar.png',
            styles: ({
              top: '45%',
              height: '9px',
              left: '45%',
              width: '6px'
            })
          })
        );     
      
        cell.id = i;
        
        that.table.add(cell);
      }
      
      this.btb = attachSceneName;
      
      that.table.onEvent(tau.rt.Event.SELECTCHANGE, function(event, payload) {
        var ajkdlasdjlk = payload.current.id;
        if (payload.current instanceof tau.ui.TableCell) {
            var test = payload.current.id;
          if(attachSceneName == 'tau.tmpl.coffee.MenuDetailPage'){
            that.currentCtrl.pushController(new tau.tmpl.coffee.MenuDetailPage(test, that.data));
          }
          
          else if(attachSceneName == 'tau.tmpl.coffee.EventDetailPage'){
            that.currentCtrl.pushController(new tau.tmpl.coffee.EventDetailPage(test, that.data));
          }
          
          else if(attachSceneName == 'tau.tmpl.coffee.CouponDetailPage'){
            that.currentCtrl.pushController(new tau.tmpl.coffee.CouponDetailPage(test, that.data));
          }
        }

      });
      
    }
    this.basePanel.add(this.table);
    this.outerLayer.add(this.basePanel);
    this.outerLayer.update();
  },
  
  hideContent: function () {
    if(this.basePanel){
      this.basePanel.setStyles({
        'display' : 'none'
      });
    }    
  },
  
  showContent: function () {
    if(this.basePanel){
      this.basePanel.setStyles({
        'display' : 'block'
      });
    }    
  },
  
  setTable: function (table) {
    this.table = table;
  },
  
  getTable: function () {
    return this.table;
  }
});


$class('tau.tmpl.coffee.TableTemplateD').define({
  TableTemplateD: function (outerLayer, data) {
    this.outerLayer = outerLayer; 
    this.data = data;
    
    this.appCtx = tau.getCurrentContext();
  },
  
  attachTable: function () {
    var that = this;    
    
    this.basePanel = new tau.ui.Panel({
      styles: ({
        width: '100%',
        height: '100%'
      })
    }); 
    
    if(this.getTable() == null){
      var isGroup = false;
      if(that.data[0].group != null){
        isGroup = true;
      }
      
      this.table = new tau.ui.Table({
        group : isGroup,
        styles: ({
          'background-image' : 'url(/img/coffeeGray.png)',
          'background-repeat': 'no-repeat',
          'background-position': 'center',
          backgroundSize: '100% 100%'
        })
      });

      if(that.data[0].group != null){
        this.table.setFoldable(true);
      }

      for(var i=0 ; i<that.data.length ; i++){
        var cell = new tau.ui.TableCell();
        if(that.data[i].group != null){
          cell.setGroupName(that.data[i].group);
        }
        cell.setTitle(that.data[i].title);
        
        if(that.data[i].subtitle){
          cell.setSubTitle(that.data[i].subtitle);
        }
        else if(that.data[i].long_subtitle){
          cell.setSubTitle(that.data[i].long_subtitle);
          this.table.setStyleClass({
            cellSize : 'auto'
          });
        }
        else if(that.data[i].registerDay){
          cell.setSubTitle(that.data[i].registerDay);
        }
        
        if(that.data[i].number){
          cell.setLeftItem(
              new tau.ui.Label({
                text : that.data[i].number
              })
            );
        }
        else if(that.data[i].img){
          cell.setLeftItem(
              new tau.ui.ImageView({
                src: that.data[i].img,
                styles: ({
                  backgroundSize: '100% 100%'
                })
              })
            );
        }
        
        if(that.data[i].star != null){
          cell.setRightItem(           
            new tau.ui.ImageView({
              src: '/img/star_' + that.data[i].star + '.png',
              styles: ({
                top: '35%',
                height: '30%',
                '-webkit-box-align': 'center'
              })
            })
          );  
        }               
        cell.id = i;        
        that.table.add(cell);
      }
    }
    
    this.basePanel.add(this.table);
    this.outerLayer.add(this.basePanel);
    this.outerLayer.update();
  },
  
  hideContent: function () {
    if(this.basePanel){
      this.basePanel.setStyles({
        'display' : 'none'
      });
    }    
  },
  
  showContent: function () {
    if(this.basePanel){
      this.basePanel.setStyles({
        'display' : 'block'
      });
    }    
  },
  
  setTable: function (table) {
    this.table = table;
  },
  
  getTable: function () {
    return this.table;
  }
});


$class('tau.tmpl.coffee.MenuDetailPage').extend(tau.ui.SceneController).define({
  MenuDetailPage: function (id, data) {
    this.setTitle('MenuDetailPage');
    this.id = id;
    this.detailData = data[this.id];
  },
  
  init: function () {
    this.appCtx = tau.getCurrentContext();
  },
  
  loadScene: function () {   
    var that = this;
    var mainTitle = new tau.ui.TextView({
      text: this.detailData.title,
      styles: ({
        height: '10%',
        width: '100%',
        'background': 'transparent',
        'font-size': 'large',
        'font-family': 'Arial, Helvetica' 
      })
    });  
    
    var subTitle = new tau.ui.TextView({
    text: this.detailData.subTitle,
    styles: ({
      height: '10%',
      width: '100%',
      'border-bottom': 'solid 1px #D9D9D9',
      'background': 'transparent',
      'font-size': 'middle',
      'font-family': 'Arial' 
    })
  }); 
    
    var textViewDetail = new tau.ui.TextView({
    text: this.detailData.explain,
    styles: ({
      height: '15%',
      width: '100%',
      'background': 'transparent',
      'font-size': 'small',
      'font-family': 'Arial' 
    })
  });  
    
    var detailView = new tau.ui.ImageView({
      src: this.detailData.detailImg,
      styles: ({
        top: '40%',
        height: '60%',
        width: '100%',
        backgroundSize: '35% 100%'
      })
    });
    
    this.getScene().setStyles({
      'background-image' : 'url(http://www.hollys.co.kr/mobile/img/main/back_wide.gif)',
      'background-repeat': 'no-repeat',
      'background-position': '50% 0%',
      backgroundSize: '230% 100%'
    });
    
    this.getScene().add(mainTitle); 
    this.getScene().add(subTitle); 
    this.getScene().add(textViewDetail); 
    this.getScene().add(detailView); 
  }
});


$class('tau.tmpl.coffee.EventDetailPage').extend(tau.ui.SceneController).define({
  EventDetailPage: function (index, data) {
    this.setTitle('EventDetailPage');
    this.index = index;
    this.detailData = data[this.index];
  },
  
  loadScene: function () { 
    var textView = new tau.ui.TextView({
      text: this.detailData.explain,
      styles: ({
        height: '10%',
        width: '100%',
        'background': 'transparent',
        'font-size': 'small',
        'font-family': 'Arial' 
      })
    });  
    
    this.getScene().setStyles({
      'background-image' : 'url(http://www.hollys.co.kr/mobile/img/main/back_wide.gif)',
      'background-repeat': 'no-repeat',
      'background-position': '50% 0%',
      backgroundSize: '230% 100%'
    });
    
    this.getScene().add(textView); 
  }
});

$class('tau.tmpl.coffee.CouponDetailPage').extend(tau.ui.SceneController).define({
  CouponDetailPage: function (index, data) {
    this.setTitle('CouponDetailPage');
    this.index = index;
    this.detailData = data[this.index];
  },
  
  loadScene: function () { 
    var textView = new tau.ui.TextView({
      text: 'Product Name : ' + this.detailData.title,
      styles: ({
        height: '10%',
        width: '100%',
        'background': 'transparent',
        'font-size': 'large',
        'font-weight': 'bold',
        'font-family': 'Arial' 
      })
    }); 
    
    var textView2 = new tau.ui.TextView({
      text: 'publish day : ' + this.detailData.publishDay,
      styles: ({
        top: '10%',
        left: '0%',
        'background': 'transparent',
        'font-size': 'small',
        'font-family': 'Arial' 
      })
    }); 
    
    var textView3 = new tau.ui.TextView({
      text: 'due day : ' + this.detailData.dueDay,
      styles: ({
        top: '10%',
        left: '50%',
        'background': 'transparent',
        'font-size': 'small',
        'font-family': 'Arial' 
      })
    }); 
    
    var textView4 = new tau.ui.TextView({
      text: 'exchange : ' + this.detailData.changePlace,
      styles: ({
        top: '20%',
        height: '10%',
        width: '100%',
        'background': 'transparent',
        'font-size': 'small',
        'font-family': 'Arial' 
      })
    }); 

    this.getScene().setStyles({
      'background-image' : 'url(http://www.hollys.co.kr/mobile/img/main/back_wide.gif)',
      'background-repeat': 'no-repeat',
      'background-position': '50% 0%',
      backgroundSize: '230% 100%'
    });
    
    this.getScene().add(textView); 
    this.getScene().add(textView2); 
    this.getScene().add(textView3); 
    this.getScene().add(textView4); 
  }
});


$class('tau.tmpl.coffee.InfoDetailPage').extend(tau.ui.SceneController).define({
  InfoDetailPage: function (storeName) {
    this.setTitle('InfoDetailPage');
    this.storeName = storeName;
  },
  
  init: function () {  
    this.appCtx = tau.getCurrentContext(); 
    this.config = tau.getConfig();
  },
  
  loadScene: function () { 
    var that = this;
    
    for(var i=0 ; i<PLACELIST_DATA.length ; i++){
      if(PLACELIST_DATA[i].storeName == this.storeName){
        var detailView = new tau.ui.ImageView({
          src: '/img/' + PLACELIST_DATA[i].detailViewImg,
          styles: ({
            top: '10%',
            height: '50%',
            width: '100%',
            backgroundSize: '100% 100%'
          })
        });
        
        var labelPanel = new tau.ui.Panel({
          styles: ({
            top: '70%',
            height: '30%',
            width: '100%'
          })
        });
        
        var storeLabel = new tau.ui.Label({
          text : 'store name : ' + PLACELIST_DATA[i].storeName,
          styles: ({
            width : '100%',
            border : '1px solid #959595'
          })
        });
        
        var addressLabel = new tau.ui.Label({
          text : 'address : ' + PLACELIST_DATA[i].address,
          styles: ({
            width : '100%',
            border : '1px solid #959595'
          })
        });
        
        var telLabel = new tau.ui.Label({
          text : 'tel : ' + PLACELIST_DATA[i].tel,
          styles: ({
            width : '100%',
            border : '1px solid #959595'
          })
        });

        
        labelPanel.add(storeLabel);
        labelPanel.add(addressLabel);
        labelPanel.add(telLabel);
      }    
    }
 
    this.getScene().add(detailView); 
    this.getScene().add(labelPanel);
  },
  
  destroy: function (){ 
    this.storeName = null;
  }
});
