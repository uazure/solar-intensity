(function(angular) {
	var app = angular.module('app', ['ui.bootstrap', 'ui.slider']);
	app.controller('appController', ['$scope', 'solar.service', '$filter', function($scope, solar, $filter) {
		$scope.test = 'ScopeTest';
		$scope.model = {
			dt: new Date(),
			hour: 12,
			minHour: 8,
			maxHour: 16
		};
		$scope.sliderOptions = {};
		$scope.openDatepicker = function() {
			$scope.datePickerOpened = true;
		}
		$scope.$watch('model.dt', function() {
			$scope.solarTimes = solar.getSolarTimes($scope.model.dt);
			$scope.solarNoon = $scope.solarTimes.solarNoon;
			$scope.model.hour = Number($filter('date')($scope.solarNoon, 'H'));
			$scope.model.minHour = Number($filter('date')($scope.solarTimes.dawn, 'H'));
			$scope.model.maxHour = Number($filter('date')($scope.solarTimes.dusk, 'H'));
			$scope.sliderOptions.floor = $scope.model.minHour;
			$scope.sliderOptions.ceil = $scope.model.maxHour;
			$scope.test = solar.getCurrentPower($scope.solarNoon);
			$scope.yield = solar.getYield($scope.model.dt);
			$scope.$broadcast('rzSliderForceRender');
		});

		$scope.$on("slideEnded", function() {
			// user finished sliding a handle
			var date = new Date($scope.model.dt);
			date.setHours($scope.model.hour);
			$scope.model.dt = date;
			$scope.$broadcast('rzSliderForceRender');
		});

	}]);
})(angular);
