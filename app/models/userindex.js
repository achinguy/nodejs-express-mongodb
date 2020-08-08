const dbConfig = require("../appconfig/db.userconfig.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const userdb = {};
userdb.mongoose = mongoose;
userdb.url = dbConfig.urltest;
userdb.users = require("./user.model.js")(mongoose);
userdb.login = require("./login.model.js")(mongoose);

module.exports = userdb;