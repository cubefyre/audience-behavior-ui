'use strict';

describe('Service: OnboardingService', function () {

  // load the service's module
  beforeEach(module('sparkyApp'));

  // instantiate service
  var OnboardingService;
  beforeEach(inject(function (_OnboardingService_) {
    OnboardingService = _OnboardingService_;
  }));

  it('should do something', function () {
    expect(!!OnboardingService).toBe(true);
  });

});
