import firebase from 'firebase'
import router from '@/router'


var currentBookingDeal = null;
var currentDriver = null;
var map = null;
var marker = null;
var directionsService;
var directionsDisplay;

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
    map = payload.map;
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
      
    directionsDisplay.setMap(map);

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
    
    setBookingDealState("accepted");
    setDriverState('busy');

    document.getElementById('blur-view').style.display = 'none';

    calculateAndDisplayRoute(currentDriver.val().driverAddress,  currentBookingDeal.val().address,directionsService, directionsDisplay);
  },
  onTheRoadToGuest(){

    console.log("onTheRoadToGuest");
    setDriverState('on the road to the guest location');
  },
  onArriveAtGuestLocation(){
    setDriverState('arrive at guest location');
  },
  onStartToGo(){
    setBookingDealState('start to go');
    setDriverState('start to go');
  },
  onArriveAtDestination(){
    setBookingDealState('arrive at destination');
    setDriverState('arrive at destination');
  },
  onFinish(){
    setBookingDealState('payed');
    setDriverState('available');
  }

}
