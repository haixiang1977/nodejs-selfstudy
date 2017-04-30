var connect = require('connect');
var setup = require('./logger.js')

function hello(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello world');
}

var app = connect()
  .use(setup('method : url'))
  .use(hello)
  .listen(3000);
