var express = require('express')
var app = express()
var pets = require('./pets.json')

app.use(require('morgan')('dev'));
app.use(require('body-parser').json());

app.get('/pets', getPets)
app.get('/pets/:index', getSinglePet)
app.get('/*', getInvalidInput)
app.post('/pets', postPet)
app.put('/pets/:index', putPet)
app.delete('/pets/:index', removePet)

function getPets (req, res, next) {
  res.status(200).send(pets)
}

function getSinglePet (req, res, next) {
  if(pets[req.params.index]) {
    res.status(200).send(pets[req.params.index])
  } else {
    res.contentType('text/plain'),
    res.status(404).send({
      message: 'Not Found',
      data: req.params.index
    })
  }
}

function getInvalidInput (req, res, next) {
  (res.status(404).send('Not Found'))
}

function postPet (req, res, next) {
  let pet = req.body
  if(!pet.age || !pet.kind || !pet.name) {
    res.contentType('text/plain').status(400).send({
      message: 'Bad Request',
      data: pet,
      usage: 'name | age | kind'
    })
  } else {
    pets.push(pet)
    res.status(201).send(pets)
  }
}

function putPet (req, res) {
  let index = Number.parseInt(req.params.index);
  if (Number.isNaN(index) || index < 0 || index >= pets.length) {
    return res.contentType('text/plain').status(404).send({
      message: 'Index of pet not found',
      data: index
    });
  }
  let pet = req.body;
  if (!pet.age || !pet.kind || !pet.name) {
    return res.contentType('text/plain').status(400).send({
      message: 'Bad Request',
      data: pet,
      usage: 'name | age | kind'
    });
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
