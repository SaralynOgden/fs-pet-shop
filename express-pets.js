var express = require('express')
var app = express()
var pets = require('./pets.json')

app.get('/pets', (req, res, next) => {
  res.status(200).send(pets)
})

app.get('/pets/:index', (req, res, next) => {
  if(pets[req.params.index]){
    console.log(req);
    res.status(200).send(pets[req.params.index])
  } else {
    res.contentType('text/plain')
    res.status(404).send('Not Found')
  }
})

app.get('/*', (req, res, next) => {
  console.log(req.params.notpets);
  if(!req.params.notpets){
    res.status(404).send('Not Found')
  }
})

app.listen(8000, () => {
  console.log('listening on 8000');
})
