var http = require('http')
var port = 7000;
var fs = require('fs')

http.createServer(function (req, res) {
  fs.readFile('pets.json', 'utf8', function (err, data) {
    data = JSON.parse(data);
    if(req.url === '/pets' && req.method === 'POST'){
      var body = [];
      req.on('data', function(chunk) {
        body.push(chunk);
        body = Buffer.concat(body).toString();
        data.push(JSON.parse(body))
        console.log(data)
      }).on('end', function() {
        fs.writeFile('pets.json', JSON.stringify(data), function(err) {
          if(err){
            return console.log('error')
            console.log('pets > pets.json');
          }
        })
        res.end(JSON.stringify(data))
      })
    }
    else if(req.url === '/pets' && req.method === 'GET') {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(data))
    } else if(req.url === '/pets/0'){
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data[0]))
    } else if(req.url === '/pets/1'){
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data[1]))
    } else {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/plain')
      res.end('Not Found')
    }
  })
}).listen(port)
