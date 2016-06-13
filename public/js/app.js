/**
 * Created by Luecu on 17.05.2016.
*/
const MAP_ZOOM = 15;
var map;

$( document ).ready(function() {
    if(userIsLoggedIn()){
        switchView('map');
        getLocation();
        setInterval(saveCurrentPosition, 20000);
    }else{
        switchView('login');
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

    $("nav").on("click", "#friendlist", function(event){
        event.preventDefault();
        getOpenRequests();
        getFriendList();
    });

    $("#login-form").on("click", "#login-btn", function(event){
        event.preventDefault();
        checkLogin({username:$("#form-username").val(), password:$("#form-password").val()});
    });

    $("header").on("keyup", "#custom-search-input input", function(event){
        event.preventDefault();
        searchPeople($(this).val());
    });

    $("#registration-form").on("click", "#register-send-btn", function(event){
        event.preventDefault();
        registerUser({username: $("#form-register-username").val(), firstname: $("#form-first-name").val(), lastname: $("#form-last-name").val(), place: $("#form-place").val(), password: $("#form-register-password").val()} );
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

function userIsLoggedIn(){
    var userId = $('#userinfo').data('info');
    return userId > 0;
}

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

function searchFriends(){
    $.get( "restAPI/friendsPosition", function(data) {
        data.forEach(function(item){
            var markerIcon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|FF0000|ffffff',
                position = new google.maps.LatLng(item.lat, item.lng),
                date = new Date(item.timestamp),
                tooltipData = '<div class="info-window" data-lat="'+item.lat+'" data-lng="'+item.lng+'"> \
                               <h3>'+ item.firstname + ' ' + item.lastname +'</h3> \
                                <p>Last time logged in: ' + date + '</p><button class="btn btn-info route-btn" type="button"> \
                                Route \
                                </button><div class="distance"></div><div class="duration"></div></div>',
                infoWindow = new google.maps.InfoWindow({
                    content: tooltipData
                });
            createMarker(position, markerIcon, infoWindow);
        });
    }, 'json');
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
        person = '<li>'+ friend.username+'<i class="fa fa-minus-square-o" aria-hidden="true"></i></li>';
    friendList.append(person);
}

function appendPersonNode(person){
    var personList = $('#persons ul'),
        personCreated = '<li>'+ person.username+'<i class="fa fa-plus-square-o" aria-hidden="true"></i></li>';
    personList.append(personCreated);
}

function appendFriendRequestNode(person){
    var personList = $('#friendrequests ul'),
        personCreated = '<li>'+ person.username+'<i class="fa fa-plus-square-o" aria-hidden="true"></i><i class="fa fa-minus-square-o" aria-hidden="true"></i></li>';
    personList.append(personCreated);
}

function checkLogin(formData){
    console.log(formData);
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
                setInterval(saveCurrentPosition, 20000);
            } else {
                $("#login").find(".notification").text("Benutzername oder Passwort falsch");
            }
            console.log(data);
            //data - response from server
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("fail");
        }
    });
}

function registerUser(formData){
    console.log(formData);
    $.ajax({
        url : "restAPI/register",
        type: "POST",
        data : formData,
        dataType: 'json',
        success: function(data, textStatus, jqXHR)
        {
            if(data.registerstatus){
                switchView('login');
            }
            else {
                $("#register").find(".notification").text("Etwas ist schiefgelaufen");
            }
            console.log(data);
            //data - response from server
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("fail");
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function saveCurrentPosition(){
    navigator.geolocation.getCurrentPosition(function(position){
        var positionData = {lat: position.coords.latitude, lng: position.coords.longitude};

        $.post( "restAPI/updatePosition", {position: JSON.stringify(positionData)}, function(data) {
            console.log(data);
            if(data.success) {
                console.log("position successfully updated");
                var current = $('#userinfo');
                current.data('lat', positionData.lat);
                current.data('lng', positionData.lng);
            }else{
                console.error("Failed to update position!");
            }
        }, "json");
    });
}

function getFriendList(){
    $.ajax({
        url : "restAPI/friends",
        type: "get",
        dataType: 'json',
        success: function(data, textStatus, jqXHR)
        {
            $(data).each(function(index){
                appendFriendNode(data[index]);
            });
            switchView('allpersons');
            //data - response from server
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("fail");
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function searchPeople(prefix){
    $.ajax({
        url : "restAPI/users/"+prefix,
        type: "get",
        dataType: 'json',
        success: function(data, textStatus, jqXHR)
        {
            console.log(data);
            $('#persons ul').empty();
            $(data).each(function(index){
                appendPersonNode(data[index]);
            });
           // switchView('friendlist');
            //data - response from server
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("fail");
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
function getOpenRequests(){
    $.ajax({
        url : "restAPI/FriendRequests",
        type: "get",
        dataType: 'json',
        success: function(data, textStatus, jqXHR)
        {
            $(data).each(function(index){
                appendFriendRequestNode(data[index]);
            });
            switchView('allpersons');
            //data - response from server
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("fail");
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}