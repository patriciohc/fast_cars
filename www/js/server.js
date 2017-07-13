

var server = {

    //ip: "localhost",
    ip: "fats-carts.herokuapp.com",
    //ip: "192.168.1.107",
    port: "443",
    socket: null,

    init: function(){
        var urlServer = "https://"+server.ip+":"+server.port;
        server.socket = io.connect( urlServer, {"forceNew": true});
    },

    post: function(urlRel, parametros, successFunction){
        var url = server.ip + ":" + server.port + urlRel;
        var setting = tools.getDefaultConfigAjax(url, 'POST', parametros);
        console.log("POST: " + url);
        $.ajax(setting).done(successFunction).fail(tools.genericFunctionError);
    },

    get: function(urlRel, parametros, successFunction){
        var url = server.ip + ":" + server.port + urlRel;
        var setting = tools.getDefaultConfigAjax(url, 'GET', parametros);
        console.log("GET: " + url);
        $.ajax(setting).done(successFunction).fail(tools.genericFunctionError);
    },



}
