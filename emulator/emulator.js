/*
 * Emulator.js 1.0.0 10/08/17
 * 
 * Copyright 2010 KT Innotz, Inc. All rights reserved. KT INNOTZ
 * PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 * 
 */

(function() {

  $class('JUDEEmlatorUtil').define(
      {
        JUDEEmlatorUtil: function() {
          this.phoneComp = null;
          this.browser = null;
          this.phoneFigure = null;
        },

        createEmulator: function() {
          this.browser = document.getElementById("browser");
          this.phoneFigure = document.getElementById("phoneFigure");
          this.iframeDoc = this.browser.contentWindow.document;
          this.phoneComp = new PhoneComposite(this.browser, this.phoneFigure);
          this.appName = null;
          this.isSingleApp = false;
          this.switchApp();
        },
        switchApp: function() {
          var locate = window.location.href;
          this.iframeSrc = "http://www.econovation.co.kr/mobello/demo/launcher.html";

          if (locate.indexOf("?") == -1) { // dashboardApp
            this.browser.src = this.iframeSrc;

          } else { // singleApp
            var param = locate.split("?")[1];
            if (param.indexOf("=") == -1)
              return;
            this.appName = param.split("=")[1];
            this.browser.src = "http://www.econovation.co.kr/mobello/demo/launcher.html?app=" + this.appName;
            this.isSingleApp = true;
          }
        },
        goHome: function() {
          if (this.isSingleApp) {
            this.browser.src = this.iframeSrc + "?app=" + this.appName;
          } else {
            this.browser.src = this.iframeSrc;
          }
          if (this.phoneComp.getPersonality() !== null) {
            this.phoneComp.getPersonality().refreshBrowserVisual();
          }
        },

        closeEmulator: function() {
          var imgsrc = "'img/" + this.phoneComp.getPhoneType() + "Home.jpg'";
          this.browser.contentWindow.document
              .write("<body style='margin:0;'><img src=" + imgsrc
                  + "style='margin:0;'></body>");

          window.setTimeout('window.close()', 1000);
        }
      });

  $class('PhoneComposite').define({
    PhoneComposite: function(browser, phoneFigure) {
      this.phoneFigure = phoneFigure;
      this.browser = browser;
      this.personality = null;
      this.orientation = "PORTRAIT";
      this.phoneType = "iPhone";
      this.createPersonality();
    },
    // getter
    getBrowser: function() {
      return this.browser;
    },
    getPersonality: function() {
      return this.personality;
    },
    getOrientation: function() {
      return this.orientation;
    },
    getPhoneType: function() {
      return this.phoneType;
    },
    getPhoneFigure: function() {
      return this.phoneFigure;
    },
    // setter
    setBrowser: function(browser) {
      this.browser = browser;
    },
    setPersonality: function(personality) {
      this.personality = personality;
    },
    setOrientation: function(orientation) {
      this.orientation = orientation;
      this.personality.refreshVisuals();
    },
    setPhoneType: function(phoneType) {
      this.phoneType = phoneType;
      this.createPersonality();
    },
    setPhoneFigure: function(phoneFigure) {
      this.phoneFigure = phoneFigure;
    },
    // create
    createBrowser: function() {
      this.getBrowser().setAttribute("url", "http://m.naver.com");
    },
    createPersonality: function() {
      this.setPersonality(new IPhonePersonality(this));
    }
  });

  $class('DefaultPersonality').define(
      {
        DefaultPersonality: function(phoneComp) {
          this.phoneComp = phoneComp;
          this.homeButton = document.getElementById("homeButton");
        },

        refreshVisuals: function() {
          this.bodyDOM = this.phoneComp.getBrowser().contentWindow.document
              .getElementsByTagName('body')[0];
          this.refreshPhoneVisual();
          this.refreshButtonVisual();
          this.refreshBrowserVisual();
        },
        refreshPhoneVisual: function() {
        },
        refreshBrowserVisual: function() {
        }
      });

  $class('IPhonePersonality').extend(DefaultPersonality).define({
    IPhonePersonality: function(phoneComp) {
      this.phoneComp = phoneComp;
      this.refreshVisuals();
    },
    refreshPhoneVisual: function() {
      this.phoneComp.phoneFigure.setAttribute('src', 'img/iphone4.jpg');
    },
    refreshButtonVisual: function() {
      this.homeButton.style.width = "80px";
      this.homeButton.style.height = "80px";
      this.homeButton.style.top = "640px";
      this.homeButton.style.marginLeft = "-35px";

    },
    refreshBrowserVisual: function() {

      // browser DOM
      var browser = this.phoneComp.getBrowser();
      // iframeDIV DOM
      browser.width = '320px';
      browser.height = '480px';
      browser.style.marginLeft = "-158px";
      browser.style.top = "135px";

      this.bodyDOM.style.zoom = "100%";
    }
  });

  util = new JUDEEmlatorUtil();

})();