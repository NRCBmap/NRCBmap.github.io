var http = require('http');
var fs = require('fs');

const allowedFiles = ["/index.html", "/data.js", "/script.js", "/Map.png"]

http.createServer(function (req, res) {
  console.log(req.url);
  console.log(allowedFiles.includes(req.url));
  if (allowedFiles.includes(req.url)) {
    fs.readFile("." + req.url, function(err, data) {
      // res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  } else {
    res.writeHead(404);
    res.end("404 Not Found");
  }
}).listen(8080);
