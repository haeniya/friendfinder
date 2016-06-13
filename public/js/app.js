/**
 * Created by Luecu on 17.05.2016.
*/
const MAP_RADIUS = 10000;
const MAP_ZOOM = 15;
var map;

$( document ).ready(function() {
    $("#login-form").on("click", "#login-btn", function(event){
        event.preventDefault();
        checkLogin({username:$("#form-username").val(), password:$("#form-password").val()});
    });

    $('#register-btn').on('click', function (event) {
        event.preventDefault();
        switchView('register');
    });

    $('#back-login-btn').on('click', function (event) {
        event.preventDefault();
        switchView('login');
    });
});

function switchView(viewId){
    $('.tab').hide();
    var searchBox = $('#search');
    if(viewId == 'login' || viewId == 'register'){
        searchBox.hide();
        $('nav').hide();
    }else{
        $('nav').show();
        searchBox.show();
    }
    $('#' + viewId).show();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(loadMap);
    } else {
        console.error("Geo location not supported by this browser.")
    }
}

function loadMap(position) {
    var here = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var mapOptions = { center: here, zoom: MAP_ZOOM };
    console.log(mapOptions);
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    var markerIcon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=P|0000FF|ffffff';
    createMarker(here, markerIcon);
    searchFriends(here);
}

function searchFriends(location){
    //TODO: search friends
}

function nearbySearchCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            appendWhoNode(place);
            var markerIcon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+(i+1)+'|FF0000|ffffff';
            createMarker(place.geometry.location, markerIcon);
        }
    }
}

function createMarker(location, iconUrl){
    console.log(location);
    var markerOptions = {
        map: map,
        position: location,
        icon: iconUrl
    };
    new google.maps.Marker(markerOptions);
}

function appendWhoNode(place){
    var placesList = $('#restaurants'),
        restaurant = '<li>'+ place.name +  ', ' + place.vicinity +'</li>';
    placesList.append(restaurant);
}

function checkLogin(formData){
    $.ajax({
        url : "restAPI/login",
        type: "POST",
        data : formData,
        dataType: 'json',
        success: function(data, textStatus, jqXHR)
        {
            if(data.loginstatus){
                switchView('map');
                getLocation();
                setInterval(saveCurrentPosition, 20000)
            }
            else {
                var errormessage = $("<h2>").text("Benutzername oder Passwort falsch");
                $("#login").find(".form-top").append(errormessage);
            }
            console.log(data);
            //data - response from server
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("fail");
        }
    });
}

function saveCurrentPosition(){
    console.log("save position");
    navigator.geolocation.getCurrentPosition(function(position){
        var positionData = {lat: position.coords.latitude, lng: position.coords.longitude};

        $.post( "restAPI/updatePosition", {position: JSON.stringify(positionData)}, function(data) {
            console.log("position updated");
        }, "json");
    });
}