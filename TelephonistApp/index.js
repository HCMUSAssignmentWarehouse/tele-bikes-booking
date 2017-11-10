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

app.get('/', (req, res) => {
    res.sendFile('index.html', {
        root: __dirname
    });
});

app.get('/login', (req, res) => {

	console.log("zo");

	

		var email = req.query.email;
		var password = req.query.password;

		console.log("*******email: " + email);

		if (email != null && password != null){
			firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
			  // Handle Errors here.
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  // ...

			  console.log("***errorCode: "+ errorCode);
			  console.log("*******errorMessage: "+ errorMessage);

			});

		}	
	
	

    res.sendFile('login.html', {
        root: __dirname
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log('api run on port: ' + PORT);
});