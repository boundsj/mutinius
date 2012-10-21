if(Meteor.isClient){

  var muniCheckin = {

    init:function(){

    },
    afterRender:function(){

      $(".checkin ul li").on("click", function(ev){
        $(".checkin ul li").removeClass("selected");
        $(ev.target).addClass("selected");
        Session.set("dist", $(ev.target).data("dist"));
      });
      $(".checkin .close").on("click", function(ev){
        $(".checkin").hide();
      });
    },
 
  }

  Template.checkin.stop = function () {
    return Session.get("stop");
  };

  Template.checkin.routeDetail = function(){
    var rd = Session.get("routeDetail");
    return rd;
  };

  Template.checkin.rendered = muniCheckin.afterRender;

 /* Template.checkin.events ={
    'click  li': function(ev) {
      $(".checkin ul li").removeClass("selected");
      $(ev.target).addClass("selected");
      Session.set("dist", $(ev.target).data("dist"));
      Meteor.call('getPredictions', 5542, [14], function(err, res) {
          console.log(res);
          for (var i=0; i<res[0].data.predictions.direction.prediction.length; i++) {
            $("#predictions").append("<h5> minutes to go:" + res[0].data.predictions.direction.prediction[i].minutes + "</h5>");
          }
      });
    }
  };*/

  $(muniCheckin.init);

}