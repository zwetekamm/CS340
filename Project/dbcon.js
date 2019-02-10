var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_wetekamz',
  password        : '5085',
  database        : 'cs340_wetekamz'
});

module.exports.pool = pool;
