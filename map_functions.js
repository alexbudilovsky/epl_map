
// displays all teams for a given matchday
function updateMap(matchday) {
	deleteMarkers()

	all_games = full_schedule_by_matchday[matchday]
	
	for (var i = 0; i < all_games.length; i++) {
		game = all_games[i]
		home_team_code = game[0]
		away_team_code = game[1]

		var marker = putTeamOnMap(home_team_code)
		addIconToMarker(marker, home_team_code, away_team_code)
	}
}

function addIconToMarker(marker, home_team_code, away_team_code) {
	path = getPathToTeam(home_team_code, true) // TODO - this should be small
	marker.setIcon(path)
}

// size_large is boolean, by default true
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

markers = []
function putTeamOnMap(team_code) {
    var loc = team_code_to_locations[team_code]

    var lat = loc[0]
    var lng = loc[1]

    var latLng = new google.maps.LatLng(lat, lng);

    return addMarker(latLng, team_code)
}

// Add a marker to the map and push to the array.
// add info window if releasing slider
function addMarker(location, team_code) {
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    title: team_code_and_name[team_code]
  });
  marker.clicked = false

  markers.push(marker);
  return marker
}

// Sets the map on all markers in the array.
function setAllMap(passedMap) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(passedMap);
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
  markers = [];
}