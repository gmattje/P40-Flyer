//recupera variáveis
var palcoWidth = getDocWidth();
var palcoHeight = getDocHeight();
    
var movendoAirplane = false;

$(document).keyup(function(e){
    
    //tecla esc
    if (e.keyCode == 27) {
        alert('esc');
    }
    
    //tecla cima
    if (e.keyCode == 38) {
        return false;
    }
    
    //tecla baixo
    if (e.keyCode == 40) {
        return false;
    }
    
    //tecla esquerda
    if (e.keyCode == 37) {
        esquerda();
    }
    
    //tecla direita
    if (e.keyCode == 39) {
        direita();
    }   
    
});

function getDocWidth(){
    var width = (
    'innerWidth' in window? window.innerWidth :
    document.compatMode!=='BackCompat'? document.documentElement.clientWidth :
    document.body.clientWidth
    );
    return width;
}

function getDocHeight(){
    var height = (
    'innerHeight' in window? window.innerHeight :
    document.compatMode!=='BackCompat'? document.documentElement.clientHeight :
    document.body.clientHeight
    );
    return height;
}

function esquerda(){
    if(movendoAirplane == false) {
        movendoAirplane = true;
        $('#airplane').animate({marginLeft:'-=150px'}, 200, function(){
             movendoAirplane = false;
        });
    }
}

function direita(){
    if(movendoAirplane == false) {
        movendoAirplane = true;
        $('#airplane').animate({marginLeft:'+=150px'}, 200, function(){
             movendoAirplane = false;
        });
    }
}