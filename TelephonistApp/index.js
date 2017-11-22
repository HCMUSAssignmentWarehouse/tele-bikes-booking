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


var defaultDatabase = firebase.database();
var defaultDatabaseRef = defaultDatabase.ref();
var defaultAuth = firebase.auth();

// app.get('/', (req, res) => {
// 	writeOneDriver("01649209301","Đường số 8, Linh Trung, Thủ Đức, Linh Trung, Việt Nam","Võ Yến Nhi");
// 	writeOneDriver("01633909021","2 Lê Văn Chí, Linh Trung, Hồ Chí Minh, Việt Nam","Đoàn Huệ");
// 	writeOneDriver("01660902930","so 9, Xa lộ Hà Nội, Hiệp Phú, Quận 9, Hồ Chí Minh, Việt Nam","Lê Thị Ý Nhi");
// 	writeOneDriver("01679892392","48 Lê Văn Chí, Linh Trung, Thủ Đức, Hồ Chí Minh, Việt Nam","Cao Ý Ly");
// 	writeOneDriver("01689203909","Suối Tiên - Biển Tiên Đồng - Ngọc Nữ","Nguyễn Thanh Long");
// 	writeOneDriver("01690023345","Trường Đại học Công nghệ Thông tin","Miu Lê");
// 	writeOneDriver("01664342321","Trường Đại học Khoa học Xã hội và Nhân văn (cơ sở 2)- Đại học Quốc gia TP. HCM","Vương Anh Tú");
// 	writeOneDriver("01689090900","Trung tâm Huấn luyện Thể Thao Quốc Gia II","Nguyễn Công Thành");
// 	writeOneDriver("09989822324","Thư viện Trung tâm ĐHQG - HCM","Nguyễn Thanh Hà");
// 	writeOneDriver("09528502814","Trường đại học Nông Lâm Thành phố Hồ Chí Minh","Lê Thị Mai Anh");
//     res.sendFile('index.html', {
//         root: __dirname
//     });
// });

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

	} else {
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

	} else {
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

		var ref = defaultDatabaseRef;

		ref.child("book-list")
			.orderByChild("phoneNumber")
			.equalTo(phoneNumber)
			.once("value")
			.then(function(snapshot) {
				snapshot.forEach(function(data) {
			        app.locals.history_List.push(data.val());
			    });
			    res.json(app.locals.history_List);
	    	}, function(error) {
	    		console.log("Error: " + error.code);
		   		res.json(app.locals.history_List);
	    	});
	} else {
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
			writeNewPost(phoneNumber,address,vehicleType,"not location",note);
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
	var auth = defaultAuth;


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
	defaultAuth.signOut().then(function() {
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
	var newPostKey = defaultDatabaseRef.child('book-list').push().key;

	  // Write the new post's data simultaneously in the posts list and the user's post list.
	var updates = {};
	updates['/book-list/' + newPostKey] = postData;
	console.log("update");
	defaultDatabaseRef.update(updates);
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
	  var newPostKey = defaultDatabaseRef.child('book-list').push().key;

	  // Write the new post's data simultaneously in the posts list and the user's post list.
	  var updates = {};
	  updates['/book-list/' + newPostKey] = postData;
	  console.log("update");
	 defaultDatabaseRef.update(updates);
}


function writeOneDriver(_phoneNumber,_address,_name) {

	console.log("entry");
  // A post entry.
	  var postData = {
	  	driverPhone: _phoneNumber,
	    driverAddress: _address,
	    driverName: _name
	  };

	  // Get a key for a new Post.
	  var newPostKey = defaultDatabaseRef.child('driver-list').push().key;

	  // Write the new post's data simultaneously in the posts list and the user's post list.
	  var updates = {};
	  updates['/driver-list/' + newPostKey] = postData;
	  console.log("update");
	 defaultDatabaseRef.update(updates);
}



const PORT = 3000;
app.listen(PORT, () => {
    console.log('api run on port: ' + PORT);
});