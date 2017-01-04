'use strict'
const Sequelize = require("sequelize");
const dataBase = require('./conection');

var User = dataBase.define('user', 
    {
        userName: {
            type: Sequelize.STRING,
            field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
        },
        password: {
            type: Sequelize.STRING,
            field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
        },
        isGuest: {
            type: Sequelize.BOOLEAN
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
});

var Game = dataBase.define('game', 
    {
        nameGame: {
            type: Sequelize.STRING,
            field: 'Nombre de uuario' // Will result in an attribute that is firstName when user facing but first_name in the database
        },
        noPlayers: {
            type: Sequelize.INTEGER
        },
        /*players: {
            type: Sequelize.STRING
        }*/
        status: {
            type: Sequelize.STRING
        }

    }, {
        freezeTableName: true // Model tableName will be the same as the model name
});
Game.hasMany(User, {as: 'players'})

User.sync({force: true}).then(function (res) {
    console.log(res);
});

Game.sync({force: true}).then(function (res) {
    console.log(res);
});

module.exports = {
    User,
    Game
};
