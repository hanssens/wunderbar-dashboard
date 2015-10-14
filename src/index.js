var Relayr = require('relayr');

// required api tokens
var app_id = 'xxx';
var token = 'xxx';

// specific sensor id's
var sensor_tokens = {
	light: 'xxx',
	thermometer: 'xxx',
	gyroscope: 'xxx',
	microphone: 'xxx',
	bridge: 'xxx',
	infrared: 'xxx'
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

relayr.on('connect', function () {
});
relayr.on('data', function (topic, msg) {
    console.log("Event: " + topic);
	console.log(msg);
});

