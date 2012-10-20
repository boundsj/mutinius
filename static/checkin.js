if(Meteor.isClient){

  var muniCheckin = {

    init:function(){

    },
    afterRender:function(){


    },
 
  }

  Template.checkin.stop = function () {
    return Session.get("stop");
  };
  Template.checkin.rendered = muniCheckin.afterRender;

  Template.checkin.events = {
    'click input': function() {
      Meteor.call('getPredictions', 5542, [14], function(err, res) {
          console.log(res);
          for (var i=0; i<res[0].data.predictions.direction.prediction.length; i++) {
            $("#predictions").append("<h5> minutes to go:" + res[0].data.predictions.direction.prediction[i].minutes + "</h5>");
          }
      });
    }
  };

  $(muniCheckin.init);

}