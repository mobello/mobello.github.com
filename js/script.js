function request_download() {
	var url = ‘http:// 125.131.85.49/Mobello/web2/_res/_server/mobello_download.asp’;
		 
		var data = {
		  _M_ID: $('email').text,
		  _M_DOMAIN: '',
		  _LANG: 'en' // ko, en
		};
		 
	$.ajax({
		  type: 'GET'
		  crossDomain: true,
		  url: url,
		  data: data,
		  success:function(result) {
				alert('success');
			},
			error:function(jqxhr, textStatus, errorThrown) {
				alert('success');
			},
		}); 
}

function openBlog() {
	if(getLanguage().indexOf('ko') !== -1) {
		window.open('http://mobello.tumblr.com/');
	} else {
		window.open('http://mobellojs.tumblr.com/');
	}
}
function navigateToTutorial() {
	if(getLanguage().indexOf('ko') !== -1) {
		window.location.href="/tutorial1-ko/";
	} else {
		window.location.href="/tutorial1/";
	}
}
function getLanguage() {
	return  window.navigator.userLanguage || window.navigator.language;
}