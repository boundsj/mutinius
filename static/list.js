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

  Template.list.created = function() {

    Session.set("refreshTime", 0);

    var refresh = function() {

      var stop = Session.get("stop");

      if (!stop || !stop.id) {
        console.log("no stop, retry");
        Meteor.setTimeout(refresh, 500);
        return;
      }

      var refreshTime = Session.get("refreshTime");
      if (refreshTime === 0) {
        console.log("refreshing");
        Meteor.call('getPredictions', "1" + stop.id, function(err, res) {
          console.log(res);
          res = _.sortBy(res, function(r){ r.predictionsAvailable ? r.minute1 : 1000 });
          Session.set("routes", res);
        });
        refreshTime = 30;
        Session.set("refreshTime", refreshTime);
      } else {
        Session.set("refreshTime", --refreshTime);
      }
      Meteor.setTimeout(refresh, 1000);
    }
    refresh();
  }
  Template.list.routes = function() {
    return Session.get("routes");
  }
  Template.list.refreshTime = function() {
    return Session.get("refreshTime");
  }

  Template.list.stop = function () {
    return Session.get("stop");
  };
  Template.list.rendered = muniList.afterRender;
  $(muniList.init);

}
