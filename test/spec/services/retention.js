'use strict';

describe('Service: Retention', function () {

  // load the service's module
  beforeEach(module('sparkyApp'));

  // instantiate service
  var Retention;
  beforeEach(inject(function (_Retention_) {
    Retention = _Retention_;
  }));

  it('should do something', function () {
    expect(!!Retention).toBe(true);
  });

});
