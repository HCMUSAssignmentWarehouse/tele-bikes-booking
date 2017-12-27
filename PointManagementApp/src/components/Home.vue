<template>
 
  <div id="main-layout">
  <div id="list-layout">
    <h1>Information of booking-deal List</h1>
    <ul id="ul-history-list" >
     <li class="list-li" dismissible v-for="c in getBookingDealList"  v-on:click="onItemClick(c)" >
      <img src="../assets/images/location_icon.png"/>
      <h4>Address: {{c.val().address}}</h4>
      <p>PhoneNumber: {{c.val().phoneNumber}}</p>      
      <p>State: {{c.val().state}}</p>
      <p v-if="c.val().driverName">Driver Name: {{c.val().driverName}}</p>
      <p v-if="c.val().driverAddress">Driver Address: {{c.val().driverAddress}}</p>

    </li>                  
    </ul>
  </div>
  	
     <div class="google-map" :id="mapName"></div>
  </div>
</template>

<script>
export default {
  name: 'google-map',
  props: ['name'],
  data: function () {
  return {
    mapName: this.name + "-map",
    markerCoordinates: [{
      latitude: 51.501527,
      longitude: -0.1921837
    }, {
      latitude: 51.505874,
      longitude: -0.1838486
    }, {
      latitude: 51.4998973,
      longitude: -0.202432
    }]
  }
},

computed:{
    getBookingDealList(){
      return this.$store.getters.getBookingdealList
    }
},
methods:{
  onItemClick(item){
    this.$store.dispatch('getDetailLocation',{bookingDeal: item})
  }
},

 mounted: function () {

  const bounds = new google.maps.LatLngBounds();
  const element = document.getElementById(this.mapName)
  const mapCentre = this.markerCoordinates[0]
  const options = {
    center: new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude)
  }
  const map = new google.maps.Map(element, options);
  this.markerCoordinates.forEach((coord) => {
    const position = new google.maps.LatLng(coord.latitude, coord.longitude);
    const marker = new google.maps.Marker({ 
      position,
      map
    });
    map.fitBounds(bounds.extend(position))
  });

  this.$store.dispatch('getBookingDealList', {map:map});

}
};
</script>

<style scoped>

.google-map {
  width: 55%;
  height: 600px;
  margin: 0 auto;
  background: gray;
  
}
#main-layout{
  background-color:#AED6F1;
  position: absolute;
  top:60px;
  padding:24px;
  left:0px;
  width: 100%;
}
#list-layout{
  float: left;
  width:40%;
}

#list-layout ul{
  list-style-type: none;
    width: 100%;
    margin: 16px auto;
    height: 800px;
    overflow: auto;
    text-align: center;
}  

img{
  height: 24px;
  width:24px;
  float: left;
  margin:8px;
}

h3{
  font: bold 20px Helvetica, Verdana, sans-serif;
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
h1{
  width:100%;
  text-align:center;
}

.list-li:hover {
  background:#979A9A;
  cursor: pointer;
}

</style>