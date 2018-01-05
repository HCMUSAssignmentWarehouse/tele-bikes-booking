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
    padding-top: 16px;
    padding-bottom: 16px;
    top: 40px;  


}





</style>