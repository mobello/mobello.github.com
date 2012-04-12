$require('/fileupload/fileuploader.js');

$class('com.tau.storeserver.Main').extend(tau.ui.SequenceNavigator).define({
	Main: function () {
		
	},
	
	init: function () {
		this.setRootController(new com.tau.storeserver.Intro());
		/*
		this.onEvent('modifyComplete', function () {
		  this.popController();
		  this.pushController(new com.tau.storeserver.Apps());
		}, this);
		*/
	}
});
$class('com.tau.storeserver.Intro').extend(tau.ui.SceneController).define({
	init: function () {
		this.setTitle('App Registry');
		this.appCtx = tau.getCurrentContext();
    var nav = this.getNavigationBar();
    nav.setBackButtonText('Home');
	},
	
	
	loadScene: function () {
	  var sequenceMain = this.getParent();
		var mainPanel = new tau.ui.Panel();
		mainPanel.setStyles({
			'top': '30px', 'margin': '0px auto',
			'max-width': '700px', 'height' : '600px',
			'position': 'relative','display' : 'block'
		});
		this.introCarousel = new tau.ui.Carousel();
		this.introCarousel.setStyles({'top': '0px', 'margin': '0px auto',
			'width': '700px', 'height' : '300px'});
		var tauIntroPanel = new tau.ui.Panel();
		var taufeatureImg = new tau.ui.ImageView({
      src : '/resource/img/taufeature.jpg',
      styles : {'background-color' : 'transparent', width : '700px' , height : '300px',
        'position' : 'relative'
      }
    });
		tauIntroPanel.add(taufeatureImg);
		tauIntroPanel.setStyle('backgroundColor','green');
		var comIntroPanel = new tau.ui.Panel();
		var tausystemImg = new tau.ui.ImageView({
      src : '/resource/img/tausystem.jpg',
      styles : {'background-color' : 'transparent', width : '700px' , height : '300px',
        'position' : 'relative'
      }
    });
		comIntroPanel.add(tausystemImg);
		comIntroPanel.setStyle('backgroundColor','yellow');
		var eventIntroPanel = new tau.ui.Panel();
		var html5rockImg = new tau.ui.ImageView({
      src : '/resource/img/html5rock.png',
      styles : {'background-color' : 'transparent', width : '700px' , height : '300px',
        'position' : 'relative'
      }
    });
		eventIntroPanel.add(html5rockImg);
		eventIntroPanel.setStyle('backgroundColor','blue');
		
		this.introCarousel.setComponents(
		    [tauIntroPanel, comIntroPanel,eventIntroPanel]);
		
		this.appsBtn = new tau.ui.Button();
		this.appsBtn.setStyles({'width': '150px', 'height':'50px' ,
			'top' : '410px', 'left' : '50px'});
		this.appsBtn.setLabel({normal: '등록된 앱'});
		this.appsBtn.onEvent(tau.rt.Event.TAP, function () {
		  sequenceMain.pushController(new com.tau.storeserver.Apps());
		},this);
		
		
		this.uploadBtn = new tau.ui.Button();
		this.uploadBtn.setStyles({'width': '150px', 'height':'50px',
			'top' : '410px', 'right' : '50px'});
		this.uploadBtn.setLabel({normal: '등록'});
		this.uploadBtn.onEvent(tau.rt.Event.TAP, function () {
		  sequenceMain.pushController(new com.tau.storeserver.Upload());
		},this);
		
//		var bottomPanel = new tau.ui.Panel();
//		bottomPanel.setStyles({
//			'bottom' : '0px', 'position' : 'relative',
//			'width' : '100%', 'height' : '100px',
//			'background' : '-webkit-linear-gradient(top, black , gray 40%, gray 80%, black)'
//		});
//		bottomPanel.add(new tau.ui.Label({styles: {
//			'top'	: '50px',
//			'right' : '100px'
//		},text:'copyright TAU. All rights reserved'}));
//		
		
		mainPanel.add(this.introCarousel);
		mainPanel.add(this.appsBtn);
		mainPanel.add(this.uploadBtn);
		var scene = this.getScene();
		scene.setStyles({
		  'background':'-webkit-linear-gradient(top, black 500px, #35425D)',
		  'overflow':'auto'
		});
		scene.add(mainPanel);
//		scene.add(bottomPanel);
		
	}
});


