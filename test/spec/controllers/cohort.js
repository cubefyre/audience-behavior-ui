'use strict';

describe('Controller: CohortCtrl', function () {

  // load the controller's module
  beforeEach(module('sparkyApp'));

  var CohortCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CohortCtrl = $controller('CohortCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
