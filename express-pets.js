var express = require('express')
var app = express()
var pets = require('./pets.json')

app.use(require('morgan')('dev'));
app.use(require('body-parser').json());

app.get('/pets', getPets)
app.get('/pets/:index', getSinglePet)
app.get('/*', handleInvalidInput)
app.post('/pets', postPet)
app.put('/pets/:index', updatePet)
app.delete('/pets/:index', removePet)

function getPets (req, res, next) {
  res.status(200).send(pets)
}

function getSinglePet (req, res, next) {
  pets[req.params.index] ? (
  res.status(200).send(pets[req.params.index])) : (
  res.contentType('text/plain'),
  res.status(404).send('Not Found'))
}

function handleInvalidInput (req, res, next) {
  (res.status(404).send('Not Found'))
}

function postPet (req, res, next) {
  let body = req.body
  if(!body.age || !body.kind || !body.name) {
    res.contentType('text/plain')
    res.status(400).send('Bad Request')
  } else {
    pets.push(body)
    res.status(201).send(pets)
  }
}

function updatePet (req, res) {
  var index = Number.parseInt(req.params.index);
  if (Number.isNaN(index) || index < 0 || index >= pets.length) {
    return res.status(404).send({
      message: 'Index of pets not found',
      data: index
    });
  }
  var pet = req.body;
  console.log(pet);
  if (!pet) {
    return res.sendStatus(400);
  }
  pets[index] = pet;
  res.send(pet);
}

function removePet (req, res) {
  var index = Number.parseInt(req.params.index);
  if (Number.isNaN(index) || index < 0 || index >= pets.length) {
    return res.sendStatus(404);
  }
  var pet = pets.splice(index, 1)[0];
  res.send(pet);
}

app.listen(8000, () => {
  console.log('listening on 8000');
})
