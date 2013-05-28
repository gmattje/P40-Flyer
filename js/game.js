//recupera variáveis

//tamanho do palco
var palcoWidth = getDocWidth();
var palcoHeight = getDocHeight();

//tamanho avião
var airplaneWidth = $('#airplane').css('width');
var airplaneHeight = $('#airplane').css('height');

//movimentação
//máximo movimentação avião
var maxMovDireita = parseFloat(parseFloat(parseFloat(palcoWidth/2)-parseFloat(75))-parseFloat(75));
var maxMovEsquerda = parseFloat("-"+(parseFloat(parseFloat(palcoWidth/2)-parseFloat(75))+parseFloat(75)));
var movimentacao = parseFloat(75); //mover em pixel a cada interação
var movendoAirplane = false;

//funções para cada tecla do teclado
$(document).keydown(function(e){
    
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

//width do body
function getDocWidth(){
    var width = (
    'innerWidth' in window? window.innerWidth :
    document.compatMode!=='BackCompat'? document.documentElement.clientWidth :
    document.body.clientWidth
    );
    return width;
}

//height do body
function getDocHeight(){
    var height = (
    'innerHeight' in window? window.innerHeight :
    document.compatMode!=='BackCompat'? document.documentElement.clientHeight :
    document.body.clientHeight
    );
    return height;
}

//movimentação avião para esquerda
function esquerda(){
    if(movendoAirplane == false) {
        //testa se a próxima será maior ou igual a máxima
        var marginAtual = $('#airplane').css('margin-left');
        marginAtual = parseFloat(marginAtual.replace('px',''));
        if((marginAtual-movimentacao) >= maxMovEsquerda){
            movendoAirplane = true;
            $('#airplane').animate({marginLeft:'-='+movimentacao+'px'}, 0, function(){
                 movendoAirplane = false;
            });
        }
    }
}

//movimentação avião para direita
function direita(){
    if(movendoAirplane == false) {
        //testa se a próxima será menor que a máxima
        var marginAtual = $('#airplane').css('margin-left');
        marginAtual = parseFloat(marginAtual.replace('px',''));
        if((marginAtual+movimentacao) < maxMovDireita){
            movendoAirplane = true;
            $('#airplane').animate({marginLeft:'+='+movimentacao+'px'}, 0, function(){
                 movendoAirplane = false;
            });
        }
    }
}