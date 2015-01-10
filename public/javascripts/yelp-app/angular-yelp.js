angular.module('Yelp', ['ngResource'])
	.controller('YelpCtrl', function ($scope, $resource, $timeout) {
		$scope.yelp = $resource("http://api.yelp.com/:action", {
			action: 'business_review_search',
			ywsid: 'oQcjRFaFtJ6xs4_sxLUHyg',
			callback: 'JSON_CALLBACK'
		}, {
			get: {
				method: 'JSONP'
			}
		});
		$scope.doSearch = function($event) {
			$event.preventDefault();
			$scope.wait = 'Please wait...';
			$scope.yelpResult = $scope.yelp.get({
				term: encodeURIComponent($scope.term),
				location: encodeURIComponent($scope.location)
			});
			$scope.yelpResult.$promise.then(function(result) {
				reset();
			});
		}

		function reset() {
			$scope.wait = '';
			$scope.term = '';
			$scope.location = '';
			$timeout(function () {
				$scope.yelpResult.businesses[0].name = 'foo';
			}, 1000);
		}
	});
