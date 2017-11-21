//Global variables
var map;
var marker;
var driverList = [];
var markers = [];

function initMap() {
    //Get called after maps finish init
    var hcmusCamp = {lat: 10.7624949, lng: 106.6773057};

    map = new google.maps.Map(document.getElementById('map'), {
        center: hcmusCamp,
        zoom: 16,
        disableDefaultUI: true
    });

    var geocoder = new google.maps.Geocoder();
    var reverse = new google.maps.Geocoder();
    var infowindow = new google.maps.InfoWindow;
    marker = new google.maps.Marker(
    {
        position: { lat: -34.397, lng: 150.644 }
    });


    document.getElementById('geocoding').addEventListener('click', function() {
        geocodeAddress(geocoder, map, infowindow);
    });

    //Get location on click 
    google.maps.event.addListener(map, 'click', function(event) {
        reverseLocation(event.latLng, reverse, infowindow);
    });

    var isbusy = false;
   
    

    var database = firebase.database().ref('book-list');

    var setAddedMessage = function (data) {
        var val = data.val();
        if (isbusy == false && val.state == "not location"){
            var message = "New book deal: "+ val.address;
            if (confirm(message)) {
            // Save it!
                var _data = val;            
                var currentKey = data.key;
                document.getElementById("address").value = val.address;
                document.getElementById("vehicle").value = val.vehicle;
                isbusy = true;
                var geocoder = new google.maps.Geocoder();
                var reverse = new google.maps.Geocoder();
                var infowindow = new google.maps.InfoWindow;
                marker = new google.maps.Marker(
                {
                    position: { lat: -34.397, lng: 150.644 }
                });

                document.getElementById('btnOk').addEventListener('click', function() {
                    var _address = document.getElementById("address").value;
                    var _lat = document.getElementById("lat").value;
                    var _long = document.getElementById("long").value;
                    var _vehicle = document.getElementById("vehicle").value;
            
                    getTenClosetDrivers(geocoder, map, infowindow, 300, _lat, _long, _vehicle);
                    
                    if (_lat = "" || _long == "" || currentKey == null || data == null){
                        alert("No booking-deal is located!");
                    }else{
                        var postData = {
                            phoneNumber: _data.phoneNumber,
                            address: _address,
                            lat: _lat,
                            long:  _long,
                            vehicle: _data.vehicle,
                            state: "finding",
                            note: _data.note
                        };
                  
                        // Write the new post's data simultaneously in the posts list and the user's post list.
                        var updates = {};
                        updates['/' + currentKey] = postData;
                       database.update(updates);
                       alert("Update success!");
                       isbusy = false;
                    }
                });
                //Call geo coding function
                geocodeAddress(geocoder, map, infowindow).lat();
                
            } else {
                // Do nothing!
            }
        }               
    }

    database.on('child_added',setAddedMessage);
    database.on('child_changed',setAddedMessage);
}

function reverseLocation(location, geocoder, infowindow) {
    geocoder.geocode({'location': location }, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
            //   map.setZoom(8);
                document.getElementById('address').value = results[0].formatted_address;
                document.getElementById('lat').value = location.lat();
                document.getElementById('long').value = location.lng();
                marker.setPosition(location);
                marker.setMap(map);
                infowindow.setContent(results[0].formatted_address);
                infowindow.open(map, marker);
            } else {
                window.alert('Not found!');
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
            document.getElementById("lat").value = results[0].geometry.location.lat();
            document.getElementById("long").value = results[0].geometry.location.lng();
            resultsMap.setCenter(results[0].geometry.location);
            
            marker.setPosition(results[0].geometry.location);
            marker.setMap(map);
            console.log(results[0]);
            infowindow.setContent(results[0].formatted_address);
            infowindow.open(resultsMap, pin); 

        } else {
            alert('Not found:  ' + status);
        }
    });
}


var rad = function(x) {
    return x * Math.PI / 180;
  };
  
  var getDistance = function(lat1,long1,lat2, long2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(lat2 - lat1);
    var dLong = rad(long2 - long1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
  };

function getTenClosetDrivers(geocoder, resultsMap, infowindow, radius, lat, long, _vehicle){

    var database = firebase.database().ref('driver-list');

    database.once("value", function(snapshot) {
        findDriver(snapshot, geocoder, resultsMap, infowindow, 300, lat, long, _vehicle);

        if (driverList.length == 0){
            findDriver(snapshot, geocoder, resultsMap, infowindow, 600, lat, long, _vehicle);            
        }
        if (driverList.length == 0){
            findDriver(snapshot, geocoder, resultsMap, infowindow, 1000, lat, long, _vehicle);            
        }
        if (driverList.length == 0){
            alert("KHÔNG CÓ XE");
        }
    });    
}


function findDriver(snapshot, geocoder, resultsMap, infowindow, radius, lat, long, _vehicle){
    clearMarkers();
    driverList = [];
    snapshot.forEach(driver => {
        if (driver.val().state =="available" && driver.val().type == _vehicle){
            var currLat = parseFloat(driver.val().lat);
            var currLong = parseFloat(driver.val().long);

            lat = parseFloat(lat);
            long = parseFloat(long);

            var m = getDistance(lat,long,currLat,currLong);
            if (m <= radius){

                var driverPoint = {
                    driver: driver.val(),
                    distance: m                       
                }
                driverList.push(driverPoint);
                
            }

        }
            
    });

    
    //sap xep mang những chuyến xe nằm trong bán kính, đang available và thuộc loại xe mà khách hàng yêu cầu
    if (driverList.length > 0){
        for (var i = 0 ; i< driverList.length -1 ; i++ ){
            for (var j = i+1 ; j< driverList.length ; j++ ){
                if (driverList[i].distance > driverList[j].distance){
                    var temp = driverList[i];
                    driverList[i] =  driverList[j];
                    driverList[j] = temp;
                }
            }
        }
            
        // hiện 10 xe gần nhất
        for (var i = 0 ; i< 10 ; i++ ){
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(driverList[i].driver.lat, driverList[i].driver.long),
                map: map,
                icon: "images/icon_vehicle.png"                       
            });

            markers.push(marker);
        }
    }
    
}

 // Sets the map on all markers in the array.
 function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
    setMapOnAll(null);
  }