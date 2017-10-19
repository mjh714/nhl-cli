'use strict';
const cheerio = require('cheerio');
const request = require('request');
const Table = require('cli-table');

module.exports = function nhl(date) {
  // date is passed and formatted from bin/nhl
  const url = 'http://sports.yahoo.com/nhl/scoreboard/?dateRange=' + date;
  request({
      method: 'GET',
      url: url
    }, function(err, response, body, callback) {
    if (err) return console.error(err);
    const $ = cheerio.load(body);

    // construct output table layout for headings and columns
    const table = new Table({
        head: ['Home', 'Scores', 'Away', 'Status'],
        colWidths: [30, 10, 30, 30]
    });

    // use the score class to look for the score/schedule data
    $('.score').each(function() {
      const home = $(this).find('li:first-child').find('[data-tst="first-name"]').text().trim();
      const away = $(this).find('li:nth-child(2)').find('[data-tst="first-name"]').text().trim();
      const score = $(this).find('li').find('div:nth-child(3)').text();
      const scoreHome = score.charAt(0);
      const scoreAway = score.charAt(1);
      const details = $(this).parent().prev().find('.status').text();

      // for future games use the away score to determine if it should be blank
      let scoreOutput;
      if (scoreAway === '-') {
        scoreOutput = '-';
      }else {
        scoreOutput = scoreHome + '-' + scoreAway;
      }

      // push data to table array
      table.push(
        [home, scoreOutput, away, details]
      );
    });

    // output the schedule table
    console.log(table.toString());
  });
};
  
  