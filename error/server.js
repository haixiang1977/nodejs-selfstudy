var connect = require('connect');

function errorHandler() {
  var env = process.env.NODE_ENV || 'development';
  return function(err, req, res, next) {
    res.statusCode = 500;
    switch(env) {
      case 'development':
        console.error('Error caught by errorHandler:');
        res.setHeader('Content-Type', 'application/json');
        console.log ("err " + err);
        res.end(JSON.stringify(err));
        break;
      default:
        res.end('Server error');
    }
  }
}

var app = connect()
  .use(function hello(req, res) {
    foo();
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello world');
  })
  .use(errorHandler())
  .listen(3000);
