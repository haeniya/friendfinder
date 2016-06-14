/**
 * Created by Luecu on 17.05.2016.
*/
const MAP_ZOOM = 15;
var map;

$( document ).ready(function() {

    switchView('login');
    if (localStorage.getItem('username')) {
        checkLogin({username:localStorage.getItem('username'), password:localStorage.getItem('password')})
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
        getAwaitingRequests();
        getFriendList();
    });
    $("#register").on("keyup", "#form-confirm-pwd", function(event){
        if($(this).val() != $('#form-register-password').val()) {
            $(this).css("border", "1px solid red");
        }
        else {
            $(this).css("border", "none");
        }
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
        var validationResult = validateRegisterForm();
        if (validationResult) {
            $('#register-alert').hide();
            registerUser({
                username: $("#form-register-username").val(),
                firstname: $("#form-first-name").val(),
                lastname: $("#form-last-name").val(),
                livingplace: $('#form-living-place').val(),
                email: $("#form-email").val(),
                password: $("#form-register-password").val()
            });
        }
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

function initAutocompleteFriends(){
    $.get("restAPI/friendsPosition", function(data) {
        var availableTags = [];
        data.forEach(function(item){
            availableTags.push(item.firstname + " " + item.lastname);
        });

        $(".js-search-box").autocomplete({
            source: availableTags,
            scroll: true,
            select: function (event, ui) {
                var index = availableTags.indexOf(ui.item.value);
                console.log(data[index].lat, data[index].lng);
                var position = new google.maps.LatLng(data[index].lat, data[index].lng);
                map.setCenter(position);
            }
        });
    }, 'json');
}

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

function getActiveView(){
    return $('main').find('section:visible:first').attr('id');
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
    $.get("restAPI/friendsPosition", function(data) {
        data.forEach(function(item){
            var date = new Date(item.timestamp);
            var markerIcon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|FF0000|ffffff',
                position = new google.maps.LatLng(item.lat, item.lng),
                tooltipData = '<div class="info-window" data-lat="'+item.lat+'" data-lng="'+item.lng+'"> \
                               <h3>'+ item.firstname + ' ' + item.lastname +'</h3> \
                                <p>Last time logged in: ' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + '</p>\
                                <p>Living place: ' + item.livingplace + ' </p>\
                                <button class="btn btn-info route-btn" type="button"> \
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
                if ($('#form-remember').is(':checked')) {
                    localStorage.setItem('username',$("#form-username").val());
                    localStorage.setItem('password',$('#form-password').val());
                }

                switchView('map');
                getLocation();
                setInterval(saveCurrentPosition, 20000);
            } else {
                $("#login").find(".alert").text("Benutzername oder Passwort falsch");
                $("#login").find(".alert").fadeIn().delay(3000).fadeOut();
            }
            console.log(data);
            //data - response from server
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("fail");
        }
    });
}

function validateRegisterForm() {
    var errorString = "";
    if (!$.trim($('#form-register-username').val())) {
        errorString += "<p>- Bitte geben Sie einen Benutzernamen ein.</p>"
    }
    if (!$.trim($('#form-first-name').val())) {
        errorString += '<p>- Bitte geben Sie einen Vornamen ein.</p>';
    }
    if (!$.trim($('#form-last-name').val())) {
        errorString += "<p>- Bitte geben Sie einen Nachnamen ein.</p>"
    }
    if (!$.trim($('#form-living-place').val())) {
        errorString += "<p>- Bitte geben Sie einen Wohnort ein.</p>"
    }
    if (!$.trim($('#form-email').val())) {
        errorString += "<p>- Bitte geben Sie ein E-Mail Adresse ein.</p>"
    } else if (!validateEmail($('#form-email').val())) {
        errorString += "<p>- Bitte geben Sie eine korrekte Emailadresse ein.</p>"
    }

    if (!$.trim($('#form-register-password').val())) {
        errorString += "<p>- Bitte geben Sie ein Passwort ein.</p>"
    } else if ($('#form-register-password').val() !== $('#form-confirm-pwd').val()) {
        errorString += "<p>- Die eingegebenen Passwörter stimmen nicht überein.</p>"
    }


    if (errorString !== "") {
        $('#register-alert').html(errorString);
        $('#register-alert').show();
    } else {
        $('#register-alert').hide();
    }

    return errorString == "";
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
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
                $('#login').find('.alert').text("Registrierung war erfolgreich");
                $('#login').find('.alert').fadeIn().delay(3000).fadeOut();
                switchView('login');
            }
            else {
                $("#register").find(".alert").text("Etwas ist schiefgelaufen");
            }
            console.log(data);
            //data - response from server
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#register").find(".alert").text("Etwas ist schiefgelaufen");
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
            if(data.success) {
                console.log("position successfully updated");
                var current = $('#userinfo');
                current.data('lat', positionData.lat);
                current.data('lng', positionData.lng);
            }else{
                console.error("Failed to update position!");
            }
        }, "json");
        // reload map
        loadMap(position);
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
function getAwaitingRequests(){
    $.ajax({
        url : "restAPI/FriendRequests/awaiting",
        type: "get",
        dataType: 'json',
        success: function(data, textStatus, jqXHR)
        {
            $('#awaitingfriendrequests ul').empty();
            $(data).each(function(index){
                appendAwaitingFriendRequestNode(data[index]);
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
            $('#allpersons .notification').fadeIn().delay(3000).fadeOut();
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
            if(answer == "accept"){
                $('#allpersons .notification').text("Freundschaftsanfrage wurde akzeptiert!");
                $('#allpersons .notification').fadeIn().delay(3000).fadeOut();
                reloadFriendList();
            }
            else {
                $('#allpersons .notification').text("Freundschaftsanfrage wurde abgelehnt!");
                $('#allpersons .notification').fadeIn().delay(3000).fadeOut();
                reloadFriendList();
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
            $('#allpersons .notification').fadeIn().delay(3000).fadeOut();
            reloadFriendList();
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
    // clear localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('password');
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

function reloadFriendList(){
    $('#persons ul').empty();
    getOpenRequests();
    getAwaitingRequests();
    getFriendList();
}