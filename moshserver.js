
const path = require("path");
const fs = require("fs");
const _ = require("underscore");
const EventEmitter = require("events");
const emitter = new EventEmitter();
const Logger = require("./app/models/logger");
const logger = new Logger();
const express = require("express");
const config = require("config");
const startupDebugger = require("debug")('app:startup');
const app = express();

var x= 'abcde'
console.log(x);
console.log(global.x);  // prints undefined


console.log(path.parse(__filename));

const files = fs.readdirSync('./'); //prints file of root location
//console.log(files);  



// Logging events
logger.on('logMessage', function(args){
  console.log('Event is emitted and logged!');
  console.log(args);
})

logger.log();

var result = _.contains([1,2,3], 2);
console.log(result);
process.env.PORT = 3000;
console.log(process.env.PORT);

startupDebugger(app.get('env'))  //To log this run : set DEBUG=app:startup and run application using nodemon moshserver.js
console.log("Applcation Name: "+ config.get('name')); //set NODE_ENV=development to set to development server
console.log("Mail Server: "+ config.get('mail.host'));


console.log("Before");
getUser(1, (user)=>{
  console.log(user);
  getRepos((repos)=>{
    console.log("Repos returned are:" + repos);
  })
});

function displayRepos(repos){
  console.log("Repos returned are:" + repos);
}

console.log("After");

function getUser(id, callback) {
  setTimeout(()=> { 
    console.log("Reading from database...");
    callback({name: 'abc', id:id})
  }, 2000);
}

function getRepos(returnRepos) {
  setTimeout(()=>{
    returnRepos(['repo1', 'repo2', 'repo3']);
  },1000);
  
}