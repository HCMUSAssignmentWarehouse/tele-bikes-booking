<template>
  <div id="main-layout">
  <div id="buttons-layout">
    <button v-on:click="onTheRoadToGuest">Start on the road to Guest</button>
    <button v-on:click="onArriveAtGuestLocation">Arrive at Guest Location</button>
    <button v-on:click="onStartToGo">Start to go</button>
    <button v-on:click="onArriveAtDestination">Arrive at the destination</button>
    <button v-on:click="onFinish">Finish</button>
  </div>
    <div class="google-map" :id="mapName"></div>
  <div id="blur-view">
    <div id="dialog">
    <p id="message"></p>
    <div>
      <button v-on:click="onAcceptClick">Accept</button>
      <button>Ignore</button>
    </div>
  </div>
  </div>
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
methods:{
  onAcceptClick(){
    return this.$store.dispatch('onAcceptClick')
  },
  onTheRoadToGuest(){
    return this.$store.dispatch('onTheRoadToGuest')
  },
  onArriveAtGuestLocation(){
    return this.$store.dispatch('onArriveAtGuestLocation')
  },
  onStartToGo(){
    return this.$store.dispatch('onStartToGo')
  },
  onArriveAtDestination(){
    return this.$store.dispatch('onArriveAtDestination')
  },
  onFinish(){
    return this.$store.dispatch('onFinish')
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

  this.$store.dispatch('getNewWaitingBookingDeal');

}

}
</script>
<style scoped>

#main-layout{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  padding-top: 24px;
  padding-bottom: 24px;
  text-align: center;
}

.google-map {
  width: 90%;
  height: 80%;
  margin: 0 auto;
  margin-top:30px;
  background: gray;
}

#buttons-layout{
  margin-top:40px;
  height: 10%;
  width: 100%;
  text-align: center;
}
button{

  background-color: #2471A3;
  border: none;
  color: white;
  disabled: true;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1.5vw;
  border-radius:3px;
  margin-top:8px;
  margin-left: 4px;
  margin-right: 4px;
}
#blur-view{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 10;
    text-align: center;
    display: none;
}

#dialog{
    width: 40%;
    padding: 20px;
    margin: 0 auto;    
    background-color: #f1c40f;
    border-radius: 5px;
    margin-top: 40px;
    z-index: 11; /* 1px higher than the overlay layer */
}

p{
  font-size:1.5vw;
  margin: 4px;
}
</style>