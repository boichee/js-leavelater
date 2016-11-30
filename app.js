#!/usr/bin/env node --harmony

var request = require('superagent');
var program = require('commander');
var colors = require('colors');

// Helpers when calculating time in milliseconds
const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;

program
    .version('0.0.1')
    .usage('[options]')
    .option('-o, --origin <address or place>', 'Starting point for traffic calc')
    .option('-d, --destination <address or place>', 'Destination for traffic calc')
    .option('-p, --acceptable-proportion <proportion>', 'Acceptable proportion to say to leave in.')
    .option('-i, --check-interval <minutes>', 'How often to check in minutes.')
    .parse(process.argv);


if (!program.origin || !program.destination) {
    console.error('  error: origin and destination both have to be specified.'.red);
    program.help();
};

if(program.checkInterval) {
    var checkInterval = program.checkInterval * ONE_MINUTE;
}

var params = Object.create({
    key: process.env.GOOGLE_DIRECTIONS_API_TOKEN,
    origin: program.origin,
    destination: program.destination,
    departure_time: 'now'
});

checkTripTime(params, program.acceptableProportion, checkInterval);

function checkTripTime(params, acceptableProportion, nextCheckTime) {
    acceptableProportion = acceptableProportion || 1.15; // Default to 115% of normal
    nextCheckTime = nextCheckTime || ONE_MINUTE * 5; // Default to five minutes

    request
        .get('https://maps.googleapis.com/maps/api/directions/json')
        .query(params)
        .then(function(resp) {
            if (!resp.body) {
                console.error('A HTTP error or some other crazy error occurred. That\'s all I know.');
                process.exit(1);
            } else if (resp.body.status === 'NOT_FOUND' ) {
                console.error('The origin or destination you provided could not be reverse geocoded. Try entering a complete address instead.'.red);
                process.exit(1);
            } else if (resp.body.error_message) {
                console.error('Something went wrong while calling the API: %s'.red, resp.body.error_message);
                process.exit(1);
            }

            // console.log(resp.body);
            var leg = resp.body.routes[0].legs[0];
            var normalTime = leg.duration;
            var trafficTime = leg.duration_in_traffic;
            var closeEnough = normalTime.value * acceptableProportion;
            var currentProportionOfNormal = trafficTime.value / normalTime.value;
            var timeOfArrival = new Date(Date.now() + trafficTime.value * 1000);
            var eta = timeOfArrival.getHours() + ":" + timeOfArrival.getMinutes();

            console.info('Normal trip time is %s', normalTime.text);
            console.info('Time with traffic is currently %s', trafficTime.text);

            if (closeEnough < trafficTime.value) {
                console.info('Trip time is currently %d%% of normal.'.red, (currentProportionOfNormal * 100).toFixed(2));
                console.info('Your ETA is', eta);
                console.info('Monitoring in progress... next check in %d %s.', Math.round(nextCheckTime/ONE_MINUTE, 1), Math.round(nextCheckTime/ONE_MINUTE, 1) > 1 ? 'minutes' : 'minute');

                setTimeout(() => {
                    checkTripTime(params, acceptableProportion, nextCheckTime);
                }, nextCheckTime); // Check every 5 minutes for the moment
            } else {
                console.info('You can now leave. Traffic is %d%% of normal and your trip is expected to take %s.'.green, (currentProportionOfNormal * 100).toFixed(2), trafficTime.text);
            }

        }, function(err) {
            console.error('An error occurred!'.red);
            program.help();
        });
}
