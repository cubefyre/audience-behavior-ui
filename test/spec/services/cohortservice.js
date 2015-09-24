'use strict';

describe('Service: CohortService', function () {

  // load the service's module
  beforeEach(module('sparkyApp'));

  // instantiate service
  var CohortService;
  beforeEach(inject(function (_CohortService_) {
    CohortService = _CohortService_;
  }));

  it('should do something', function () {
    expect(!!CohortService).toBe(true);
  });

});