$class('com.tau.storeserver.Apps').extend(tau.ui.SceneController).define({
	init: function () {
    this.setTitle('앱 리스트');
	  this.appCtx = tau.getCurrentContext();
	  this.onEvent('modifyComplete',this.updateTable, this);
	},
	
	updateTable: function () {
	  //this.dismissModal(false);
	  this.getScene().removeAll(true);
	  this.indicator = new tau.ui.ActivityIndicator({
      message : 'Data Loading...'
    });
    
    this.getScene().add(this.indicator);
    this.indicator.start();
    tau.req(
        {
          type : 'GET',
          url : 'apps?path=list',
          callbackFn : tau.ctxAware(this.modelLoaded, this)
    }).send();
    this.getScene().update();
	},
	
  loadScene: function () {
	  this.indicator = new tau.ui.ActivityIndicator({
	    message : 'Data Loading...'
	  });
	  
	  this.getScene().add(this.indicator);
	  this.indicator.start();
    tau.req(
        {
          type : 'GET',
          url : 'apps?path=list',
          callbackFn : tau.ctxAware(this.modelLoaded, this)
    }).send();
	  
	  
	},
	
	modelLoaded: function (resp) {
	  console.log(resp);
	  
	  if (resp.status !== 200) {
      tau.alert('데이터가 로딩되지 못했습니다. 재시도 해주세요 : ' + resp.statusText);
      return;
    }
	  
	  var jsonData = eval("("+resp.responseText+")");
    this.appsData = jsonData["apps"];
	  
	  
	  var mainPanel = new tau.ui.Panel();
    mainPanel.setStyles({
      'margin': '0px auto',
      'width': '100%', 'height' : '100%',
      'position': 'relative','display' : 'block'
    });
    this.searchPanel = new tau.ui.Panel();
    this.searchPanel.setStyles({
      'margin': '0px auto',
      'width': '100%', 'height' : '40px',
      'position': 'relative','display' : '-webkit-box',
      '-webkit-box-orient' : 'horizontal'
      
    });
    
    this.searchField = new tau.ui.TextField({
      type : tau.ui.TextField.TEXT,
      placeholderLabel : '검색어 입력',
      clearButtonMode : true,
      styles : {
        '-webkit-box-flex' :'1.0', height : '40px', width : '944px',
        display : 'flexbox'
      },
      clearsOnBeginEditing : true
    });
    
    this.searchPanel.add(this.searchField);
    
    this.searchBtn = new tau.ui.Button({
      label : {normal :'검색'},
      styles : {
        width : '80px', height : '40px',
        '-webkit-box-flex' : '0.0', display : 'flexbox'
      }
    });
    this.popResultCtrl = new tau.ui.PopoverController({
      width : '500px' , height : '500px'
    });
    this.searchBtn.onEvent(tau.rt.Event.TAP, this.searchApps ,this);
    this.searchPanel.add(this.searchBtn);
    mainPanel.add(this.searchPanel);
    
    this.table = new tau.ui.Table({
      group: true,
      foldable: false,
      cellSort: tau.ui.INDEX_SORT,
      sectionSort: tau.ui.ASC_SORT,
    });
    
    for (var i=0; i < this.appsData.length ; i++) {
      var app = this.appsData[i];
      var cell = new tau.ui.TableCell({
        title: app["title"],
        groupName: app["subgroup"] ,
        subTitle: app["subtitle"]+" / dev: "+app["devDate"] ,
      });
      //cell.setRightItem(new tau.ui.Label({text : '>>'}));
      if (app["icon"]) {
        cell.setLeftItem(new tau.ui.ImageView({
          //TODO : change url 
          src : "/../" + app["apppath"] +"/" + app["icon"],
          styles : {'background-color' : 'transparent',width : '50px'}
        }));
      } else {
        cell.setLeftItem(new tau.ui.ImageView({
          src : '/resource/img/icon.png',
          styles : {'background-color' : 'transparent',width : '50px'}
        }));
      }
      
      
      cell.setStyle('cellLeftItemWidth','70px');
      
      var that = this;
      (function (appTemp) {
        cell.onEvent(tau.rt.Event.TAP, function () {
          
          var sequeceNavi = that.getParent();
          
          var detailCtrl = new com.tau.storeserver.AppDetail(appTemp);
          sequeceNavi.pushController(detailCtrl);
          
          detailCtrl.onEvent('modifyComplete', function () {
            sequeceNavi.popController();
            this.fireEvent('modifyComplete');
          }, this);          
        } , that);
      })(app);
      this.table.add(cell, 0);
      
    }
    
    mainPanel.add(this.table);
    this.getScene().add(mainPanel);
    this.getScene().update();
	},
	
	searchApps : function () {
	  var sequenceNavi = this.getParent();
	  var appResultCtrl = new com.tau.storeserver.AppSearchResult(sequenceNavi, this.appsData, this.searchField);
    appResultCtrl.onEvent('modifyComplete', function () {
      sequenceNavi.popController();
      this.fireEvent('modifyComplete');
      this.popResultCtrl.dismiss();
    }, this);
    this.popResultCtrl.presentCtrl(appResultCtrl, this.searchPanel, { masking : true});
	},

});

