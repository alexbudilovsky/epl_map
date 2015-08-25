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
		async: true,
		beforeSend: function() { 
			disableButtonsShowLoading(true)
		}
	});
}

function disableButtonsShowLoading(disable) {
	$(".buttonArrows").attr("disabled", disable);
	if (disable) {
		$("#loading_gif").show();
	} else {
		$("#loading_gif").hide();
	}
}

function parse(json) {
	disableButtonsShowLoading(false)

	var fixtures = json["fixtures"]
	for (var i = 0; i < fixtures.length; i++) {
		var fixture = fixtures[i]

		var homeTeamName = fixture["homeTeamName"]
		var teams = [homeTeamName, fixture["awayTeamName"]]
		var scores = [fixture["result"]["goalsHomeTeam"], fixture["result"]["goalsAwayTeam"]]

		//TODO deal with inprog game??
		var infoWindowHtml = getGameHtml(teams, scores, fixture["date"], fixture["status"])

		addInfoWindowToHomeTeamMarker(homeTeamName, infoWindowHtml)
	}
}

// if here, need to read a static file
function jqueryError(jqXHR, textStatus, errorThrown) {
	console.log(errorThrown+'\n'+status+'\n'+jqXHR.statusText);
}

function addInfoWindowToHomeTeamMarker(homeTeamName, html) {
	var teamCode = team_code_and_name[homeTeamName]
	var marker = team_code_to_marker[teamCode]

	var infoWindow = new google.maps.InfoWindow;
	infoWindow.setContent(html);

  	google.maps.event.addListener(marker, 'mouseover', mouseOverInfowindowEvent(marker, infoWindow));
  	google.maps.event.addListener(marker, 'mouseout', mouseOutInfowindowEvent(marker, infoWindow));
}

function  mouseOverInfowindowEvent(marker, infoWindow) {
  return function() {
  	if (infoWindow.getMap() == null) {
  		infoWindow.open(map, this)
  	}
  }
}

function mouseOutInfowindowEvent(marker, infoWindow) {
	return function() {
  		if (infoWindow.getMap() != null && !this.clicked) {
    		infoWindow.close()
   		}
	}
}

// for infowindow 
// params: [Manchester United FC, Arsenal FC], [2, 0] -> Arsenal 0 AT ManU 2. date -> date when played
// if scores are -1, game has not been recorded yet
// status -> "FINISHED", "TIMED", etc
function getGameHtml(team_pair, score_pair, date, status) {
	var homeScoreToShow = (score_pair[0] == -1 ? "" : score_pair[0])
	var awayScoreToShow = (score_pair[1] == -1 ? "" : score_pair[1])
	var formattedDateTime = parseRawDate(date)

	if (status == "FINISHED") {
		gameStatus = "FT"
	} else if (status == "TIMED") {
		gameStatus = formattedDateTime[1]
	}

	var awayTeamSVGPath = "images/team_icons_svg/" + team_code_and_name[team_pair[1]] + ".svg"
	var homeTeamSVGPath = "images/team_icons_svg/" + team_code_and_name[team_pair[0]] + ".svg"

	var html = "<table class=\"score_table\">"
	html += "<tr><td class=\"game_date\" colspan=\"3\">" + formattedDateTime[0] + "</td> <td></td> </tr>"
	html += "<tr><td><img class=\"svg_image_cell\" src=\"" + homeTeamSVGPath + "\"></td><td class=\"team_cell\">" 
		+ team_pair[0] + "</td> <td class=\"team_score\""
	
	if (score_pair[0] > score_pair[1]) {
		html += " id=\"winning_team_score\""
	}

	html += ">" + homeScoreToShow + "</td><td class=\"game_status\" rowspan=\"2\">" + gameStatus + "</td></tr>"
	html += "<tr><td><img class=\"svg_image_cell\" src=\"" + awayTeamSVGPath + "\"></td><td class=\"team_cell\">" 
		+ team_pair[1] + "</td><td class=\"team_score\"" 
	
	if (score_pair[1] > score_pair[0]) {
		html += " id=\"winning_team_score\""
	}

	html += ">" + awayScoreToShow + "</td> </tr>"
	html += "</table>"

	return html
}

// ex: raw_date = '2015-08-09T14:00:00Z'
// return: ['9 Aug, 2015', '14:00'] (Note date format is DMY, confirms with UK format)
function parseRawDate(raw_date) {
	var d = new Date(raw_date)

	var day = d.getDate()
	var dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]
	var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 
		'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]
	var year = d.getFullYear()
	var hour = d.getHours()
	var min = d.getMinutes()

	if (min < 10) {
		min = "0" + min
	}

	return [dayOfWeek + " " + day + " " + month + ", " + year, hour + ":" + min + " GMT"]
}