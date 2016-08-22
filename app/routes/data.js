var express = require('express');
var router = express.Router();
var database = require('../database');

router.get('/', function(req, res) {
  database.getLatestData()
  .then(function(results) {
    res.setHeader('Content-Type', 'application/json');

    // Reverse the results so they are in time order
    res.end(JSON.stringify(results.reverse()));
  })
  .catch(function(err) {
    res.status(400);
    res.send(err);
  });
});

module.exports = router;
