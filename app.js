Vehicles = new Meteor.Collection("vehicles");

if (Meteor.isClient) {

  BuberRouter = ReactiveRouter.extend({
    routes: {
      'livetest': 'livetest',
      'checkin': 'checkin',
      'map': 'map',
      '': 'list'
    },
    livetest: function() { this.goto('livetest'); },
    map: function() { this.goto('map'); },
    checkin: function() { this.goto('checkin'); },
    list: function() { this.goto('list'); }
  });

  Router = new BuberRouter();
  Meteor.startup(function() {
    Backbone.history.start({pushState: true});
  });

  Meteor.autosubscribe(function() {
    Meteor.subscribe("vehicles", Session.get("vehicle"));
  });

  Template.checkin.events = {
    'click': function() {
      console.log("click");
    }
  }

}

if (Meteor.isServer) {

  Meteor.startup(function () {

    function pollVehicleLocations() {
      var vehiclesList = NextBusApi.getVehicleLocations();

      if (!vehiclesList || vehiclesList.length === 0) {
        console.log("No vehicles in found in call to server!");
        Meteor.setTimeout(pollVehicleLocations, 10000);
        return;
      }

      //Vehicles.remove({});

      console.log("loading vehicles");
      for (var i=0; i<vehiclesList.length; i++) {
        var vehicle = vehiclesList[i];
        if (Vehicles.findOne({id: vehicle.id})) {
          Vehicles.update({id: vehicle.id}, vehicle);
        } else {
          Vehicles.insert(vehiclesList[i]);
        }
      }
      console.log("vehicles:" + Vehicles.find({}).count());
      Meteor.setTimeout(pollVehicleLocations, 10000);
    }
    pollVehicleLocations();

    Meteor.publish("vehicles", function(id) {
      console.log("subscription request for vehicle: " + id);
      return Vehicles.find({id: id});
    });

    Meteor.methods({
      getPredictions: function(stop, tags) {
        return NextBusApi.getPredictions(stop, tags);
      }
    });

  });

}

