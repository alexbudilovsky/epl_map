// constants definitions here
var firstWeek = 1
var lastWeek = 38
var sliderId = "matchdaySlider"
// end constant definitions

team_code_to_marker = {} // current markers displayed - key is team code

// displays all teams for a given matchday
function updateMap(matchday) {
	deleteMarkers()

	all_games = full_schedule_by_matchday[matchday]
	
	for (var i = 0; i < all_games.length; i++) {
		game = all_games[i]
		home_team_code = game[0]
		away_team_code = game[1]

		putTeamOnMap(home_team_code)
	}
}

function moveSliderLeft() {
	currentMatchday = getSliderValue()
	if (currentMatchday > firstWeek) {
		currentMatchday--
		moveSlider(currentMatchday)
	}
}

function moveSliderRight() {
	currentMatchday = getSliderValue()
	if (currentMatchday < lastWeek) {
		currentMatchday++;
		moveSlider(currentMatchday)
	}
}

function moveSlider(matchday) {
	document.getElementById(sliderId).value = matchday;
	updateMap(matchday)
}

function getSliderValue() {
    return parseInt(document.getElementById(sliderId).value)
}

// size_large is boolean, by default needs to be false - small
function getPathToTeam(team_code, size_large) {
	base = "images/team_icons/" + team_code
	if (size_large) {
		return base + ".png"
	} else {
		return base + "_small.png"
	}
}

////////////////////////////////
// Google Map Functions Below //
////////////////////////////////
function putTeamOnMap(team_code) {
    var loc = team_code_to_locations[team_code]

    var lat = loc[0]
    var lng = loc[1]

    var latLng = new google.maps.LatLng(lat, lng);

    addMarker(latLng, team_code)
}

// Add a marker to the map and push to the array.
// add info window if releasing slider
function addMarker(location, team_code) {
  var smallIconPath = getPathToTeam(home_team_code, false)
  var largeIconPath = getPathToTeam(home_team_code, true)
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    title: team_code_and_name[team_code],
    icon: smallIconPath
  });
  marker.clicked = false

  // these listeners only deal with icon size.  load_score.js will deal with only infoWindows
  google.maps.event.addListener(marker, 'mouseover', function() {
	if (this.getIcon() != largeIconPath) {
		this.setIcon(largeIconPath)
	} });

  google.maps.event.addListener(marker, 'mouseout', function() {
	if (!this.clicked) {
		this.setIcon(smallIconPath)
	} });

  google.maps.event.addListener(marker, 'click', function() {
  	this.clicked = !this.clicked;

  	if (this.clicked) {
  		this.setIcon(largeIconPath)	
  	} else {
  		this.setIcon(smallIconPath)
  	}
  });

  team_code_to_marker[team_code] = marker
}

// Sets the map on all markers in the array.
function setAllMap(passedMap) {
  for (var key in team_code_to_marker) {
    team_code_to_marker[key].setMap(passedMap);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setAllMap(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  team_code_to_marker = {}
}