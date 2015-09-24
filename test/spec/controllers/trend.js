'use strict';

describe('Controller: TrendCtrl', function () {

  // load the controller's module
  beforeEach(module('sparkyApp'));

  var TrendCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TrendCtrl = $controller('TrendCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
