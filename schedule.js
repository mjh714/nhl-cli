const request = require('request');
const Table = require('cli-table');
const moment = require('moment');

module.exports = function nhl(date) {

  const table = new Table({
    head: ['Home', 'Scores', 'Away', 'Status'],
    colWidths: [30, 10, 30, 30]
  });

  const year = date.split('-')[0].trim();
  const nextYear = parseInt(year)+1;
  request(`http://www.nicetimeonice.com/api/seasons/${year}${nextYear}/games`, function (error, response, body) {
    
    const data = JSON.parse(body);
    
    for (let games in data) {
      const fullDate = data[games].date;
      const nowDate = `${fullDate.split(' ')[1]} ${fullDate.split(' ')[2]} ${fullDate.split(' ')[3]}`;

      if (date === nowDate) {
        const home = data[games].homeTeam;
        const away = data[games].awayTeam;
        const scoreHome = 0;
        const scoreAway = 0;
        const details = '';

        table.push(
          [home, scoreHome + ' - ' + scoreAway, away, details]
        );
      }
    }

    // output the schedule table
    console.log(table.toString());
  });
};