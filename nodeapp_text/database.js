var mysql = require('mysql');
var conn = mysql.createConnection({
  host: 'localhost',
 user: 'root',
 password: '123456',
 database: 'nodeapp'
});
conn.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
});
module.exports = conn;
