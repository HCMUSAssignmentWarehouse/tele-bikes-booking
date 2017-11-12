const express = require('express'),
    morgan = require('morgan'),
    path = require('path');

var firebase =  require('firebase');

firebase.initializeApp({
    	apiKey: "AIzaSyCPsM92WXpL9n_APrHNbO0CtkT_FbAcuBY",
	    authDomain: "barg-midterm.firebaseapp.com",
	    databaseURL: "https://barg-midterm.firebaseio.com",
	    projectId: "barg-midterm",
	    storageBucket: "barg-midterm.appspot.com",
	    messagingSenderId: "263139149669"
}); 

var app = express();
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.sendFile('index.html', {
        root: __dirname
    });
});

app.locals.logined = false;
app.locals.history_List = [];
app.locals.selectedIndex = 0;

app.get('/getSelectedIndex', (req, res) => {	

	if (app.locals.logined == true){
		app.locals.selectedIndex = req.query.index;
		console.log("app.locals.selectedIndex: "+ app.locals.selectedIndex);
		let c = {
            message:"success"
	    }
	    res.json(c);
		
	}else{
		let c = {
            message:"fail"
	    }
	    res.json(c);
	}
});

app.get('/callDriver', (req, res) => {	

	if (app.locals.logined == true){
		var selectedHistory = app.locals.history_List[app.locals.selectedIndex];

		console.log("app.locals.history_List.length: " + app.locals.history_List.length);
		console.log("app.locals.selectedIndex: "+ app.locals.selectedIndex);

		writeNewPostWithLatLong(selectedHistory.phoneNumber,selectedHistory.address,selectedHistory.lat, selectedHistory.long,selectedHistory.vehicle,"finding",selectedHistory.note);

		let c = {
            message:"success"
	    }
	    res.json(c);
		
	}else{
		let c = {
            message:"fail"
	    }
	    res.json(c);
	} 
});

app.get('/history', (req, res) => {	

	if (app.locals.logined == true){
		var phoneNumber = req.query.phoneNumber;
		console.log("sdt:"+ phoneNumber);
		app.locals.history_List = [];
		
		var ref = firebase.database().ref();

		ref.child("book-list").on("value", function(snapshot) {
		   snapshot.forEach(book => {
		   		console.log(book.val().phoneNumber);

		   		if (book.val().phoneNumber == phoneNumber){
		   			app.locals.history_List.push(book.val());
		   		}
		   });
		   res.json(app.locals.history_List);

		}, function (error) {
		   console.log("Error: " + error.code);
		   res.json(app.locals.history_List);

		});
	}else{
		res.sendFile('login.html', {
        	root: __dirname
    	});
	}    
});

app.get('/verifyLogin',(req,res)=>{
	var _email = req.query.email;
	var _password = req.query.password;
	
	if (_email != null && _password != null){
		var errorCode;
		firebase.auth().signInWithEmailAndPassword(_email, _password).then(function(user) {
		console.log("sucess!");
		app.locals.logined = true;
		 let c = {
            message:'success'
        }
        res.statusCode = 201;
        res.json(c);
	}).catch(function(error) {
		  // Handle Errors here.
		  errorCode = error.code;
		  var errorMessage = error.message;
		  console.log("***errorCode: "+ errorCode);
		  console.log("*******errorMessage: "+ errorMessage);
		  let c = {
            message:errorMessage
	        }
	        res.statusCode = 201;
	        res.json(c);
		});			

	}else{
		 let c = {
	            message:"Email or password is null!"
		 }
		 res.statusCode = 201;
		 res.json(c);
	}				
});

