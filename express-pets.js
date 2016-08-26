var express = require('express')
var app = express()
var pets = require('./pets.json')

app.get('/pets', (req, res, next) => {
  res.status(200).send(pets)
})

app.get('/pets/:index', (req, res, next) => {
  pets[req.params.index] ? (
  res.status(200).send(pets[req.params.index])) : (
  res.contentType('text/plain'),
  res.status(404).send('Not Found'))
})

app.get('/*', (req, res, next) => {
  (res.status(404).send('Not Found'))
})

app.post('/pets', function (req, res, next) {
  let body = [];
  req.on('data', function (chunk) {
    body.push(chunk.toString());
  }).on('end', function () {
    let data = JSON.parse(body.join(''));
    !data.age || !data.kind || !data.name ? (
      res.contentType('text/plain'),
      res.status(400).send('Bad Request')) : (
      pets.push(data),
      res.status(201).send(pets))
  });
});

app.listen(8000, () => {
  console.log('listening on 8000');
})
