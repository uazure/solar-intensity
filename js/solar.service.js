(function(angular) {
	var app = angular.module('app');
	app.factory('solar.service', ['geolocation.service', 'sun-position.service', function(geolocation, sunPosition) {
		var CONST = {
			irradiationAboveTheSky: 1360.8, // Watts per m2
			irradiationOnSurface: 1000, // Watts per m2 for minimal rayPath
			dt: 3600, // seconds,
			earthRadius: 6300, // km
			atmoHeight: 150, // km
		};


		var solarService = {
			getCurrentPower: function(date) {
				var pos = sunPosition.getSunTruePosition(date);
				var times = sunPosition.getSunTimes(date);
				// console.log('geolocation', geolocation.getLocation());
				console.log('current sun position', sunPosition.toDegrees(pos));

				var beta = pos.altitude + Math.PI/2;
				var alpha = Math.asin(CONST.earthRadius * Math.sin(beta) / (CONST.earthRadius + CONST.atmoHeight));
				var gamma = Math.PI - alpha - beta;
				var a = CONST.earthRadius;
				var b = CONST.earthRadius + CONST.atmoHeight;

				var rayPath = Math.sqrt((Math.pow(a,2) + Math.pow(b, 2) - 2 * a * b * Math.cos(gamma))) / CONST.atmoHeight;

				//var sunPowerAtSurface = CONST.irradiationAboveTheSky - ((CONST.irradiationAboveTheSky - CONST.irradiationOnSurface) * rayPath);
				var sunPowerAtSurface = CONST.irradiationAboveTheSky * Math.pow(1 - ((CONST.irradiationAboveTheSky - CONST.irradiationOnSurface) / CONST.irradiationAboveTheSky), rayPath);
				console.log('rayPath', rayPath, 'sunPowerAtSurface', sunPowerAtSurface);
				var times = sunPosition.getSunTimes(date);
				// console.log(times);
				return sunPowerAtSurface;
			},

			getSolarNoon: function(date) {
				var times = sunPosition.getSunTimes(date);
				return times.solarNoon;
			},

			getYield: function(date) {
				console.log("calculating yield");
				var times = sunPosition.getSunTimes(date);
				var result = {
					harvest: 0,
					data: []
				};

				//times.dawn times.dusk
				var curTime = new Date(times.dawn);
				do {
					var power = this.getCurrentPower(curTime);
					var dHarvest = power * CONST.dt / 3600; // W*h
					result.harvest += dHarvest;
					console.log('time', curTime, 'power', power, 'harvest', dHarvest, 'total', result.harvest);
					result.data.push({time: curTime, power: power, dt: CONST.dt, harvest: dHarvest});
					curTime = new Date(curTime.getTime() + (CONST.dt * 1000)) ;
				} while (curTime < times.dusk);
				return result;
			}

		}
		return solarService;
	}])

})(angular);
