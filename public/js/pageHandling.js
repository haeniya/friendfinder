/**
 * This function toggles (show/hide) the navigation and search box depending on the active view.
 * @param isLoginPage if the active view is register or login the search box and navigation are hidden.
 */
function toggleSiteElements(isLoginPage){
    var searchBox = $('#search');
    if(isLoginPage) {
        searchBox.hide();
        $('nav').hide();
    }else{
        $('nav').show();
        searchBox.show();
    }
}

/**
 * This function gets the current active view and returns the id.
 * @returns id of the current active view
 */
function getActiveView(){
    return $('main').find('section:visible:first').attr('id');
}

/**
 * This function adds a friend node to the friend list.
 * @param friend
 */
function appendFriendNode(friend){
    var friendList = $('#friends ul'),
        person = '<li data-friend-id='+friend.id+'>'+ friend.username+'<i class="fa fa-minus-square-o delete" aria-hidden="true"></i></li>';
    friendList.append(person);
}

/**
 * This function switches between the different views of the single page application.
 * @param viewId id of the view/section which should be shown.
 */
function switchView(viewId){
    $('.tab').hide();
    toggleSiteElements(viewId == 'login' || viewId == 'register');
    handleAutoComplete(viewId);
    $('nav li.active').removeClass('active');
    $('nav li.' + viewId + '-view').addClass('active');
    $('#' + viewId).show();
}

/**
 * This function appends a person node to the person list.
 * @param person person object
 */
function appendPersonNode(person){
    var personList = $('#persons ul'),
        personCreated = '<li data-person-id='+person.id+'>'+ person.username+'<i class="fa fa-plus-square-o add" aria-hidden="true"></i></li>';
    personList.append(personCreated);
}

/**
 * This method appends an open friend request to the corresponding list.
 * @param person Person object
 */
function appendAwaitingFriendRequestNode(person){
    var personList = $('#awaitingfriendrequests ul'),
        personCreated = '<li data-person-id='+person.id+'>'+ person.username+'</li>';
    personList.append(personCreated);
}

/**
 * This method adds a friend request node to the list.
 * @param person Person object
 */
function appendFriendRequestNode(person){
    var personList = $('#friendrequests ul'),
        personCreated = '<li data-person-id='+person.id+'>'+ person.username+'<i class="fa fa-plus-square-o accept" aria-hidden="true"></i><i class="fa fa-minus-square-o decline" aria-hidden="true"></i></li>';
    personList.append(personCreated);
}

/**
 * This method checks if a user is logged in and returns true or false accordingly.
 * @returns {boolean}
 */
function userIsLoggedIn(){
    var userId = $('#userinfo').data('info');
    return userId > 0;
}

/**
 * This function handles the auto-complete function of the search box.
 * @param viewId active view
 */
function handleAutoComplete(viewId){
    var searchInput = $(".js-search-box");
    if(viewId == 'map'){
        initAutocompleteFriends();
    }
    else if(searchInput.hasClass('ui-autocomplete-input')){
        // remove auto-complete from search input field
        searchInput.autocomplete("destroy");
    }
}

/**
 * This method reloads the friend list.
 */
function reloadFriendList(){
    $('#persons ul').empty();
    getOpenRequests();
    getAwaitingRequests();
    getFriendList();
}