$class('com.tau.storeserver.Upload').extend(tau.ui.SceneController).define({
  init: function () {
    this.setTitle('등록');
    var date = new Date();
    
    this.randomKey = date.getTime() + Math.round(Math.random()*1000) +'';
  },
	loadScene: function () {
	  this.layoutPanel = new tau.ui.Panel({
      styles : {
        'top': '30px', 'margin': '0px auto',
        'max-width': '700px', 'height' : '500px',
        'position': 'relative','display' : 'block'
      }
    }); 
	  this.notePanel = new tau.ui.Panel({
      styles : {
        'top': '30px', 
        'width': '300px', 'height' : '500px',
        'position': 'relative'
      }
    }); 
	  
	  this.formPanel = new tau.ui.Panel({
	    styles : {
	      'top': '30px', 'margin': '0px auto',
	      'width': '400px', 'height' : '500px',
	      'position': 'relative','display' : 'block'
	    }
	  }); 
	  var titleLabel = new tau.ui.Label({text : '제목(최대 255자)', styles : {
      'display' : 'block','font-size' : '16px',
      'font-family': 'MuseoSans500' 
    }});
	  
	  this.titleInput = new tau.ui.TextField({
	    type : tau.ui.TextField.TEXT,
	    styles : {
	      width : '400px', 'font-size' : '14px'
	    }
	  });
	  
	  
	  
	  var descriptionLabel = new tau.ui.Label({text : '설명(최소 30자)', styles : {
      'display' : 'block','font-size' : '16px',
      'font-family': 'MuseoSans500'
    }});
	  
	  this.descriptionArea = new tau.ui.TextArea({
      styles : {
        width : '400px', height : '150px','font-size' : '14px'
      }
    });
	  
	  var iconLabel = new tau.ui.Label({text : 'Icon', styles : {
      'display' : 'block','font-size' : '16px',
      'font-family': 'MuseoSans500' 
    }});
    
    this.iconPanel = new tau.ui.Panel({
      styles : {
        'top': '0px',
        'width': '400px', 'height' : '80px',
        'position': 'relative'
      }
    });
    
    var iconUploadArea = document.createElement('div');
    iconUploadArea.setAttribute('id','iconUploadArea');
    tau.util.dom.appendChild(this.iconPanel.getDOM(),iconUploadArea);
    
    var screenShotLabel = new tau.ui.Label({text : '스크린샷 이미지(Drag&Drop)', styles : {
      'display' : 'block','font-size' : '16px',
      'font-family': 'MuseoSans500'
    }});
    
    this.screenShotPanel = new tau.ui.Panel({
      styles : {
        'top': '0px',
        'width': '400px', 'height' : '80px',
        'position': 'relative'
      }
    });
    
    var screenShotUploadArea = document.createElement('div');
    screenShotUploadArea.setAttribute('id','screenShotUploadArea');
    tau.util.dom.appendChild(this.screenShotPanel.getDOM(),screenShotUploadArea);
    
    var appLabel = new tau.ui.Label({text : '앱[zip파일](Drag&Drop)', styles : {
      'display' : 'block','font-size' : '16px',
      'font-family': 'MuseoSans500' 
    }});
    
    this.appPanel = new tau.ui.Panel({
      styles : {
        'top': '0px',
        'width': '400px', 'height' : '80px',
        'position': 'relative'
      }
    });
    
    var appUploadArea = document.createElement('div');
    appUploadArea.setAttribute('id','appUploadArea');
    tau.util.dom.appendChild(this.appPanel.getDOM(),appUploadArea);
    
    this.cancelBtn = new tau.ui.Button({
      label : {normal : '취소'},
      styles : {width : '100px', height: '40px', left: '225px'},
      tap : tau.ctxAware(function () {
        tau.req({
          type: 'POST',
          url: 'app/upload',
          params : 'path=cancel&key='+this.randomKey,
          callbackFn : tau.ctxAware(this.cancelCallBack, this)
        }).send();
      }, this)
    });
    
    
    this.submitBtn = new tau.ui.Button({
      label : {normal : '등록'},
      styles : {width : '100px', height: '40px',left: '375px'},
      tap : tau.ctxAware(this.submit, this)
    });
    
    
	  this.formPanel.add(titleLabel);
	  this.formPanel.add(this.titleInput);
	  this.formPanel.add(descriptionLabel);
	  this.formPanel.add(this.descriptionArea);
	  //this.formPanel.add(iconLabel);
	  //this.formPanel.add(this.iconPanel);
	  this.formPanel.add(screenShotLabel);
	  this.formPanel.add(this.screenShotPanel);
	  this.formPanel.add(appLabel);
    this.formPanel.add(this.appPanel);
	  
/*	  var titleNote = new tau.ui.TextView({text : 
	    'Title 길이는 최대 255자 입니다.', 
	    styles : {
	    top : '0px',  left : '2px', 'height' : '60px',
      'position' : 'relative','font-size' : '14px',
      'border-left' : '1px solid', 'background' : 'transparent',
      'font-family': 'MuseoSans500', 'color' : '#696' 
    }});
	  
	  var DescriptionNote = new tau.ui.TextView({text : 
      'App에 대한 상세한 설명을 \n 최소 30자 이내로 작성 해 주세요.', 
      styles : {
      top : '5px',  left : '2px', 'height' : '60px',
      'position' : 'relative','font-size' : '14px',
      'border-left' : '1px solid', 'background' : 'transparent',
      'font-family': 'MuseoSans500', 'color' : '#696' 
    }});
	  
	  var screenNote = new tau.ui.TextView({text : 
      '이미지의 파일명은 영문만 지원합니다. \n 권장 크기는 320px X 480 px 입니다.', 
      styles : {
      top : '122px', left : '2px',  'height' : '60px',
      'position' : 'relative','font-size' : '14px',
      'border-left' : '1px solid', 'background' : 'transparent',
      'font-family': 'MuseoSans500', 'color' : '#696' 
    }});*/
	  
//	  this.notePanel.add(titleNote);
//	  this.notePanel.add(DescriptionNote);
//	  this.notePanel.add(screenNote);
	  
	  
	  this.uploadPanel = new tau.ui.Panel({
	    styles : {
        'top': '30px', 'margin': '0px auto',
        'max-width': '700px', 'height' : '200px',
        'position': 'relative','display' : 'block'
      }
	  });
	  this.uploadPanel.add(this.cancelBtn);
	  this.uploadPanel.add(this.submitBtn);
	 
	  var scene = this.getScene();
	  scene.setStyles({
	    'background' : 
	      '-webkit-gradient(linear, left top, left bottom, from(#35425D), to(white) )',
	    'overflow' : 'auto'
	  });
	  this.layoutPanel.add(this.formPanel);
	  this.layoutPanel.add(this.notePanel);
	  scene.add(this.layoutPanel);
	  scene.add(this.uploadPanel);
	  
	},
	
	sceneDrawn: function () {
	  /*
	  var iconUploader = new qq.FileUploader({
      element: document.getElementById('iconUploadArea'),
      action: 'StoreServer',
      sizeLimit: 100000,
      allowedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
      params: {  'path': 'icon', 'key': this.randomKey},
      debug: true
    }); 
	  */
	  
	  var screenShotUploadElement = document.getElementById('screenShotUploadArea');
	  var screenShotUploader = new qq.FileUploader({
      element: screenShotUploadElement,
      action: 'app/upload',
      sizeLimit: 100000,
      allowedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
      params: {  'path': 'screenshot', 'key': this.randomKey},
      debug: false,
      onSubmit: function(id, fileName){
        var dropArea = appUploader._find(appUploader._element, 'drop');
        dropArea.style.display = 'none';
      },
      onComplete: tau.ctxAware(this.screenFileUploadComplete,this),
      onCancel: function(id, fileName){},
    });
	  
	  var screenUploadList = screenShotUploadElement.firstChild.childNodes[2];
	  screenUploadList.style.overflow = "auto";
	  screenUploadList.style.height = "40px";
	  
	  var appUploadElement = document.getElementById('appUploadArea');
	  var appUploader = new qq.FileUploader({
      element: appUploadElement,
      action: 'app/upload',
      sizeLimit: 10000000,
      allowedExtensions: ['zip'],
      params: {  'path': 'app', 'key': this.randomKey},
      debug: false,
      onSubmit: function(id, fileName){
        var dropArea = screenShotUploader._find(screenShotUploader._element, 'drop');
        dropArea.style.display = 'none';
      },
      onProgress: function(id, fileName, loaded, total){},
      onComplete: tau.ctxAware(this.appFileUploadComplete,this),
      onCancel: function(id, fileName){},
    });
	  
	  var appUploadList = document.getElementById('appUploadArea').firstChild.childNodes[2];
    appUploadList.style.overflow = "auto";
    appUploadList.style.height = "40px";
	},
	
	screenFileUploadComplete: function (id, fileName, responseJSON) {
	  var randomKey = this.randomKey;
	  var screenShotUploadElement = document.getElementById('screenShotUploadArea');
	  var screenUploadList = screenShotUploadElement.firstChild.childNodes[2];
    var liElement = screenUploadList.childNodes[id];
    var deleteAtag = liElement.lastChild;
    var success = responseJSON["success"];
    if (success && success === true) {
      deleteAtag.addEventListener("click", function () {
        tau.req({
          type: 'POST',
          url : 'app/upload',
          params : 'path=screenshotDelete&key='+randomKey
                   + '&file='+fileName,
          callbackFn: function (resp) {
            if (resp.status === 200) {
              liElement.style.display = 'none';
            } else {
              tau.alert('삭제가 완료 되지 못했습니다: ' + resp.statusText);
            }
          }
          
          
        }).send();
      });
    } else {
      deleteAtag.addEventListener("click", function () {
        liElement.style.display = 'none';
      });
    }
	},
	
	appFileUploadComplete: function (id, fileName, responseJSON) {
	  var appUploadElement = document.getElementById('appUploadArea');
	  var appUploadList = appUploadElement.firstChild.childNodes[2];
    var liElement = appUploadList.childNodes[id];
    var deleteAtag = liElement.lastChild;
    var success = responseJSON["success"];
    if (success && success === true) {
      deleteAtag.addEventListener("click", function () {
        liElement.style.display = 'none';
      });
    } else {
      deleteAtag.addEventListener("click", function () {
        liElement.style.display = 'none';
      });
    }
	},
	
	submit : function () {
	  var value = this.titleInput.getText();
	  if (value === "") {
	    tau.alert('제목을  입력해 주세요', {
	      title : '제목누락'
	    });
	    return;
	  }
	  
	  if (value.length >= 255) {
      tau.alert('제목의 길이가 너무 깁니다', {
        title : '길이초과'
      });
      return;
    }
	  value = this.descriptionArea.getText();
	  if (value === "") {
      tau.alert('설명을 입력해 주세요', {
        title : '설명누락'
      });
      return;
    }
	  
	  if (value.length < 30) {
      tau.alert('설명이 너무 짧아요', {
        title : '설명길이오류'
      });
      return;
    }
	  
	  tau.prompt('앱('+this.titleInput.getText()+')을 등록 하겠습니까?'+ 
	      '앱 삭제 및 수정시 사용할 암호를 입력해 주세요.', {
	      title : '등  록',
	      callbackFn : tau.ctxAware(function (retVal) {
	        tau.req({
	          type: 'POST',
	          url: 'app/upload',
	          params : 'path=regist&pw='+retVal+'&key='+this.randomKey
	                    +'&title='+this.titleInput.getText()
	                    +'&description='+this.descriptionArea.getText(),
	          callbackFn: tau.ctxAware(this.submitCallBack, this)
	        }).send();
	      },this)
	  });
	  
	  
	},
	
	submitCallBack: function (resp) {
	  
	  if (resp.status === 200) {
	    tau.alert('등록이 완료 되었습니다.', {
	      title : '등 록',
	      callbackFn : tau.ctxAware(function (ret) {
	        this.getParent().popController();
	      }, this)
	    });
	  } else {
	    tau.alert('등록이 완료 되지 못했습니다: ' + resp.statusText);
	  }
	},
	
	cancelCallBack: function (resp) {
	  if (resp.status === 200) {
	    this.getParent().popController();
	  } else {
	    tau.alert('취소가 완료 되지 못했습니다: ' + resp.statusText);
	  }
	} 
});

