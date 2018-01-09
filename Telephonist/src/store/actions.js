import firebase from 'firebase'
import router from '@/router'
var driverList = [];
var markers = [];
var isbusy = false;
var isFirstTime = true;
var notLocationBookingDealList = [];
var currentPayLoad = null;

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

function findDriver(snapshot, radius, lat, long, _vehicle){
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

        if (howManyTimes > driverList.length) howManyTimes = driverList.length;
            
        console.log("10 xe gan nhat", driverList)
        console.log("howManyTimes", howManyTimes)
    }
    
}

function getTenClosetDrivers(radius, lat, long, _vehicle){

    var database = firebase.database().ref('driver-list');

    database.once("value", function(snapshot) {
        findDriver(snapshot, 1000, lat, long, _vehicle);
        if (driverList.length == 0){
            alert("KHÔNG CÓ XE");
        }
    });    
}

var i = 0, howManyTimes = 10;

function sendRequestToDriver(address,lat,long,vehicle,key,phoneNumber,note) {

     var database = firebase.database().ref('book-list');    
     console.log("key",key);

    database.child(key).on("value", function(snapshot) {

            if (snapshot.key == key){
                if (snapshot.val().state != "finding" && i != 0 && i <= howManyTimes){
                    alert('Accepted by driver name: '+snapshot.val().driverName );                    
                    i = howManyTimes + 1;
                    database.off('value');
                    return;
                }
            }
        });
        
    if (i < howManyTimes && i < driverList.length){
         var postData = {
        phoneNumber: phoneNumber,
        address: address,
        lat: lat,
        long:  long,
        vehicle: vehicle,
        state: "finding",
        note: note,
        driverPhone: driverList[i].driver.driverPhone,
        driverAddress:  driverList[i].driver.driverAddress,
        driverName: driverList[i].driver.driverName,
        driverEmail: driverList[i].driver.driverEmail,
    };
    var updates = {};
    updates['/' + key] = postData;
    database.update(updates);
    console.log("updated!" +i+ driverList[i].driver.driverName);
    }

   
    ++i;
    if (i >= howManyTimes){
        alert("No driver accept this booking deal!");
    }
    console.log( i );
    if( i < howManyTimes ){
        setTimeout( ()=>{sendRequestToDriver(address,lat,long,vehicle,key,phoneNumber,note)}, 5000 );
    }
}



function writeNewPost(_phoneNumber,_address,_vehicleType, _state,_note) {

var defaultDatabaseRef = firebase.database().ref();

  var dt = new Date();
  var formatted = dt.toString();
  console.log("DATE: "+ formatted);
  // A post entry.
    var postData = {
      phoneNumber: _phoneNumber,
      address: _address,
      vehicle: _vehicleType,
      state: _state,
      note: _note,
      time:formatted
    };

    // Get a key for a new Post.
  var newPostKey = defaultDatabaseRef.child('book-list').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/book-list/' + newPostKey] = postData;
  defaultDatabaseRef.update(updates);
}

function writeNewPostWithLatLong(_phoneNumber,_address,_lat, _long,_vehicleType, _state,_note) {

 var defaultDatabaseRef = firebase.database().ref();

  var dt = new Date();
  var formatted = dt.toString();
  console.log("DATE: "+ formatted);

  // A post entry.
    var postData = {
      phoneNumber: _phoneNumber,
      address: _address,
      lat: _lat,
      long:  _long,
      vehicle: _vehicleType,
      state: _state,
      note: _note,
      time:formatted,
      driverPhone: "",
      driverAddress: "",
      driverName: "",
      driverEmail:""
    };

    // Get a key for a new Post.
    var newPostKey = defaultDatabaseRef.child('book-list').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/book-list/' + newPostKey] = postData;
   defaultDatabaseRef.update(updates);
   return newPostKey;
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
  getBookListByPhoneNumber({commit}, payload){
    var temptlist = []
    commit('setLoading', true)

    firebase.database().ref().child('book-list')
      .orderByChild("phoneNumber")
      .equalTo(payload.phoneNumber)
      .once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(data) {
              temptlist.push(data);              
          });
        console.log(temptlist);
        commit('setLoading', false)
        commit('setSearchList', temptlist)
        }, function(error) {
          console.log(error)
          commit('setLoading', false)
          commit('setSearchList', null)
        });
  },
  addNewBookingDeal({commit},payload){
    commit('setLoading', true)

    var phoneNumber = payload.phoneNumber;
    var address = payload.address;
    var vehicleType = payload.vehicleType;
    var note = payload.note;
    if (phoneNumber != null && address != null && vehicleType != null){
      writeNewPost(phoneNumber,address,vehicleType,"not location",note);
      commit('setLoading', false)
    }
  },

  getDetail({commit},payload){
    commit('setLoading',true)

    var key = payload.key;
    console.log("KEY: "+ key);
    firebase.database().ref().child('book-list').child(key)
      .once("value")
      .then(function(snapshot) {        
        console.log(snapshot.val())
        commit('setDetailBookingDeal', snapshot)
        commit('setIsGetingDetail',true)
        commit('setLoading', false)
        }, function(error) {
          console.log(error)
          commit('setDetailBookingDeal', null)
          commit('setIsGetingDetail',false)
          commit('setLoading', false)

        });
  },
  resetIsGettingDetail({commit}){
     commit('setIsGetingDetail',false)
   },
  bookAgain({commit},payload){
    commit('setLoading', true)

    if (payload.phoneNumber != null && payload.address != null && payload.vehicle != null){
      currentPayLoad = payload;
      i = 0;
      var key = writeNewPostWithLatLong(currentPayLoad.phoneNumber,currentPayLoad.address,currentPayLoad.lat, currentPayLoad.long,currentPayLoad.vehicle, "finding",currentPayLoad.note);
      getTenClosetDrivers(1000,currentPayLoad.lat, currentPayLoad.long,currentPayLoad.vehicle);
      
      sendRequestToDriver(currentPayLoad.address,currentPayLoad.lat, currentPayLoad.long,currentPayLoad.vehicle,key,currentPayLoad.phoneNumber,currentPayLoad.note);
      commit('setLoading', false)

    }
   },
  
}