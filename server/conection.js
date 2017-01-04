"use strict";

const Sequelize = require("sequelize");

var sequelize = new Sequelize('', '', '', {
  //host: 'localhost',
  //dialect: 'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql',
  dialect: 'sqlite',
  // SQLite only
  storage: './database.sqlite'
});

// Or you can simply use a connection uri
//var sequelize = new Sequelize('sqlite://user:pass@example.com:5432/dbname');

module.exports = sequelize;
