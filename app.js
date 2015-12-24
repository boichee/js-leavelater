var request = require('superagent');

// So far, this is a fairly simple, dumbed down version of this thing.
// Will need to add the ability to accept input from the user as well as to recheck and see if traffic is better later on.

(function() {
    // Globals here
    const gmaps_token = 'AIzaSyC8tAh9LPl_KfWtuDWNgpiFbwrLnV0Rn6U';

    var params = Object.create({
        key: gmaps_token,
        origin: '225 Bush St, 94104',
        destination: '807 Martin Luther King Jr Way, 94607',
        departure_time: 'now'
    });

    var r = request
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

}());