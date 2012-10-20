var baseUrl = 'http://webservices.nextbus.com';

var NextBusApi = {

  callPredictionServer: function(stopId) {
    //var url = baseUrl + '/service/publicJSONFeed?command=predictions&a=sf-muni&' + 'r=' + tag + '&s=' + stop;
    var url = baseUrl + '/service/publicJSONFeed?command=predictions&a=sf-muni&' + '&stopId=' + stopId;
    var result = Meteor.http.get(url);
    return result.data;
  },

  getPredictions: function(stopId) {

    var predictions = [];
    var rawCollection = this.callPredictionServer(stopId);

    console.log("rawCollection:");
    console.log(rawCollection);


    // XXX: Should check to see if we were rate limited
    if (!rawCollection.predictions) {
      return predictions;
    }

    for (var i=0; i<rawCollection.predictions.length; i++) {

      var raw = rawCollection.predictions[i];
      var prediction = {};

      console.log("raw:");
      console.log(raw);

      if (!raw.routeTag) {
        prediction.routeTag = "";
      } else {
        prediction.routeTag = raw.routeTag;
      }
      if (!raw.direction) {
        prediction.title = "";
        prediction.predictionsAvailable = false;
        predictions.push(prediction);
        continue;
      } else {
        prediction.title = raw.direction.title;
      }
      if (!raw.stopTitle) {
        prediction.stopTitle = "";
      } else {
        prediction.stopTitle = raw.stopTitle;
      }

      // XXX: it's possible that a single route forks to two (or more)
      //      destinations. If this is the case, then direction is an array
      //      if not, then it is a single object. For now, we ignore the
      //      more complex case of forked directions and just take the first one
      //      :P
      var predictionArray;
      if (raw.direction.length) {
        predictionArray = raw.direction[0].prediction;
      } else {
        predictionArray = raw.direction.prediction;
      }

      var minutes = [];
      var maxPredictions = Math.min(3, predictionArray.length);
      for (var j=0; j<maxPredictions; j++) {
        minutes.push({value: predictionArray[j].minutes});
      }
      prediction.minutes = minutes;
      prediction.predictionsAvailable = true;

      predictions.push(prediction);

    }

    return predictions;
  }

}

