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

  });

});

