//recupera variáveis

//tamanho do palco
var palcoWidth = getDocWidth();
var palcoHeight = getDocHeight();

//tamanho avião
var airplaneWidth = 0;
var airplaneHeight = 0;

//tamanho passagem avião
var tamanhoPassagem = 0;

//movimentação
//máximo movimentação avião
var maxMovDireita = parseFloat(parseFloat(parseFloat(palcoWidth/2)-parseFloat(75))-parseFloat(75));
var maxMovEsquerda = parseFloat("-"+(parseFloat(parseFloat(palcoWidth/2)-parseFloat(75))+parseFloat(75)));
var movimentacao = parseFloat(75); //mover em pixel a cada interação
var movendoAirplane = false;

//objetos
var objects = new Array();
var objectsMaximos = new Array();

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
        //return false;
        criaLinhaObstaculos();
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

//dados sobre obstáculos
function dadosObjetos(){
    var numObjects = 0;
    $('#objects').children('.object').each(function(i){
        var tamanhoObject = $(this).children('img').css('width').replace('px','');
        objects[numObjects] = tamanhoObject;
        numObjects++; 
    });
    //$.each(objects, function(index, value) {
    //    alert(index+" = "+value);
    //});
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

//criando linhas de obstáculos
function criaLinhaObstaculos(){
    
    if(airplaneWidth == "" || airplaneHeight == ""){
        airplaneWidth = $('#airplane').css('width').replace('px','');
        airplaneHeight = $('#airplane').css('height').replace('px','');
        tamanhoPassagem = parseFloat(airplaneWidth)+parseFloat(airplaneWidth*(25/100));
    }        
    
    //cria elemento linha
    var novaLinha = $('<div>').appendTo('body').addClass('linha');
    
    //elementos
    var tamMax = palcoWidth;
    for(var i=0;i<100;i++) {
        indexElemento = indexObstaculoAleatorio(tamMax);
        $('#obj'+indexElemento).clone().appendTo(novaLinha).css('margin-left',tamanhoPassagem);
        tamMax = tamMax-objects[indexElemento];
        if(tamMax <= 0) {
            break;
        }
    }
    
}

//escolhe elemento aleatorio com tamanho máximo
function indexObstaculoAleatorio(tamanhoMaximo){
    var numObjects = 0;
    $.each(objects, function( index, value ){
        if(parseFloat(value) <= parseFloat(tamanhoMaximo)) {
            objectsMaximos[numObjects] = index;
            numObjects++;
        }
    });
    var quantidadeObstaculos = objectsMaximos.length;
    var elementoAleatorio = Math.floor((Math.random()*quantidadeObstaculos));
    return objectsMaximos[elementoAleatorio];
}