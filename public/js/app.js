/**
 * Created by Luecu on 17.05.2016.
*/
var MAP_ZOOM = 15;
var map;

$( document ).ready(function() {

    switchView('login');
    if (localStorage.getItem('username')) {
        checkLogin({username:localStorage.getItem('username'), password:localStorage.getItem('password')});
    }

    //Listen to dynamically added route buttons
    $(document).on('click', '.route-btn', function(event){
        // calculate route to this marker
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var directionsService = new google.maps.DirectionsService();
        directionsDisplay.setMap(map);
        directionsDisplay.setOptions( { suppressMarkers: true } );

        var infoWindow = $(this).closest('.info-window');
        var currentPosition = $('#userinfo');
        var start = new google.maps.LatLng(currentPosition.data('lat'), currentPosition.data('lng'));
        var end = new google.maps.LatLng(infoWindow.data('lat'), infoWindow.data('lng'));

        var request = {
            origin: start,
            destination:end,
            travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                infoWindow.find('.distance').text(result.routes[0].legs[0].distance.text);
                infoWindow.find('.duration').text(result.routes[0].legs[0].duration.text);
                directionsDisplay.setDirections(result);
            }
        });
    });

});



function userIsLoggedIn(){
    var userId = $('#userinfo').data('info');
    return userId > 0;
}

function switchView(viewId){
    $('.tab').hide();
    var searchBox = $('#search');
    setonlyContentModeEnabled(viewId == 'login' || viewId == 'register');

    if(viewId == 'map'){
        initAutocompleteFriends();
    }else{
        var searchInput = $(".js-search-box");
        if(searchInput.hasClass('ui-autocomplete-input')){
            // remove autocomplete
            searchInput.autocomplete("destroy");
        }
    }
    $('nav li.active').removeClass('active');
    $('nav li.' + viewId + '-view').addClass('active');
    $('#' + viewId).show();
}

function setonlyContentModeEnabled(isEnabled){
    var searchBox = $('#search');
    if(isEnabled) {
        searchBox.hide();
        $('nav').hide();
    }

    else{
        $('nav').show();
        searchBox.show();
    }

}

function getActiveView(){
    return $('main').find('section:visible:first').attr('id');
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(loadMap);
    } else {
        console.error("Geo location not supported by this browser.");
    }
}

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

function appendFriendNode(friend){
    var friendList = $('#friends ul'),
        person = '<li data-friend-id='+friend.id+'>'+ friend.username+'<i class="fa fa-minus-square-o delete" aria-hidden="true"></i></li>';
    friendList.append(person);
}

function appendPersonNode(person){
    var personList = $('#persons ul'),
        personCreated = '<li data-person-id='+person.id+'>'+ person.username+'<i class="fa fa-plus-square-o add" aria-hidden="true"></i></li>';
    personList.append(personCreated);
}


function appendAwaitingFriendRequestNode(person){
    var personList = $('#awaitingfriendrequests ul'),
        personCreated = '<li data-person-id='+person.id+'>'+ person.username+'</li>';
    personList.append(personCreated);
}


function appendFriendRequestNode(person){
    var personList = $('#friendrequests ul'),
        personCreated = '<li data-person-id='+person.id+'>'+ person.username+'<i class="fa fa-plus-square-o accept" aria-hidden="true"></i><i class="fa fa-minus-square-o decline" aria-hidden="true"></i></li>';
    personList.append(personCreated);
}



function reloadFriendList(){
    $('#persons ul').empty();
    getOpenRequests();
    getAwaitingRequests();
    getFriendList();
}