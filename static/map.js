if(Meteor.isClient) {

  var vecMarker = null;
  var userMarker = null;

  Template.map.created = function() {


      //Session.set("vehicle", 5481);

      function watchVehicle() {
        var vehicle = Vehicles.findOne();

        if (!vehicle || !userMarker) {
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
          new google.maps.LatLng(userMarker.position.Xa, userMarker.position.Ya)
        );
        muniMap.map.fitBounds(bounds);


        Meteor.setTimeout(watchVehicle, 5000);
      }
      watchVehicle();

  }

  var muniMap = {

    init:function(){
      var myOptions = {
        center: new google.maps.LatLng(37.765, -122.443),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      muniMap.stops = MuniStops;

      muniMap.map = new google.maps.Map($("#map")[0], myOptions);
      muniMap.userMarker = new google.maps.Marker( {
        position: new google.maps.LatLng(37.765, -122.443),
        title: "You"
      });

      if(navigator.geolocation) {

        var wpid = navigator.geolocation.watchPosition(function(position) {
          var browserLoc = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
          muniMap.map.panTo(browserLoc);
          muniMap.userMarker.setPosition(browserLoc);
          muniMap.userMarker.setMap(muniMap.map)
          userMarker = muniMap.userMarker;
        }, function(e){
          console.log("error", e);
        }, {enableHighAccuracy:true, maximumAge:30000, timeout:27000});
      }
    }






  }

  Template.map.stop = function () {
    return Session.get("stop");
  };
  Template.map.rendered = muniMap.init;


}
