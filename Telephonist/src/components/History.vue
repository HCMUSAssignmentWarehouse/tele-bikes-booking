<template>
  <div id="app">
    


<div id="new-book-deals-layout" v-if="getIsGettingDetail">

        <input type="button" id="backButton" value="Back to List" v-on:click="backToList" />

  <div class="form-style-9" id="booking-deal-form" >

    <h1>New booking deal</h1>

    <ul>
    <li>
    	<Label class="label">Address:</Label>
    	<input type="text" id="address" :value="getDetailBookingDeal.val().address" name="field3" class="field-style field-full align-none" placeholder="Address" />
    </li>

    <li>
    	<Label class="label">PhoneNumber:</Label>
    	<input type="text" id="PhoneNumber" :value="getDetailBookingDeal.val().phoneNumber" name="field3" class="field-style field-full align-none" />
    </li>

    <li id="lat-long-layout">
        <div id="lat-layout" v-if="getDetailBookingDeal.val().lat != null">
            <Label class="label">Lat:</Label>
            <input  type="text" id="lat" :value="getDetailBookingDeal.val().lat" name="field3" class="field-style field-full align-none" />
        </div>
        <div id="long-layout" v-if="getDetailBookingDeal.val().long != null">
            <Label class="label">Long:</Label>
            <input type="text" id="long" :value="getDetailBookingDeal.val().long" name="field3" class="field-style field-full align-none" />
        </div>
	</li>
	
	<li>
	    <Label class="label">vehicleType:</Label>
		<select  id="vehicleType" class="field-style field-full align-none" v-model="getDetailBookingDeal.val().vehicle" style="width: 70%; height: 40px;" >
	      <option selected="selected">normal</option>
	      <option>premium</option>
	    </select>
	</li>
	<li>
		<Label class="label">State:</Label>
    	<input type="text" id="state" :value="getDetailBookingDeal.val().state" name="field3" class="field-style field-full align-none" />
    </li>
    <li>
    	<Label class="label">Time:</Label>
    	<input type="text" id="time" :value="getDetailBookingDeal.val().time" name="field3" class="field-style field-full align-none" />
    </li>
    <li>
    	<Label class="label">Note:</Label>
    	<input type="text" id="note" :value="getDetailBookingDeal.val().note" name="field3" class="field-style field-full align-none"/>
    </li>
	<li>
    	<input type="button" id="book-button"  :disabled="loading" value="Book" v-on:click="bookAgain(getDetailBookingDeal)" />
    </li>
   
    </ul>
  </div>
</div>


<div id="search-layout" v-else>
  
  <form class="form-wrapper" v-on:submit.prevent="getBookListByPhoneNumber">
    <input type="text" id="search" v-model="phoneNumber" placeholder="Search for..." required>
    <input type="submit" id="submit" value="Go" >
  </form>

<div id="list-layout">
  <ul id="ul-history-list" >
   <li class="list-li" dismissible v-for="c in getSearchList"  v-on:click="onItemClick(c)" >
    <h4>Address: {{c.val().address}}</h4>
    <p>PhoneNumber: {{c.val().phoneNumber}}</p>
    <p v-if="c.val().lat != null">Lat: {{c.val().lat}}</p>
    <p v-if="c.val().long != null">Long: {{c.val().long}}</p
    <p>Vehicle type: {{c.val().vehicle}}</p>
    <p>State: {{c.val().state}}</p>
    <p>Time: {{c.val().time}}</p>
    <p>Note: {{c.val().note}}</p>
  </li>  

               
  </ul>
</div>

</div>
  </div>
</template>

<script>

  export default {

 	name:'Home',
    data () {
      return {
        posts: [{title: 'NHA'},{title: 'TAM'},{title: 'HUYEN'}],
       	isGettingDetail: false,
       	vehicleType: 'normal'
      }
    },
    computed: {

	    getSearchList () {
	      return this.$store.getters.getSearchList
	    },
	    getDetailBookingDeal(){
	    	return this.$store.getters.getDetailBookingDeal
	    },
	    getIsGettingDetail () {
	      return this.$store.getters.getIsGetingDetail
		},
		loading () {			
	      return this.$store.getters.getLoading
	    }
	    
	},
	watch: {
	    getSearchList (value) {
	      if (value) {
	        this.alert = true
	      }

	    },
	    alert (value) {
	      if (!value) {
	        this.$store.dispatch('setError', false)
	      }
	    }
	  },
    methods: {
    getBookListByPhoneNumber () {
      this.$store.dispatch('getBookListByPhoneNumber', { phoneNumber: this.phoneNumber})
    },
    
    onItemClick(c){
    	this.$store.dispatch('getDetail',{key: c.key})
    },
    backToList(){
    	this.$store.dispatch('resetIsGettingDetail')
    },
    bookAgain(bookingDeal){
    	if (bookingDeal.val().lat == null || bookingDeal.val().long == null){
    		alert("This booking deal is not located, wait for Location App to do this, please!")
    	}else{
    		this.$store.dispatch('bookAgain',{address: bookingDeal.val().address,phoneNumber: bookingDeal.val().phoneNumber, lat:bookingDeal.val().lat,long: bookingDeal.val().long, state: bookingDeal.val().state, vehicle: bookingDeal.val().vehicle, time: bookingDeal.val().time,note:bookingDeal.val().note })
    		if (this.$store.getters.getError){
    			alert(this.$store.getters.getError);
	    	}
	    	else if (this.$store.getters.getLoading == false)
					alert("Book again success!")
    	}
    }
   
  },
  }


