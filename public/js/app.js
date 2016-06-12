/**
 * Created by Luecu on 17.05.2016.
*/
const MAP_RADIUS = 10000;
const MAP_ZOOM = 15;

$( document ).ready(function() {
    $("#login-form").on("click", "#login-btn", function(event){
        event.preventDefault();
        checkLogin({username:$("#username").val(), password:$("#password").val()});
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
    $('#' + viewId).show();
}

function initMap(position) {
    // Create a map object and specify the DOM element for display.
    var myLatLng = {lat: position.coords.latitude, lng: position.coords.longitude};
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: position.coords.latitude, lng: position.coords.longitude},
        scrollwheel: false,
        zoom: 8
    });
    var marker=new google.maps.Marker({
        position:myLatLng,
    });

    marker.setMap(map);
}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        //x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {
   // x.innerHTML = "Latitude: " + position.coords.latitude +"<br>Longitude: " + position.coords.longitude;
    console.log(position.coords.latitude);
    initMap(position);
}

function checkLogin(formData){
    $.ajax({
        url : "restAPI/login",
        type: "POST",
        data : formData,
        success: function(data, textStatus, jqXHR)
        {
            if(data == "1"){
                console.log("erolgreich eingeloggt");
                switchView('map');
            }
            //data - response from server
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log("fail");
        }
    });
}