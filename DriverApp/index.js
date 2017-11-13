var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));


var firebase =  require('firebase');
app.locals.logined = false;

firebase.initializeApp({
    	apiKey: "AIzaSyCPsM92WXpL9n_APrHNbO0CtkT_FbAcuBY",
	    authDomain: "barg-midterm.firebaseapp.com",
	    databaseURL: "https://barg-midterm.firebaseio.com",
	    projectId: "barg-midterm",
	    storageBucket: "barg-midterm.appspot.com",
	    messagingSenderId: "263139149669"
}); 

app.get('/index', (req, res) => {
	if (app.locals.logined == true){
			 res.sendFile('index.html', {
	        root: __dirname
    	});
	}else{
		 res.sendFile('login.html', {
	        root: __dirname
	    });
	}
   
});

app.get('/', (req, res) => {
    if (app.locals.logined == true){
		 res.sendFile('index.html', {
        	root: __dirname
    	});
	}else{
		 res.sendFile('login.html', {
	        root: __dirname
	    });
	}
});

app.locals.history_List = [];

app.get('/waiting-booking-deal', (req, res) => {	

	if (app.locals.logined == true){
		app.locals.history_List = [];
		
		var ref = firebase.database().ref();

		ref.child("book-list").on("value", function(snapshot) {
		   snapshot.forEach(book => {

		   		if (book.val().state == "finding"){
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


app.get('/forgot_password', (req, res) => {

    res.sendFile('forgot_password.html', {
        root: __dirname
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



const PORT = 3002;
app.listen(PORT, () => {
    console.log('api run on port: ' + PORT);
});