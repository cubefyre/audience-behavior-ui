'use strict';

describe('Service: RetentionService', function () {

  // load the service's module
  beforeEach(module('sparkyApp'));

  // instantiate service
  var RetentionService;
  beforeEach(inject(function (_RetentionService_) {
    RetentionService = _RetentionService_;
  }));

  it('should do something', function () {
    expect(!!RetentionService).toBe(true);
  });

});
