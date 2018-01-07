import firebase from 'firebase'
import router from '@/router'


var map = null;
var marker = null;
var directionsService;
var directionsDisplay;

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
    var temptlist = []
    map = payload.map;
     marker = new google.maps.Marker(
    {
        position: { lat: -34.397, lng: 150.644 }
    });


    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
      
    directionsDisplay.setMap(map);

    var setAddedMessage = function (data) {
         temptlist.push(data);
         commit('setBookingdealList',temptlist);  
    }

   
    var database = firebase.database().ref('book-list');  

    database.on('child_added',setAddedMessage);
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