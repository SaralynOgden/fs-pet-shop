'use strict';

//import required libraries
var fs = require('fs');
var path = require('path');

//pets path is the current directory and the
var petsPath = path.join(__dirname, 'pets.json');

//variable to store the last portion of the executable path
var node = path.basename(process.argv[0]);

//variable to store the last portion of the javascript file being executed
var file = path.basename(process.argv[1]);

//variable to store the command sent through terminal
var cmd = process.argv[2];

//variable to store the index sent through terminal
var index = process.argv[3];
var age = index
var kind = process.argv[4]
var name = process.argv[5]

//if the command sent through the terminal is 'read', read the file and log it to the terminal
fs.readFile(petsPath, 'utf8', function(err, data) {
  var pets = JSON.parse(data);
  if (err) {
    throw err;
  }

  if(cmd === 'create' && (age === undefined || kind === undefined || name === undefined)){
    console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`)
    process.exit(1)
  } else {
    console.log({age: age, kind: kind, name: name})
    process.exit(0)
  }


  if (cmd === 'read' && index > pets.length - 1 || index < 0){
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
