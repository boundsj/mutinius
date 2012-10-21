Vehicles = new Meteor.Collection("vehicles");

if (Meteor.isClient) {

  BuberRouter = ReactiveRouter.extend({
    routes: {
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
    //'click .login-close-text': function () {
    //  loginButtonsSession.closeDropdown();
    //}
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

