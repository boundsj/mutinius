Checkins = new Meteor.Collection("checkins");
Feedbacks = new Meteor.Collection("feedbacks");
Vehicles = new Meteor.Collection("vehicles");

if (Meteor.isClient) {

  BuberRouter = ReactiveRouter.extend({
    routes: {
      'settings': 'list',
      'livetest': 'livetest',
      'checkin': 'checkin',
      'map': 'map',
      'list': 'list',
      '': 'list'
    },
    livetest: function() { this.goto('livetest'); },
    map: function() { this.goto('map');  },
    checkin: function() { this.goto('checkin');  },
    list: function() { this.goto('list'); }
  });

  Router = new BuberRouter();
  Meteor.startup(function() {
    Backbone.history.start({pushState: true});
  });

  Meteor.autosubscribe(function() {
    Meteor.subscribe("vehicles", Session.get("vehicle"));
  });
  Meteor.autosubscribe(function() {
    Meteor.subscribe("checkins", Meteor.userId());
  });
  Meteor.autosubscribe(function() {
    Meteor.subscribe("feedbacks", Meteor.userId());
  });

  Template.checkin.events = {
    'click': function() {
      console.log("click");
    }
  }

  var setSelected = function(page){
    $(".header li").removeClass("selected");
    $(".header li."+page).addClass("selected");
  };

  Template.header.rendered = function(){
    $(".header li").on("click", function(ev){
      Router.navigate("/"+$(ev.currentTarget).attr("class").replace("selected"), {trigger:true});
    });
  };

  var checkAndReturnUserLogin = function() {
    console.log("user", Meteor.user());
    if (!Meteor.user()) {
      // XXX: For demo only!! disabling the login req because meteor login sucks
      //      ass on mobile.
      //alert('Hey good looking, you need to login to do this!');
      //return null;
      return "DEMO_USER";
    }
    return Meteor.userId();
  }

  var loginButtonsSession = Accounts._loginButtonsSession;
  var correctDropdownZIndexes = function () {
    // IE <= 7 has a z-index bug that means we can't just give the
    // dropdown a z-index and expect it to stack above the rest of
    // the page even if nothing else has a z-index.  The nature of
    // the bug is that all positioned elements are considered to
    // have z-index:0 (not auto) and therefore start new stacking
    // contexts, with ties broken by page order.
    //
    // The fix, then is to give z-index:1 to all ancestors
    // of the dropdown having z-index:0.
    for(var n = document.getElementById('login-dropdown-list').parentNode;
        n.nodeName !== 'BODY';
        n = n.parentNode)
      if (n.style.zIndex === 0)
        n.style.zIndex = 1;
  };

  // events shared between loginButtonsLoggedOutDropdown and
  // loginButtonsLoggedInDropdown
  Template.header.events({
    'click #my-login': function () {
      console.log("test");
      console.log(loginButtonsSession);
      loginButtonsSession.set('dropdownVisible', true);
      Meteor.flush();
      correctDropdownZIndexes();
    }
  });

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
    Meteor.publish("checkins", function(id) {
      return Checkins.find({userId: id});
    });
    Meteor.publish("feedbacks", function(id) {
      return Feedbacks.find({userId: id});
    });

    Meteor.methods({
      getPredictions: function(stop, tags) {
        return NextBusApi.getPredictions(stop, tags);
      }
    });

  });

}

