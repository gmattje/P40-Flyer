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
var deslocamento = 'desligado';
var altitude = 0;
var maxMovDireita = 0;
var maxMovEsquerda = 0;
var movimentacao = 0; //mover em pixel a cada interação
var velocidadeMovimentacao = 0;
var movendoAirplane = false;
var velocidade = 0;
var modeloAviao = 'P-40';

//avião P-40
switch (modeloAviao){
    case 'P-40':
    movimentacao = parseFloat(15);
    velocidadeMovimentacao = parseFloat(20);
    break;
    case 'Boing':
    movimentacao = parseFloat(5); 
    velocidadeMovimentacao = parseFloat(20);
    break;
    case 'Caça':
    movimentacao = parseFloat(10); 
    velocidadeMovimentacao = parseFloat(10);
    break;
}

//objetos
var objects = new Array();
var objectsMaximos = new Array();
var encontroX = false;
var encontroY = false;

//colisoes
var colisoes = 0;

//vidas
var vidas = 0;

//pontuacao
var pontos = 0;

//se jogo está rolando
var varPlay = false;

//função de inicialização
function init(qtdVidas, valorVelocidade){
    //setando vidas
    vidas = qtdVidas;
    for(var i=1;i<=vidas;i++){
        $('<div>').prependTo('#vidas').addClass('vida').attr('id','vida_'+i);
    }
    //setando velocidade
    velocidade = valorVelocidade;
    //recupera dados dos possíveis obstáculos
    dadosObjetos();
    //calculando dados do avião
    dadosAviao();
    //primeira linha de obstáculos
    criaLinhaObstaculos(3);
}

function play(){
    if(varPlay == false) {
        varPlay = true;
        $('#panelPause').css('display','none');
        muted(false);
        if(deslocamento == 'desligado') {
            ligaAviao();
            var aguardar = "4000";
        } else {
            var aguardar = "0";
        }
        setTimeout(function(){
            //potuação
            timerPontuacao = setInterval('pontuacao(5)', ((velocidade*10)/4));
            //cria linha obstaculos
            timerCriaObstaculos = setInterval('criaLinhaObstaculos(1)', (velocidade*6));    
            //rolagem obstaculos
            timerRolaObstaculos = setInterval('rolagemObstaculos()', velocidade);
            //controle colisao
            timerControleColisao = setInterval('controleColisao()', velocidade);            
        }, aguardar);       
    }
}

function pause(){
    if((varPlay == true) && (aviaoAutorizaPausar() == true)) {
        varPlay = false;
        $('#panelPause').css('display','block');
        muted(true);
        clearInterval(timerPontuacao);
        clearInterval(timerCriaObstaculos);
        clearInterval(timerRolaObstaculos);
        clearInterval(timerControleColisao);        
    }
}

function muted(status){
    document.getElementById('audio-p40-partida').muted = status;
    document.getElementById('audio-p40-subindo').muted = status;
    document.getElementById('audio-p40-voando').muted = status;
    document.getElementById('audio-p40-explosao').muted = status;
}

function restart(confirmacao){
    if(confirmacao == true) {
        if(confirm('Deseja realmente reiniciar?')) { 
            window.location.reload(true);
        }
    } else { 
        window.location.reload(true);
    }
}

