'use strict';

describe('Service: FunnelService', function () {

  // load the service's module
  beforeEach(module('sparkyApp'));

  // instantiate service
  var FunnelService;
  beforeEach(inject(function (_FunnelService_) {
    FunnelService = _FunnelService_;
  }));

  it('should do something', function () {
    expect(!!FunnelService).toBe(true);
  });

});
