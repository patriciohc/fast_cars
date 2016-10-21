

var server = {

    //ip: "localhost",
    ip: "192.168.1.92",
    port: "8080",
    socket: null,

    init: function(){
        var urlServer = "http://"+server.ip+":"+server.port;
        server.socket = io.connect( urlServer, {"forceNew": true});
    },

    post: function(urlRel, parametros, successFunction){
        var url = server.ip + ":" + server.port + urlRel;
        var setting = tools.getDefaultConfigAjax(url, 'POST', parametros);
        $.ajax(setting).done(successFunction).fail(tools.genericFunctionError);
    },

    get: function(urlRel, parametros, successFunction){
        var url = server.ip + ":" + server.port + urlRel;
        var setting = tools.getDefaultConfigAjax(url, 'GET', parametros);
        $.ajax(setting).done(successFunction).fail(tools.genericFunctionError);
    },



}