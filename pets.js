'use strict';

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var node = path.basename(process.argv[0]);
var file = path.basename(process.argv[1]);
var cmd = process.argv[2];

var index = process.argv[3];
var age = index
var kind = process.argv[4]
var name = process.argv[5]

fs.readFile(petsPath, 'utf8', function(err, data) {
  if (err) {
    throw err;
  }
  var pets = JSON.parse(data);
  if(cmd === 'read'){
    if(index > pets.length - 1 || index < 0 || isNaN(index)){
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`)
      process.exit(9)
    } else if (index < pets.length){
      console.log(pets[index]);
    } else if (!index) {
      console.log(pets);
    }
  } else if(cmd === 'create'){
    if(!age || !kind || !name){
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`)
      process.exit(1)
    }
    var pet = {age: age, kind: kind, name: name}
    pets.push(pet)

    var petsJSON = JSON.stringify(pets)

    fs.writeFile(petsPath, petsJSON, function(writeErr){
      if(writeErr){
        throw writeErr
      }
      console.log(pet);
    })
  }
 else {
    console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
    process.exit(1);
  }
});
