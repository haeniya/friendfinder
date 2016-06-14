/**
 * Gets the data for the friend list.
 */
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

        }
    });
}

/**
 * Retrieves all people with a username containing a specific prefix.
 * @param prefix Prefix that the user entered in the search box.
 */
function searchPeople(prefix){
    $.ajax({
        url : "restAPI/users/"+prefix,
        type: "get",
        dataType: 'json',
        success: function(data, textStatus, jqXHR)
        {
            $('#persons ul').empty();
            $(data).each(function(index){
                appendPersonNode(data[index]);
            });
            // switchView('friendlist');
            //data - response from server
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

/**
 * Retrieves all open requests and appends them to the list.
 */
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

        }
    });
}

/**
 * Retrieves all open requests and adds them to the appropriate list.
 */
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

        }
    });
}
/**
 * This function deletes a specific friend from the current user.
 * @param friendID Id of the friend to be removed.
 */
function deleteFriend(friendID){
    $.ajax({
        url : "restAPI/friends/"+friendID,
        type: "get",
        dataType: 'json',
        success: function(data, textStatus, jqXHR)
        {
            $('#allpersons .notification').text("Freund erfolgreich gelöscht!");
            $('#allpersons .notification').fadeIn().delay(3000).fadeOut();
            $('#friends li[data-friend-id='+friendID+']').remove();
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}
/**
 * Answers a friend request.
 * @param answer Answer of the user (accept/decline)
 * @param friendID User id of the user who sent the request.
 */
function answerFriendRequest(answer, friendID) {
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
            //$('#friends li[data-friend-id='+friendID+']').remove();
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}
/**
 * Sends a friend request to a user.
 * @param personID User id of the future friend.
 */
function sendFriendRequest(personID){
    $.ajax({
        url : "restAPI/FriendRequests/new/" +personID,
        type: "get",
        dataType: 'json',
        success: function(data, textStatus, jqXHR)
        {
            $('#allpersons .notification').text("Freundschaftsanfrage wurde erfolgreich gesendet!");
            $('#allpersons .notification').fadeIn().delay(3000).fadeOut();
            reloadFriendList();
            //$('#friends li[data-friend-id='+friendID+']').remove();
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}