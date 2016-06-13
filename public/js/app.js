/**
 * Created by Luecu on 17.05.2016.
*/
const MAP_ZOOM = 15;
var map;

$( document ).ready(function() {
    if($('#userinfo').text() != ''){
        switchView('map');
        getLocation();
        setInterval(saveCurrentPosition, 20000);
    }

    $("nav").on("click", "#friendlist", function(event){
        event.preventDefault();
        getOpenRequests();
        getFriendList();
    });
    $("nav").on("click", "#logout", function(event){
        event.preventDefault();
        logout();
    });
    $("nav").on("click", "#showmap", function(event){
        event.preventDefault();
        switchView("map");
    });

    $("#login-form").on("click", "#login-btn", function(event){
        event.preventDefault();
        checkLogin({username:$("#form-username").val(), password:$("#form-password").val()});
    });

    $("#friendrequests").on("click", ".accept", function(event){
        event.preventDefault();
        answerFriendRequest("accept",$(this).parent().data("person-id"));
    });
    $("#friendrequests").on("click", ".decline", function(event){
        event.preventDefault();
        answerFriendRequest("decline", $(this).parent().data("person-id"));
    });
    $("#friends").on("click", ".delete", function(event){
        event.preventDefault();
        deleteFriend($(this).parent().data("friend-id"));
    });
    $("#persons").on("click", ".add", function(event){
        event.preventDefault();
        sendFriendRequest($(this).parent().data("person-id"));
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
    var markerIcon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=P|0000FF|ffffff',
        tooltipData = '<div class="info-window">Your Position</div>',
        infoWindow = new google.maps.InfoWindow({
            content: tooltipData
        });
    createMarker(here, markerIcon, infoWindow);
    searchFriends();
}

function searchFriends(){
    $.get( "restAPI/friendsPosition", function(data) {
        data.forEach(function(item){
            var markerIcon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|FF0000|ffffff',
                position = new google.maps.LatLng(item.lat, item.lng),
                date = new Date(item.timestamp),
                tooltipData = '<div class="info-window"><h3>'+ item.firstname + ' ' + item.lastname +'</h3> \
                                <p>Last time logged in: ' + date + '</p><button class="btn btn-info btn-lg" type="button"> \
                                Route \
                                </button></div>',
                infoWindow = new google.maps.InfoWindow({
                    content: tooltipData
                });

            createMarker(position, markerIcon, infoWindow);
        });
    }, 'json');
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

function appendFriendRequestNode(person){
    var personList = $('#friendrequests ul'),
        personCreated = '<li data-person-id='+person.id+'>'+ person.username+'<i class="fa fa-plus-square-o accept" aria-hidden="true"></i><i class="fa fa-minus-square-o decline" aria-hidden="true"></i></li>';
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
            $('#friends ul').empty();
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
            console.log("success");
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
            $('#friendrequests ul').empty();
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
function deleteFriend(friendID){
    console.log(friendID);
    $.ajax({
        url : "restAPI/friends/"+friendID,
        type: "get",
        dataType: 'json',
        success: function(data, textStatus, jqXHR)
        {
            console.log("friend deleted");
            $('#allpersons .notification').text("Freund erfolgreich gelöscht!");
            $('#allpersons .notification').fadeIn();
            $('#friends li[data-friend-id='+friendID+']').remove();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("fail");
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
function answerFriendRequest(answer, friendID) {
    console.log(friendID);
    $.ajax({
        url : "restAPI/FriendRequests/"+answer+"/"+friendID,
        type: "get",
        dataType: 'json',
        success: function(data, textStatus, jqXHR)
        {
            if(anser == "accepted"){
                $('#allpersons .notification').text("Freundschaftsanfrage wurde akzeptiert!");
                $('#allpersons .notification').fadeIn();
            }
            else {
                $('#allpersons .notification').text("Freundschaftsanfrage wurde abgelehnt!");
                $('#allpersons .notification').fadeIn();
            }
            console.log("worked");
            //$('#friends li[data-friend-id='+friendID+']').remove();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("fail");
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
function sendFriendRequest(personID){
    $.ajax({
        url : "restAPI/FriendRequests/new/" +personID,
        type: "get",
        dataType: 'json',
        success: function(data, textStatus, jqXHR)
        {
            console.log("worked");
            $('#allpersons .notification').text("Freundschaftsanfrage wurde erfolgreich gesendet!");
            $('#allpersons .notification').fadeIn();
            //$('#friends li[data-friend-id='+friendID+']').remove();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("fail");
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function logout(){
    $.ajax({
        url : "restAPI/logout",
        type: "get",
        success: function(data, textStatus, jqXHR)
        {
            switchView('login');
            //$('#friends li[data-friend-id='+friendID+']').remove();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("fail");
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}