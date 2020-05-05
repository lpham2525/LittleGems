let userPosition = {
 lat: 0,
 lng: 0
}
let irvine = {
 lat: 33.6694649,
 lng: -117.8231107
}
// Initialize and add the map
function initMap() {
 //get users location and assigns it to empty object created earlier.
 navigator.geolocation.getCurrentPosition(success, error, position => {
 })
  function success(position) {
    userPosition.lat = position.coords.latitude
    userPosition.lng = position.coords.longitude
    console.log(userPosition.lat)
    console.log(userPosition.lng)
   // The map, centered at user position
   let map = new google.maps.Map(
    document.getElementById('map'), { zoom: 13, center: userPosition })
   // The marker, positioned at user position
   let marker = new google.maps.Marker({ position: userPosition, map: map })
  }
  
  function error() {
   // The map, centered at user position
   let map = new google.maps.Map(
    document.getElementById('map'), { zoom: 13, center: irvine })
   // The marker, positioned at user position
   let marker = new google.maps.Marker({ position: irvine, map: map })
   console.log(irvine)
  }
}