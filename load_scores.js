var baseUrl = "http://api.football-data.org/alpha/soccerseasons/398/fixtures/?matchday="

// ajax call here loads the live scores for the selected matchday and populates infowindows of all markers
function loadScoresXMLForSliderMatchday() {
	var slideAmt = document.getElementById().value

	var url = getUrlForDay(slideAmt)

	jQuery.support.cors = true;  // needed for IE
	$.ajax({
		url: url, // name of file you want to parse
		dataType: "xml", // type of file you are trying to read
		success: parse, // name of the function to call upon success
		error: function(jqXHR, textStatus, errorThrown){
			console.log(errorThrown+'\n'+status+'\n'+jqXHR.statusText);
		},
		cache: false,
		async: true
	});
}