//funções para cada tecla do teclado
$(document).keydown(function(e){
    
    //tecla r - restart
    if(e.keyCode == 82) {
        restart(true);
    }
    
    //tecla esc
    if (e.keyCode == 27) {
        pause();
    }
    
    //tecla cima
    if (e.keyCode == 38) {
        frente();
    }
    
    //tecla baixo
    if (e.keyCode == 40) {
        play();
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
}

//dados sobre avião
function dadosAviao(){
    airplaneWidth = $('#airplane').css('width').replace('px','');
    airplaneHeight = $('#airplane').css('height').replace('px','');
    air_x1 = $('#airplane').offset().left;
    air_x2 = air_x1+parseFloat(airplaneWidth);
    air_y1 = $('#airplane').offset().top;
    air_y2 = air_y1+parseFloat(airplaneHeight);
    tamanhoPassagem = parseFloat(airplaneWidth)+parseFloat(airplaneWidth*(50/100));
    maxMovDireita = parseFloat(parseFloat(parseFloat(palcoWidth/2)-parseFloat(airplaneWidth/2))-parseFloat(airplaneWidth/2));
    maxMovEsquerda = parseFloat("-"+(parseFloat(parseFloat(palcoWidth/2)-parseFloat(airplaneWidth/2))+parseFloat(airplaneWidth/2)));
}

function aviaoAutorizaPausar(){
    var autoriza = true;
    if(altitude == 0) {
        autoriza = false;
    }
    return autoriza;
}

function ligaAviao(){  
    frente();
    document.getElementById('audio-p40-partida').play();
    setTimeout(function(){
        decolaAviao(); 
    }, 4000);
}

function decolaAviao(){
    altitude = 10;
    document.getElementById('audio-p40-subindo').play();
    setTimeout(function(){
       voando();        
    }, 13000);
}

function voando(){
    altitude = 1000;
    document.getElementById('audio-p40-voando').play();
    setInterval(function(){
        document.getElementById('audio-p40-voando').currentTime = 0;
    }, 4318);
}

function explodeAviao(){
    document.getElementById('audio-p40-voando').pause();
    document.getElementById('audio-p40-explosao').play();    
    $('#airplaneContent').removeClass('frente').removeClass('esquerda').removeClass('direita').addClass('explosion');
    $('#airplaneContent #airplanePropeller').css("display","none");
    $('#airplaneContent #airplaneSmoke').css("display","none");
    $('#airplaneContent #airplaneFire').css("display","none");
}

//movimentação avião para esquerda
//function esquerda(){
//    if(movendoAirplane == false) {
//        //testa se a próxima será maior ou igual a máxima
//        var marginAtual = $('#airplane').css('margin-left');
//        marginAtual = parseFloat(marginAtual.replace('px',''));
//        if((marginAtual-movimentacao) >= maxMovEsquerda){
//            movendoAirplane = true;
//            $('#airplane').animate({marginLeft:'-='+movimentacao+'px'}, 0, function(){
//                 movendoAirplane = false;
//                 posicaoAbsolutaAirplane(esquerda);
//            });
//        }        
//    }
//}

function esquerda(){
    if((varPlay == true) && (altitude >= 10)){
        if(deslocamento == 'direita') {
            frente();
        } else {
            deslocamento = 'esquerda';
            $('#airplaneContent').removeClass('frente').addClass('esquerda');
            deslocaEsquerda();
        }
    }
}

function deslocaEsquerda(){
    if(varPlay == true && movendoAirplane == false) {
        if(deslocamento == 'esquerda') {
            //testa se a próxima será maior ou igual a máxima
            var marginAtual = $('#airplaneContent').css('margin-left');
            marginAtual = parseFloat(marginAtual.replace('px',''));
            if((marginAtual-movimentacao) >= maxMovEsquerda){
                movendoAirplane = true;
                $('#airplaneContent').animate({marginLeft:'-='+movimentacao+'px'}, velocidadeMovimentacao, function(){
                     movendoAirplane = false;
                     deslocaEsquerda();
                     posicaoAbsolutaAirplane();
                });
            } else {
                frente();
            }
        } else {
            return false;
        }
    }
}

//movimentação avião para direita
//function direita(){
//    if(movendoAirplane == false) {
//        //testa se a próxima será menor que a máxima
//        var marginAtual = $('#airplane').css('margin-left');
//        marginAtual = parseFloat(marginAtual.replace('px',''));
//        if((marginAtual+movimentacao) < maxMovDireita){
//            movendoAirplane = true;
//            $('#airplane').animate({marginLeft:'+='+movimentacao+'px'}, 0, function(){
//                 movendoAirplane = false;
//                 posicaoAbsolutaAirplane(direita);
//            });
//        }        
//    }
//}

function direita(){
    if((varPlay == true) && (altitude >= 10)){
        if(deslocamento == 'esquerda') {
            frente();
        } else {            
            deslocamento = 'direita';
            $('#airplaneContent').removeClass('frente').addClass('direita');
            deslocaDireita();
        }
    }
}

function deslocaDireita(){
    if(varPlay == true && movendoAirplane == false) {
        if(deslocamento == 'direita') {
            //testa se a próxima será menor que a máxima
            var marginAtual = $('#airplaneContent').css('margin-left');
            marginAtual = parseFloat(marginAtual.replace('px',''));
            if((marginAtual+movimentacao) < maxMovDireita){
                movendoAirplane = true;
                $('#airplaneContent').animate({marginLeft:'+='+movimentacao+'px'}, velocidadeMovimentacao, function(){
                     movendoAirplane = false;
                     deslocaDireita();
                     posicaoAbsolutaAirplane();
                });
            } else {
                frente();
            }
        } else {
            return false;
        }
    }
}

function frente(){
    if(varPlay == true){
        deslocamento = 'frente';
        $('#airplaneContent').removeClass('esquerda').removeClass('direita').addClass('frente');
    }
}

//function posicaoAbsolutaAirplane(direcao){
//    if(direcao == esquerda) {
//        air_x1 = air_x1-movimentacao;
//        air_x2 = parseFloat(air_x1)+parseFloat(airplaneWidth);
//    } else if (direcao == direita) {
//        air_x1 = air_x1+movimentacao;
//        air_x2 = parseFloat(air_x1)+parseFloat(airplaneWidth);
//    }    
//    //air_y1 = $('#airplane').offset().top;
//    //air_y2 = parseFloat(air_y1)+parseFloat(airplaneHeight);
//}

function posicaoAbsolutaAirplane(){
    air_x1 = $('#airplane').offset().left;
    air_x2 = parseFloat(air_x1)+parseFloat($('#airplane').css('width').replace('px',''));    
    //air_y1 = $('#airplane').offset().top;
    //air_y2 = parseFloat(air_y1)+parseFloat(airplaneHeight);
}

//criando linhas de obstáculos aleatórios
function criaLinhaObstaculos(quantidade){       
    
    //cria quantas linhas foram solicitadas
    for(var i=0; i<quantidade; i++) {
    
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
                    $('#obj'+indexElemento).clone().appendTo(novaLinha).css('margin-left',inicioAletorio).removeClass('crash').addClass('object');
                }
                primeiroElemento = false;
            } else {
                tamMax = tamMax-tamanhoPassagem-objects[indexElemento];
                if(tamMax >= 0) {
                    $('#obj'+indexElemento).clone().appendTo(novaLinha).css('margin-left',tamanhoPassagem).removeClass('crash').addClass('object');
                }
            }        
        }
    
    }
    
    $('#obstaculos').children('<div>:last').remove();
    
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
function rolagemObstaculos(){
    $('#obstaculos').animate({bottom:'-=10%'}, velocidade);
}

