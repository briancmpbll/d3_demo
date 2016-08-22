const express = require('express');
const router = express.Router();
const database = require('../database');

router.get('/', (req, res)=> {
  database.getLatestData()
  .then(results=> {
    res.setHeader('Content-Type', 'application/json');

    // Reverse the results so they are in time order
    res.end(JSON.stringify(results.reverse()));
  })
  // More useful feedback should be provided.
  .catch(err=> {
    res.status(400);
    res.send(err);
  });
});

module.exports = router;
