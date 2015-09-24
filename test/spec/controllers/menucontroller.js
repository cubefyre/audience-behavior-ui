'use strict';

describe('Controller: MenucontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('sparkyApp'));

  var MenucontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MenucontrollerCtrl = $controller('MenucontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