$class('com.tau.storeserver.AppSearchResult').extend(tau.ui.SceneController).define({
	AppSearchResult: function (sequenceNavi , apps, searchField) {
	  this.sequenceNavi = sequenceNavi;
	  this.apps = apps;
	  this.value = searchField.getText();
	},
	
	init: function () {
    this.appCtx = tau.getCurrentContext();
  },
  
  loadScene: function () {
    var appsData = this.apps;
	  var mainPanel = new tau.ui.Panel();
    mainPanel.setStyles({
      'margin': '0px auto',
      'max-width': '1024px', 'height' : '100%',
      'position': 'relative','display' : 'block'
    });
    
    this.table = new tau.ui.Table({
      cellSort: tau.ui.INDEX_SORT,
      sectionSort: tau.ui.INDEX_SORT
    });
    
    for (var i=0; i < appsData.length ; i++) {
      var app = appsData[i];
      
      if (this.value) {
        var pattern = new RegExp(this.value,"i");
        
        if (app["title"].match(pattern) === null) {
          continue;
        }
      }
      
      var cell = new tau.ui.TableCell({
        title: app["title"],
        groupName: app["subgroup"] ,
        subTitle: app["subtitle"]+" / dev: "+app["devDate"] ,
      });
     
      if (app["icon"]) {
        cell.setLeftItem(new tau.ui.ImageView({
          //TODO : change url 
          src : "/../" + app["apppath"] +"/" + app["icon"],
          styles : {'background-color' : 'transparent',width : '50px'}
        }));
      } else {
        cell.setLeftItem(new tau.ui.ImageView({
          src : '/resource/img/icon.png',
          styles : {'background-color' : 'transparent',width : '50px'}
        }));
      }
      
      
      cell.setStyle('cellLeftItemWidth','70px');
      var that = this;
      (function (appTemp) {
        cell.onEvent(tau.rt.Event.TAP, function () {
          var detailCtrl = new com.tau.storeserver.AppDetail(appTemp);
          that.sequenceNavi.pushController(detailCtrl);
          detailCtrl.onEvent('modifyComplete',function () {
            this.fireEvent('modifyComplete');
          }, this);
        }, that);
      })(app);
      
      this.table.add(cell);
    }
    mainPanel.add(this.table);
    this.getScene().add(mainPanel);
	},
	
	
});

