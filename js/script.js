function request_download() {
	if ($('#eula')[0].checked != true) {
		alert('You have to agree to the EULA.')
		return;
	}
	var pattern = new RegExp("\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b");
	var email = pattern.test($('#email')[0].value);
	if (pattern.test(email) != true) {
		alert("Enter valid email address.");
		return;
	}
	var url = "http://125.131.85.49/Mobello/web2/_res/_server/mobello_download.asp";
	var id = email.split('@')[0];
	var domain = email.split('@')[1];

	var data = {
		_M_ID : id,
		_M_DOMAIN : domain,
		_LANG : 'en' // ko, en
	};

	$.ajax({
		type : 'GET',
		crossDomain : true,
		url : url,
		data : data,
		success : function(result) {
			alert('success: ' + result);
		},
		error : function(jqxhr, textStatus, errorThrown) {
			alert('success: ' + textStatus);
		},
	});
}

function openBlog() {
	if (getLanguage().indexOf('ko') !== -1) {
		window.open('http://mobello.tumblr.com/');
	} else {
		window.open('http://mobellojs.tumblr.com/');
	}
}
function navigateToTutorial() {
	if (getLanguage().indexOf('ko') !== -1) {
		window.location.href = "/tutorial1-ko/";
	} else {
		window.location.href = "/tutorial1/";
	}
}
function getLanguage() {
	return window.navigator.userLanguage || window.navigator.language;
}