function controleColisao(){
    $('.linha').each(function(){
        if($(this).offset().top >= 0 && $(this).offset().top < palcoHeight) {
            $(this).children('.object').each(function(){
                var objWidth = $(this).children('img').css('width').replace('px','');
                var objHeight = $(this).children('img').css('height').replace('px','');
                var obj_x1 = $(this).children('img').offset().left; 
                var obj_x2 = parseFloat(obj_x1)+parseFloat(objWidth);
                var obj_y1 = $(this).children('img').offset().top; 
                var obj_y2 = parseFloat(obj_y1)+parseFloat(objHeight);
                if($(this).attr('class') != "crash") {
                if(parseFloat(obj_y2) > parseFloat(air_y1)) {
                    //caso batida na esquerda
                    if((parseFloat(obj_x2) > parseFloat(air_x1)) && (parseFloat(obj_x1) < parseFloat(air_x1)) && (parseFloat(obj_y2) <= parseFloat(air_y2))) {
                        colidiu($(this));                
                    }
                    //caso batida toda esquerda
                    else if((parseFloat(obj_x2) > parseFloat(air_x1)) && (parseFloat(obj_x1) < parseFloat(air_x1)) && (parseFloat(obj_y1) > parseFloat(air_y1))) {
                        colidiu($(this));                
                    }
                    //caso batida na direia
                    else if((parseFloat(obj_x2) > parseFloat(air_x2)) && (parseFloat(obj_x1) < parseFloat(air_x2)) && (parseFloat(obj_y2) <= parseFloat(air_y2))) {
                        colidiu($(this)); 
                    }
                    //caso batida toda direita
                    else if((parseFloat(obj_x2) > parseFloat(air_x2)) && (parseFloat(obj_x1) < parseFloat(air_x2)) && (parseFloat(obj_y1) > parseFloat(air_y1))) {
                        colidiu($(this));                
                    }
                    //caso batida em todo obstáculo
                    else if((parseFloat(obj_x2) < parseFloat(air_x2)) && (parseFloat(obj_x1) > parseFloat(air_x1)) && (parseFloat(obj_y2) < parseFloat(air_y2))) {
                        colidiu($(this)); 
                    }
                }
                }
                if(parseFloat(obj_y1) > parseFloat(palcoHeight)) {
                    
                } 
            }); 
        }
    })
     
}

function colidiu(elemento){
    //confere novamente se objato já não tinha sido atingido
    if(elemento.attr('class') != "crash") {
        colisoes++;
        elemento.removeClass('object').addClass('crash');         
        $('#vida_'+colisoes).addClass('off');
        pontuacao(-20); 
        
        if(colisoes >= vidas) {
            gameOver();
        } else {        
            //pisca com jquery-ui
            $("#airplaneContent").effect('pulsate', {}, 500);

            if(vidas-colisoes <= 3) {
                $('#airplaneContent #airplaneSmoke').css("display","block");
            } else {
                $('#airplaneContent #airplaneSmoke').css("display","none");
            }
            if(vidas-colisoes <= 2) {
                $('#airplaneContent #airplaneFire').css("display","block");
            } else {
                $('#airplaneContent #airplaneFire').css("display","none");
            }
        }        
    }      
}

function pontuacao(valor){
    pontos = pontos + valor;
    if(pontos < 0) {
        pontos = 0;
    }
    exibePontuacao();
    //se perdeu pontos
    if(valor < 0) {
        exibePontuacaoNegativa(valor);
    }
}

function exibePontuacaoNegativa(valor){
    if(valor < 0) {
        var perdeuPonto = $('<div>').appendTo('#palco').addClass('pontoNegativo').html(valor);
        perdeuPonto.css('bottom','0px');
        perdeuPonto.animate({bottom:palcoHeight}, 2000, function(){
            perdeuPonto.remove();
        });
    }
}

function exibePontuacao(){
    $('#pontos').html(pontos+" Pontos");
}

function gameOver(){    
    explodeAviao();
    alert('GAME OVER - Você fez '+pontos+' pontos.');
    restart(false);
}