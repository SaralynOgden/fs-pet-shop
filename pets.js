(function() {
  'use strict';

  const fs = require('fs');
  const path = require('path');
  const petsPath = path.join(__dirname, 'pets.json');
  const node = path.basename(process.argv[0]);
  const file = path.basename(process.argv[1]);
  const cmd = process.argv[2];

  switch (cmd) {
    case 'read': {
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
          process.exit(1);
        } else {
          console.log(pets);
        }
      });
      break;
    }
    case 'create': {
      const age = parseInt(process.argv[3]);
      const kind = process.argv[4];
      const name = process.argv[5];
      if (typeof age === 'number' && typeof kind === 'string' &&
          typeof name === 'string') {
        const newPet = { age, kind, name };

        fs.readFile(petsPath, 'utf8', function(readErr, petFile) {
          if (readErr) {
            throw readErr;
          }
          const pets = JSON.parse(petFile);

          pets.push(newPet);
          const petsJSON = JSON.stringify(pets);

          fs.writeFile(petsPath, petsJSON, 'utf8', function(writeErr) {
            if (writeErr) {
              throw writeErr;
            }

            console.log(newPet);
          });
        });
      } else {
        console.error(`Usage: ${node} ${file} create AGE KIND NAME`);
        process.exit(1);
      }
      break;
    }
    case 'update': {
      const toUpdate = process.argv[3];
      const age = parseInt(process.argv[4]);
      const kind = process.argv[5];
      const name = process.argv[6];
      if (typeof age === 'number' && typeof kind === 'string' &&
          typeof name === 'string') {
        const newPet = { age, kind, name };

        fs.readFile(petsPath, 'utf8', function(readErr, petFile) {
          if (readErr) {
            throw readErr;
          }
          const pets = JSON.parse(petFile);

          pets[toUpdate] = newPet;
          const petsJSON = JSON.stringify(pets);

          fs.writeFile(petsPath, petsJSON, 'utf8', function(writeErr) {
            if (writeErr) {
              throw writeErr;
            }

            console.log(newPet);
          });
        });
      } else {
        console.error(`Usage: ${node} ${file} update INDEX AGE KIND NAME`);
        process.exit(1);
      }
      break;
    }
    case 'destroy': {
      fs.readFile(petsPath, 'utf8', function(readErr, petFile) {
        if (readErr) {
          throw readErr;
        }
        const pets = JSON.parse(petFile);
        const indexToDelete = process.argv[3];

        if (indexToDelete) {
          const splicedPet = pets.splice(indexToDelete, 1);
          const petsJSON = JSON.stringify(pets);

          fs.writeFile(petsPath, petsJSON, 'utf8', function(writeErr) {
            if (writeErr) {
              throw writeErr;
            }

            console.log(splicedPet[0]);
          });
        } else {
          console.error(`Usage: ${node} ${file} destroy INDEX`);
          process.exit(1);
        }
      });
      break;
    }
    default:
      console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
      process.exit(1);
  }
})();
