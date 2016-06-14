/**
 * Call SLIM-API to get all friends
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
        }
    });
}

/**
 * Call SLIM-API to get all users for search on friendlist
 * @param prefix
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
        }
    });
}

/**
 * Call SLIM-API to get all open friend requests
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
        }
    });
}

/**
 * Call SLIM-API to get all friend request waiting for answer
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
        }
    });
}

/**
 * Call SLIM-API to delete Friend from FriendList
 * @param friendID: ID of Friend to delete
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
        }
    });
}

/**
 * Call SLIM-API to get accept or decline a friend request
 * @param answer: accept or decline
 * @param friendID: ID of Friend
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
        }
    });
}

/**
 * Call SLIM-API to send a friend request
 * @param personID: Person to send friend request to
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
        }
    });
}