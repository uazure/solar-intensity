(function(angular) {
	var app = angular.module('app', ['ui.bootstrap']);
	app.controller('appController', ['$scope', 'solar.service', function($scope, solar) {
		$scope.test = 'ScopeTest';
		$scope.model = {
			dt: new Date()
		};
		$scope.openDatepicker = function() {
			$scope.datePickerOpened = true;
		}
		$scope.$watch('model.dt', function() {
			$scope.solarNoon = solar.getSolarNoon($scope.model.dt);
			$scope.test = solar.getCurrentPower($scope.solarNoon);
			$scope.yield = solar.getYield($scope.model.dt);
		})

	}]);
})(angular);