</script>

<style>


.body {
  width: 100%;
  height: 250px;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
}

#app{
      position: absolute;
    width:100%;
    height: 100%;
    padding: 16px;
    top: 40px;  


}


#backButton{
	-moz-box-shadow: inset 0px 1px 0px 0px #3985B1;
    -webkit-box-shadow: inset 0px 1px 0px 0px #3985B1;
    box-shadow: inset 0px 1px 0px 0px #3985B1;
    background-color: #216288;
    border: 1px solid #17445E;
    color: #FFFFFF;
    height: 50px;
    padding: 8px 18px;
    margin-bottom:16px;
    text-decoration: none;
    font: 5vm Arial, Helvetica, sans-serif;
}

#search-layout{
	width: 90%;
	text-align: center;
	background-color: #7FB3D5;
    margin: 0px auto;
    padding:16px;
}

.form-wrapper {
	background-color: #f6f6f6;
	background-image: -webkit-gradient(linear, left top, left bottom, from(#f6f6f6), to(#eae8e8));
	background-image: -webkit-linear-gradient(top, #f6f6f6, #eae8e8);
	background-image: -moz-linear-gradient(top, #f6f6f6, #eae8e8);
	background-image: -ms-linear-gradient(top, #f6f6f6, #eae8e8);
	background-image: -o-linear-gradient(top, #f6f6f6, #eae8e8);
	background-image: linear-gradient(top, #f6f6f6, #eae8e8);
	border-color: #dedede #bababa #aaa #bababa;
	border-style: solid;
	border-width: 1px;
	-webkit-border-radius: 10px;
	-moz-border-radius: 10px;
	border-radius: 10px;
	-webkit-box-shadow: 0 3px 3px rgba(255,255,255,.1), 0 3px 0 #bbb, 0 4px 0 #aaa, 0 5px 5px #444;
	-moz-box-shadow: 0 3px 3px rgba(255,255,255,.1), 0 3px 0 #bbb, 0 4px 0 #aaa, 0 5px 5px #444;
	box-shadow: 0 3px 3px rgba(255,255,255,.1), 0 3px 0 #bbb, 0 4px 0 #aaa, 0 5px 5px #444;
	overflow: hidden;
    margin-bottom: 8px;
    margin-left: auto;
    margin-right: auto;
	padding: 4px;
	width: 95%;
	position: relative;
}

.form-wrapper #search {
	border: 1px solid #CCC;
	-webkit-box-shadow: 0 1px 1px #ddd inset, 0 1px 0 #FFF;
	-moz-box-shadow: 0 1px 1px #ddd inset, 0 1px 0 #FFF;
	box-shadow: 0 1px 1px #ddd inset, 0 1px 0 #FFF;
	-webkit-border-radius: 3px;
	-moz-border-radius: 3px;
	border-radius: 3px;
  color: #999;
	float: left;
	font: 16px Lucida Sans, Trebuchet MS, Tahoma, sans-serif;
	height: 42px;
	padding: 10px;
	width: 70%;
}

.form-wrapper #search:focus {
	border-color: #aaa;
	-webkit-box-shadow: 0 1px 1px #bbb inset;
	-moz-box-shadow: 0 1px 1px #bbb inset;
	box-shadow: 0 1px 1px #bbb inset;
	outline: 0;
}

.form-wrapper #search:-moz-placeholder,
.form-wrapper #search:-ms-input-placeholder,
.form-wrapper #search::-webkit-input-placeholder {
	color: #999;
	font-weight: normal;
}

.form-wrapper #submit {
	background-color: #0483a0;
	background-image: -webkit-gradient(linear, left top, left bottom, from(#31b2c3), to(#0483a0));
	background-image: -webkit-linear-gradient(top, #31b2c3, #0483a0);
	background-image: -moz-linear-gradient(top, #31b2c3, #0483a0);
	background-image: -ms-linear-gradient(top, #31b2c3, #0483a0);
	background-image: -o-linear-gradient(top, #31b2c3, #0483a0);
	background-image: linear-gradient(top, #31b2c3, #0483a0);
	border: 1px solid #00748f;
	-moz-border-radius: 3px;
	-webkit-border-radius: 3px;
	border-radius: 3px;
	-webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.3) inset, 0 1px 0 #FFF;
	-moz-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.3) inset, 0 1px 0 #FFF;
	box-shadow: 0 1px 0 rgba(255, 255, 255, 0.3) inset, 0 1px 0 #FFF;
	color: #fafafa;
	cursor: pointer;
	height: 42px;
	font: 15px Arial, Helvetica;
	padding: 0;
	text-transform: uppercase;
	text-shadow: 0 1px 0 rgba(0, 0 ,0, .3);
	width: 18%;
	display: inline-block;
}

.form-wrapper #submit:hover,
.form-wrapper #submit:focus {
	background-color: #31b2c3;
	background-image: -webkit-gradient(linear, left top, left bottom, from(#0483a0), to(#31b2c3));
	background-image: -webkit-linear-gradient(top, #0483a0, #31b2c3);
	background-image: -moz-linear-gradient(top, #0483a0, #31b2c3);
	background-image: -ms-linear-gradient(top, #0483a0, #31b2c3);
	background-image: -o-linear-gradient(top, #0483a0, #31b2c3);
	background-image: linear-gradient(top, #0483a0, #31b2c3);
}

.form-wrapper #submit:active {
	-webkit-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5) inset;
	-moz-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5) inset;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5) inset;
	outline: 0;
}

.form-wrapper #submit::-moz-focus-inner {
	border: 0;
}

#list-layout{
	width:95%;
	text-align: center;
	margin-left: auto;
    margin-right: auto;
}



#list-layout ul{
	list-style-type: none;
  	width: 100%;
  	margin: 16px auto;
  	height: 800px;
  	overflow: auto;
  	text-align: center;
  	

}

h4{
    margin-top: 16px;
	font: bold Helvetica, Verdana, sans-serif;
}

.list-li p{
	font: 200 14px Georgia, Times New Roman, serif;
}
.label{
	float: left;
}

.list-li{
	margin: 0 0 3px 0;
  	overflow: auto;
  	background-color:#D0D3D4;

}

#key{
}

.list-li:hover {
  background:#979A9A;
  cursor: pointer;
}

.form-style-9{
    position: relative;

    max-width: 600px;
    background: #FAFAFA;
    padding: 30px;
    margin: auto;
    box-shadow: 1px 1px 25px rgba(0, 0, 0, 0.35);
    border-radius: 10px;
    border: 6px solid #305A72;
}
.form-style-9 ul{
    padding:0;
    margin:0;
    list-style:none;
}
.form-style-9 ul li{
    display: block;
    margin-bottom: 10px;
}

.form-style-9 ul li #book-button{
    font-size: 12px;
}


.form-style-9 ul li  .field-style{
    box-sizing: border-box; 
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box; 
    padding: 8px;
    outline: none;
    border: 1px solid #B0CFE0;
    -webkit-transition: all 0.30s ease-in-out;
    -moz-transition: all 0.30s ease-in-out;
    -ms-transition: all 0.30s ease-in-out;
    -o-transition: all 0.30s ease-in-out;

}.form-style-9 ul li  .field-style:focus{
    box-shadow: 0 0 5px #B0CFE0;
    border:1px solid #B0CFE0;
}
.form-style-9 ul li .field-split{
    width: 49%;
}

.form-style-9 h1{
    color: #305A72;
}

.form-style-9 ul li .field-full{
    width: 100%;
}
.form-style-9 ul li input.align-left{
    float:left;
}
.form-style-9 ul li input.align-right{
    float:right;
}
.form-style-9 ul li textarea{
    width: 100%;
    height: 100px;
}


.form-style-9 ul li input[type="button"],
.form-style-9 ul li input[type="submit"] {
    -moz-box-shadow: inset 0px 1px 0px 0px #3985B1;
    -webkit-box-shadow: inset 0px 1px 0px 0px #3985B1;
    box-shadow: inset 0px 1px 0px 0px #3985B1;
    background-color: #216288;
    border: 1px solid #17445E;
    display: inline-block;
    cursor: pointer;
    color: #FFFFFF;
    width: 50%;
    height: 50px;
    padding: 8px 18px;
    text-decoration: none;
    font: 16px Arial, Helvetica, sans-serif;
}
.form-style-9 ul li input[type="button"]:hover, 
.form-style-9 ul li input[type="submit"]:hover {
    background: linear-gradient(to bottom, #2D77A2 5%, #337DA8 100%);
    background-color: #28739E;
}

#new-book-deals-layout{
    height: auto;
    text-align: center;
    margin: 0 auto;
}

#lat-layout{
    float: left;
    width: 48%;
    margin-bottom:8px;
    margin-right: 4px;

}

#long-layout{
    width: 48%;
    float: right;
    margin-bottom:8px;
    margin-left: 4px;
}

</style>