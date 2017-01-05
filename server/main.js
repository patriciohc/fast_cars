var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require("method-override");
//var LINQ = require('linq');


var app = express();
// Middlewares
app.use(methodOverride());

function initPlayers(n){
    var players = []
    for (var i = 0; i < n; i++){
        players.push(getConfigAuto());
    }
    return players;
}

function getConfigAuto(){
    return {
        id: null,
        info: {
            point: {x:0, y:0},
            velocityX: 0,
            velocityY: 0,
        }
    }
}


function getObstaculos (nObstaculos, minX, maxX, minY, maxY){
    var obstaculos = [];
    for (var i = 0; i < nObstaculos; i++) {
        var element = {};
        element.x = Math.floor((Math.random() * maxX) + minX);
        element.y = Math.floor((Math.random() * maxY) + minY);
        element.v = -Math.floor((Math.random() * 400) + 50); // velocidad
        element.t = Math.ceil(Math.random() * 3); // tipo de carro
        obstaculos.push( element );
    }
    return obstaculos;
}
