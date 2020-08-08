module.exports = app => {
    const tutorials = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    // Logins application
    router.post("/login", tutorials.login);

    // Sign ups application
    // router.post("/signup",function(req, res){
    //   tutorials.signup
    // });

    router.post("/signup", tutorials.signup);
    
    app.use("/api/auth", router);
  };