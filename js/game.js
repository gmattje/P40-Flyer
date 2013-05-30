//recupera variáveis

//tamanho do palco
var palcoWidth = getDocWidth();
var palcoHeight = getDocHeight();

//tamanho avião
var airplaneWidth = 0;
var airplaneHeight = 0;
var air_x1 = 0;
var air_x2 = 0;
var air_y1 = 0;
var air_y2 = 0;

//tamanho passagem avião
var tamanhoPassagem = 0;

//movimentação
//máximo movimentação avião
var maxMovDireita = 0;
var maxMovEsquerda = 0;
var movimentacao = parseFloat(50); //mover em pixel a cada interação
var movendoAirplane = false;

//objetos
var objects = new Array();
var objectsMaximos = new Array();
var encontroX = false;
var encontroY = false;

//função de inicialização
function init(){
    dadosObjetos();
    //calculando variáveis
    airplaneWidth = $('#airplane').css('width').replace('px','');
    airplaneHeight = $('#airplane').css('height').replace('px','');
    tamanhoPassagem = parseFloat(airplaneWidth)+parseFloat(airplaneWidth*(50/100));
    maxMovDireita = parseFloat(parseFloat(parseFloat(palcoWidth/2)-parseFloat(airplaneWidth/2))-parseFloat(airplaneWidth/2));
    maxMovEsquerda = parseFloat("-"+(parseFloat(parseFloat(palcoWidth/2)-parseFloat(airplaneWidth/2))+parseFloat(airplaneWidth/2)));
}

//funções para cada tecla do teclado
$(document).keydown(function(e){
    
    //tecla esc
    if (e.keyCode == 27) {
        alert('esc');
    }
    
    //tecla cima
    if (e.keyCode == 38) {
        //return false;       
        rolagemObstaculo();
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
                 posicaoAbsolutaAirplane();
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
                 posicaoAbsolutaAirplane();
            });
        }        
    }
}

function posicaoAbsolutaAirplane(){
    air_x1 = $('#airplane').offset().left;
    air_x2 = parseFloat(air_x1)+parseFloat(airplaneWidth);
    air_y1 = $('#airplane').offset().top;
    air_y2 = parseFloat(air_y1)+parseFloat(airplaneHeight);
    //alert("X: "+air_x1+" - "+air_x2+" e Y: "+air_y1+" - "+air_y2);
}

//criando linhas de obstáculos aleatórios
function criaLinhaObstaculos(){       
    
    //cria elemento linha
    var novaLinha = $('<div>').prependTo('#obstaculos').addClass('linha');
    
    //elementos
    var primeiroElemento = true;
    var tamMax = palcoWidth;
    while(tamMax > 0) {
        indexElemento = indexObstaculoAleatorio(tamMax);
        
        if(primeiroElemento == true) {
            var inicioAletorio = Math.floor((Math.random()*(tamanhoPassagem+parseFloat(tamanhoPassagem*(25/100)))));
            tamMax = tamMax-inicioAletorio-objects[indexElemento];
            if(tamMax >= 0) {
                $('#obj'+indexElemento).clone().appendTo(novaLinha).css('margin-left',inicioAletorio);
            }
            primeiroElemento = false;
        } else {
            tamMax = tamMax-tamanhoPassagem-objects[indexElemento];
            if(tamMax >= 0) {
                $('#obj'+indexElemento).clone().appendTo(novaLinha).css('margin-left',tamanhoPassagem);
            }
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

//rolagem dos obstáculos
function rolagemObstaculo(){
    //criaLinhaObstaculos();
    $('.linha').children('.object').each(function(){
       encontroX = false;
       encontroY = false;
       var objWidth = $(this).css('width').replace('px','');
       var objHeight = $(this).css('height').replace('px','');
       var obj_x1 = $(this).children('img').offset().left; 
       var obj_x2 = parseFloat(obj_x1)+parseFloat(objWidth);
       var obj_y1 = $(this).children('img').offset().top; 
       var obj_y2 = parseFloat(obj_y1)+parseFloat(objHeight);
       if(objWidth >= airplaneWidth) {
           if(air_x1 >= obj_x1 && air_x2 <= obj_x2){
            encontroX = true;
           }
       }
       if(objHeight < airplaneHeight) {
           if(obj_y1 <= air_y1 && obj_y2 <= air_y2){
            encontroY = true;    
           }
       }
       if($(this).children('img').offset().top > palcoHeight) {
           $(this).remove();
       } 
    });
    if(encontroX && encontroY) {
        gameOver();
    }
    $('#obstaculos').animate({bottom:'-=10%'}, 150, function(){
        rolagemObstaculo();
    });
    //$('.object').each(function(){
    //    if($(this).offset().top > palcoHeight) {
    //        $(this).parent('.linha').remove();
    //    }
    //})
}

function gameOver(){
    encontroX = false;
    encontroY = false;
    alert('game over');
}