function request_download() {
	var url = "http://125.131.85.49/Mobello/web/_res/_server/mobello_download.asp";
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

	var data = {
		_M_ID : id,
		_M_DOMAIN : domain,
		// _LANG : 'ko' // ko, en
	};
	$.ajax({
		type : 'GET',
		crossDomain : true,
		url : url,
		data : data,
		success : function(result) {
			alert('The Studio download link has been sent to the email address you have entered.');
			navigateTo('studio-install-guide');
		},
		error : function(jqxhr, textStatus, errorThrown) {
			alert('The Studio download link has been sent to the email address you have entered.');
			navigateTo('studio-install-guide');
		},
	});
}

function navigateTo(page) {
	if (getLanguage().indexOf('ko') !== -1) {
		window.location.href = '/' + page + '-ko';
	} else {
		window.location.href = '/' + page;
	}
}

function openBlog() {
	if (getLanguage().indexOf('ko') !== -1) {
		window.open('http://mobello.tumblr.com/');
	} else {
		window.open('http://mobellojs.tumblr.com/');
	}
}

function getLanguage() {
	return window.navigator.userLanguage || window.navigator.language;
}