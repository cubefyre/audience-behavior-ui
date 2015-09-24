'use strict';

describe('Controller: SegmentationCtrl', function () {

  // load the controller's module
  beforeEach(module('sparkyApp'));

  var SegmentationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SegmentationCtrl = $controller('SegmentationCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
