(function(angular) {
	var app = angular.module('app');
	app.factory('geolocation.service', [function() {
		var location = {lat: 50, lon: 36};
		// TODO: implement integration with browser geolocation and fallback to OSM maps to pick a point
		var geolocation = {
			getLocation: function() {
				return location;
			}
		};
		return geolocation;
	}])

})(angular);
