import firebase from 'firebase';
import router from '@/router';


var driverList = [];
var markers = [];
var isbusy = false;
var isFirstTime = true;
var notLocationBookingDealList = [];
var map = null;
var marker = null;
var currentNewBookingDeal = null;

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

function findDriver(snapshot, geocoder, resultsMap, infowindow, radius, lat, long, _vehicle){
    clearMarkers();
    driverList = [];
    //var markers = [];
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
            if (i < driverList.length){
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(driverList[i].driver.lat, driverList[i].driver.long),
                    map: resultsMap,
                    icon: "http://imageshack.com/a/img924/5672/1XsvZH.png"                                    
                });
    
                markers.push(marker);
            }
            
        }

        console.log("10 xe gan nhat", driverList)
    }
    
}

function getTenClosetDrivers(geocoder, resultsMap, infowindow, radius, lat, long, _vehicle){

    var database = firebase.database().ref('driver-list');

    database.once("value", function(snapshot) {
      console.log("**************************")
        findDriver(snapshot, geocoder, resultsMap, infowindow, 1000, lat, long, _vehicle);

        // if (driverList.length == 0){
        //     findDriver(snapshot, geocoder, resultsMap, infowindow, 600, lat, long, _vehicle);            
        // }
        // if (driverList.length == 0){
        //     findDriver(snapshot, geocoder, resultsMap, infowindow, 1000, lat, long, _vehicle);            
        // }
        if (driverList.length == 0){
            alert("KHÔNG CÓ XE");
        }
    });    
}

    var i = 0, howManyTimes = 10;

function sendRequestToDriver() {

    console.log('start');

     var database = firebase.database().ref('book-list');    
    
    var _address = document.getElementById("address").value;
    var _lat = document.getElementById("lat").value;

    var _long = document.getElementById("long").value;
    var _vehicle = document.getElementById("vehicle").value;
    var currentKey = document.getElementById("key").value;
    var _phoneNumber = document.getElementById("phone").value;
    var _note = document.getElementById("note").value;


 database.child(currentKey).on("value", function(snapshot) {
    if (snapshot.key == key){
            if (snapshot.val().state != "finding" && i != 0 && i <= howManyTimes){
                alert('Accepted by driver name: '+snapshot.val().driverName ); 
                document.getElementById('btnOk').style.backgroundColor = "#1A5276";
                document.getElementById('btnOk').disabled = false;                   
                i = howManyTimes + 1;
                database.off('value');
                isbusy = false;
                notLocationBookingDealList = [];        
                handleNewBookingDeal();
            }
        }
    });  

    if (i <  howManyTimes){
         var postData = {
        phoneNumber: _phoneNumber,
        address: _address,
        lat: document.getElementById("lat").value,
        long:  _long,
        vehicle: _vehicle,
        state: "finding",
        note: _note,
        driverPhone: driverList[i].driver.driverPhone,
        driverAddress:  driverList[i].driver.driverAddress,
        driverName: driverList[i].driver.driverName,
        driverEmail: driverList[i].driver.driverEmail,
    };
    var updates = {};
    updates['/' + currentKey] = postData;
    database.update(updates);
    
    console.log("updated! i: " +i+" howManyTimes: "+ howManyTimes+  driverList[i].driver.driverName);
    }
   
    ++i;
     if (i >= howManyTimes ){
        alert("No driver accept this booking deal!");
        document.getElementById('btnOk').style.backgroundColor = "#1A5276";
        document.getElementById('btnOk').disabled = false; 
        isbusy = false;
        notLocationBookingDealList = [];        
        handleNewBookingDeal();
    }
    console.log( i );
    if( i < howManyTimes ){
        setTimeout( sendRequestToDriver, 5000 );
    }
}

