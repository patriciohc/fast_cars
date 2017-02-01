
var Buttons = {

    eventUpButton: function(evt) {
        switch(evt.id) {
            case "ArrowUp":
                Player.incVelocity();
                break;

            case "ArrowDown":
                Player.decVelocity();
                break;

            case "ArrowLeft":
                Player.xNotMove();
                break;

            case "ArrowRight":
                Player.xNotMove();
                break;
        }
    },

    eventDownButton: function(evt){
        switch(evt.id){
            case "ArrowLeft":
                Player.moveLeft();
                break;

            case "ArrowRight":
                Player.moveRight();
                break;
        }
    },

}
