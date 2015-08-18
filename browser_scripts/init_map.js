        var bounds = new google.maps.LatLngBounds();
        for (key in team_code_to_locations) {
          var lat = team_code_to_locations[key][0]
          var lng = team_code_to_locations[key][1]
          bounds.extend(new google.maps.LatLng(lat, lng))
        };
        var mapCenter = bounds.getCenter()

        var zoomLevel = 6;
        var mapOptions = {
          center: mapCenter,
          zoom: zoomLevel,
          panControl:false,
          zoomControl:true,
          streetViewControl:false,
          scrollwheel:true
        };
        var map

        /**
         * The CenterControl adds a control to the map that recenters the map on Chicago.
         * This constructor takes the control DIV as an argument.
         * @constructor
         */
        function CenterControl(controlDiv, map) {

        // Set CSS for the control border
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.float = 'left';
        controlUI.style.marginBottom = '22px';
        controlUI.style.marginLeft = '12px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior
        var goCenterText = document.createElement('div');
        controlUI.style.color = 'rgb(25,25,25)';
        controlUI.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlUI.style.fontSize = '16px';
        controlUI.style.lineHeight = '38px';
        controlUI.style.paddingLeft = '5px';
        controlUI.style.paddingRight = '5px';
        controlUI.innerHTML = 'Center Map';
        controlUI.appendChild(goCenterText);

        // Set CSS for the goToToday control border
        var todayUI = document.createElement('div');
        todayUI.style.backgroundColor = '#fff';
        todayUI.style.border = '2px solid #fff';
        todayUI.style.borderRadius = '3px';
        todayUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        todayUI.style.cursor = 'pointer';
        todayUI.style.float = 'left';
        todayUI.style.marginBottom = '22px';
        todayUI.style.marginLeft = '12px';
        todayUI.style.textAlign = 'center';
        todayUI.title = 'Click to set the current day to today';
        controlDiv.appendChild(todayUI);

        // Set CSS for the control interior
        var todayText = document.createElement('div');
        todayUI.style.color = 'rgb(25,25,25)';
        todayUI.style.fontFamily = 'Roboto,Arial,sans-serif';
        todayUI.style.fontSize = '16px';
        todayUI.style.lineHeight = '38px';
        todayUI.style.paddingLeft = '5px';
        todayUI.style.paddingRight = '5px';
        todayUI.innerHTML = 'Go To Today';
        todayUI.appendChild(todayText);

        google.maps.event.addDomListener(controlUI, 'click', function() {
          map.setCenter(mapCenter)
          map.setZoom(zoomLevel)
        });

        google.maps.event.addDomListener(todayUI, 'click', function() {
          setSliderToCurrentDay()
        });
      }

      function initialize() {

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        // Create the DIV to hold the control and
        // call the CenterControl() constructor passing
        // in this DIV.
        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map);

        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(centerControlDiv);
      }

      google.maps.event.addDomListener(window, 'load', initialize);