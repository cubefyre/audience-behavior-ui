'use strict';

describe('Controller: FunnelsCtrl', function () {

  // load the controller's module
  beforeEach(module('sparkyApp'));

  var FunnelsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FunnelsCtrl = $controller('FunnelsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
