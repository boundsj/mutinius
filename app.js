if (Meteor.isClient) {

  BuberRouter = ReactiveRouter.extend({
    routes: {
      'checkin': 'checkin',
      'map': 'map',
      '': 'list'
    },
    map: function() { this.goto('map'); },
    checkin: function() { this.goto('checkin'); },
    list: function() { this.goto('list'); }
  });

  Router = new BuberRouter();
  Meteor.startup(function() {
    Backbone.history.start({pushState: true});
  });



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

