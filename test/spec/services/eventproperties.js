'use strict';

describe('Service: EventProperties', function () {

  // load the service's module
  beforeEach(module('sparkyApp'));

  // instantiate service
  var EventProperties;
  beforeEach(inject(function (_EventProperties_) {
    EventProperties = _EventProperties_;
  }));

  it('should do something', function () {
    expect(!!EventProperties).toBe(true);
  });

});
