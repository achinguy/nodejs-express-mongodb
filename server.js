const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");


//JWT Web Token

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const SECRET = 'VERY_SECRET_KEY!';
const passportOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET
};

const app = express();
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'pug')
app.set('views', "views")

passport.use(new JwtStrategy(passportOpts, function (jwtPayload, done) {
  const expirationDate = new Date(jwtPayload.exp * 1000);
  if(expirationDate < new Date()) {
    return done(null, false);
  }
  done(null, jwtPayload);
}))
//JWT Web Token



var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {        
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');    
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');    
    res.setHeader('Access-Control-Allow-Headers', 'Pagination-Headers');     
    res.setHeader("access-control-expose-headers", "Pagination-Headers"); 
    res.setHeader('Access-Control-Allow-Credentials', true);       
    next();  
});  

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route 
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./app/routes/turorial.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

//Achin
require("./app/appconfig/prod")(app);

const userdb = require("./app/models/userindex");
userdb.mongoose
  .connect(userdb.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

  app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
  });
  
  require("./app/routes/user.routes")(app);
  require("./app/routes/auth.routes")(app);
  // set port, listen for requests
  process.env.PORT = 8081;
  const PORT1 = process.env.PORT || 8081;
  app.listen(PORT1, () => {
    console.log(`Server is running on port ${PORT1}.`);
  });


//--------------------------------------------------------------------------------------------------------
// Code with Mosh
const path = require("path");
const fs = require("fs");
const EventEmitter = require("events");
const emitter = new EventEmitter();
const Logger = require("./app/models/logger");
const logger = new Logger();

var x= 'abcdef'
console.log(x);
console.log(global.x);  // prints undefined


console.log(path.parse(__filename));

const files = fs.readdirSync('./'); //prints file of root location
console.log(files);  



// Logging events
logger.on('logMessage', function(args){
  console.log('Event is emitted and logged!');
  console.log(args);
})

logger.log();

