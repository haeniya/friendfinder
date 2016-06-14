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
        //loadMap(position);
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
    console.log("logout");
    // clear localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('password');

    $.ajax({
        url : "restAPI/logout",
        type: "get",
        success: function(data, textStatus, jqXHR)
        {
            switchView('login');
            location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("fail");
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
    location.reload();

}

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
function searchFriends(){
    $.get("restAPI/friendsPosition", function(data) {
        data.forEach(function(item){
            var date = new Date(item.timestamp);
            /*jshint multistr: true */
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