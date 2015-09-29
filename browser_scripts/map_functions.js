// constants definitions here
var firstWeek = 1
var lastWeek = 38
var sliderId = "matchday-slider"
// end constant definitions

team_code_to_marker = {} // current markers displayed - key is team code

/*
  first game day: Aug 8, 2015 - Day #1 -> return 1
  last game day: May 15, 2016 - Day #282 -> return 38
*/
Date.prototype.getCurrentMatchday = function() {
  var dayOne = new Date(2015,7,8);
  var currentSeasonDay = Math.ceil((this - dayOne) / 86400000);

  while (!(currentSeasonDay in last_gameday_to_matchday)) {
    currentSeasonDay++;
  }

  return last_gameday_to_matchday[currentSeasonDay]
}

// displays all teams for a given matchday
function updateMap() {
  updateMatchdayInHeader()

	deleteMarkers();
  var matchday = getSliderValue()

	all_games = full_schedule_by_matchday[matchday]
	
	for (var i = 0; i < all_games.length; i++) {
		game = all_games[i]
		home_team_code = game[0]
		away_team_code = game[1]

		putTeamOnMap(home_team_code)
	}
}

function updateMatchdayInHeader() {
  document.getElementById("header-matchday-span").innerHTML = document.getElementById(sliderId).value;
}

function moveSliderLeft() {
	var currentMatchday = getSliderValue()
	if (currentMatchday > firstWeek) {
		currentMatchday--;
		moveSlider(currentMatchday);
	}
}

function moveSliderRight() {
	var currentMatchday = getSliderValue()
	if (currentMatchday < lastWeek) {
		currentMatchday++;
		moveSlider(currentMatchday);
	}
}

function moveSlider(matchday) {
  setSliderValue(matchday)
  updateMap()
  loadScoresForSliderMatchday()
}

function moveSliderToToday() {
  var currentMatchday = new Date().getCurrentMatchday();
  // only move slider if day set is not current day OR no markers on map
  if (currentMatchday != getSliderValue() || Object.keys(team_code_to_marker).length == 0) {
    moveSlider(currentMatchday)
  }
}

function setSliderValue(matchday) {
	document.getElementById(sliderId).value = matchday;
}

function getSliderValue() {
    return parseInt(document.getElementById(sliderId).value)
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
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    title: team_code_and_name[team_code],
  });
  marker.clicked = false;

  team_code_to_marker[team_code] = marker

  addIconsToMarker(team_code)
  addIconListenersToMarker(team_code)
}

// adds or refreshed images associated to marker based on click & zoom level
function addIconsToMarker(team_code) {
  var marker = team_code_to_marker[team_code]
  scaledMarkerImages = getScaledMarkerImage(team_code, map.getZoom())
  marker.largeImage = scaledMarkerImages[0]
  marker.smallImage = scaledMarkerImages[1]

  if (marker.clicked) {
    marker.setIcon(marker.largeImage)
  } else {
    marker.setIcon(marker.smallImage)
  }
}

function addIconListenersToMarker(team_code) {
  var marker = team_code_to_marker[team_code]

  // these listeners only deal with icon size.  load_score.js will deal with only infoWindows
  google.maps.event.addListener(marker, 'mouseover', mouseOverEvent(marker));
  google.maps.event.addListener(marker, 'mouseout', mouseOutEvent(marker));
  google.maps.event.addListener(marker, 'click', mouseClickEvent(marker));
}

// returns [largeImage, smallImage]
function getScaledMarkerImage(team_code, zoomLevel) {
  // for some reason only  chrome browsers support svg images fully as markers on google maps
  // svg images look crisper and rescale better however, so I kept both
  if (window.chrome != null && window.navigator.vendor === "Google Inc.") {
    var teamIconPath = "images/team_icons_svg/" + team_code + ".svg"
  } else {
    var teamIconPath = "images/team_icons_orig/" + team_code + ".png"
  }
  smallHeight = 10*zoomLevel // keep icon proportional to zoom level
  largeHeight = smallHeight*1.2

  smallIcon = new google.maps.MarkerImage(teamIconPath, null, null, null, scaleTeamIconSizeToHeight(team_code, smallHeight))
  largeIcon = new google.maps.MarkerImage(teamIconPath, null, null, null, scaleTeamIconSizeToHeight(team_code, largeHeight))

  return [largeIcon, smallIcon]
}

// returns size object scaled to height
function scaleTeamIconSizeToHeight(team_code, height) {
  SVGSize = team_crest_svg_size[team_code] // [width, height]
  scaledWidth = SVGSize[0] * (height/SVGSize[1])

  return new google.maps.Size(scaledWidth, height)
}

function  mouseOverEvent(marker) {
  return function() {
    if (marker.getIcon() != marker.largeImage && !marker.clicked) {
      marker.setIcon(marker.largeImage)
    } 
  }
}

function mouseOutEvent(marker) {
  return function() {
    if (!marker.clicked) {
      marker.setIcon(marker.smallImage)
    }
  }
}

function mouseClickEvent(marker) {
  return function() {
    marker.clicked = !marker.clicked

    if (marker.clicked) {
      marker.setIcon(marker.largeImage)
    } else {
      marker.setIcon(marker.smallImage)
    }
  }
}

// Sets the map on all markers in the array.
function setAllMap(passedMap) {
  for (var key in team_code_to_marker) {
    team_code_to_marker[key].setMap(passedMap);

    if (passedMap == null) {
      team_code_to_marker[key] = null
    }
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
      refreshMarkerIcons();
    }
  });
}

// helper function
function refreshMarkerIcons() {
  Object.keys(team_code_to_marker).map(addIconsToMarker);
}

google.maps.event.addDomListener(window, 'load', addMapListeners)