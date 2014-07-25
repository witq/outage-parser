#!/usr/bin/env node

(function() {

  'use strict';

  var express = require('express'),
      scraper = require('./scraper.js'),

      app = express();

  app.use(express.static(__dirname + '/public'));

  app.get('/api/outages/:branch/:region', function(req, res) {

    var branchID = req.params.branch,
        regionID = req.params.region;

    if (branchID && regionID) {

      scraper
        .get(branchID, regionID)
        .then(function(response) {
          res.send(response);
        })
        .catch(function(error) {
          res.send(error);
        });

    } else {

      res.send('Wrong or missing parameters');

    }

  });

  app.listen(4321);
  console.log('Server listening on port 4321');

})();
