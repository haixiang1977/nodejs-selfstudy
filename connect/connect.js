var connect = require('connect');

function logger(req, res, next) {
  console.log('%s %s', req.method, req.url);
  next();
}

function hello(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello world');
}

function authenticateWithDatabase(user, password, callback) {
  var err;

  if (user != 'tobi' || password != 'ferret') {
    err = new Error('Unauthorized');
  }
  callback(err);
}

function restrict (req, res, next) {
  var authorization = req.headers.authorization;
  if (!authorization) return next(new Error('Unauthorized'));

  var parts = authorization.split(' ');
  var scheme = parts[0];
  var auth = new Buffer(parts[1], 'base64').toString().split(':');
  var user = auth[0];
  var pass = auth[1];

  authenticateWithDatabase(user, pass, function(err) {
    if (err) return next(err);
    next();
  });
}

function admin (req, res, next) {
  console.log('admin url: ', req.url);
  switch (req.url) {
    case '/':
      res.end('try /users');
      break;
    case '/users':
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(['tobi', 'loki', 'jane']));
      break;
  }
}

var app = connect();
app.use(logger);
app.use('/admin', restrict);
app.use('/admin', admin);
app.use(hello);
app.listen(3000);
