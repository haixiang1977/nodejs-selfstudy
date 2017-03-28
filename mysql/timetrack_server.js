var http = require('http');
var mysql = require('mysql');
var work = require('./lib/timetrack');

// before run, need to open mysql terminal and create a database
// mysql -u root -p
// mysql> show databases;
// mysql> create database timetrack;
// mysql> quit;

var db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '11111111',
  database: 'timetrack'
});

/*
db.connect(function (err) {
  if (!err) {
    console.log("database is connected\n");
  } else {
    throw err;
  }
});
*/

// create http Server
var server = http.createServer(function (req, res) {
  switch (req.method) {
    case 'POST':
      switch (req.url) {
        case '/':
          work.add(db, req, res);
          break;
        case '/archieve':
          work.archieve(db, req, res);
          break;
        case '/delete':
          work.delete(db, req, res);
          break;
      }
      break;
    case 'GET':
      switch (req.url) {
        case '/':
          work.show(db, res);
          break;
        case 'archived':
          work.showArchived(db, res);
          break;
        }
        break;
      }
});

// connect database
db.query (
  "CREATE TABLE IF NOT EXISTS work ("
  + "id INT(10) NOT NULL AUTO_INCREMENT, "
  + "hours DECIMAL(5,2) DEFAULT 0, "
  + "date DATE, "
  + "archived INT(1) DEFAULT 0, "
  + "description LONGTEXT, "
  + "PRIMARY KEY(id))",
  function(err) {
    if (err) throw err;
    console.log('HTTP Server started ...');
    //server.listen(3000, '127.0.0.1');
    server.listen(3000, '192.168.31.158');
  }
);
