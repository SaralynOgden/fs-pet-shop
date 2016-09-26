'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, './pets.json');

const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

const morgan = require('morgan');
const bodyParser = require('body-parser');
const authentication = require('express-authentication');

app.disable('x-powered-by');
app.use(morgan('short'));
app.use(bodyParser.json());

app.use(function myauth(req, res, next) {
    // provide the data that was used to authenticate the request; if this is
    // not set then no attempt to authenticate is registered.
    req.challenge = req.get('Authorization');

    req.authenticated = req.authentication === 'secret';

    // provide the result of the authentication; generally some kind of user
    // object on success and some kind of error as to why authentication failed
    // otherwise.
    if (req.authenticated) {
        req.authentication = { user: 'bob' };
    } else {
        req.authentication = { error: 'INVALID_API_KEY' };
    }

    // That's it! You're done!
    next();
});

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

    if (petIndex < 0 || petIndex >= pets.length || Number.isNaN(petIndex)) {
      return res.sendStatus(404);
    }

    res.send(pets[petIndex]);
  });
});

app.post('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', (readErr, petsJSON) => {
    if (readErr) {
      console.error(readErr.stack);
      return res.sendStatus(500);
    }

    const pets = JSON.parse(petsJSON);
    const name = req.body.name;
    const age = Number(req.body.age);
    const kind = req.body.kind;
    const pet = { name, age, kind };

    if (!name || !age || !kind) {
      return res.sendStatus(400);
    }

    pets.push(pet);

    const newpetsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newpetsJSON, (writeErr) => {
      if (writeErr) {
        console.error(writeErr.stack);
        return res.sendStatus(500);
      }

      res.set('Content-Type', 'application/json');
      res.send(pet);
    });
  });
});

app.put('/pets/:index', function(req, res) {
  fs.readFile(petsPath, 'utf8', (readErr, petsJSON) => {
    if (readErr) {
      console.error(readErr.stack);
      return res.sendStatus(500);
    }

    const pets = JSON.parse(petsJSON);
    const petIndex = parseInt(req.params.index);
    const name = req.body.name;
    const age = Number(req.body.age);
    const kind = req.body.kind;
    const pet = { name, age, kind };

    if (!name || !age || !kind) {
      return res.sendStatus(400);
    }

    pets.splice(petIndex, 0, pet);

    const newpetsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newpetsJSON, (writeErr) => {
      if (writeErr) {
        console.error(writeErr.stack);
        return res.sendStatus(500);
      }

      res.set('Content-Type', 'application/json');
      res.send(pet);
    });
  });
})

app.delete('/pets/:index', function(req, res) {
  fs.readFile(petsPath, 'utf8', (readErr, petsJSON) => {
    if (readErr) {
      console.error(readErr.stack);
      return res.sendStatus(500);
    }

    const pets = JSON.parse(petsJSON);
    const petIndex = parseInt(req.params.index);

    if (petIndex < 0 || petIndex > pets.length || isNaN(petIndex)) {
      return res.sendStatus(404);
    }

    const pet = pets.splice(petIndex, 1)[0];
    const newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newPetsJSON, (writeErr) => {
      if (writeErr) {
        console.error(writeErr.stack);
        return res.sendStatus(500);
      }

      res.set('Content-Type', 'application/json');
      res.send(pet);
    });
  });
})

app.patch('/pets/:index', function(req, res) {
  fs.readFile(petsPath, 'utf8', (readErr, petsJSON) => {
    if (readErr) {
      console.error(readErr.stack);
      return res.sendStatus(500);
    }

    const pets = JSON.parse(petsJSON);
    const petIndex = parseInt(req.params.index);

    if (petIndex < 0 || petIndex > pets.length || isNaN(petIndex)) {
      return res.sendStatus(404);
    }
    const name = req.body.name;
    const age = Number(req.body.age);
    const kind = req.body.kind;
    const pet = { name, age, kind };

    if (!name || !age || !kind) {
      return res.sendStatus(400);
    }

    pets[petIndex] = { name, age, kind };
    const newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newPetsJSON, (writeErr) => {
      if (writeErr) {
        console.error(writeErr.stack);
        return res.sendStatus(500);
      }

      res.set('Content-Type', 'application/json');
      res.send(pet);
    });
  });
});

app.use(function(req, res) {
  res.sendStatus(404);
});

app.listen(port, function() {
  console.log('Listening on port', port);
});

module.exports = app;
