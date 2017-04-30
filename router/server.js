var connect = require('connect');
var router = require('./middleware/router');
var routes = {
  // different uri return different res
  GET: {
    '/users': function(req, res) {
      console.log ("GET /users called");
      res.end('tobi, loki, ferret');
    },
    '/user/:id': function(req, res, id) {
      console.log ("GET /user/:id called");
      res.end('user ' + id);
    }
  },
  DELETE: {
    '/user/:id': function(req, res, id) {
      res.end('deleted user ' + id);
    }
  }
};

connect()
  .use(router(routes))
  .listen(3000);
