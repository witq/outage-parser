(function() {

  'use strict';

  var request = require('request'),
      cheerio = require('cheerio'),
      q       = require('q'),

      matchers, scrape, urlTpl;

  urlTpl = 'http://www.tauron-dystrybucja.pl/wylaczenia/Strony/wylaczenia.aspx?BranchId={%branchID%}&RegionId={%regionID%}';

  matchers = {
    hours: /\d{2}[:]\d{2}( - )\d{2}[:]\d{2}/,
    date: /\d{4}[-]\d{2}[-]\d{2}/,
    region: /[^:]*/
  };

  scrape = function(branchID, regionID) {

    var defer,
        url;

    defer = q.defer();
    url = urlTpl.replace('{%branchID%}', branchID).replace('{%regionID%}', regionID);

    request(url, function(error, response, html) {

      if(!error && response.statusCode === 200) {

        var $ = cheerio.load(html),
            outages = [];

        $('.tn-outages tr').each(function(i, tr) {
          var outage = {};
          $(tr).find('td').each(function(i, td) {
            var text = $(this).text();
            if(matchers.hours.test(text)) {
              outage.hours = {}
              outage.hours.from = text.split(' - ')[0];
              outage.hours.to = text.split(' - ')[1];
            } else if (matchers.date.test(text)) {
              outage.date = new Date(text);
            } else {
              outage.region = text.match(matchers.region)[0];
              outage.desc = text.split(': ')[1];
            }
          });
          if (outage.desc) {
            outages.push(outage);
          }
        });

        defer.resolve(outages);

      }

      defer.reject('oops, something went wrong');

    });

    return defer.promise;

  };

  module.exports = {
    get: scrape
  };

})();
