<template>
 
  <div id="main-layout">
  	<div class="floating-panel">
        <input id="address" type="textbox">
        <button class="button" v-on:click="geocoding" >GEOCODING</button>
        <div id="location">
        	<label class="label">Lat: </label><input id="lat" type="text">
        	<label class="label" >Long: </label><input id="long" type="text" >
        </div>
        
        <input id="vehicle" type="text" style="display:none;" >
        <input id="key" type="text" style="display:none;" >
        <input id="phone" type="text" style="display:none;" >
        <input id="note" type="text" style="display:none;" >
        <div id="btnLayout">
        	<button class="button" id="btnOk"  v-on:click="onOkClick" >OK</button>
        	<button class="button" id="btnCancel" v-on:click="onCancelClick" >Cancel</button>
        </div>
    </div>
     <div class="google-map" :id="mapName"></div>
      <div id="blur-view">
    <div id="dialog">
    <p id="message"></p>
    <div>
      <button class="dialog-button" v-on:click="onAcceptClick">Accept</button>
      <button class="dialog-button" v-on:click="onIgnoreClick">Ignore</button>
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
  onOkClick(){
    return this.$store.dispatch('onOkClick')
  },
  onCancelClick(){
    return this.$store.dispatch('onCancelClick')
  },
  onAcceptClick(){
    return this.$store.dispatch('onAcceptClick')
  },
  onIgnoreClick(){
    return this.$store.dispatch('onIgnoreClick')  
  },
  geocoding(){
      
    return this.$store.dispatch('geocoding')
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

  

  this.$store.dispatch('getCurrentBookingDeal', {map:map});

}
};
</script>

<style scoped>

#main-layout{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 40px;
  padding: 24px;
  text-align: center;

}

.google-map {
  width: 80%;
  height: 600px;
  margin: 0 auto;
  background: gray;
}
.floating-panel {
        top: 10px;
        margin-left: auto;
        margin-right: auto;
        z-index: 5;
        background-color:'black';
        padding: 5px;
        text-align: center;
        font-family: 'Roboto','sans-serif';
        line-height: 30px;
        padding-left: 10px;
}
#address{
	width:50%;height:30px;
	border:1px solid #5499C7;
}
#lat{
	width:150px;height:30px;
	border:1px solid #5499C7;
}
#long{
	width:150px;height:30px;
	border:1px solid #5499C7;	
}
.button{
	background-color: #1A5276;
	color: white;
	padding: 4px;
}
#btnOk{
	width: 100px;
}
#btnCancel{
	width: 100px;
	background-color: #FF5722
}
#btnLayout{
	margin-top:8px;
}
#location{
  margin-top:8px;
}

.dialog-button{
   background-color: #2471A3;
  border: none;
  color: white;
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

</style>