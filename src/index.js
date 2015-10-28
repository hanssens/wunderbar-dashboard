var Relayr = require('relayr');
var Config = require('../config/keys');

// required api tokens
var app_id = Config.app_id;
var token = Config.token;

// specific sensor id's
var sensor_tokens = {
	light: Config.light,
	thermometer: Config.thermometer,
	gyroscope: Config.gyroscope,
	microphone: Config.microphone,
	bridge: Config.bridge,
	infrared: Config.infrared
}

// initialize the core component
var relayr = new Relayr(app_id);

relayr.deviceModel(token, sensor_tokens.thermometer, function (err, description) {
    console.log("-------------- Temperature & Humidity --------------------");
    console.log(err||description);
    console.log("----------------------------------------------------------");
});
relayr.deviceModel(token, sensor_tokens.microphone, function (err, description) {
    console.log("-------------- Sound Level -------------------------------");
    console.log(err||description);
    console.log("----------------------------------------------------------");
});
relayr.deviceModel(token, sensor_tokens.light, function (err, description) {
    console.log("-------------- Light, Color & Proximity ------------------");
    console.log(err||description);
    console.log("----------------------------------------------------------");
});

relayr.connect(token, sensor_tokens.thermometer);
relayr.connect(token, sensor_tokens.microphone);
relayr.connect(token, sensor_tokens.light);

// events
relayr.on('connect', function () {
	console.log("Event: Connected to Wunderbar cloud");
});

relayr.on('data', function (topic, msg) {

  /*console.log("Event: " + topic);
	console.log(msg);*/

	var device_id = msg.deviceId;

  // call handlers
	if (device_id === Config.light) {
		light_handler(msg.readings);
	}

});

// event handlers

// light - coffee count
var proximity_light_threshold = 100;
var proximity_time_threshold_seconds = 10;
var time_high_proximity_recorded = 0;
var high_proximity_active = false;
var coffee_count = 0;
var last_coffee_time = undefined;

function light_handler(data) {
	console.log("------------ Handle Light, Color & Proximity -------------");

	console.log("Coffee count: " + coffee_count);

	if (coffee_count !== 0) {
		console.log("Last coffee was ordered at: " + last_coffee_time.toString());
	}

	var proximity = data[2];
	var proximity_light_value = proximity.value;
	var proximity_time_recorded = proximity.recorded;
	var date_deactivated = new Date(proximity_time_recorded);

	// high proximity was previously detected but now the proximity value
	// is below the threshold: Something was removed
	if (high_proximity_active
	 && proximity_light_value < proximity_light_threshold) {

		 high_proximity_active = false;

		 // time when high proximity initiated until now should be at least 10 secs
		 // otherwise someone is playing with the sensor
		 var date_initiated = new Date(time_high_proximity_recorded);
		 var seconds_in_high_proximity = date_deactivated - date_initiated;

		 if (seconds_in_high_proximity >= proximity_time_threshold_seconds) {
			 console.log("Coffee cup was removed at " + date_deactivated.toString());
			 last_coffee_time = date_deactivated;
			 coffee_count += 1;
		 }
	}

	 // detected high proximity - coffee machine is occupied
	else if (proximity_light_value > proximity_light_threshold) {

		if (!high_proximity_active) {
			console.log("Coffee cup was inserted at " + date_deactivated.toString());
			high_proximity_active = true;
			time_high_proximity_recorded = proximity_time_recorded;
		} else {
			console.log("Coffee machine occupied at " + date_deactivated.toString());
		}

	}

	console.log("----------------------------------------------------------");
}
