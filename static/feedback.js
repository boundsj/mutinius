if(Meteor.isClient){

  var muniFeedback = {

    init:function(){

    },
    afterRender:function(){

      $(".feedback div.feedbackitem").on("click", function(ev){
        if($(ev.currentTarget).is(".selected")){
          $(ev.currentTarget).removeClass("selected");
        }else{
          $(ev.currentTarget).addClass("selected");
        }
      });
      $(".feedback .close").on("click", function(ev){
        $(".feedback").hide();
      });
      $(".feedback .feedbackbtn").on("click", function(ev){
        var checkinId = Session.set("checkinId", checkinId);
        var feedbacks = $(".feedbacklist div.feedbackitem.selected");
        var fblist = [];
        _.forEach(feedbacks, function(f){
          var c  = $(f).attr("class");
          c = c.replace("selected", "").replace("feedbackitem", "").replace(" ","")
          fblist.push(c);
        });

        var userId = checkAndReturnUserLogin();
        if (userId) {
          var checkinId = Session.get("checkinId");
          var feedback = {tripId: checkinId,
                        feedback:fblist,
                        checkinId:checkinId,
                        userId:userId};
          var feedbackId = Feedbacks.insert(feedback);
          console.log("Choosen feedbacks", feedback);

          $(".feedback").hide();
          $(".startfeedback").hide();
          $(".stats").show();
        }


      });


    },

  }

  Template.feedback.rendered = muniFeedback.afterRender;


  $(muniFeedback.init);

}
