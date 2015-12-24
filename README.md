# When to Leave

A simple application that allows you to enter an origin and a destination. It will continually poll the Google Directions API service while there is traffic. Once traffic has died down, it will notify you.

## Next Steps

1. Convert to a script that handles this process and reports when complete.
2. Convert to a web app that uses a web worker
3. Include a way to send an SMS when traffic is over
4. Add additional flags and options like `pessimistic` and _optimistic notification when traffic has fallen off by X%_.


## Dev Notes

### Gotchas

For the API to return traffic info, you have to specify a traffic model (`best_guess` is the default, and `pessimistic` is exactly that) but you also have to specify a departure time in seconds since the epoch. A special value of `now` can also be used.

### Env
API Token from Google: `AIzaSyC8tAh9LPl_KfWtuDWNgpiFbwrLnV0Rn6U`

> You must use https when using a token.

### API Usage

Documentation is at: https://developers.google.com/maps/documentation/directions/intro

**This is a valid GET request to the API using my personal API token.**
```
https://maps.googleapis.com/maps/api/directions/json?origin=305+Walnut+St+Redwood+City+CA&destination=201+3rd+St+94607&key=AIzaSyC8tAh9LPl_KfWtuDWNgpiFbwrLnV0Rn6U&mode=driving&traffic_model=best_guess&departure_time=now
```

**Here's a properly formatted curl request with the default traffic_model because its unspecified**
```bash
curl -i 'https://maps.googleapis.com/maps/api/directions/json?origin=305+Walnut+St+Redwood+City+CA&destination=201+3rd+St+94607&key=AIzaSyC8tAh9LPl_KfWtuDWNgpiFbwrLnV0Rn6U&mode=driving&departure_time=now'
```

**Here's a properly formatted curl request**
```bash
curl -i 'https://maps.googleapis.com/maps/api/directions/json?origin=305+Walnut+St+Redwood+City+CA&destination=201+3rd+St+94607&key=AIzaSyC8tAh9LPl_KfWtuDWNgpiFbwrLnV0Rn6U&mode=driving&traffic_model=pessimistic&departure_time=now'
```

**One more curl request, formatted using the `--data` and `--get` switches**
```bash
curl -i --get https://maps.googleapis.com/maps/api/directions/json --data 'origin=305+Walnut+St+Redwood+City+CA&destination=201+3rd+St+94607&departure_time=now&key=AIzaSyC8tAh9LPl_KfWtuDWNgpiFbwrLnV0Rn6U'
```