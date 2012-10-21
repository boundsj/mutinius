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
        //This is your feedback data, Jesse.
        
        // we should now have a trip ID from meteor, use that to save our feedback!
        var tripId = "?";
        var feedbacks = $(".feedbacklist div.feedbackitem.selected");
        var fblist = [];
        _.forEach(feedbacks, function(f){
          var c  = $(f).attr("class");
          c = c.replace("selected", "").replace("feedbackitem", "").replace(" ","")
          fblist.push(c);
        });

        var feedback = {tripId: tripId,
                        feedback:fblist};

        console.log("Choosen feedbacks", feedback);

        $(".feedback").hide();
        $(".startfeedback").hide();

      });


    },
 
  }

  Template.feedback.rendered = muniFeedback.afterRender;


  $(muniFeedback.init);

}