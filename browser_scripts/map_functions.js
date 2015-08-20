// constants definitions here
var firstWeek = 1
var lastWeek = 38
var sliderId = "matchdaySlider"
// end constant definitions

team_code_to_marker = {} // current markers displayed - key is team code
team_code_to_icons = {}  // team code to [largeIcon, smallIcon]

function populateTeamCodeToIcons() {
  team_code_to_icons = {}
  for (code in team_crest_svg_size) {
    team_code_to_icons[code] = getIconsForTeam(code)
  }
}

// displays all teams for a given matchday
function updateMap() {
   matchday = getSliderValue()

  if (Object.keys(team_code_to_icons).length == 0) {
    populateTeamCodeToIcons() // initialize iconss
  }

	deleteMarkers()

	all_games = full_schedule_by_matchday[matchday]
	
	for (var i = 0; i < all_games.length; i++) {
		game = all_games[i]
		home_team_code = game[0]
		away_team_code = game[1]

		putTeamOnMap(home_team_code)
	}

  addIcons()
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
	updateMap()
}

function getSliderValue() {
    return parseInt(document.getElementById(sliderId).value)
}

// returns both large and small icons (svg-scaled) 
function getIconsForTeam(team_code) {
    smallHeight = 10*currentZoomLevel
    largeHeight = 10*(currentZoomLevel+2)
    teamSVGPath = "images/team_icons_svg/" + team_code + ".svg"
    smallIcon = new google.maps.MarkerImage(teamSVGPath, null, null, null, scaleTeamIconSizeToHeight(team_code, smallHeight))
    largeIcon = new google.maps.MarkerImage(teamSVGPath, null, null, null, scaleTeamIconSizeToHeight(team_code, largeHeight))

    return [largeIcon, smallIcon]
}

// returns size object scaled to height
function scaleTeamIconSizeToHeight(team_code, height) {
  SVGSize = team_crest_svg_size[team_code] // [width, height]
  scaledWidth = SVGSize[0] * (height/SVGSize[1])

  return new google.maps.Size(scaledWidth, height)
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
  var largeSmallIcons = team_code_to_icons[team_code]

  var marker = new google.maps.Marker({
    position: location,
    map: map,
    title: team_code_and_name[team_code]
  });
  marker.clicked = false

  team_code_to_marker[team_code] = marker
}

function addIcons() {
  for (team_code in team_code_to_marker) {
    var largeSmallIcons = team_code_to_icons[team_code]
    var marker = team_code_to_marker[team_code]

    if (marker.clicked) {
      marker.setIcon(largeSmallIcons[0])
    } else {
      marker.setIcon(largeSmallIcons[1])
    }

    // these listeners only deal with icon size.  load_score.js will deal with only infoWindows
    google.maps.event.addListener(marker, 'mouseover', mouseOverEvent(marker, largeSmallIcons[0]));
    google.maps.event.addListener(marker, 'mouseout', mouseOutEvent(marker, largeSmallIcons[1]));
    google.maps.event.addListener(marker, 'click', mouseClickEvent(marker, largeSmallIcons));
  }
}

function  mouseOverEvent(marker, largeIcon) {
  return function() {
    if (marker.getIcon() != largeIcon && !marker.clicked) {
      marker.setIcon(largeIcon)
    } 
  }
}

function mouseOutEvent(marker, smallIcon) {
  return function() {
    if (!marker.clicked) {
      marker.setIcon(smallIcon)
    }
  }
}

function mouseClickEvent(marker, largeSmallIcons) {
  return function() {
    marker.clicked = !marker.clicked

    if (this.clicked) {
      this.setIcon(largeSmallIcons[0])
    } else {
      this.setIcon(largeSmallIcons[1])
    }
  }
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

function addMapListeners() {
  map.addListener('zoom_changed', function() {
    currentZoomLevel = map.getZoom()
    if (currentZoomLevel > (initialZoomLevel - 1)) {
      populateTeamCodeToIcons()
      addIcons()
    }
  });
}

google.maps.event.addDomListener(window, 'load', addMapListeners)