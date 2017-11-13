var express = require('express');
var firebase =  require('firebase');


var app = express();


app.use(express.static(__dirname + '/public'));


// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
  apiKey: "AIzaSyCPsM92WXpL9n_APrHNbO0CtkT_FbAcuBY",
	    authDomain: "barg-midterm.firebaseapp.com",
	    databaseURL: "https://barg-midterm.firebaseio.com",
	    projectId: "barg-midterm",
	    storageBucket: "barg-midterm.appspot.com",
	    messagingSenderId: "263139149669"
};
var defaultApp = firebase.initializeApp(config);
var defaultAuth = firebase.auth();
// retrieve services via the defaultApp variable
var defaultDatabase = defaultApp.database();
var defaultDatabaseRef = defaultDatabase.ref();

app.get('/index', (req, res) => {
	if (defaultAuth.currentUser) {
    	// User is signed in.
    	res.sendFile('index.html', {
        	root: __dirname
    	});
    	
    	return defaultDatabaseRef.child('book-list')
		.once('value')
		.then(function(snapshot) {
		  var val = snapshot.val();
		  console.log(val);
		})
		.catch(function(error) {
			//TODO: Send error pages
	    	console.error("Error: ", error);
		});
	} else{
		 res.sendFile('login.html', {
	        root: __dirname
	    });
	}
});

app.get('/', (req, res) => {
    if (defaultAuth.currentUser) {
    	// User is signed in.
    	res.sendFile('index.html', {
        	root: __dirname
    	});
    	
    	return defaultDatabaseRef.child('book-list')
		.once('value')
		.then(function(snapshot) {
		  var val = snapshot.val();
		  console.log(val);
		})
		.catch(function(error) {
			//TODO: Send error pages
	    	console.error("Error: ", error);
		});
	} else{
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
		defaultAuth.signInWithEmailAndPassword(_email, _password).then(function(user) {
		console.log("sucess!");
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
			defaultAuth.createUserWithEmailAndPassword(_email, _password).then(function(user) {
			
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

app.get('/veryfiUpdatePassword', (req, res) => {
	var email = req.query.email;
	
	defaultAuth.sendPasswordResetEmail(email).then(function() {
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


app.get('/forgot_password', (req, res) => {
    res.sendFile('forgot_password.html', {
        root: __dirname
    });
});


app.get('/logout', (req, res) => {
	defaultAuth.signOut().then(function() {
  		// Sign-out successful.
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


const PORT = 3001;
app.listen(PORT, () => {
    console.log('api run on port: ' + PORT);
});