var baseUrl = 'http://webservices.nextbus.com';

var NextBusApi = {

  callPredictionServer: function(stop, tag) {
    var url = baseUrl + '/service/publicJSONFeed?command=predictions&a=sf-muni&' + 'r=' + tag + '&s=' + stop;
    return Meteor.http.get(url);
  },

  getPredictions: function(stop, tags) {

    var predictions = [];

    for (var i=0; i<tags.length; i++) {
      predictions.push(this.callPredictionServer(stop, tags[i]));
    }

    return predictions;
  }

}

