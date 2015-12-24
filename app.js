#!/usr/bin/env node --harmony

var request = require('superagent');
var program = require('commander');

program
    .version('0.0.1')
    .usage('[options]')
    .option('-o, --origin <address or place>', 'Starting point for traffic calc')
    .option('-d, --destination <address or place>', 'Destination for traffic calc')
    .parse(process.argv);


if (!program.origin || !program.destination) {
    program.help();
};


var params = Object.create({
    key: 'AIzaSyC8tAh9LPl_KfWtuDWNgpiFbwrLnV0Rn6U',
    origin: program.origin,
    destination: program.destination,
    departure_time: 'now'
});

request
    .get('https://maps.googleapis.com/maps/api/directions/json')
    .query(params)
    .then(function(resp) {
        console.log("Success!!!")
        var leg = resp.body.routes[0].legs[0];

        console.info(leg.duration);
        console.info(leg.duration_in_traffic);

    }, function(err) {
        console.error("An error occurred!");
        console.error(err);
    });