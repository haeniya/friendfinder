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