app.get('/verifySignUp',(req,res)=>{
	var _email = req.query.email;
	var _password = req.query.password;

	console.log("zo verify");

	if (_email != null && _password != null){
			firebase.auth().createUserWithEmailAndPassword(_email, _password).then(function(user) {
			
			console.log("sucess!");
			 let c = {
	            message:'success'
	        }
	        res.statusCode = 201;
	        res.json(c);

		}).catch(function(error) {
			  // Handle Errors here.
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  // ...

			  console.log("***errorCode: "+ errorCode);
			  console.log("*******errorMessage: "+ errorMessage);

			  let c = {
	            message:errorMessage
		        }
		        res.statusCode = 201;
		        res.json(c);
		});
	}else{
		 let c = {
	            message:"Email or password is null!"
		 }
		 res.statusCode = 201;
		 res.json(c);
	}			
});

app.get('/login', (req, res) => {	

    res.sendFile('login.html', {
        root: __dirname
    });
});

app.get('/signup', (req, res) => {

    res.sendFile('signup.html', {
        root: __dirname
    });
});

app.get('/forgot_password', (req, res) => {

    res.sendFile('forgot_password.html', {
        root: __dirname
    });
});

app.get('/process', (req, res) => {

	if (app.locals.logined == true){
		res.sendFile('process.html', {
	        root: __dirname
	    });

	}else{
		res.sendFile('login.html', {
        	root: __dirname
    	});
	}
});

app.get('/addNewBookingDeal', (req, res) => {

	if (app.locals.logined == true){
		var phoneNumber = req.query.phoneNumber;
		var address = req.query.address;
		var vehicleType = req.query.vehicleType;
		var note = req.query.note;

		console.log("zo verify");

		if (phoneNumber != null && address != null && vehicleType != null){
			writeNewPost(phoneNumber,address,vehicleType,"Chưa xác định tọa độ",note);
			let c = {
		            message:"success"
			 }
			 res.statusCode = 201;
			 res.json(c);
		}else{
			 let c = {
		            message:"Email or password is null!"
			 }
			 res.statusCode = 201;
			 res.json(c);
		}		
	}else{
		res.sendFile('login.html', {
        	root: __dirname
    	});
	}
});

app.get('/veryfiUpdatePassword', (req, res) => {
	var email = req.query.email;
	var auth = firebase.auth();


	auth.sendPasswordResetEmail(email).then(function() {
	  let c = {
	            message:"success"
		 }
		 res.statusCode = 201;
		 res.json(c);
	}).catch(function(error) {
	  let c = {
	            message:error.message
		 }
		 res.statusCode = 201;
		 res.json(c);
	});
});

app.get('/logout', (req, res) => {
	firebase.auth().signOut().then(function() {
  		// Sign-out successful.
  		app.locals.logined = false;
  		let c = {
	            message:"success"
		 }
		 res.json(c);
	}).catch(function(error) {
	  // An error happened.
	   let c = {
	            message:error.message
		 }
		 res.json(c);
	});
});

function writeNewPost(_phoneNumber,_address,_vehicleType, _state,_note) {

	console.log("entry");
  // A post entry.
	  var postData = {
	  	phoneNumber: _phoneNumber,
	    address: _address,
	    vehicle: _vehicleType,
	    state: _state,
	    note: _note
	  };

	console.log("new key");
	  // Get a key for a new Post.
	var newPostKey = firebase.database().ref().child('book-list').push().key;

	  // Write the new post's data simultaneously in the posts list and the user's post list.
	var updates = {};
	updates['/book-list/' + newPostKey] = postData;
	console.log("update");
	firebase.database().ref().update(updates);	
}

function writeNewPostWithLatLong(_phoneNumber,_address,_lat, _long,_vehicleType, _state,_note) {

	console.log("entry");
  // A post entry.
	  var postData = {
	  	phoneNumber: _phoneNumber,
	    address: _address,
	    lat: _lat,
	    long:  _long,
	    vehicle: _vehicleType,
	    state: _state,
	    note: _note
	  };

	console.log("new key");
	  // Get a key for a new Post.
	  var newPostKey = firebase.database().ref().child('book-list').push().key;

	  // Write the new post's data simultaneously in the posts list and the user's post list.
	  var updates = {};
	  updates['/book-list/' + newPostKey] = postData;
	  console.log("update");
	  firebase.database().ref().update(updates);
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log('api run on port: ' + PORT);
});