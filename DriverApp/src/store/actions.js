import firebase from 'firebase'
import router from '@/router'

export const actions = {
  userSignUp ({commit}, payload) {
    commit('setLoading', true)

    // firebase.auth.EmailAuthProvider.createUser({
    //   email: payload.email,
    //   emailVerified: false,
    //   phoneNumber: payload.phoneNumber,
    //   password: payload.password,
    //   displayName: payload.Uername,
    //   disabled: false
    // })
    //   .then(function(userRecord) {
    //     console.log("Successfully created new user:", userRecord.uid);
    //     commit('setLoading', false);
    //     router.push('/home');
    //     // See the UserRecord reference doc for the contents of userRecord.
    //   })
    //   .catch(function(error) {
    //     console.log("Error creating new user:", error);
    //     commit('setError', error.message)
    //     commit('setLoading', false);
    //   });


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
        commit('setUser', firebaseUser)
        commit('setLoading', false)
        commit('setError', null)
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
  getNewWaitingBookingDeal(){
    var setAddedMessage = function (data) {
        var val = data.val();
        var currentAcc = firebase.auth().currentUser;
        if (val.state == "finding" && val.driverEmail == currentAcc.email){           
            console.log(val.address);
            alert(val.address);
        }               
    }

   
    var database = firebase.database().ref('book-list');  

    database.on('child_changed',setAddedMessage);
    database.on('child_added',setAddedMessage);
  }
}
