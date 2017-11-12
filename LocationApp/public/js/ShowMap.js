var map;
var marker;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        disableDefaultUI: true
    });

    var geocoder = new google.maps.Geocoder();
    var reverse = new google.maps.Geocoder();
    var infowindow = new google.maps.InfoWindow;
    marker = new google.maps.Marker(
    {
        position: { lat: -34.397, lng: 150.644 }
    });
    //goi hàm geocode
    document.getElementById('submit').addEventListener('click', function() {
        geocodeAddress(geocoder, map, infowindow);
    });

    //lấy tọa độ khi click chuột
    google.maps.event.addListener(map, 'click', function(event) {
        reverseLocation(event.latLng, reverse, infowindow);
    });
}

function reverseLocation(location, geocoder, infowindow) {
    geocoder.geocode({'location': location }, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
            //   map.setZoom(8);
                marker.setPosition(location);
                marker.setMap(map);
                infowindow.setContent(results[0].formatted_address);
                infowindow.open(map, marker);
            } else {
                window.alert('không tìm thấy');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}

function geocodeAddress(geocoder, resultsMap, infowindow) {
    var address = document.getElementById('address').value;
    //marker.setMap(map);
    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            
            marker.setPosition(results[0].geometry.location);
            marker.setMap(map);
            console.log(results[0]);
            infowindow.setContent(results[0].formatted_address);
            infowindow.open(resultsMap, pin);
        } else {
            alert('không tìm thấy:  ' + status);
        }
    });
}