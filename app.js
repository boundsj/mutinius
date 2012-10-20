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

  // livetest template
  Template.livetest.created = function() {

    Session.set("refreshTime", 0);

    // TODO: Handoff from Mick's code starts here
    //       Should get a bus stop and array of route tags that are coordinated
    //       with user's actual location
    var refresh = function() {
      var refreshTime = Session.get("refreshTime");
      if (refreshTime === 0) {
        console.log("refreshing");
        Meteor.call('getPredictions', 13114, function(err, res) {
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
  Template.livetest.routes = function() {
    return Session.get("routes");
  }
  Template.livetest.refreshTime = function() {
    return Session.get("refreshTime");
  }
  Template.livetest.events = {}

  Template.checkin.events = {
    'click input': function() {
      Meteor.call('getPredictions', 5542, [14], function(err, res) {
          console.log(res);
          for (var i=0; i<res[0].data.predictions.direction.prediction.length; i++) {
            $("#predictions").append("<h5> minutes to go:" + res[0].data.predictions.direction.prediction[i].minutes + "</h5>");
          }
      });
    }
  }

}

if (Meteor.isServer) {

  Meteor.startup(function () {

    Meteor.methods({
      getPredictions: function(stop, tags) {
        return NextBusApi.getPredictions(stop, tags);
      }
    });

  });

}

