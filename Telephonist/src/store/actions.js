import firebase from 'firebase'
import router from '@/router'

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
      time:formatted
    };

    // Get a key for a new Post.
    var newPostKey = defaultDatabaseRef.child('book-list').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/book-list/' + newPostKey] = postData;
   defaultDatabaseRef.update(updates);
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

    // console.log('phoneNumber '+ phoneNumber);
    // console.log('address '+ address);
    // console.log('vehicleType '+  vehicleType);
    // console.log('note' + note);
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
      writeNewPostWithLatLong(payload.phoneNumber,payload.address,payload.lat, payload.long,payload.vehicle, payload.state,payload.note)
      commit('setLoading', false)
    }
   }

}