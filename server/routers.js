'use strict'

const express = require('express');
const api = express.Router();
const controllers = require('./controllers');
//const middleware = require('../middleware');

// user
api.get('/user/', controllers.getUsers);
api.get('/user/:id', controllers.getUser);
api.post('/user/',controllers.createUSer);
// game
api.get('/game', controllers.getGames);
api.post('/game', controllers.createGame);
api.put('/game', controllers.exitUser);
//api.get('/cat-atributo/:id', catProductoCtrl.getCatProducto);

module.exports = api;