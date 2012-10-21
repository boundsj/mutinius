var baseUrl = 'http://webservices.nextbus.com';

var NextBusApi = {

  callVehicleLocationServer: function() {
    var url = baseUrl + '/service/publicJSONFeed?command=vehicleLocations&a=sf-muni';
    var result = Meteor.http.get(url);
    return result.data;
  },

  callPredictionServer: function(stopId) {
    var url = baseUrl + '/service/publicJSONFeed?command=predictions&a=sf-muni&' + '&stopId=' + stopId;
    var result = Meteor.http.get(url);
    return result.data;
  },

  getVehicleLocations: function() {
    return this.callVehicleLocationServer().vehicle;
  },

  getPredictions: function(stopId) {

    var predictions = [];
    var rawCollection = this.callPredictionServer(stopId);

    // XXX: Should check to see if we were rate limited
    if (!rawCollection.predictions) {
      return predictions;
    }

    for (var i=0; i<rawCollection.predictions.length; i++) {

      var raw = rawCollection.predictions[i];
      var prediction = {};

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
        if(raw.direction[0].prediction.length){
          predictionArray = raw.direction[0].prediction;
        }else{
          predictionArray = [raw.direction[0].prediction];
        }
        prediction.title = raw.direction[0].title.substring(0, 8);
      } else {
        if(raw.direction.prediction.length){
          predictionArray = raw.direction.prediction;
        }else{
          predictionArray = [raw.direction.prediction];
        }
        predictionArray = [raw.direction.prediction];
        prediction.title = raw.direction.title.substring(0, 8);
      }
      var minutes = [];
      var maxPredictions = Math.min(3, predictionArray.length);
      for (var j=0; j<maxPredictions; j++) {
        minutes.push({value: predictionArray[j].minutes});
      }
      //console.log("pa",predictionArray)
      prediction.minutes = minutes;
      prediction.vehicle = predictionArray[0].vehicle;
      if (minutes.length >= 1) {prediction.minute1 = minutes[0].value;}
      if (minutes.length >= 2) {prediction.minute2 = minutes[1].value;}
      if (minutes.length >= 3) {prediction.minute3 = minutes[2].value;}
      prediction.predictionsAvailable = true;

      predictions.push(prediction);

    }

    return predictions;
  }

}

