'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, '../pets.json');

const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);
const cmd = process.argv[2];


switch (cmd) {
  case 'read':
    fs.readFile(petsPath, 'utf8', function(readErr, petFile) {
      if (readErr) {
        throw readErr;
      }
      const pets = JSON.parse(petFile);
      const petIndex = process.argv[3];

      if (petIndex < pets.length && petIndex > -1) {
        console.log(pets[petIndex]);
      } else if (petIndex > pets.length || petIndex <= -1) {
        console.error(`Usage: ${node} ${file} read INDEX`);
      } else {
        console.log(pets);
      }
    });
    break;
  case 'create':
    fs.readFile(petsPath, 'utf8', function(readErr, petFile) {
      if (readErr) {
        throw readErr;
      }
      const pets = JSON.parse(petFile);
      const age = process.argv[3];
      const kind = process.argv[4];
      const name = process.argv[5];

      if (typeof age === 'string' && typeof kind === 'string' && typeof name === 'string') {
        const newPet = {'age': age, 'kind': kind, 'name': name};

        pets.push(newPet);
        const petsJSON = JSON.stringify(pets);
        fs.writeFile(petsPath, petsJSON, 'utf8', function(writeErr) {
          if (writeErr) {
            throw writeErr;
          }

          console.log(newPet)
        })
      } else {
        console.log(`Usage: ${node} ${file} create AGE KIND NAME`)
      }
    });
    break;
  case 'update':
  case  'destory':
  default:
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
};
