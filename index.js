#!/usr/bin/env node

(function() {

  'use strict';

  var scraper = require('./scraper.js'),
      fs = require('fs');

  scraper
    .get('c16fbfb2-c3fe-4566-982d-fcd18777ebf3', 'c32af2ac-b9e5-4e8f-9acb-ff38aea7a49b')
    .then(function(response) {
      fs.writeFile('outages.json', JSON.stringify(response, null, 2), function(error) {
        if (error) {
          throw error;
        }
        console.log('File saved');
      });
    })
    .catch(function(error) {
      console.log(error);
    });

})();
