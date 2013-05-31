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
    air_x1 = $('#airplane').offset().left;
    air_x2 = air_x1+parseFloat(airplaneWidth);
    air_y1 = $('#airplane').offset().top;
    air_y2 = air_y1+parseFloat(airplaneHeight);
    tamanhoPassagem = parseFloat(airplaneWidth)+parseFloat(airplaneWidth*(50/100));
    maxMovDireita = parseFloat(parseFloat(parseFloat(palcoWidth/2)-parseFloat(airplaneWidth/2))-parseFloat(airplaneWidth/2));
    maxMovEsquerda = parseFloat("-"+(parseFloat(parseFloat(palcoWidth/2)-parseFloat(airplaneWidth/2))+parseFloat(airplaneWidth/2)));
    //primeira linha de obstáculos
    criaLinhaObstaculos();
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
                 posicaoAbsolutaAirplane(esquerda);
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
                 posicaoAbsolutaAirplane(direita);
            });
        }        
    }
}

function posicaoAbsolutaAirplane(direcao){
    if(direcao == esquerda) {
        air_x1 = air_x1-movimentacao;
        air_x2 = parseFloat(air_x1)+parseFloat(airplaneWidth);
    } else if (direcao == direita) {
        air_x1 = air_x1+movimentacao;
        air_x2 = parseFloat(air_x1)+parseFloat(airplaneWidth);
    }    
    //air_y1 = $('#airplane').offset().top;
    //air_y2 = parseFloat(air_y1)+parseFloat(airplaneHeight);
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
    $('.linha').children('.object').each(function(){
       var objWidth = $(this).children('img').css('width').replace('px','');
       var objHeight = $(this).children('img').css('height').replace('px','');
       var obj_x1 = $(this).children('img').offset().left; 
       var obj_x2 = parseFloat(obj_x1)+parseFloat(objWidth);
       var obj_y1 = $(this).children('img').offset().top; 
       var obj_y2 = parseFloat(obj_y1)+parseFloat(objHeight);
       if(parseFloat(obj_y1) >= parseFloat(air_y1)) {
            //caso 2 e 8
            if((parseFloat(obj_x2) > parseFloat(air_x1)) && (parseFloat(obj_x1) < parseFloat(air_x1)) && (parseFloat(obj_y2) <= parseFloat(air_y2))) {
                gameOver($(this));
            }
            //caso 4 e 9
            if((parseFloat(obj_x2) > parseFloat(air_x2)) && (parseFloat(obj_x1) < parseFloat(air_x2)) && (parseFloat(obj_y2) <= parseFloat(air_y2))) {
                gameOver($(this));
            } 
            //caso 10
            //if((parseFloat(obj_x2) > parseFloat(air_y2)) && (parseFloat(obj_x1) < parseFloat(air_x1)) && (parseFloat(obj_y2) > parseFloat(air_y2))) {
            //    gameOver($(this));
            //} 
            //caso 11
            if((parseFloat(obj_x2) > parseFloat(air_x2)) && (parseFloat(obj_x1) < parseFloat(air_x1)) && (parseFloat(obj_y2) > parseFloat(air_y2))) {
                gameOver($(this));
            }
            //caso 12
            if((parseFloat(obj_x2) < parseFloat(air_x2)) && (parseFloat(obj_x1) > parseFloat(air_x1)) && (parseFloat(obj_y2) < parseFloat(air_y2))) {
                gameOver($(this));
            }
       }
       if(parseFloat(obj_y1) > parseFloat(palcoHeight)) {
           $(this).remove();
           criaLinhaObstaculos();
       } 
    });
    $('#obstaculos').animate({bottom:'-=10%'}, 200, function(){
        rolagemObstaculo();
    });
}

function gameOver(elemento){
    
    var objWidth = elemento.children('img').css('width').replace('px','');
    var objHeight = elemento.children('img').css('height').replace('px','');
    var obj_x1 = elemento.children('img').offset().left; 
    var obj_x2 = parseFloat(obj_x1)+parseFloat(objWidth);
    var obj_y1 = elemento.children('img').offset().top; 
    var obj_y2 = parseFloat(obj_y1)+parseFloat(objHeight);
    
    elemento.addClass('crash');
    alert('game over');
    alert("X: "+obj_x1+" - "+obj_x2+" e Y: "+obj_y1+" - "+obj_y2);
    alert("X: "+air_x1+" - "+air_x2+" e Y: "+air_y1+" - "+air_y2);
}