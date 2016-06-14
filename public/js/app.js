/**
 * Created by Luecu on 17.05.2016.
*/
var MAP_ZOOM = 15;
var map;

$( document ).ready(function() {

    switchView('login');
    if (localStorage.getItem('username')) {
        checkLogin({username: localStorage.getItem('username'), password: localStorage.getItem('password')});
    }

    $("nav").on("click", "#friendlist", function(event){
        event.preventDefault();
        getOpenRequests();
        getAwaitingRequests();
        getFriendList();
    });

    $("nav").on("click", "#logout", function(event){
        console.log("logotu1");
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

//Listen to dynamically added route buttons
    $(document).on('click', '.route-btn', function(event){
        calculateRouteToMarker($(this));
    });

});


