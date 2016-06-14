function calculateRouteToMarker(routebutton){
    // calculate route to this marker
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    directionsDisplay.setMap(map);
    directionsDisplay.setOptions( { suppressMarkers: true } );

    var infoWindow = routebutton.closest('.info-window');
    var currentPosition = $('#userinfo');
    var start = new google.maps.LatLng(currentPosition.data('lat'), currentPosition.data('lng'));
    var end = new google.maps.LatLng(infoWindow.data('lat'), infoWindow.data('lng'));

    var request = {
        origin: start,
        destination:end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    displayRoute(directionsService, infoWindow, directionsDisplay);
}

function displayRoute(directionsService, infoWindow, directionsDisplay){
    directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            infoWindow.find('.distance').text(result.routes[0].legs[0].distance.text);
            infoWindow.find('.duration').text(result.routes[0].legs[0].duration.text);
            directionsDisplay.setDirections(result);
        }
    });
}


/**
 * This function gets the current location of the client and loads the map.
 * If geo locations are not supported an error is shown to the console.
 */
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(loadMap);
    } else {
        console.error("Geo location not supported by this browser.");
    }
}

/**
 * This function loads and shows the map with all markers.
 * @param position current position of the client.
 */
function loadMap(position) {
    var here = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var mapOptions = { center: here, zoom: MAP_ZOOM},
        currentPosition = $('#userinfo');

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    var markerIcon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=P|0000FF|ffffff',
        tooltipData = '<div id="current-pos" class="info-window">Your Position</div>',
        infoWindow = new google.maps.InfoWindow({
            content: tooltipData
        });
    currentPosition.data('lat', position.coords.latitude);
    currentPosition.data('lng', position.coords.longitude);
    createMarker(here, markerIcon, infoWindow);
    searchFriends();
}

/**
 * This function creates a marker at a specific location on the map.
 * @param location location of the new marker
 * @param iconUrl icon of the marker
 * @param infoWindow info window which is added to the marker.
 */
function createMarker(location, iconUrl, infoWindow){
    var markerOptions = {
        map: map,
        position: location,
        icon: iconUrl
    };
    var marker = new google.maps.Marker(markerOptions);
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker);
    });
}
