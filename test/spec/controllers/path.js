'use strict';

describe('Controller: PathCtrl', function () {

  // load the controller's module
  beforeEach(module('sparkyApp'));

  var PathCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PathCtrl = $controller('PathCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