function onCancelClicked(){
    console.log("notLocationBookingDealList.length",notLocationBookingDealList.length);
    notLocationBookingDealList.splice(0, 1);
    isbusy = false;
   if (notLocationBookingDealList.length > 0){
        var val = notLocationBookingDealList[0].val();
        var message = "New book deal: "+ val.address;
        
        isbusy = true;                    
        currentNewBookingDeal = notLocationBookingDealList[0];
        var message = "New book deal: "+ val.address;
        document.getElementById('blur-view').style.display = 'block';
        document.getElementById('message').innerHTML = message;  
        console.log("show");         
                    
    }

    var setChangedMessage = function (data) {
        var val = data.val();
        if (data.key == currentNewBookingDeal.key){  
            if (val.state != "not location")     {    
           
                document.getElementById('blur-view').style.display = 'none';

            }
        }               
    }

   
    var database = firebase.database().ref('book-list');  

    database.on('child_changed',setChangedMessage);
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
                // infowindow.setContent(results[0].formatted_address);
                // infowindow.open(map, marker);

                var _address = results[0].formatted_address;
                var _lat = location.lat();
                var _long = location.lng();
                var _vehicle = document.getElementById("vehicle").value;
        
                getTenClosetDrivers(geocoder, map, infowindow, 300, _lat, _long, _vehicle);
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
          console.log('OK');
            document.getElementById("lat").value = results[0].geometry.location.lat();
            document.getElementById("long").value = results[0].geometry.location.lng();
            resultsMap.setCenter(results[0].geometry.location);
            
            marker.setPosition(results[0].geometry.location);
            marker.setMap(resultsMap);
            //console.log(results[0]);
            //infowindow.setContent(results[0].formatted_address);
            //infowindow.open(resultsMap, pin); 

            var _address = document.getElementById("address").value;
            var _lat = document.getElementById("lat").value;
            var _long = document.getElementById("long").value;
            var _vehicle = document.getElementById("vehicle").value;
    
            getTenClosetDrivers(geocoder, resultsMap, infowindow, 300, _lat, _long, _vehicle);
          

        } else {
            console.log('FAILED');
            alert('Not found:  ' + status);
        }
    });
}


function handleNewBookingDeal(){
    var reverse = new google.maps.Geocoder();
    var infowindow = new google.maps.InfoWindow;

    //Get location on click 
    google.maps.event.addListener(map, 'click', function(event) {
        reverseLocation(event.latLng, reverse, infowindow);
    });

    var setAddedMessage = function (data) {
        var val = data.val();
        console.log("notLocationBookingDealList.length",notLocationBookingDealList.length);
        console.log("isbusy",isbusy);
        if (val.state == "not location"){           
            console.log(val.address);
            notLocationBookingDealList.push(data);
            if (notLocationBookingDealList.length == 1 && !isbusy){
                val = notLocationBookingDealList[0].val();
                currentNewBookingDeal = data;
                var message = "New book deal: "+ val.address;
                document.getElementById('blur-view').style.display = 'block';
                document.getElementById('message').innerHTML = message

            }
        }               
    }

    var setChangedMessage = function (data) {
        var val = data.val();
        if (data.key == currentNewBookingDeal.key){  
            if (val.state != "not location")     {    
                notLocationBookingDealList.splice(0, 1);
                document.getElementById('blur-view').style.display = 'none';

            }
        }               
    }

   
    var database = firebase.database().ref('book-list');  

    database.on('child_added',setAddedMessage);
    database.on('child_changed',setChangedMessage);
}

