// AngularJS App and Controller
var app = angular.module('App', []);

app.controller('searchCtrl', function($scope, $window) {
  	$scope.name = '';
  	$scope.region = 'region';

  	// Gets the search query, create a url partial
  	// and redirects to the new page.
  	$scope.search = function() {
  		var searchString = '/search/' + $scope.region + '/' + $scope.name.replace(/\s+/g, '');
  		$window.location.href = searchString;
  	};
});