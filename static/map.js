if(Meteor.isClient) {

  var vecMarker = null;
  var userMarker = null;

  function watchVehicle() {
    console.log("watching vehicle 8-|");
    var vehicle = Vehicles.findOne();

    if (!vehicle || !muniMap.userMarker) {
      Meteor.setTimeout(watchVehicle, 5000);
      console.log("vehicle and/or userMarker are null");
      return;
    }

    if (vecMarker === null) {
      vecMarker = new google.maps.Marker( {
        map: muniMap.map,
        position: new google.maps.LatLng(vehicle.lat, vehicle.lon),
        title: "Vehicle"
      });
    } else {
      vecMarker.position = new google.maps.LatLng(vehicle.lat, vehicle.lon);
    }

    var bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(vehicle.lat, vehicle.lon),
      new google.maps.LatLng(muniMap.userMarker.position.Xa, muniMap.userMarker.position.Ya)
    );
    console.log(bounds);

    muniMap.map.fitBounds(bounds);
    console.log("schedule watcher again");
    Meteor.setTimeout(watchVehicle, 5000);
  }

  var muniMap = {
    firstRun:true,
    init:function(){

      console.log("INIT!");
      var location = new google.maps.LatLng(37.765, -122.443);
      console.log("sess loc", Session.get("location"))
      if(Session.get("location"))
        location = new google.maps.LatLng(Session.get("location")[1], Session.get("location")[0]);

      var myOptions = {
        center: location,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      muniMap.stops = MuniStops;
      console.log($("#map"));
      console.log("loC", location);
      muniMap.map = new google.maps.Map($("#map")[0], myOptions);
      muniMap.userMarker = new google.maps.Marker({
        position: location,
        title: "You",
        map:muniMap.map
      });


      muniMap.firstRun = false;
    },
    usePosition:function(position){
      if(muniMap.map){
        var browserLoc = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        muniMap.map.panTo(browserLoc);
        console.log("LOCmap", position);
        muniMap.userMarker.setPosition(browserLoc);
        muniMap.userMarker.setMap(muniMap.map)
        userMarker = muniMap.userMarker;
        console.log("userMarker=");
        console.log(userMarker);
      }
    },
    afterRender:function(){


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
  Template.map.created = watchVehicle;

  $(function(){
    if(navigator.geolocation) {
      var wpid = navigator.geolocation.watchPosition(function(position){
        muniMap.usePosition(position);
        muniList.usePosition(position);
      }, function(e){
        console.log("error", e);
      }, {enableHighAccuracy:true, maximumAge:30000, timeout:27000});

    }
  });
}
