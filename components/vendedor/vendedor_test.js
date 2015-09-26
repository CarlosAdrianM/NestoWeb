'use strict';

describe('myApp.vendedor module', function() {
  beforeEach(module('myApp.vendedor'));

  describe('vendedor service', function() {
    it('should return current vendedor', inject(function(version) {
      expect(version).toEqual('NV');
    }));
  });
});
