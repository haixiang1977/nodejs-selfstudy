var parse = require('url').parse;
module.exports = function route(obj) {
  return function(req, res, next) {
    //console.log(req);
    console.log(req.method);
    if (!obj[req.method]) {
      next();
      return;
    }
    var routes = obj[req.method];
    var url = parse(req.url);
    var paths = Object.keys(routes);

    console.log("url" + url);
    console.log("paths " + paths);
    console.log("paths.length " + paths.length);

    for (var i = 0; i < paths.length; i++) {
      var path = paths[i];
      var fn = routes[path];
      path = path
        .replace(/\//g, '\\/')
        .replace(/:(\w+)/g, '([^\\//]+)');
      console.log("path " + path);
      var re = new RegExp('^' + path + '$');
      var capture = url.pathname.match(re);
      console.log("capture " + capture);
      if (capture) {
        var args = [req, res].concat(capture.slice(1));
        console.log("args " + args);
        fn.apply(null, args);
        return;
      }
    }
  };
};
