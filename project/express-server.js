'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, '../pets.json');

const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.disable('x-powered-by');
app.use(morgan('short'));
app.use(bodyParser.json());

app.get('/pets', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
    if (err) {
      console.error(err.stack);

      return res.sendStatus(500);
    }

    const pets = JSON.parse(petsJSON);

    res.send(pets);
  });
});

app.get('/pets/:index', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
    if (err) {
      console.error(err.stack);

      return res.sendStatus(500);
    }

    const pets = JSON.parse(petsJSON);
    const petIndex = parseInt(req.params.index);

    if (petIndex < 0 || petIndex >= pets.length || isNaN(petIndex)) {
      return res.sendStatus(404);
    }

    res.send(pets[petIndex]);
  });
});

app.post('/pets', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(readErr, petsJSON) {
    if (readErr) {
      console.error(readErr.stack);

      return res.sendStatus(500);
    }

    const pets = JSON.parse(petsJSON);
    const petAge = Number(req.body.age);
    const petKind = req.body.kind;
    const petName = req.body.name;

    if (!petAge || !petKind || !petName || parseInt(petAge) !== petAge) {
      return res.sendStatus(400);
    }

    const pet = { petAge, petKind, petName };
    pets.push(pet);

    const newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newPetsJSON, function(writeErr) {
      if (writeErr) {
        console.error(writeErr.stack);
        return res.sendStatus(500);
      }

      res.set('Content-Type', 'text/plain');
      res.send(pet);
    });
  });
});

app.put('/pets/:index', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(readErr, petsJSON) {
    if (readErr) {
      console.error(readErr.stack);

      return res.sendStatus(500);
    }

    const index = req.params.index;
    const pets = JSON.parse(petsJSON);
    const petAge = Number(req.body.age);
    const petKind = req.body.kind;
    const petName = req.body.name;

    if (!petAge || !petKind || !petName || parseInt(petAge) !== petAge) {
      return res.sendStatus(400);
    }

    const pet = { petAge, petKind, petName };
    pets[index] = pet;

    const newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newPetsJSON, function(writeErr) {
      if (writeErr) {
        console.error(writeErr.stack);

        return res.sendStatus(500);
      }

      res.set('Content-Type', 'text/plain');
      res.send(pet);
    });
  });
});

app.delete('/pets/:index', function(req, res) {
  fs.readFile(petsPath, function(readErr, petsJSON) {
    if (readErr) {
      console.error(readErr.stack);

      return res.sendStatus(500);
    }

    const pets = JSON.parse(petsJSON);
    const adoptedPet = pets.splice(req.params.index,1)[0];

    const newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newPetsJSON, function(writeErr) {
      if (writeErr) {
        console.error(writeErr.stack);

        return res.sendStatus(500);
      }

      res.set('Content-Type', 'text/plain');
      res.send(adoptedPet);
    });
  });
});

app.use(function(req, res) {
  res.sendStatus(404);
});

app.listen(port, function() {
  console.log('Listening on port', port);
});
