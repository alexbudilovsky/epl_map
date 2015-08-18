var baseUrl = "http://api.football-data.org/alpha/soccerseasons/398/fixtures/?matchday="

// ajax call here loads the live scores for the selected matchday and populates infowindows of all markers
function loadScoresForSliderMatchday() {
	var slideAmt = document.getElementById(sliderId).value

	var url = baseUrl + slideAmt

	jQuery.support.cors = true;  // needed for IE
	$.ajax({
		headers: { 'X-Auth-Token': '42e64211de01430dae46dce7230d9825' },
		type:'GET',
		url: url, // name of file you want to parse
		dataType: 'json', // type of file you are trying to read
		success: parse, // name of the function to call upon success
		error: jqueryError,
		cache: false,
		async: true
	});
}

function parse(json) {
	console.log(json)
}

function jqueryError(jqXHR, textStatus, errorThrown) {
	console.log(errorThrown+'\n'+status+'\n'+jqXHR.statusText);
}