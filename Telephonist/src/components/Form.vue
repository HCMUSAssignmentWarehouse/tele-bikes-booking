<template>
  <div id="app">


<div id="new-book-deals-layout" >
  <div class="form-style-9" id="booking-deal-form" >

    <h1>New booking deal</h1>

    <ul>
    <li>
        <input type="text" id="phoneNumber" v-model="addphoneNumber" name="field1" class="field-style field-full align-none" placeholder="Phone number" />
    </li>
    <li>
        <input type="text" id="address" v-model="address" name="field3" class="field-style field-full align-none" placeholder="Address" />
    </li>
    <li>
    <label>Vehicle type: </label>
    <select  id="vehicleType" class="field-style field-full align-none" style="width: 70%; height: 40px;" v-model="vehicleType" >
      <option selected="selected">normal</option>
      <option>premium</option>
    </select>
    </li>
    <li>
    <textarea name="field5" id="note" class="field-style" placeholder="Note" v-model="note"></textarea>
    </li>
    <li>
    <input type="button" id="book-button"  :disabled="loading" value="Book" v-on:click="addNewBookingDeal" />
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

		loading () {			
	      return this.$store.getters.getLoading
	    }
	    
	},
	
    methods: {
    
    addNewBookingDeal(){
    	this.$store.dispatch('addNewBookingDeal',{phoneNumber: this.addphoneNumber,address:this.address,vehicleType:this.vehicleType,note:this.note })
    	if (this.$store.getters.getError){
    		alert(this.$store.getters.getError);
    	}
    	else if (this.$store.getters.getLoading == false)
				alert("Book success!")
    },
    
    
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
#new-book-deals-layout{
	height: auto;
	text-align: center;
    margin: 0 auto;
}

#app{
    position: absolute;
    width:100%;
    height: 100%;
    padding: 16px;
    top: 40px;  


}

.form-style-9{
	position: relative;

    max-width: 450px;
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



</style>