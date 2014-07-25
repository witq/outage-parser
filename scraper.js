(function() {

  'use strict';

  var request = require('request'),
      cheerio = require('cheerio'),
      Q       = require('q'),

      matchers, scrape, urlTpl;

  urlTpl = 'http://www.tauron-dystrybucja.pl/wylaczenia/Strony/wylaczenia.aspx?BranchId={%branchID%}&RegionId={%regionID%}';

  matchers = {
    hours: /\d{2}[:]\d{2}( - )\d{2}[:]\d{2}/,
    date: /\d{4}[-]\d{2}[-]\d{2}/,
    region: /[^:]*/
  };

  scrape = function(branchID, regionID) {

    var deferred,
        url;

    deferred = Q.defer();
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
              outage.hours = {};
              outage.hours.start = text.split(' - ')[0];
              outage.hours.end = text.split(' - ')[1];
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

        deferred.resolve(outages);

      }

      deferred.reject(error);

    });

    return deferred.promise;

  };

  module.exports = {
    get: scrape
  };

})();
