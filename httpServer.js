'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

const http = require('http');
const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
  const petRegExp = /^\/pets\/(.*)$/;
  if (req.method === 'GET' && req.url === '/pets') {
    fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
      if (err) {
        console.error(err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Internal Server Error');
      }

      res.setHeader('Content-Type', 'application/json');
      res.end(petsJSON);
    });
  } else if (req.method === 'GET' && petRegExp.test(req.url)) {
    const petIndex = req.url.substring(req.url.lastIndexOf('/') + 1);
    fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
      if (err) {
        console.error(err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Internal Server Error');
      }

      const pets = JSON.parse(petsJSON);

      if (petIndex >= 0 && petIndex < pets.length - 1) {
        const petJSON = JSON.stringify(pets[petIndex]);

        res.setHeader('Content-Type', 'application/json');
        res.end(petJSON);
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
      }
    });
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = server;