export const actions = {
  userSignUp ({commit}, payload) {
    commit('setLoading', true)
    firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
    .then(firebaseUser => {
      commit('setUser', firebaseUser)
      commit('setLoading', false)
      commit('setError', null)
      router.push('/home')
    })
    .catch(error => {
      commit('setError', error.message)
      commit('setLoading', false)
    })
  },
  userSignIn ({commit}, payload) {
    commit('setLoading', true)
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
    .then(firebaseUser => {
      commit('setUser', firebaseUser)
      commit('setLoading', false)
      commit('setError', null)
      router.push('/home')
    })
    .catch(error => {
      commit('setError', error.message)
      commit('setLoading', false)
    })
  },
  autoSignIn ({commit}, payload) {
    commit('setUser', payload)
  },
  userSignOut ({commit}) {
    firebase.auth().signOut()
    commit('setUser', null)
    router.push('/')
  },
  getCurrentBookingDeal({commit},payload){
     marker = new google.maps.Marker(
    {
        position: { lat: -34.397, lng: 150.644 }
    });
    map = payload.map;
    handleNewBookingDeal();

  },
  onOkClick({commit}){
    var database = firebase.database().ref('book-list');    
    
    var _address = document.getElementById("address").value;
    var _lat = document.getElementById("lat").value;

    var _long = document.getElementById("long").value;
    var _vehicle = document.getElementById("vehicle").value;
    var currentKey = document.getElementById("key").value;
    var _phoneNumber = document.getElementById("phone").value;
    var _note = document.getElementById("note").value;
     document.getElementById('btnOk').style.backgroundColor = "#A6ACAF";
    document.getElementById('btnOk').disabled = true;

    if (_lat = "" || _long == "" || currentKey ==""){
        alert("No booking-deal is located!");
    }else{

        notLocationBookingDealList.splice(0, 1);
        
        var numberOfDriver = 0;
        if (driverList.length < 10){
            numberOfDriver = driverList.length;
        }else{
            numberOfDriver = 10;
        }

        alert("Book success! Finding driver...");
        i = 0;
        if (howManyTimes > driverList.length) howManyTimes = driverList.length;
            sendRequestToDriver();

        if (i == numberOfDriver){
            alert("Not dirver accept this booking-deal!");
        }

        console.log("Come out");
  
        // Write the new post's data simultaneously in the posts list and the user's post list.
        
        
    }
  },
  onCancelClick(){
    onCancelClicked();
  },
  geocoding(){
    var geocoder = new google.maps.Geocoder();
    var infowindow = new google.maps.InfoWindow;
                                       
    //Call geo coding function
    geocodeAddress(geocoder, map, infowindow).lat();
  },
  onAcceptClick(){
    var infowindow = new google.maps.InfoWindow;
    var database = firebase.database().ref('book-list');    

    isbusy = true;     
    isFirstTime = false; 
    var isInProccessing = true;  
    var val = currentNewBookingDeal.val();

    database.child(currentNewBookingDeal.key).on("value", function(snapshot) {

        if (snapshot.key == currentNewBookingDeal.key){
            var state = snapshot.val().state;
            if (state == "not location"){
                isInProccessing = false;
                var postData = {
                    phoneNumber: val.phoneNumber,
                    address: val.address,                
                    vehicle: val.vehicle,
                    state: "locating",
                    note: val.note,
                    driverPhone: "",
                    driverAddress:  "",
                    driverName: "",
                    driverEmail:"",
                };
                          
                // Write the new post's data simultaneously in the posts list and the user's post list.
                var updates = {};
                updates['/' + currentNewBookingDeal.key] = postData;
                database.update(updates);              
                // Save it!             
                document.getElementById("address").value = val.address;
                document.getElementById("vehicle").value = val.vehicle;
                document.getElementById("key").value = currentNewBookingDeal.key;
                document.getElementById("phone").value = val.phoneNumber;
                document.getElementById("note").value = val.note;       
                document.getElementById('blur-view').style.display = 'none';

                var geocoder = new google.maps.Geocoder();
                    
                //Call geo coding function
                geocodeAddress(geocoder, map, infowindow).lat();
                    
            }                    
        }

        if (isInProccessing){
            alert("This booking-deal is in proccessing by other staff!");
            document.getElementById('blur-view').style.display = 'none';
        }
    });    
  },
  onIgnoreClick(){
    console.log("ignore");
    document.getElementById('blur-view').style.display = 'none';
    isbusy = false;
    //onCancelClicked();
  }

}