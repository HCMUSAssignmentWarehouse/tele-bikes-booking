import firebase from 'firebase'
import router from '@/router'


var currentBookingDeal = null;
var currentDriver = null;
var map = null;
var marker = null;
var directionsService;
var directionsDisplay;
var currentDriverState= "available";
var currentGuestState = "accepted";

function startCustomDialog(msg,duration){
    document.getElementById('blur-view').style.display = 'block';
    document.getElementById('message').innerHTML = "Will you accept this new booking deal: "+ msg + " ?";
    setTimeout(function() { 
      document.getElementById('blur-view').style.display = 'none';
    }, duration);
}

function setDriverState(state) {

  var driverDatabase = firebase.database().ref('driver-list');  

    var postData = {
        driverAddress: currentDriver.val().driverAddress,
        driverEmail:  currentDriver.val().driverEmail,
        driverName:  currentDriver.val().driverName,
        driverPhone:  currentDriver.val().driverPhone,
        lat:  currentDriver.val().lat,
        long: currentDriver.val().long,
        state:  state,
        type:  currentDriver.val().type,
       
    };
    var updates = {};
    updates['/' + currentDriver.key] = postData;
    driverDatabase.update(updates);
    console.log("Driver updated!");
}

function setBookingDealState(state) {
  var bookingDealDatabase = firebase.database().ref('book-list');  

    var postData = {
        phoneNumber: currentBookingDeal.val().phoneNumber,
        address:  currentBookingDeal.val().address,
        lat:  currentBookingDeal.val().lat,
        long:   currentBookingDeal.val().long,
        vehicle:  currentBookingDeal.val().vehicle,
        state: state,
        note:  currentBookingDeal.val().note,
        driverPhone:  currentBookingDeal.val().driverPhone,
        driverAddress:   currentBookingDeal.val().driverAddress,
        driverName: currentBookingDeal.val().driverName,
        driverEmail: currentBookingDeal.val().driverEmail,
    };
    var updates = {};
    updates['/' + currentBookingDeal.key] = postData;
    bookingDealDatabase.update(updates);
    console.log("BookingDeal updated!");
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


function updateDriverLocation(address) {
  var driverDatabase = firebase.database().ref('driver-list');  

  var postData = {
        driverAddress: address,
        driverEmail:  currentDriver.val().driverEmail,
        driverName:  currentDriver.val().driverName,
        driverPhone:  currentDriver.val().driverPhone,
        lat:  currentDriver.val().lat,
        long: currentDriver.val().long,
        state:  currentDriverState,
        type:  currentDriver.val().type,
       
    };
    var updates = {};
    updates['/' + currentDriver.key] = postData;
    driverDatabase.update(updates);
    console.log("Driver updated after click!");



    var bookingDealDatabase = firebase.database().ref('book-list');  

    var postData = {
        phoneNumber: currentBookingDeal.val().phoneNumber,
        address:  currentBookingDeal.val().address,
        lat:  currentBookingDeal.val().lat,
        long:   currentBookingDeal.val().long,
        vehicle:  currentBookingDeal.val().vehicle,
        state: currentGuestState,
        note:  currentBookingDeal.val().note,
        driverPhone:  currentBookingDeal.val().driverPhone,
        driverAddress:   address,
        driverName: currentBookingDeal.val().driverName,
        driverEmail: currentBookingDeal.val().driverEmail,
    };
    var updates = {};
    updates['/' + currentBookingDeal.key] = postData;
    bookingDealDatabase.update(updates);
    console.log("BookingDeal updated after click!");
}

function reverseLocation(location, geocoder, infowindow) {
    geocoder.geocode({'location': location }, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
              
                marker.setPosition(location);
                marker.setMap(map);
                
                if (confirm("Update to this location?")) {
                    updateDriverLocation(results[0].formatted_address);
                    calculateAndDisplayRoute(results[0].formatted_address,  currentBookingDeal.val().address,directionsService, directionsDisplay);

                } else {

                }

            } else {
                alert("Can not reverse this location");
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}




export const actions = {
  userSignUp ({commit}, payload) {
    commit('setLoading', true);
    firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
    .then(firebaseUser => {
      firebaseUser.updateProfile({
        phoneNumber: "+"+payload.phoneNumber           
      }).then(function() {

        console.log('payload.phoneNumber',payload.phoneNumber)
        var userName = firebaseUser.displayName;
        console.log('userName',userName);
        var phoneNumber = firebaseUser.phoneNumber;
        console.log('phoneNumber',phoneNumber);
        // "https://example.com/jane-q-user/profile.jpg"
        commit('setUser', firebaseUser);
        commit('setLoading', false);
        commit('setError', null);
        var database = firebase.database().ref('driver-list');  
 
          database.orderByChild('driverEmail').equalTo(payload.email).on("value", function(snapshot) {
              snapshot.forEach(function(data) {
                  currentDriver = data;
                  console.log("currentDriver",currentDriver.val());
              });
          });   
        router.push('/home')
      }, function(error) {
         commit('setError', error.message)
      commit('setLoading', false)
      });
      
      
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
      console.log('firebaseUser.phoneNumber: ',firebaseUser);
          commit('setUser', firebaseUser);
          commit('setLoading', false);
          commit('setError', null);
          var database = firebase.database().ref('driver-list');  
 
          database.orderByChild('driverEmail').equalTo(payload.email).on("value", function(snapshot) {
              snapshot.forEach(function(data) {
                  currentDriver = data;
                  console.log("currentDriver",currentDriver.val());
              });
          });   

          router.push('/home');

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
  getNewWaitingBookingDeal({commit},payload){

    if (!currentDriver){

      var currentAcc = firebase.auth().currentUser;
      var database = firebase.database().ref('driver-list');  
 
          database.orderByChild('driverEmail').equalTo(currentAcc.email).on("value", function(snapshot) {
              snapshot.forEach(function(data) {
                  currentDriver = data;
                  console.log("currentDriver",currentDriver.val());
              });
          });   
    }

    map = payload.map;
     marker = new google.maps.Marker(
    {
        position: { lat: -34.397, lng: 150.644 }
    });
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
      
    directionsDisplay.setMap(map);

    var reverse = new google.maps.Geocoder();
    var infowindow = new google.maps.InfoWindow;

    //Get location on click 
    google.maps.event.addListener(map, 'click', function(event) {
        reverseLocation(event.latLng, reverse, infowindow);
    });

    var setAddedMessage = function (data) {
        var val = data.val();
        var currentAcc = firebase.auth().currentUser;
        console.log("email", currentAcc.email);
        if (val.state == "finding" && val.driverEmail == currentAcc.email){  
            currentBookingDeal = data;          
           startCustomDialog(val.address,5000);
        }               
    }

   
    var database = firebase.database().ref('book-list');  

    database.on('child_changed',setAddedMessage);
    database.on('child_added',setAddedMessage);
  },
  onAcceptClick(){

    document.getElementById('start-to-guest').style.backgroundColor = "#2471A3";
    document.getElementById('start-to-guest').disabled = false;

    document.getElementById('arrivet-at-guest').style.backgroundColor = "#A6ACAF";
    document.getElementById('arrivet-at-guest').disabled = true;

    document.getElementById('start-go').style.backgroundColor = "#A6ACAF";
    document.getElementById('start-go').disabled = true;

    document.getElementById('arrive-at-destination').style.backgroundColor = "#A6ACAF";
    document.getElementById('arrive-at-destination').disabled = true;

    document.getElementById('finish').style.backgroundColor = "#A6ACAF";
    document.getElementById('finish').disabled = true;
    
    setBookingDealState("accepted");
    setDriverState('busy');

    document.getElementById('blur-view').style.display = 'none';

    calculateAndDisplayRoute(currentDriver.val().driverAddress,  currentBookingDeal.val().address,directionsService, directionsDisplay);
  },
  onTheRoadToGuest(){

    document.getElementById('start-to-guest').style.backgroundColor = "#A6ACAF";
    document.getElementById('start-to-guest').disabled = true;

    document.getElementById('arrivet-at-guest').style.backgroundColor = "#2471A3";
    document.getElementById('arrivet-at-guest').disabled = false;

    document.getElementById('start-go').style.backgroundColor = "#A6ACAF";
    document.getElementById('start-go').disabled = true;

    document.getElementById('arrive-at-destination').style.backgroundColor = "#A6ACAF";
    document.getElementById('arrive-at-destination').disabled = true;

    document.getElementById('finish').style.backgroundColor = "#A6ACAF";
    document.getElementById('finish').disabled = true;

    console.log("onTheRoadToGuest");
    currentDriverState = 'on the road to the guest location';
    setDriverState(currentDriverState);
  },
  onArriveAtGuestLocation(){

    document.getElementById('start-to-guest').style.backgroundColor = "#A6ACAF";
    document.getElementById('start-to-guest').disabled = true;

    document.getElementById('start-go').style.backgroundColor = "#2471A3";
    document.getElementById('start-go').disabled = false;

    document.getElementById('arrivet-at-guest').style.backgroundColor = "#A6ACAF";
    document.getElementById('arrivet-at-guest').disabled = true;

    document.getElementById('arrive-at-destination').style.backgroundColor = "#A6ACAF";
    document.getElementById('arrive-at-destination').disabled = true;

    document.getElementById('finish').style.backgroundColor = "#A6ACAF";
    document.getElementById('finish').disabled = true;

    currentDriverState = 'arrive at guest location';
    setDriverState(currentDriverState);
  },
  onStartToGo(){

    document.getElementById('start-to-guest').style.backgroundColor = "#A6ACAF";
    document.getElementById('start-to-guest').disabled = true;

    document.getElementById('arrive-at-destination').style.backgroundColor = "#2471A3";
    document.getElementById('arrive-at-destination').disabled = false;

    document.getElementById('arrivet-at-guest').style.backgroundColor = "#A6ACAF";
    document.getElementById('arrivet-at-guest').disabled = true;

    document.getElementById('start-go').style.backgroundColor = "#A6ACAF";
    document.getElementById('start-go').disabled = true;

    document.getElementById('finish').style.backgroundColor = "#A6ACAF";
    document.getElementById('finish').disabled = true;

    currentDriverState = 'start to go';
    currentGuestState = currentDriverState;
    setBookingDealState(currentDriverState);
    setDriverState(currentDriverState);
  },
  onArriveAtDestination(){

    document.getElementById('start-to-guest').style.backgroundColor = "#A6ACAF";
    document.getElementById('start-to-guest').disabled = true;

    document.getElementById('finish').style.backgroundColor = "#2471A3";
    document.getElementById('finish').disabled = false;

    document.getElementById('arrivet-at-guest').style.backgroundColor = "#A6ACAF";
    document.getElementById('arrivet-at-guest').disabled = true;

    document.getElementById('start-go').style.backgroundColor = "#A6ACAF";
    document.getElementById('start-go').disabled = true;

    document.getElementById('arrive-at-destination').style.backgroundColor = "#A6ACAF";
    document.getElementById('arrive-at-destination').disabled = true;

    currentDriverState = 'arrive at destination';
    currentGuestState = currentDriverState; 
    setBookingDealState(currentDriverState);
    setDriverState(currentDriverState);
  },
  onFinish(){

    document.getElementById('start-to-guest').style.backgroundColor = "#A6ACAF";
    document.getElementById('start-to-guest').disabled = true;

    document.getElementById('finish').style.backgroundColor = "#A6ACAF";
    document.getElementById('finish').disabled = true;

    document.getElementById('arrivet-at-guest').style.backgroundColor = "#A6ACAF";
    document.getElementById('arrivet-at-guest').disabled = true;

    document.getElementById('start-go').style.backgroundColor = "#A6ACAF";
    document.getElementById('start-go').disabled = true;

    document.getElementById('arrive-at-destination').style.backgroundColor = "#A6ACAF";
    document.getElementById('arrive-at-destination').disabled = true;

    currentDriverState = 'available';
    currentGuestState = 'payed';
    setBookingDealState(currentGuestState);
    setDriverState(currentDriverState);
  },
  onIgnoreClick(){
    document.getElementById('blur-view').style.display = 'none';
  }

}
