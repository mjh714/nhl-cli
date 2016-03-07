var cheerio = require('cheerio');
var request = require('request');
var Table = require('cli-table');

module.exports = function nhl(date) {
  
  var url = 'http://sports.yahoo.com/nhl/scoreboard';
  if(date !== undefined){
    url = 'http://sports.yahoo.com/nhl/scoreboard/?date=' + date;
  }
  request({
      method: 'GET',
      url: url
    }, function(err, response, body, callback) {
    if (err) return console.error(err);
    $ = cheerio.load(body);

    var table = new Table({
        head: ['Home', 'Scores', 'Away', 'Status'],
        colWidths: [30, 10, 30, 30]
    });

    $('.list .game').each(function() {
      var away = $(this).find('.away').children('.team').text().trim();
      var home = $(this).find('.home').children('.team').text().trim();
      var scoreHome = $(this).find('.score .home').text();
      var scoreAway = $(this).find('.score .away').text();
      var details = $(this).find('.details span').text();
      var summary = $(this).find('.summary .time').text();
      var tv = $(this).find('.summary .tv').text();

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
  
  