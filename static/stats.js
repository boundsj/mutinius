if(Meteor.isClient){

  var muniStats = {

    init:function(){

    },
    afterRender:function(){

      $(".stats .close").on("click", function(ev){
        $(".stats").hide();
      });
      $(".stats .kbtn").on("click", function(ev){

        $(".stats").hide();

      });


    },
 
  }

  Template.stats.rendered = muniStats.afterRender;


  $(muniStats.init);

}