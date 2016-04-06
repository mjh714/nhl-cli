'use strict';
const cheerio = require('cheerio');
const request = require('request');
const Table = require('cli-table');

module.exports = function nhl(date) {
  
  let url = 'http://sports.yahoo.com/nhl/scoreboard';
  if(date !== undefined){
    url = 'http://sports.yahoo.com/nhl/scoreboard/?date=' + date;
  }
  request({
      method: 'GET',
      url: url
    }, function(err, response, body, callback) {
    if (err) return console.error(err);
    const $ = cheerio.load(body);

    const table = new Table({
        head: ['Home', 'Scores', 'Away', 'Status'],
        colWidths: [30, 10, 30, 30]
    });

    $('.list .game').each(function() {
      const away = $(this).find('.away').children('.team').text().trim();
      const home = $(this).find('.home').children('.team').text().trim();
      const scoreHome = $(this).find('.score .home').text();
      const scoreAway = $(this).find('.score .away').text();
      let details = $(this).find('.details span').text();
      const summary = $(this).find('.summary .time').text();
      const tv = $(this).find('.summary .tv').text();

      if(summary !== ''){
        details = summary + ' ' + tv;
      }

      table.push(
        [home, scoreHome + ' - ' + scoreAway, away, details]
      );
    });

    // output the schedule table
    console.log(table.toString());
  });
};
  
  