function request_download() {
	var url = "http://www.econovation.co.kr/@page/development/@exec/mobello_send.asp";
	var pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	var email = $('#email')[0].value;
	
	if (pattern.test(email) != true) {
		alert("Enter valid email address.");
		return;
	}
	if ($('#eula')[0].checked != true) {
		alert('You have to agree to the EULA.')
		return;
	}
	
	var id = email.split('@')[0];
	var domain = email.split('@')[1];
	var subscribe = 'N';
	if($('#subscribe')[0].checked)
		subscribe = 'Y';
	var data = {
		_M_ID : id,
		_M_DOMAIN : domain,
		_M_NEWS: subscribe,
		// _LANG : 'ko' // ko, en
	};
	$.ajax({
		type : 'GET',
		crossDomain : true,
		url : url,
		data : data,
		success : function(result) {
			alert('Mobello Studio download link has been sent to the email address you have entered.');
			navigateTo('studio-install-guide');
		},
		error : function(jqxhr, textStatus, errorThrown) {
			alert('Mobello Studio download link has been sent to the email address you have entered.');
			navigateTo('studio-install-guide');
		},
	});
	_gaq.push(['_trackEvent', 'Studio', 'Download', 'Request studio download link.']);
}

function navigateTo(page) {
	if (isKorean()) {
		window.location.href = '/' + page + '-ko';
	} else {
		window.location.href = '/' + page;
	}
}

function openBlog() {
	if (isKorean()) {
		window.open('http://mobello.tumblr.com/');
	} else {
		window.open('http://mobellojs.tumblr.com/');
	}
}

function getLanguage() {
	return window.navigator.userLanguage || window.navigator.language;
}

function isKorean() {
	return getLanguage().indexOf('ko') !== -1;
}
