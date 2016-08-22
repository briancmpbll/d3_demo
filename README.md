# D3 Demo
A small demonstration of using node.js and D3 to display realtime updates on a line chart.

The initial data is requested on page load from the node.js server via a GET request. The request routes to a router that requests the
newest 20 data points from an in memory sqlite database, which are then sent as the result. The client D3 code processes this list and
draws the line chart.

To simulate new data points, a five second interval runs on the node server. When the interval fires, a new data point with a random
value for the next day is added to the database and broadcast to all clients using socket.io. When the client receives this message
it adds the new data point to it data collection, redraws the chart, and discards the oldest data point.

## Running
You will need node, bower, and grunt installed to run the demo.

To run the demo, fork and clone the repository, and navigate to your local copy of the repository. Then run the following.
````
> npm install
> bower install
> grunt
> npm start
````
The demo will be running at `http://localhost:3000`.

## Improvements/TODO
- Smooth out the animation of adding new data points.
- Display multiple charts.
