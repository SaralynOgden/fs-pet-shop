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
  var pets = JSON.parse(data);
  if (err) {
    throw err;
  }
  if(cmd === 'create' && (age === undefined || kind === undefined || name === undefined)){
    console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`)
    process.exit(1)
  } else if (cmd === 'create' && age !== undefined && kind !== undefined && name !== undefined){
    console.log({age: age, kind: kind, name: name})
    process.exit(0)
  } else if (cmd === 'read' && (index > pets.length - 1 || index < 0) || isNaN(index)){
    console.error(`Usage: ${node} ${file} ${cmd} INDEX`)
    process.exit(9)
  } else if (cmd === 'read' && index < pets.length){
    console.log(pets[index]);
  } else if (cmd === 'read') {
    console.log(pets);
  } else {
    console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
    process.exit(1);
  }
});
