'use strict';

describe('Filter: DateFilter', function () {

  // load the filter's module
  beforeEach(module('sparkyApp'));

  // initialize a new instance of the filter before each test
  var DateFilter;
  beforeEach(inject(function ($filter) {
    DateFilter = $filter('DateFilter');
  }));

  it('should return the input prefixed with "DateFilter filter:"', function () {
    var text = 'angularjs';
    expect(DateFilter(text)).toBe('DateFilter filter: ' + text);
  });

});
