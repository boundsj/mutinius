describe("NextBusApi", function() {

  describe("#getPredictions(stop, tags)", function() {

    beforeEach(function() {
      spyOn(NextBusApi, 'callPredictionServer').andCallFake(function() {
        return prediction;
      });
    });

    it("should return 3 prediction objects for 3 routes and one stop", function() {
      expect(NextBusApi.getPredictions(1234, ['N', '71', '6']).length).toBe(3);
    });

    it("should package prediction objects with only required data", function() {

      var predictions = NextBusApi.getPredictions(1234, ['N', '71']);
      expect(predictions.length).toBe(2);
      var prediction1 = predictions[0];
      expect(prediction1.routeTag).toBe(14);
      expect(prediction1.title).toBe("Inbound to Downtown");
      expect(prediction1.stopTitle).toBe("Mission St & 9th St");
      expect(prediction1.minutes.length).toBe(3);
      expect(prediction1.minutes[0].value).toBe(0);
      expect(prediction1.minutes[1].value).toBe(18);
      expect(prediction1.minutes[2].value).toBe(27);

      var prediction2 = predictions[1];
      expect(prediction2.routeTag).toBe(14);
      expect(prediction2.title).toBe("Inbound to Downtown");
      expect(prediction2.stopTitle).toBe("Mission St & 9th St");
      expect(prediction2.minutes.length).toBe(3);
      expect(prediction2.minutes[0].value).toBe(0);
      expect(prediction2.minutes[1].value).toBe(18);
      expect(prediction2.minutes[2].value).toBe(27);

    });

  });

});

