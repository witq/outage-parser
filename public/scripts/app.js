(function(angular) {

  'use strict';

  var outageApp = angular.module('outageApp', []);

  outageApp.controller('AppController', function($scope, OutageApi) {

    OutageApi
      .getOutages('c16fbfb2-c3fe-4566-982d-fcd18777ebf3', 'c32af2ac-b9e5-4e8f-9acb-ff38aea7a49b')
      .then(function(response) {

        console.log(response);

        $scope.outages = response.data;

      })
      .catch(function(response) {

        console.log('oops');

      });

  });

  var OutageApi = function($http) {

    var baseUrl, getOutages, setBaseUrl;

    baseUrl = '/api/outages';

    this.setBaseUrl = function(url) {
      baseUrl = url;
      return this;
    };

    this.getOutages = function(branchId, regionId) {

      return $http({
        method: 'GET',
        url: [baseUrl, branchId, regionId].join('/')
      });

    };

  };

  outageApp.service('OutageApi', ['$http', OutageApi]);


})(window.angular);
