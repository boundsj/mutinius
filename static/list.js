if(Meteor.isClient){

  var muniList = {

    init:function(){
      muniList.stops = MuniStops;
      if(navigator.geolocation) {
        var wpid = navigator.geolocation.watchPosition(function(position) {
          var browserLoc = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
          var stop = muniList.lookupStop([position.coords.longitude, position.coords.latitude])
          console.log("stop", stop);
          Session.set("stop", stop);
        }, function(e){
          console.log("error", e);
        }, {enableHighAccuracy:true, maximumAge:30000, timeout:27000});
      }
    },
    afterRender:function(){


    },
    lookupStop:function(coords){
      
      var current = new google.maps.LatLng(coords[1], coords[0]);
      var inbounds = [];

      var smallest = 10000;
      var closest;
      for(s in muniList.stops){
        var stop = muniList.stops[s];

        var stoploc = new google.maps.LatLng(stop.lat, stop.lng);
        var dist = google.maps.geometry.spherical.computeDistanceBetween(current, stoploc)
        if(dist < smallest){
          smallest = dist;
          closest = stop;
        }
      }
      return closest;
    } 
 
  }

  Template.list.stop = function () {
    return Session.get("stop");
  };
  Template.list.rendered = muniList.afterRender;
  $(muniList.init);

}