$class('com.tau.storeserver.AppDetail').extend(tau.ui.SceneController).define({
	AppDetail: function (appData) {
	  
	  this.appData = appData;
	},
	
  init: function () {
    this.setTitle('상세정보');
	  this.appCtx = tau.getCurrentContext();
	},
  
  loadScene: function () {
    var app = this.appData;
	  var mainPanel = new tau.ui.Panel({
	    styles : {
	      width : '650px', height : '600px', overflow : 'auto', 
	      display : 'block', margin : '0px auto'
	    }
	  });
	  var detailPanel = new tau.ui.Panel({
	    styles : {
	    top : '50px', left : '10px', width : '350px', height :'400px',
	    color : '#FFF'
	    }
	  });
	  var titleLabel = new tau.ui.Label({text : '이름', styles : {
	    'display' : 'block','font-size' : '16px',
	    'font-family': 'MuseoSans500'
	  }});
	  var titleData = new tau.ui.Label({text : app["title"], styles : {
	    position : 'relative' ,'display' : 'block','font-size' : '14px', left : '20px',
      'font-family': 'MuseoSans500', 'color' : '#000' 
    }});
	  var devDateLabel = new tau.ui.Label({text : '등록일', styles : {
      'display' : 'block','font-size' : '16px',
      'font-family': 'MuseoSans500' 
    }});
	  var devDateData = new tau.ui.Label({text : app["devDate"], styles : {
	    position : 'relative' ,'display' : 'block','font-size' : '14px', left : '20px',
      'font-family': 'MuseoSans500', 'color' : '#000' 
    }});
	  var descriptionLabel = new tau.ui.Label({text : '설명', styles : {
      'display' : 'block','font-size' : '16px',
      'font-family': 'MuseoSans500' 
    }});
	  var descriptionData = new tau.ui.TextView({
	    
	    text : app["description"],
	    styles : {
	      position : 'relative' ,display : 'block' , width : '300px', height : '150px', left : '20px',
	      font : '14px sans-serif', 'background-color' : 'transparent',
	      color : 'black', 'border-color' :'transparent'
	    }   
    });
	  var iconLabel = new tau.ui.Label({text : '아이콘', styles : {
      'display' : 'block', 'font-size' : '16px',
      'font-family': 'MuseoSans500'
    }});
	  var iconData = null;
	  if (app["icon"]) {
	    //TODO : change url
	    iconData = new tau.ui.ImageView({
	      src : "/../" + app["apppath"] +"/"+app["icon"],
	      styles : {'background-color' : 'transparent', 
	        position : 'relative', left : '20px',width: '72px'}
	    });
	  } else {
	    iconData = new tau.ui.ImageView({
        src : '/resource/img/icon.png',
        styles : {'background-color' : 'transparent', 
          position : 'relative', left : '20px'}
      });
	  }
	  
	  
	  detailPanel.add(titleLabel);
	  detailPanel.add(titleData);
	  detailPanel.add(devDateLabel);
	  detailPanel.add(devDateData);
	  detailPanel.add(descriptionLabel);
	  detailPanel.add(descriptionData);
	  detailPanel.add(iconLabel);
	  detailPanel.add(iconData);
	  
	  
	  var screenshotPanel = new tau.ui.Panel({
      styles : {
        left : '400px', top : '50px', width : '250px', height :'400px', color : '#FFF'
      }
	  });
	  
	  var screenshotLabel = new tau.ui.Label({text : '스크린샷', styles : {
      'display' : 'block','font-size' : '16px',
      'font-family': 'MuseoSans500' 
    }});
	  
	  screenshotPanel.add(screenshotLabel);
	  
	  if (app["screen"]) {
	    var screens = app["screen"];
	    var screenshotCarousel = new tau.ui.Carousel();
	    screenshotCarousel.setStyles({'top': '22px',
	      'width': '240px', 'height' : '360px'});
	    for ( var i = 0; i < screens.length; i++) {
        var url = screens[i];
        var panel = new tau.ui.Panel();
        var image = new tau.ui.ImageView({
          //TODO : change url
          src : "/../" + app["apppath"] + "/description/" + url,
          styles : {'background-color' : 'transparent', 
            'width': '240px', 'height' : '360px'}
        });
        panel.add(image);
        screenshotCarousel.add(panel);
      }
	    
	    screenshotPanel.add(screenshotCarousel);
	    
	  } else {
	    var screenCenterPanel = new tau.ui.Panel({
        styles : {
          'display' : 'block', 'width' : '240px',
          'height' : '360px', 'border' : '1px solid'
        }
      });
	    
	    var screenMissingImage = new tau.ui.ImageView({
        src : "/resource/img/missingimage.png",
        styles : {
          'display' : 'block', 'margin' : '164px auto',
          'width' : '32px' , 'height' : '32px'
        }
      });
	    
	    screenCenterPanel.add(screenMissingImage);
	    screenshotPanel.add(screenCenterPanel);
	  }
	  
	  var deleteBtn = new tau.ui.Button({
	    styles : {
	      top : '480px', left : '50px', width : '100px', height :'40px',
	    },
	    label : { normal : '삭제'}
	  });
	  var modifyBtn = new tau.ui.Button({
      styles : {
        top : '480px', left : '200px', width : '100px', height :'40px',
      },
      label : { normal : '수정'}
    });
	  var exportBtn = new tau.ui.Button({
      styles : {
        top : '480px', left : '350px', width : '100px', height :'40px',
      },
      label : { normal : '내보내기'}
    });
	  var executeBtn = new tau.ui.Button({
      styles : {
        top : '480px', left : '500px', width : '100px', height :'40px',
      },
      label : { normal : '실행'}
    });
	  
	  deleteBtn.onEvent(tau.rt.Event.TAP, this.deleteAlert, this);
	  executeBtn.onEvent(tau.rt.Event.TAP, this.executePopUp, this);
	  modifyBtn.onEvent(tau.rt.Event.TAP, this.modifyAlert, this);
	  exportBtn.onEvent(tau.rt.Event.TAP, function() {
	    document.location.href = 
	      encodeURI('app/export?folder='+app["apppath"]+"&file="+app["subtitle"]);
	  }, this);
	  
	  mainPanel.add(detailPanel);
	  mainPanel.add(screenshotPanel);
	  mainPanel.add(deleteBtn);
	  mainPanel.add(modifyBtn);
	  mainPanel.add(exportBtn);
	  mainPanel.add(executeBtn);
	  var scene = this.getScene();
    scene.setStyles({
      'overflow' : 'auto',  display : 'block', 
      'background-image': 
        '-webkit-gradient(linear, left top, left bottom, from(#35425D), to(white) )'
    });
    scene.add(mainPanel);
	},
	
	deleteCallBack : function () {
	  tau.alert('삭제 완료 되었습니다.', {
	    title : '삭제 완료',
	    callbackFn : tau.ctxAware(function () {
	      //this.dismissModal(true);
	      this.fireEvent('modifyComplete');
	    }, this)
	  });
	  
	},
	
	deleteAlert : function () {
	  tau.prompt('앱('+this.appData["title"]+')을 삭제 하겠습니까? 암호를 입력해 주세요.', {
      title : '삭 제',
      callbackFn : tau.ctxAware(function (retVal) {
        if (retVal === this.appData["pw"]) {
          tau.req({
            type : 'POST',
            url  : 'app/modify' ,
            params : 'path=delete&folder='+this.appData["apppath"] ,
            callbackFn : tau.ctxAware(this.deleteCallBack, this)
          }).send();
        }
      }, this)
    });
	},
	
	executePopUp : function () {
	  var executeCtrl = new com.tau.storeserver.AppExecute(this.appData);
    executeCtrl.onEvent('dismiss',function () {
      this.dismissModal(true);
    }, this);
    this.presentModal(executeCtrl,
        { 'layout' : 'PAGE', 'animate' : 'vertical'});
	},
	
	modifyAlert : function () {
	  tau.prompt('앱('+this.appData["title"] + ')을 수정하시겠습니까? 암호를 입력해 주세요.' , {
      title : '수 정',
      callbackFn : tau.ctxAware(function (retVal) {
        if (retVal === this.appData["pw"]) {
          var modifyCtrl = new com.tau.storeserver.AppModify(this.appData);
          modifyCtrl.onEvent('dismiss',function () {
            this.dismissModal(true);
          }, this);
          modifyCtrl.onEvent('modifyComplete',function () {
            this.dismissModal(false);
            this.fireEvent('modifyComplete');
          }, this);
          this.presentModal(modifyCtrl, {
            'layout' : 'PAGE', 'animate' : 'vertical'
          });
        }
      }, this)
    });
	}
});

