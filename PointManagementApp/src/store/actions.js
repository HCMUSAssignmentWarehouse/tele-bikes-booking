import firebase from 'firebase'
import router from '@/router'


var map = null;
var marker = null;
var directionsService;
var directionsDisplay;
var temptlist = []


function geocodeAddress(bookingDeal, geocoder, resultsMap, infowindow) {
   var address = bookingDeal.val().address;

    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            
            marker.setPosition(results[0].geometry.location);
            marker.setMap(resultsMap);            

        } else {
            console.log('FAILED');
        }
    });
}


function calculateAndDisplayRoute(origin, destination, directionsService, directionsDisplay) {



      console.log("directionsService",directionsService);
      console.log("directionsDisplay",directionsDisplay);
      console.log("origin ",origin);
      console.log("destination ",destination);
        directionsService.route({
          origin: origin,
          destination: destination,
          optimizeWaypoints: true,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
    });
}


function _getDetailLocation(data){
    var bookingDeal = data;
    directionsDisplay.setMap(null);
    var geocoder = new google.maps.Geocoder();
    var infowindow = new google.maps.InfoWindow;
    if (bookingDeal.val().state == 'accepted' || bookingDeal.val().state == 'start to go' || bookingDeal.val().state == 'arrive at destination'){
        directionsDisplay.setMap(map);
        calculateAndDisplayRoute(bookingDeal.val().driverAddress, bookingDeal.val().address, directionsService, directionsDisplay);      
    }else{
        geocodeAddress(bookingDeal,geocoder, map, infowindow).lat();      
    }
}

function createNewLi(data) {
  var li = document.createElement('LI');
              li.setAttribute("class", "list-li");
              li.setAttribute("v-on:click", "onItemClick(c)");
              li.style.margin = "0 0 3px 0";
              li.style.overflow = "auto";
              li.style.backgroundColor = "#D0D3D4";
              li.onclick = function() {  _getDetailLocation(data); };
 
              var key = document.createElement('P');
              var keyText = document.createTextNode(data.key); 
              key.appendChild(keyText);
              key.style.display = "none";

              var img = document.createElement("IMG");
              img.src = "https://www.spreadshirt.com.au/image-server/v1/mp/designs/13059948,width=178,height=178/map-location-icon.png";
              img.style.maxHeight = "24px";
              img.style.width = "auto";
              img.style.float = "left";
              img.style.margin = "8px";

              var address = document.createElement('H4');
              var addressText = document.createTextNode("Address: "+ data.val().address); 
              address.appendChild(addressText);
              address.style.width = "100%";
              address.style.textAlign = "center";
              address.style.fontSize = "1.5vw";


              var phoneNumber = document.createElement('P');
              var phoneNumberText = document.createTextNode("PhoneNumber: "+data.val().phoneNumber); 
              phoneNumber.appendChild(phoneNumberText);
              phoneNumber.style.font = "200 24px Georgia, Times New Roman, serif";
              phoneNumber.style.fontSize = "1.5vw";


              var state = document.createElement('P');
              var stateText = document.createTextNode("State: "+data.val().state); 
              state.appendChild(stateText);
              state.style.font = "200 24px Georgia, Times New Roman, serif";
              state.style.fontSize = "1.5vw";

              if (data.val().driverName){
                var driverName = document.createElement('P');
                var driverNameText = document.createTextNode("Driver Name: "+data.val().driverName); 
                driverName.appendChild(driverNameText);
                driverName.style.font = "200 24px Georgia, Times New Roman, serif";
                driverName.style.fontSize = "1.5vw";

                var driverAddress = document.createElement('P');
                var driverAddressText = document.createTextNode("Driver Address: "+data.val().driverAddress); 
                driverAddress.appendChild(driverAddressText);
                driverAddress.style.font = "200 24px Georgia, Times New Roman, serif";
                driverAddress.style.fontSize = "1.5vw";
              }


              li.appendChild(key);
              li.appendChild(img);
              li.appendChild(address);
              li.appendChild(phoneNumber);
              li.appendChild(state);
              li.appendChild(driverName);
              li.appendChild(driverAddress);
    return li;          
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
  getBookingDealList({commit},payload){
    map = payload.map;
     marker = new google.maps.Marker(
    {
        position: { lat: -34.397, lng: 150.644 }
    });


    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
      
    directionsDisplay.setMap(map);

    var database = firebase.database().ref('book-list'); 
    var setAddedMessage = function (data) {
         temptlist.push(data);
         commit('setBookingdealList',temptlist);  
    }.bind(this);

    var setChangedMessage = function (data) {
      var nums = document.getElementById("ul-history-list");
      var listItem = nums.getElementsByTagName("li");

      var newNums = [];
        console.log('listItem',listItem);
        for (var i=0; i < listItem.length; i++) {        
            if (listItem[i].getElementsByClassName("key")[0].innerHTML == data.key){
                var li = createNewLi(data);
              listItem[i].parentNode.replaceChild(li,listItem[i] );
            }
        }
    }.bind(this);

    var setRemovedMessage = function (data) {
      var nums = document.getElementById("ul-history-list");
      var listItem = nums.getElementsByTagName("li");

      var newNums = [];
        console.log('listItem',listItem);
        for (var i=0; i < listItem.length; i++) {        
            if (listItem[i].getElementsByClassName("key")[0].innerHTML == data.key){                
              listItem[i].parentNode.removeChild(listItem[i]);
            }
        }
    }.bind(this);

   
    database.on('child_added',setAddedMessage);
    database.on('child_changed',setChangedMessage);
    database.on('child_removed',setRemovedMessage);
  },
  getDetailLocation({commit},payload){
    var bookingDeal = payload.bookingDeal;
    directionsDisplay.setMap(null);
    var geocoder = new google.maps.Geocoder();
    var infowindow = new google.maps.InfoWindow;
    if (bookingDeal.val().state == 'accepted'){
        directionsDisplay.setMap(map);
        calculateAndDisplayRoute(bookingDeal.val().driverAddress, bookingDeal.val().address, directionsService, directionsDisplay);      
    }else{
        geocodeAddress(bookingDeal,geocoder, map, infowindow).lat();      
    }

  }
}