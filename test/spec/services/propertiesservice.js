'use strict';

describe('Service: PropertiesService', function () {

  // load the service's module
  beforeEach(module('sparkyApp'));

  // instantiate service
  var PropertiesService;
  beforeEach(inject(function (_PropertiesService_) {
    PropertiesService = _PropertiesService_;
  }));

  it('should do something', function () {
    expect(!!PropertiesService).toBe(true);
  });

});