$class('com.tau.storeserver.AppModify').extend(tau.ui.SceneController).define({
	AppModify: function (app) {
	  this.app = app;
	},
	
	init: function () {
	  this.setTitle('APP Modify');
	},

	loadScene: function () {
	  this.layoutPanel = new tau.ui.Panel({
      styles : {
        'top': '30px', 'margin': '0px auto',
        'max-width': '700px', 'height' : '500px',
        'position': 'relative','display' : 'block'
      }
    }); 
    this.notePanel = new tau.ui.Panel({
      styles : {
        'top': '30px', 
        'width': '300px', 'height' : '500px',
        'position': 'relative'
      }
    }); 
    
    this.formPanel = new tau.ui.Panel({
      styles : {
        'top': '30px', 'margin': '0px auto',
        'width': '400px', 'height' : '500px',
        'position': 'relative', 'display' : 'block'
      }
    }); 
    var titleLabel = new tau.ui.Label({text : '이름(최대 255자)', styles : {
      'display' : 'block','font-size' : '16px',
      'font-family': 'MuseoSans500'
    }});
    
    this.titleInput = new tau.ui.TextField({
      type : tau.ui.TextField.TEXT,
      styles : {
        width : '400px', 'font-size' : '14px'
      }
    });
    
    
    
    var descriptionLabel = new tau.ui.Label({text : '설명(최소 30자)', styles : {
      'display' : 'block','font-size' : '16px',
      'font-family': 'MuseoSans500'
    }});
    
    this.descriptionArea = new tau.ui.TextArea({
      styles : {
        width : '400px', height : '150px','font-size' : '14px'
      }
    });
    
    var iconLabel = new tau.ui.Label({text : 'Icon', styles : {
      'display' : 'block','font-size' : '16px',
      'font-family': 'MuseoSans500'
    }});
    
    this.iconPanel = new tau.ui.Panel({
      styles : {
        'top': '0px',
        'width': '400px', 'height' : '80px',
        'position': 'relative'
      }
    });
    
    var iconUploadArea = document.createElement('div');
    iconUploadArea.setAttribute('id','iconUploadArea');
    tau.util.dom.appendChild(this.iconPanel.getDOM(),iconUploadArea);
    
    var screenShotLabel = new tau.ui.Label({text : '스크린샷(Drag&Drop)', styles : {
      'display' : 'block','font-size' : '16px',
      'font-family': 'MuseoSans500'
    }});
    
    this.screenShotPanel = new tau.ui.Panel({
      styles : {
        'top': '0px',
        'width': '400px', 'height' : '80px',
        'position': 'relative'
      }
    });
    
    var screenShotUploadArea = document.createElement('div');
    screenShotUploadArea.setAttribute('id','screenShotUploadArea');
    tau.util.dom.appendChild(this.screenShotPanel.getDOM(),screenShotUploadArea);
    
    var appLabel = new tau.ui.Label({text : '앱[zip파일](Drag&Drop)', styles : {
      'display' : 'block','font-size' : '16px',
      'font-family': 'MuseoSans500'
    }});
    
    this.appPanel = new tau.ui.Panel({
      styles : {
        'top': '0px',
        'width': '400px', 'height' : '80px',
        'position': 'relative'
      }
    });
    
    var appUploadArea = document.createElement('div');
    appUploadArea.setAttribute('id','appUploadArea');
    tau.util.dom.appendChild(this.appPanel.getDOM(),appUploadArea);
    
    var folder = this.app["apppath"];
    
    this.formPanel.add(titleLabel);
    this.formPanel.add(this.titleInput);
    this.formPanel.add(descriptionLabel);
    this.formPanel.add(this.descriptionArea);
    //this.formPanel.add(iconLabel);
    //this.formPanel.add(this.iconPanel);
    this.formPanel.add(screenShotLabel);
    this.formPanel.add(this.screenShotPanel);
    this.formPanel.add(appLabel);
    this.formPanel.add(this.appPanel);
    
/*    var titleNote = new tau.ui.TextView({text : 
      'Title 길이는 최대 255자 입니다.', 
      styles : {
      top : '0px',  left : '2px', 'height' : '60px',
      'position' : 'relative','font-size' : '14px',
      'border-left' : '1px solid', 'background' : 'transparent',
      'font-family': 'MuseoSans500', 'color' : '#696' 
    }});
    
    var DescriptionNote = new tau.ui.TextView({text : 
      'App에 대한 상세한 설명을 \n 최소 30자 이내로 작성 해 주세요.', 
      styles : {
      top : '5px',  left : '2px', 'height' : '60px',
      'position' : 'relative','font-size' : '14px',
      'border-left' : '1px solid', 'background' : 'transparent',
      'font-family': 'MuseoSans500', 'color' : '#696' 
    }});
    
    var screenNote = new tau.ui.TextView({text : 
      '이미지의 파일명은 영문만 지원합니다. \n 권장 크기는 320px X 480 px 입니다.', 
      styles : {
      top : '122px', left : '2px',  'height' : '60px',
      'position' : 'relative','font-size' : '14px',
      'border-left' : '1px solid', 'background' : 'transparent',
      'font-family': 'MuseoSans500', 'color' : '#696' 
    }});*/
    
//    this.notePanel.add(titleNote);
//    this.notePanel.add(DescriptionNote);
//    this.notePanel.add(screenNote);
    
    this.uploadPanel = new tau.ui.Panel({
      styles : {
        'top': '30px', 'margin': '0px auto',
        'max-width': '700px', 'height' : '50px',
        'position': 'relative','display' : 'block'
      }
    });
    
    this.submitBtn = new tau.ui.Button({
      label : {normal : '수정'},
      styles : {width : '100px', height: '40px',left: '400px'},
      tap : tau.ctxAware(this.submit, this)
    });
    
    this.dismissBtn = new tau.ui.Button({
      styles : {
        left : '200px', width : '100px', height :'40px',
      },
      label : { normal : '닫기'},
    });
    this.dismissBtn.onEvent(tau.rt.Event.TAP, function () {
      this.fireEvent('dismiss');
    }, this);
    
    
    this.uploadPanel.add(this.submitBtn);
    this.uploadPanel.add(this.dismissBtn);
    
    var scene = this.getScene();
    scene.setStyles({
      'background' : 
        '-webkit-gradient(linear, left top, left bottom, from(#35425D), to(white) )',
      'overflow' : 'auto'
    });
    this.layoutPanel.add(this.formPanel);
    this.layoutPanel.add(this.notePanel);
    scene.add(this.layoutPanel);
    scene.add(this.uploadPanel);
    
    this.titleInput.setText(this.app["title"]);
    this.descriptionArea.setText(this.app["description"]);
    
	},
	//파일 찾기.
	_findLiElement: function (filename, childs) {
	  for ( var int = 0; int < childs.length; int++) {
      var targetLi = childs[int];
      var targetfileName = targetLi.firstChild.innerText;
      if (filename === targetfileName) return targetLi;
    }
	},
	
	sceneDrawn: function () {
	  var that = this;
	  var screenShotUploadElement = document.getElementById('screenShotUploadArea');
    var screenShotUploader = new qq.FileUploader({
      element: screenShotUploadElement,
      action: 'app/modify',
      sizeLimit: 100000,
      allowedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
      params: {  'path': 'screenshot', 'folder': this.app["apppath"]},
      debug: false,
      onSubmit: function(id, fileName){
        var dropArea = appUploader._find(appUploader._element, 'drop');
        dropArea.style.display = 'none';
      },
      onComplete: tau.ctxAware(this.screenFileUploadComplete, this),
      onCancel: function(id, fileName){},
    });
    
    var screenUploadList = screenShotUploadElement.firstChild.childNodes[2];
    screenUploadList.style.overflow = "auto";
    screenUploadList.style.height = "40px";
    
    if (this.app["screen"]) {
      var screen = this.app["screen"];
      var liFragment = document.createDocumentFragment();
      for ( var i = 0; i < screen.length; i++) {
        var li = document.createElement("li");
        li.setAttribute("class","qq-upload-success");
        var span = document.createElement("span");
        span.setAttribute("class","qq-upload-file");
        var atag = document.createElement("a");
        atag.setAttribute("class","qq-upload-delete");
        atag.setAttribute("href","#");
        
        var url = screen[i];
        var folder = this.app["apppath"];
        span.innerHTML = url;
        atag.innerHTML = "Delete";
        (function (urlTemp, liTemp) {
          atag.addEventListener("click", function () {
            tau.req({
              type: 'POST',
              url : 'app/modify',
              params : 'path=screenshotDelete&folder='+ folder
                       + '&file='+urlTemp,
              callbackFn: function (resp) {
                if (resp.status === 200) {
                  liTemp.style.display = 'none';
                } else {
                  tau.alert('삭제가 완료 되지 못했습니다: ' + resp.statusText);
                }
              }
            }).send();
          });
        })(url, li);  
        
        li.appendChild(span);
        li.appendChild(atag);
        liFragment.appendChild(li);
      }//endFor
      
      screenUploadList.appendChild(liFragment);
        
    }
    
    var appUploadElement = document.getElementById('appUploadArea');
    var appUploader = new qq.FileUploader({
      element: appUploadElement,
      action: 'app/modify',
      sizeLimit: 10000000,
      allowedExtensions: ['zip'],
      params: {  'path': 'app', 'folder': that.app["apppath"]},
      debug: false,
      onSubmit: function(id, fileName){
        var dropArea = screenShotUploader._find(screenShotUploader._element, 'drop');
        dropArea.style.display = 'none';
      },
      onProgress: function(id, fileName, loaded, total){},
      onComplete: tau.ctxAware(this.appFileUploadComplete,this),
      onCancel: function(id, fileName){},
    });
    
    var appUploadList = document.getElementById('appUploadArea').firstChild.childNodes[2];
    appUploadList.style.overflow = "auto";
    appUploadList.style.height = "40px";
	},
	
	submit : function () {
    var value = this.titleInput.getText();
    if (value === "") {
      tau.alert('제목을 입력해 주세요', {
        title : '제목누락'
      });
      return;
    }
    
    if (value.length >= 255) {
      tau.alert('제목의 길이가 너무 깁니다', {
        title : '제목길이초과'
      });
      return;
    }
    value = this.descriptionArea.getText();
    if (value === "") {
      tau.alert('설명을 입력해 주세요', {
        title : '설명누락'
      });
      return;
    }
    
    if (value.length < 30) {
      tau.alert('설명이 너무 짧아요', {
        title : '설명길이제한'
      });
      return;
    }
    
    tau.req({
      type: 'POST',
      url: 'app/modify',
      params : 'path=regist&folder='+this.app["apppath"]
                +'&title='+this.titleInput.getText()
                +'&description='+this.descriptionArea.getText(),
      callbackFn: tau.ctxAware(this.submitCallBack, this)
    }).send();
  },
	
	
	submitCallBack: function (resp) {
    if (resp.status === 200) {
      tau.alert('수정이 완료 되었습니다.', {
        title : '수 정',
        callbackFn : tau.ctxAware(function (ret) {
          this.fireEvent('modifyComplete');
        }, this)
      });
    } else {
      tau.alert('등록이 완료 되지 못했습니다: ' + resp.statusText);
    }
  },
  
  screenFileUploadComplete: function (id, fileName, responseJSON) {
    var screenShotUploadElement = document.getElementById('screenShotUploadArea');
    var screenUploadList = screenShotUploadElement.firstChild.childNodes[2];
    var liElement = this._findLiElement(fileName, screenUploadList.childNodes);
    var deleteAtag = liElement.lastChild;
    var success = responseJSON["success"];
    var folder = this.app["apppath"];
    if (success && success === true) {
      console.log(liElement);
      deleteAtag.addEventListener("click", function () {
        tau.req({
          type: 'POST',
          url : 'app/modify',
          params : 'path=screenshotDelete&folder='+folder
                   + '&file='+fileName,
          callbackFn: function (resp) {
            if (resp.status === 200) {
              liElement.style.display = 'none';
            } else {
              tau.alert('삭제가 완료 되지 못했습니다: ' + resp.statusText);
            }
          }
        }).send();
      });
    } else {
      deleteAtag.addEventListener("click", function () {
        liElement.style.display = 'none';
      });
    }
  },
  
  appFileUploadComplete: function (id, fileName, responseJSON) {
    var appUploadElement = document.getElementById('appUploadArea');
    var appUploadList = appUploadElement.firstChild.childNodes[2];
    var liElement = appUploadList.childNodes[id];
    var deleteAtag = liElement.lastChild;
    var success = responseJSON["success"];
    var folder = this.app["apppath"];
    if (success && success === true) {
      deleteAtag.addEventListener("click", function () {
        tau.req({
          type: 'POST',
          url : 'app/modify',
          params : 'path=appDelete&folder='+folder
                   + '&file='+fileName,
          callbackFn: function (resp) {
            if (resp.status === 200) {
              liElement.style.display = 'none';
            } else {
              tau.alert('삭제가 완료 되지 못했습니다: ' + resp.statusText);
            }
          }
          
          
        }).send();
      });
    } else {
      deleteAtag.addEventListener("click", function () {
        liElement.style.display = 'none';
      });
    }
  }
	
});

