#!/usr/bin/env node --harmony

var request = require('superagent');
var program = require('commander');
var colors = require('colors');

program
    .version('0.0.1')
    .usage('[options]')
    .option('-o, --origin <address or place>', 'Starting point for traffic calc')
    .option('-d, --destination <address or place>', 'Destination for traffic calc')
    .parse(process.argv);


if (!program.origin || !program.destination) {
    console.error('  error: origin and destination both have to be specified.'.red);
    program.help();
};

// TODO: Remove the gmaps token from the code
var params = Object.create({
    key: process.env.GOOGLE_DIRECTIONS_API_TOKEN,
    origin: program.origin,
    destination: program.destination,
    departure_time: 'now'
});

request
    .get('https://maps.googleapis.com/maps/api/directions/json')
    .query(params)
    .then(function(resp) {
        var leg = resp.body.routes[0].legs[0];

        var closeEnough = leg.duration.value * 1.15; // essentially, we're allowing for 115% of normal.
        var trafficTime = leg.duration_in_traffic.value;

        var shouldLeave = closeEnough >= trafficTime;

        if (!shouldLeave) {
            console.info('Trip time is currently %d percent of normal.'.red, trafficTime/leg.duration.value * 100);
            console.info('Monitoring in progress. You\'ll be notified when it\'s time to leave.');
        } else {
            console.info('You can now leave. Your trip is expected to take %s.'.green, leg.duration_in_traffic.text);
        }

    }, function(err) {
        console.error('An error occurred!'.red);
        program.help();
    });