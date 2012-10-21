if(Meteor.isClient){

  var muniMap = {

    init:function(){
      var myOptions = {
        center: new google.maps.LatLng(37.765, -122.443),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      muniMap.stops = MuniStops;

      var location = new google.maps.LatLng(37.765, -122.443);
      if(Session.get("location"))
        location = new google.maps.LatLng(Session.get("location")[1], Session.get("location")[0]);
      
      console.log("loc", location);

      muniMap.map = new google.maps.Map($("#map")[0], myOptions);
      muniMap.userMarker = new google.maps.Marker( {
        position: location,
        title: "You"
      });

      if(navigator.geolocation) {
        var wpid = navigator.geolocation.watchPosition(function(position) {
          var browserLoc = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
          muniMap.map.panTo(browserLoc);
          console.log("LOC", position);
          muniMap.userMarker.setPosition(browserLoc);
          muniMap.userMarker.setMap(muniMap.map)
          Session.set("location", [position.coords.latitude,position.coords.longitude]);
        }, function(e){
          console.log("error", e);
        }, {enableHighAccuracy:true, maximumAge:30000, timeout:27000});
      }
    }

  }

  Template.map.stop = function () {
    return Session.get("stop");
  };
  Template.map.route = function () {
    if(!Session.get("route"))
      return "N/A";
    return Session.get("route");
  };

  Template.map.routeDetails = function () {
    return Session.get("routeDetails");
  };

  Template.map.times = function () {
    routes =Session.get("routes");
    var route = _.find(Session.get("routes"), function(r){ return r.routeTag  == Session.get("route"); });
    times = [];
    if(!route)
      return "";
    _.forEach(route.minutes, function(r){
      times.push(r.value);
    })
     console.log("R", route.minutes);
    return times.join(", ");
  };

  Template.map.rendered = muniMap.init;
  //created.

}