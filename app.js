if (Meteor.isClient) {

  BuberRouter = ReactiveRouter.extend({
    routes: {
      'checkin': 'checkin',
      '': 'landing'
    },
    checkin: function() { this.goto('checkin'); },
    landing: function() { this.goto('landing'); }
  });

  Router = new BuberRouter();
  Meteor.startup(function() {
    Backbone.history.start({pushState: true});
  });

  Template.checkin.username = function() { return 'user'; }
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

