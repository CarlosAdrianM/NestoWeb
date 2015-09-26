'use strict';

describe('myApp.vendedor module', function() {
  beforeEach(module('myApp.vendedor'));

  describe('interpolate filter', function() {
    beforeEach(module(function($provide) {
      $provide.value('vendedor', 'TEST_VENDEDOR');
    }));

    it('should replace VENDEDOR', inject(function(interpolateFilter) {
      expect(interpolateFilter('before %VENDEDOR% after')).toEqual('before TEST_VENDEDOR after');
    }));
  });
});