$class('com.tau.storeserver.AppExecute').extend(tau.ui.SceneController).define({
  AppExecute: function (app) {
    this.app = app;
  },
  
  init: function () {
    this.setTitle('APP Execute');
    this.appCtx = tau.getCurrentContext();
  },
  loadScene: function () {
	  var dismissBtn = new tau.ui.Button({
      styles : {
        right : '10px', width : '100px', height :'40px',
      },
      label : { normal : 'Close'},
    });
    dismissBtn.onEvent(tau.rt.Event.TAP, function () {
      this.fireEvent('dismiss');
    }, this);
    
    var qrcodeLabel = new tau.ui.Label({text : 'QRCode', styles : {
      'display' : 'block', 'font-size' : '16px', 
      'position' : 'absolute','top': '20px', 'left' : '56px',
      'font-family': 'MuseoSans500'
    }});
    
    var qrcodeImage = new tau.ui.ImageView({
        src : "/../" + this.app["apppath"] +'/qrcode.png',
        styles : {'background-color' : 'transparent', 
          'position' : 'absolute','top' : '40px'
        }
    });
    
	  var iphoneImage = new tau.ui.ImageView({
      src : '/resource/img/iphone4.png',
      styles : {'background-color' : 'transparent', 
        'left' : '184px' , 'top' : '30px','position' : 'absolute'
      }
    });
	  var iframePanel = new tau.ui.Panel({
	    styles : {
	      'z-index' : '9999' , 'position' : 'absolute', 'width' : '320px',
	      'height' : '480px', 'left' : '221px', 'top' : '165px'
	    }
	  });
	  var iframe = document.createElement('iframe');
	  iframe.setAttribute('src', this.app["fullpath"]);
	  iframe.setAttribute('style' ,'width: 320px;height: 480px;');
	  tau.util.dom.appendChild(iframePanel.getDOM() , iframe);
	  var scene = this.getScene();
	  scene.setStyles({
	    'overflow':'auto',
	    'background':'-webkit-linear-gradient(top, white 300px, #35425D)'
	  });
	  
	  scene.add(dismissBtn);
	  scene.add(qrcodeLabel);
	  scene.add(qrcodeImage);
	  scene.add(iphoneImage);
	  scene.add(iframePanel);
	  
	}
});

/*
$class('com.tau.storeserver.SourceView')
$class('com.tau.storeserver.SourceView.FileTree')
$class('com.tau.storeserver.SourceView.Source')
*/