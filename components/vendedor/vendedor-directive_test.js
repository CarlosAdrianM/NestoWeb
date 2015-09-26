'use strict';

describe('myApp.vendedor module', function() {
  beforeEach(module('myApp.vendedor'));

  describe('app-vendedor directive', function() {
    it('should print current vendedor', function() {
      module(function($provide) {
        $provide.value('vendedor', 'TEST_VENDEDOR');
      });
      inject(function($compile, $rootScope) {
        var element = $compile('<span app-vendedor></span>')($rootScope);
        expect(element.text()).toEqual('TEST_VENDEDOR');
      });
    });
  });
});
