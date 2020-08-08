const db = require("../models/userindex");
const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');
const mysql = require('mysql');
const url = require('url');
const querystring = require('querystring');
const _ = require('lodash');
// const bcrypt   = require('bcrypt-nodejs');
var bcrypt = require('bcrypt');
const Tutorial = db.users;
const LoginDetails = db.login;


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'user_schema'
})

// connection.connect(function(error){
//   if(!!error) {
//     console.log('Some error' + error);
//   } else {
//     console.log('Connected to DB');
//   }

// })
const refreshTokens = {};
let SECRET = 'VERY_SECRET_KEY!';
var key = '';

const users = [
  {
    email: 'abc.yahoo.com',
    password: 'welcome',
    role: 'admin'
  }, {
    email: 'anna',
    password: 'anna',
    role: 'member'
  }
];
// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Tutorial
  const tutorial = new Tutorial({
    name: req.body.name,
    address: req.body.address
  });

  // Save Tutorial in the database
  tutorial
    .save(tutorial)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  const queryObject = url.parse(req.url, true).query;
  var currentPage = queryObject.PageNumber;
  var currentPageSize = queryObject.PageSize;
  var searchText = queryObject.searchText;



  var condition = searchText ? { name: { $regex: new RegExp(searchText), $options: "i" } } : {};

  console.log(currentPage);
  console.log(currentPageSize);
  let skip = (currentPage - 1) * currentPageSize;
  console.log(skip);
  var HasNextPage;
  var HasPreviousPage;


  Tutorial.count({}, function (err, TotalPageCount) {
    console.log("Number of docs: ", TotalPageCount);
    TotalPageCount = parseInt(TotalPageCount);

    HasNextPage = Math.ceil(TotalPageCount / currentPageSize) - currentPage > 0 ? true : false;
    HasPreviousPage = currentPage > 1 ? true : false;
    Tutorial.find(condition)
      .skip(skip > 0 ? ((currentPage - 1) * currentPageSize) : 0).limit(parseInt(currentPageSize))
      // .skip(skip)    //Pagination This will send next set of 5 records
      // .limit(queryObject.PageSize)
      // .sort('-name') //decending name order
      // .select('name addredd') //this will select only name and adress fields out of all fields
      // .or([{price: {$gte:15}, name: /.*achiin.*/}]) // this will return entries having name achin or price is greater or equal to 15
      .then(data => {
        //res.render('index', {message1: "Recod was updated successfully from node.!!!" });
        // res.setHeader('Pagination-Headers', JSON.stringify(PaginationHeaders))
        res.setHeader('Pagination-Headers', '{"page": ' + currentPage + ', "pageSize": ' + currentPageSize + ', "TotalRecords": ' + TotalPageCount + ', "HasPreviousPage": ' + HasPreviousPage + ', "HasNextPage": ' + HasNextPage + ', "TotalPageCount": ' + Math.ceil(TotalPageCount / currentPageSize) + '}');
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });
  });


};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tutorial.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Tutorial with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Tutorial with id=" + id });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else {
        // res.render('index', {message: "Recod was updated successfully from node.!!!" });
        res.send({ message: "Tutorial was updated successfully." });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else {
        res.send({
          message: "Tutorial was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Tutorial.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  Tutorial.find({ published: true })  // find with operator .find( price : { $gt: 10, $lte: 20 })
    .then(data => { // similarly or operator .or([{author: 'Mosh'} ,{name: /.*Achin*/i}])
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Logins the application
exports.login = (req, res) => {
  const { email, password } = req.body;

  console.log(email);
  // var hash = bcrypt.hashSync(password, salt); u.email === email && email: { $regex: new RegExp(email), $options: "i"}, 


  var condition = email ? { email: { $regex: new RegExp(email), $options: "i" } } : {};
  LoginDetails.findOne({ email: email }, function (err, user) {
    console.log(user);
    // console.log(bcrypt.compareSync(docs.password, hash));
    if (user) {

    

    console.log(password);
    console.log(email);
    console.log(user);
    console.log(user.password);
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    console.log(hash);
    if (bcrypt.compareSync(password, user.password)) {
      console.log('Creds match');
      const token = jwt.sign({ user }, SECRET, { expiresIn: 600 })
      key = token;
      SECRET = token;
      const refreshToken = randtoken.uid(256);
      refreshTokens[refreshToken] = email;

      return res.json({ jwt: token, refreshToken: refreshToken });
    } else {

      console.log('Creds do no t match');
      const user = _.pick(req.body, ['email', 'password'])
      // const salt = bcrypt.getSalt(10);
      // user.password = bcrypt.hash(user.password, salt);
      res.send({
        OprStatus: 400,
        message: "Incorrect Email Or Password!Email not registered!"
      });

      // res.json({ message: 'Incorrect Email Or Password!', status: 'Error' });
    }
  } else {
    res.send({
      OprStatus: 400,
      message: "Email not registered!"
    });
    // res.json({ message: 'Email not registered!', status: 'Warning' });
  }
  });

  exports.logout = (req, res) => {
    const { email, password } = req.body;

    console.log(email);
    return res.json({ message: 'Logged Out Successfully!', status: 'Success' });
  }


  // if(bcrypt.compareSync(password, hash)) {
  //   console.log('Passwords match');
  //  } else {
  //   console.log('Passwords dont match');
  //  }
  // let user = LoginDetails.find(u => { 
  //   console.log(u);
  //   //return  u.email === email && bcrypt.compareSync(u.password, hash)
  // });
  // if (user) {
  //   console.log(user);
  //   const token = jwt.sign(user, SECRET, { expiresIn: 600 })
  //   key = token;
  //   SECRET = token;
  //   const refreshToken = randtoken.uid(256);
  //   refreshTokens[refreshToken] = email;
  //   res.json({ jwt: token, refreshToken: refreshToken });
  //   console.log('log in hua!');
  // } else {
  //   console.log(user);
  //   res.send('Email or password incorrect');
  // }
}

// Sign Ups the application
exports.signup = (req, res) => {
  const { email, password } = req.body;

  var condition = email ? { email: { $regex: new RegExp(email), $options: "i" } } : {};

  LoginDetails.findOne({ email: email }, function (err, user) {
    if (user) {
      console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');

      return res.json({ message: 'Email already exists!', status: 'Error' });
    } else {
      const user = _.pick(req.body, ['email', 'password'])
      // const salt = bcrypt.getSalt(10);
      // user.password = bcrypt.hash(user.password, salt);

      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(user.password, 10);

      bcrypt.hashSync(req.body.password, hash);
      // console.log(hash);
      // console.log(salt);
      console.log(user);
      const loginDetails = new LoginDetails({
        email: email,
        password: hash
      });
      console.log('ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo');
      loginDetails.save();
      return res.json({ message: 'User Created!', status: 'Success' });
    }
  });
};