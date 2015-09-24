'use strict';

describe('Controller: IntegrationCtrl', function () {

  // load the controller's module
  beforeEach(module('sparkyApp'));

  var IntegrationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IntegrationCtrl = $controller('IntegrationCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
