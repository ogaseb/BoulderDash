
function eventsContainer() {
    // highscore()
    startGameLoop()
    time = document.getElementById('time')
    
    document.getElementById('life').innerHTML = zycie
    document.getElementById("overall_score").innerHTML = '000000'
    map_wczytaj(document.getElementById("level").value)
    document.getElementById("wczytaj").style.display = 'none'
    document.getElementById("start").addEventListener("click", startgame);
    document.getElementById("suicide").addEventListener("click", gameover);
    document.getElementById("bricks").addEventListener("mouseover", edytor);
    document.getElementById("bricks").addEventListener("mouseup", function (){
        edycja = false
    });
    document.getElementById("bricks").addEventListener("mousedown", function(event){
        edycja = true
        edytor(event)
    })
    document.getElementById("levels").addEventListener("click", function (event) {
        if (document.getElementById("admin_tools").checked == false) {
            alert('STAY DETERMINED!')
            event.preventDefault()
        }      
    })
    document.getElementById("levels").addEventListener("change", function (event) {
        if (document.getElementById('levels').value) {
            _poziom_ = document.getElementById('levels').value
            map_wczytaj(document.getElementById("level").value)
        }
    })
    document.getElementById("zapisz").addEventListener("click", function () {
        document.getElementById("level").value = map_zapisz() 
    })
    document.getElementById("wczytaj").addEventListener("click", function () {
        document.getElementById("overall_score").innerHTML = '000000'
        map_wczytaj(document.getElementById("level").value)
    })
    document.getElementById("pauza").addEventListener("click", function () {
        restart = true

        bricks.style.opacity = 0.5 ;
    })
    document.getElementById("coin_score").addEventListener("click", function () {
        document.getElementById("admin_tools").checked = true
        admin_tool()
    })
    admin_tool()
    document.getElementById("admin_tools").addEventListener("change", admin_tool)  
}
var edycja, restart;
var next_lifeup = 500;
var currentlyPressedKey;
var is_active;
var zycie = 3;
var player_can_walk = true;
var poz_gracza_x = 0;
var poz_gracza_y = 0;
Object.defineProperty(window, '_poziom_', {
        get: function() { // wczytuje wartość zmiennej _poziom_ bezpośrednio z HTML
            return Number(document.getElementById('levels').value)
        },
        set: function (value) { // zapisuje nowy poziom do HTML
            document.getElementById('levels').value = value
        }
    }
)
function startGameLoop() {
    setInterval(move, 115);
}
//ta funkcja na dole jest do tworzenai mapek
function startgame() {
    makeLevel();
    //map_wczytaj()
    document.getElementById("coin_score").innerHTML = 0
    document.getElementById("overall_score").innerHTML = '000000'
    document.getElementById('time').innerHTML = Infinity
};
function makeLevel() {
    restart = true
    width = document.getElementById('szerokosc_plansza').value
    heigth = document.getElementById('wysokosc_plansza').value
    document.getElementById("coin_score").innerHTML = 0
    var bricks = document.getElementById('bricks')
    bricks.style.width = 20 * heigth+ 'px'
    bricks.style.height = 20 * width + 'px'
    bricks.innerHTML = ''
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < heigth; j++) {
            
            var bri = document.createElement("bri"); 
            bricks.appendChild(bri)

            bri.style.opacity = 0
            bri.style.top= i * 20+ "px"
            bri.style.left= j * 20+"px"
            bri.id = i + "_" + j
            bri.className = 'dirt'
        }

    } 
    var random = Array.from(document.getElementsByTagName("bri"))
    shuffle(random)
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
    var i = random.length -1
    var interval_scoreboard = setInterval(function () {
        if ( i >= 0) {
            random[i].style.opacity = '1'
            random[i-1].style.opacity = '1'
            i -= 2
            player_can_walk = false
            document.getElementById("scoreboard2").style.display = 'flex'
            document.getElementById("scoreboard").style.display = 'none'
        } else {
            //var poz = document.querySelector('.gracz').id.split('_')
            player_can_walk = true
            document.getElementById("scoreboard2").style.display = 'none'
            document.getElementById("scoreboard").style.display = 'flex'
            clearInterval(interval_scoreboard)
            restart = false
                    
        }
    }, 6)

    

    bri = document.getElementById(poz_gracza_x + '_' + poz_gracza_y);
    bri.className = 'gracz'
}
function kolizja(bri) {
    switch (bri.className) {
        case "dirt":
            var snd = new Audio("audio/dirt.ogg"); // buffers automatically when created
            snd.play();
            snd.volume = 0.04
            return true;
            break;
        case "czysto":
            var snd = new Audio("audio/czysto.ogg"); // buffers automatically when created
            snd.play();
            snd.volume = 0.04
            return true;
            break;
        case "stone":
            
            var pos_kam = bri.id.split('_')
            var po_prawej = document.getElementById(pos_kam[0] + '_' + (Number(pos_kam[1]) + 1))
            var po_lewej = document.getElementById(pos_kam[0] + '_' + (Number(pos_kam[1]) - 1))
            var gracz_nadole = document.getElementById((Number(pos_kam[0])+1) + '_' + pos_kam[1]) || {className: ''}
            var gracz_nagorze = document.getElementById((Number(pos_kam[0]) - 1) + '_' + pos_kam[1]) || { className: '' }

            if (gracz_nadole.className == 'gracz' || gracz_nagorze.className == 'gracz') {
                return false;
            }

            if (po_prawej.className == 'czysto') {
                po_prawej.className = 'stone'
                return true;
            }
            
            if (po_lewej.className == 'czysto') {
                po_lewej.className = 'stone'
                return true;
            }
            return false;
            break;
        case "coin":
            var snd = new Audio("audio/coin.ogg"); // buffers automatically when created
            snd.play();
            snd.volume = 0.04
            document.getElementById("coin_score").innerHTML++        
            document.getElementById("overall_score").innerHTML = zeroes(Number(document.getElementById("overall_score").innerHTML) + Number(pkt_coin.innerHTML), 6)
            var coin_score = document.getElementById('coin_score')
            lifeup()
            //funkcja dodająca zera do wyniku
            function zeroes(n, width, z) {
                z = z || '0';
                n = n + '';
                return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
            }
            
            if (document.getElementById("coin_score").innerHTML == Number(document.getElementById('required_coins').innerHTML)) {
                document.documentElement.style.backgroundColor = 'white'
                setTimeout(function () { document.documentElement.style.backgroundColor = 'black' }, 250)

                var snd = new Audio("audio/teleport1.ogg"); // buffers automatically when created
                snd.play();
                snd.volume = 0.04
                
                switch (_poziom_) {
                    case 1:
                        if (coin_score.innerHTML == '12') {
                            pkt_coin.innerHTML = '15'
                           // document.getElementById('coin_img').innerHTML = '<img style="display:inline" src="tekstures/coin.gif" /><img style="display:inline" src="tekstures/coin.gif" /><img style="display:inline" src="tekstures/coin.gif" />'
                            //document.getElementById('required_coins').innerHTML = document.getElementById('pkt_coin').innerHTML
                           // document.getElementById('pkt_coin').innerHTML = ' '
                            
                        }
                        document.getElementById('16_38').className = 'teleport'
                        break
                    case 2:
                        if (coin_score.innerHTML = '10') {
                            pkt_coin.innerHTML = '15'

                        }
                        document.getElementById('20_18').className = 'teleport'
                        break
                    case 3:
                        if (coin_score.innerHTML == '24') {
                            pkt_coin.innerHTML = '00'
                        }
                        document.getElementById('18_39').className = 'teleport'
                        break
                    case 4:
                        if (coin_score.innerHTML == '36') {
                            pkt_coin.innerHTML = '20'
                        }
                        document.getElementById('20_38').className = 'teleport'
                        break
                    case 5://bonus lvl1
                        if (coin_score.innerHTML == '6') {
                            pkt_coin.innerHTML = '00'
                        }
                        document.getElementById('10_18').className = 'teleport'
                        break
                    case 6:
                        if (coin_score.innerHTML == '4') {
                            pkt_coin.innerHTML = '90'
                        }
                        document.getElementById('20_39').className = 'teleport'
                       
                        break
                    case 7:
                        if (coin_score.innerHTML == '4') {
                            pkt_coin.innerHTML = '60'
                        }
                        document.getElementById('18_38').className = 'teleport'
                        
                        break
                    case 8:
                        if (coin_score.innerHTML == '15') {
                            pkt_coin.innerHTML = '20'
                        }
                        document.getElementById('5_39').className = 'teleport'
                       
                        break
                    case 9:
                        if (coin_score.innerHTML == '10') {
                            pkt_coin.innerHTML = '20'
                        }
                        document.getElementById('3_0').className = 'teleport'                       
                        break
                    case 10://bonus lvl 2                    
                        if (coin_score.innerHTML == '16') {
                            pkt_coin.innerHTML = '00'
                        }
                        document.getElementById('3_0').className = 'teleport'
                        break
                    case 11:
                        if (coin_score.innerHTML == '75') {
                            pkt_coin.innerHTML = '10'
                        }
                        break
                    case 12:
                        if (coin_score.innerHTML == '12') {
                            pkt_coin.innerHTML = '60'
                        }
                        document.getElementById('20_39').className = 'teleport'                       
                        break
                    case 13:
                        if (coin_score.innerHTML == '6') {
                            pkt_coin.innerHTML = '00'
                        }
                        document.getElementById('15_38').className = 'teleport'                                              
                        break
                    case 14:
                        if (coin_score.innerHTML == '19') {
                            pkt_coin.innerHTML = '00'
                        }
                        document.getElementById('20_39').className = 'teleport'                                             
                        break
                    case 15://bonus lvl 3                                             
                        if (coin_score.innerHTML == '14') {
                            pkt_coin.innerHTML = '15'
                        }
                        document.getElementById('20_39').className = 'teleport'
                        break
                    case 16:
                        if (coin_score.innerHTML == '50') {
                            pkt_coin.innerHTML = '8'
                        }
                        document.getElementById('1_10').className = 'teleport'                                                                     
                        break
                    case 17:
                        if (coin_score.innerHTML == '30') {
                            
                            pkt_coin.innerHTML = '10'
                        }
                        document.getElementById('18_38').className = 'teleport'                                               
                        break
                    case 18:
                        if (coin_score.innerHTML == '15') {
                            pkt_coin.innerHTML = '20'
                        }
                        document.getElementById('20_39').className = 'teleport'
                        break
                    case 19:
                        if (coin_score.innerHTML == '12') {
                            pkt_coin.innerHTML = '20'
                        }
                        document.getElementById('2_39').className = 'teleport'
                        break
                    case 20: //bonus lvl 4
                        if (coin_score.innerHTML == '6') {
                            pkt_coin.innerHTML = '00'
                        }
                        document.getElementById('2_39').className = 'teleport'
                        break
                }
            }
            return true;
            break;
        case "enemy":
            break;
        case "obsidian":
            return false
            break;
        case "cobble":
            return false
            break;           
        case "teleport":
            restart = true
            var snd = new Audio("audio/teleport.ogg"); // buffers automatically when created
            snd.play();
            snd.volume = 0.04
            
            var score = document.getElementById('overall_score')
            
            var interval = setInterval(function () {
                if (time.innerHTML > 0) {
                    player_can_walk = false // YOU SHALL NOT PASS HERE TOO
                    score.innerHTML = zeroes(Number(score.innerHTML) + 1, 6)         
                    time.innerHTML--
                    lifeup()
                    //score.innerHTML++
                } else {
                    clearInterval(interval)
                    map_wczytaj(document.getElementById("level").value)
                    //alert("poziom " + _poziom_ + "!")
                    
                }
            }, 28)
            _poziom_++
            
            return true;
            break;
        case "explosion":
            return true
            break
    }
}

var pressedKey = new Set
function registerKey(event) {
    currentlyPressedKey = event.which;
    pressedKey.add(event.which)
    //console.log('keydown' + event.which)
}

function releaseKey(event) {
    //console.log('keyup' + event.which)
   
    pressedKey.delete(event.which)
    if (pressedKey.size == 0) {
        currentlyPressedKey = null;
    }
}
function move(event){
    var key = currentlyPressedKey
    //console.log(currentlyPressedKey)
    if (player_can_walk == false) {
        return
    }
    //87 - w , 83 -s, 65 -a, 68 - d
    switch (key){
        case 87:
            document.querySelector('.gracz').style.backgroundImage = ''
            var nowy_x = poz_gracza_x -1; 
            var nowy_y = poz_gracza_y - 0;
            bricks.style.opacity = 1;
            var czy_isc = true;
            restart = false
            break;
        case 83:
            document.querySelector('.gracz').style.backgroundImage = ''
            var nowy_x = poz_gracza_x +1; 
            var nowy_y = poz_gracza_y - 0;
            bricks.style.opacity = 1;
            var czy_isc = true;
            restart = false
            break;
        case 65:
            document.querySelector('.gracz').style.backgroundImage = ''
            var player_teksture = 'url(tekstures/player_left.gif)'
            var nowy_x = poz_gracza_x - 0; 
            var nowy_y = poz_gracza_y - 1;
            bricks.style.opacity = 1;
            var czy_isc = true;
            restart = false
            break;
        case 68:
            document.querySelector('.gracz').style.backgroundImage = ''
            var player_teksture = 'url(tekstures/player_right.gif)'
            var nowy_x = poz_gracza_x - 0;
            var nowy_y = poz_gracza_y + 1;
            bricks.style.opacity = 1;
            var czy_isc = true;
            restart = false
            break;
        case 38://strzałki
            document.querySelector('.gracz').style.backgroundImage = ''
            var nowy_x = poz_gracza_x - 1;
            var nowy_y = poz_gracza_y - 0;
            bricks.style.opacity = 1;
            var czy_isc = false;
            break;
        case 40:
            document.querySelector('.gracz').style.backgroundImage = ''
            var nowy_x = poz_gracza_x + 1;
            var nowy_y = poz_gracza_y - 0;
            bricks.style.opacity = 1;
            var czy_isc = false;
            break;
        case 37:
            document.querySelector('.gracz').style.backgroundImage = 'url(tekstures/player_left.gif)'
           
            
            var nowy_x = poz_gracza_x - 0;
            var nowy_y = poz_gracza_y - 1;
            bricks.style.opacity = 1;
            var czy_isc = false;
            break;
        case 39:
            
            document.querySelector('.gracz').style.backgroundImage = 'url(tekstures/player_right.gif)'
            var nowy_x = poz_gracza_x - 0;
            var nowy_y = poz_gracza_y + 1;
            bricks.style.opacity = 1;
            var czy_isc = false;
            break;
        case 27:
            restart = true
            break

        default:

            //console.log(key)
            return;
            break;
    }
    //event.preventDefault()
    
        var _bri = document.getElementById(nowy_x + '_' + nowy_y)
        if (_bri != null && kolizja(_bri)) {
            if (czy_isc) {
                _bri.className = 'gracz'
                _bri.style.backgroundImage = player_teksture || ''
                var star_poz = document.getElementById(poz_gracza_x + '_' + poz_gracza_y)

                star_poz.className = 'czysto';

                poz_gracza_y = nowy_y;
                poz_gracza_x = nowy_x;
            } else {
                _bri.className = 'czysto'
            }
        }
 
}
function edytor(event){
    if(event.target!==event.currentTarget && edycja && document.getElementById("admin_tools").checked) {  // MAGICZNY IF
        var objekciki = document.getElementById('objekciki').value
        event.target.className = objekciki; 
    }
}

setInterval (spadaj, 150)
function spadaj() {
    if (restart) {
        return
    };
    var gracz = document.querySelector(".gracz")
    var kamienie_monety = document.querySelectorAll(".stone, .coin, .cobble")
     magic_cobble = document.querySelectorAll(".magic_cobble")
  

    for (var j = magic_cobble.length - 1; j >= 0; j--) {
     
        var mag_cob = magic_cobble[j] 
        var poz_mag_kamien = mag_cob.id.split('_')
        
        var mag_nad = document.getElementById(Number(poz_mag_kamien[0]) - 1 + '_' + poz_mag_kamien[1]) || { }
        var mag_pod = document.getElementById(Number(poz_mag_kamien[0]) + 1 + '_' + poz_mag_kamien[1]) || { }
        var mag_lewo = document.getElementById(poz_mag_kamien[0]+ '_' + (Number(poz_mag_kamien[1]) - 1) )|| {}
        var mag_prawo = document.getElementById(poz_mag_kamien[0] + '_' + (Number(poz_mag_kamien[1]) + 1)) || { }
        
        window.aktywuj_mag_el = function(el) { 
            is_active = true
            //el.style.background = 'yellow'
            //var all = el.querySelectorAll('.magic_cobble') 
            for (var i = 0; i < magic_cobble.length; i++) {
                magic_cobble[i].style.backgroundImage = 'url(tekstures/magic_stone.gif)'
            };
        }
        
        window.deaktywuj_mag_el = function(el) {
            
            is_active = false
            //var all = magic_cobble.querySelectorAll('.af_magic_cobble') 
            for (var i = 0; i < magic_cobble.length; i++) {
                magic_cobble[i].className = 'cobble'
                magic_cobble[i].style.background = ''
            };
           
        }
        
        if (mag_nad.className == 'stone' && ( mag_nad.leci || is_active) && mag_pod.className == 'czysto'){
            if (_poziom_ == 9) {
                var czas = 20000
            }
            if (_poziom_ == 18 || _poziom_ == 20) {
                var czas = 10000
            }
            if (_poziom_ == 19) {
                var czas = 25000
            }
            if (_poziom_ == 20) {
                var czas = 25000
            }
            aktywuj_mag_el(mag_cob)
            setTimeout(deaktywuj_mag_el, czas, mag_cob) 
            if (is_active) {
                mag_nad.className = 'czysto'
                mag_pod.className = 'coin'
            };
            
        }
        else if (mag_nad.className == 'coin' && is_active && mag_pod.className == 'czysto') {
            if (_poziom_ == 9) {
                var czas = 20000
            }
            if (_poziom_ == 18 || _poziom_ == 20) {
                var czas = 10000
            }
            if (_poziom_ == 19) {
                var czas = 25000
            }
            if (_poziom_ == 20) {
                var czas = 25000
            }
            aktywuj_mag_el(mag_cob)
            setTimeout(deaktywuj_mag_el, czas, mag_cob)
            if (is_active) { 
                mag_nad.className = 'czysto'
            mag_pod.className = 'stone'};
           
        }
    }
    for (var i = kamienie_monety.length - 1; i >= 0; i--) {
        // because we dont want mess with gravity
        // making its working for fuck sake!!! DONT TOUCH IT! YOU!!!!!!
        if (player_can_walk == false) {
            return
        }
        //if (restart) {   
        //    return
        //}
        var gra = gracz
        var poz_gra = gra.id.split('_');
        var kam = kamienie_monety[i]
        var poz  = kam.id.split('_');//dzieli id na dwie zmienne
        //wybieranie id elementu ponizej
        var pod = document.getElementById(Number(poz[0]) + 1 + '_' + poz[1]) || { className: '' } 

        
        if (kam.className != 'stone' && kam.className != 'coin') {
            continue    
        }
        
        //funkcja losujaca w ktora stronie spadnie kamien                                                       
        var x = [1, -1]
        function random(x){
            return x[Math.floor(x.length * Math.random())]
        }
        var rand_x = random(x)
        //wybieranie id dla kamienia spadajacego z kamienia
        var kam_obok = document.getElementById(poz[0] + '_' + ((Number(poz[1]) + rand_x)))
        var kam_obok_nad = document.getElementById((Number(poz[0]) - 1) + '_' + ((Number(poz[1]) + rand_x)))
        var kam_obok_pod = document.getElementById((Number(poz[0]) + 1) + '_' + ((Number(poz[1]) + rand_x)))
        // sprawdzanie nad kamienie_monetym
        var kam_nagorze = document.getElementById((Number(poz[0]) - 1) + '_' + poz[1]) || { className: '' }
        //spadanie kamienia gdy jest w powietrzu
        if (pod.className == 'czysto') {
            if (kam.className == 'coin') {
                var _rand_sound_ = Math.floor((Math.random() * 2) + 1);
                switch(_rand_sound_){
                    case 1:
                        var snd = new Audio("audio/coin_fall1.ogg"); // buffers automatically when created
                        snd.play();
                        snd.volume = 0.04
                        break
                    case 2:
                        var snd = new Audio("audio/coin_fall2.ogg"); // buffers automatically when created
                        snd.play();
                        snd.volume = 0.04
                        break
                }
                
            }
            pod.className = kam.className;
            pod.leci= true
            kam.className = 'czysto'
            
            continue
        }
        //spadanie kamienia z kamienia
        if (kam_obok != null && kam_obok.className == 'czysto' && (kam_nagorze.className == 'stone' || kam_nagorze.className == 'coin') && kam_obok_nad.className == 'czysto') {
            kam_obok_nad.className = kam_nagorze.className;
            kam_nagorze.className = 'czysto' 
        }
        else if (pod.className == 'cobble' && kam_obok_pod.className == 'czysto' && kam_obok.className == "czysto") {
            kam_obok.className = kam.className
            kam.leci = true
            kam.className = 'czysto'
        }
        //smierc gracza przy spadaniu kamienia, nie gdy jest pod nim
        
        if (pod.className != 'czysto' && kam.leci == true && kam.className != 'coin') {
            var snd = new Audio("audio/stone.ogg"); // buffers automatically when created
            
            snd.play();
            snd.volume = 0.03
            }
        
        if (kam.leci) {
            if (pod.className == 'gracz' ) {
                
                coin_explosion(pod.id.split('_'), 'czysto')
                gameover()
                kam.leci = false
            }
            
            else if (pod.className == 'butterfly')  {

                coin_explosion(pod.id.split('_'), 'coin')
            }
            else if (pod.className == 'firefly') {
                coin_explosion(pod.id.split('_'), 'czysto')
            }
        }

        if (pod.className != 'czysto') {
            kam.leci = false
        }
    };  
}
function Position(y, x) {
    this[0] = Number(y)
    this[1] = Number(x)
}
Position.prototype = {
    add:function(other){
        return new Position(this[0] + Number(other[0] || 0), this[1] + Number(other[1] || 0))
    },
    get:function(){
        return document.getElementById(this[0] + '_' + this[1])
    }
}
setInterval(enemy, 150)
function enemy() {
    if (restart) { return }
    var allenemy = document.querySelectorAll('.firefly, .butterfly')
    for (var i = allenemy.length - 1; i >= 0; i--) {
        enemy_wall(allenemy[i])
    }
}

function move_one(enemy, direction) {
    var enemy_poz = enemy.id.split('_')
    var new_position = (new Position(enemy_poz[0], enemy_poz[1])).add(direction).get()
    if (new_position.className == 'czysto') {
        new_position.className = enemy.className
        enemy.className = 'czysto'
        return new_position
    }
    else if (new_position.className == 'gracz') {
        coin_explosion(new_position.id.split('_'), 'czysto')
        gameover()
    }
    else if (new_position.className == 'bio_mass') {
        if (enemy.className == 'firefly') {
            coin_explosion(enemy_poz, 'czysto')
        }
        else if (enemy.className == 'butterfly'){
            coin_explosion(enemy_poz, 'coin')
        }
    }
}

function enemy_wall(enemy) {
    if (enemy.className == 'firefly') {
        var attached_direction = +1
        var blocked_direction = +3
    }
    else if (enemy.className == 'butterfly') {
        var attached_direction = +3
        var blocked_direction = +1
    }
    else {
        throw "cant't move"
    }
    var attached_to = ((enemy.direction || 0) + attached_direction) % 4
    var new_square

    if (new_square = move_one(enemy, dir_to_pos[attached_to])) {
        new_square.direction = attached_to
    }
    else if (new_square = move_one(enemy, dir_to_pos[enemy.direction || 0])) {
        new_square.direction = enemy.direction
    } else {
        enemy.direction = ((enemy.direction || 0) + blocked_direction) % 4
    }
}

var dir_to_pos = [
	new Position(0, 1),
	new Position(-1, 0),
	new Position(0, -1),
	new Position(1, 0)
]

function gameover() {
            
    if (_poziom_ % 5 == 0) {
        _poziom_++
    }
    else {
    document.getElementById('life').innerHTML = zycie - 1
    zycie--
    //alert('umar, zostało ci ' + zycie + ' żyć!')
    
    if (zycie == 0) {
    //     var highscore = document.getElementById("overall_score").innerHTML
    //     swal({
    //           title: "Ranking",
    //           text: "Czy chcesz udostępnić swój wynik?",
    //           type: "input",
    //           showCancelButton: true,
    //           cancelButtonText: "Anuluj",
    //           confirmButtonColor: "green",
    //           confirmButtonText: "Tak, wyślij",
    //           closeOnConfirm: false,
    //           showLoaderOnConfirm: true,
    //           animation: "slide-from-top",
    //           inputPlaceholder: "Twój nick"
    //         },
    //         function(inputValue){
    //           if (inputValue === false) return false;
              
    //           if (inputValue === "") {
    //             swal.showInputError("Musisz coś tu wpisać");
    //             return false
    //           }
    //           setTimeout(function(){
    //                 $.ajax({
    //                     type: "POST",
    //                     url: "http://projekty.propanek.tk/boulderdash/highscore.php",
    //                     data: {
    //                            name: inputValue,
    //                            highscore: highscore
    //                     },
    //                     dataType: 'text',
    //                     success: function (response) {
    //                         alert(response)
    //                         swal("", "zapisałem twój wynik pod nazwą: " + inputValue+"", "success")
    //                         setTimeout(function(){location.href = 'start.html'}, 3000)

    //                         //alert()
    //                     },
    //                     error: function(xhr){
    //                         alert("błąd" + xhr.responseText)
    //                     }
    //                 })
    //             },2000)
    //           //swal("Nice!", "You wrote: " + inputValue, "success");
    //         });
        window.location.href = "/index.html"
            
            
        document.getElementById('getttttttttttt_dunked_on').style.display = 'inline'
        document.getElementById('life').innerHTML = 3
        _poziom_ = 1
        zycie = 3
        next_lifeup = 500
        document.getElementById("overall_score").innerHTML = '000000'
    }
    }
    document.querySelector('.gracz').className = 'explosion'
    player_can_walk = false
    if (document.getElementById('time').innerHTML === '0')
        map_wczytaj(document.getElementById("level").value)
    else {
        setTimeout(map_wczytaj, 3000, document.getElementById("level").value)
    }
}

function coin_explosion(poz_gra, typ) {
    var wokol_gracz = [
        document.getElementById(Number(poz_gra[0]) + '_' + poz_gra[1]) || {},
        document.getElementById(Number(poz_gra[0]) + 1 + '_' + poz_gra[1]) || {},
        document.getElementById(Number(poz_gra[0]) + -1 + '_' + poz_gra[1]) || {},
        document.getElementById(Number(poz_gra[0]) + 1 + '_' + (Number(poz_gra[1]) + 1)) || {},
        document.getElementById(Number(poz_gra[0]) + 1 + '_' + (Number(poz_gra[1]) - 1)) || {},
        document.getElementById(Number(poz_gra[0]) - 1 + '_' + (Number(poz_gra[1]) + 1)) || {},
        document.getElementById(Number(poz_gra[0]) - 1 + '_' + (Number(poz_gra[1]) - 1)) || {},
        document.getElementById(poz_gra[0] + '_' + (Number(poz_gra[1]) + 1)) || {},
        document.getElementById(poz_gra[0] + '_' + (Number(poz_gra[1]) - 1)) || {}
    ]
    document.getElementById(poz_gra[0]+'_'+poz_gra[1]).style.backgroundImage = ''
    for (var i = 0; i < wokol_gracz.length; i++) {
        if (wokol_gracz[i].className == 'gracz') {
            //document.getElementById("coin_score").innerHTML++
        }
        else if (wokol_gracz[i].className != 'obsidian' ) {
            wokol_gracz[i].className = 'explosion'
            
        }

            
    }
    setTimeout(function () {
        for (var i = 0; i < wokol_gracz.length; i++) {

            if (wokol_gracz[i].className == 'gracz') {
                if (typ == 'coin')
                    document.getElementById("coin_score").innerHTML++
            }
            else if (wokol_gracz[i].className == 'obsidian') {
                //emm
            }
            else wokol_gracz[i].className = typ

        }
    }, 600)
}

function map_zapisz() {
    var map = []
    for (var i = 0; i < width; i++) {
        map[i] = []
        for (var j = 0; j < heigth; j++) {
            map[i][j] = document.getElementById(i + "_" + j).className
        }
    }  
    return JSON.stringify(map)
}

function map_wczytaj(s) {
    var required_coins = document.getElementById('required_coins')
    
        pkt_coin = document.getElementById('pkt_coin')
    if (_poziom_ == 21) {
        _poziom_ = 1
    }
    switch (_poziom_) {
        case 1:
            pkt_coin.innerHTML = '10'
            required_coins.innerHTML = '12'            
            break
        case 2:
            pkt_coin.innerHTML = '20'
            required_coins.innerHTML = '10'
            break
        case 3:
            pkt_coin.innerHTML = '15'
            required_coins.innerHTML = '24'
            break
        case 4:
            pkt_coin.innerHTML = '5'
            required_coins.innerHTML = '36'
            break
        case 5:// bonus 1
            pkt_coin.innerHTML = '30'
            required_coins.innerHTML = '6'
            break
        case 6:
            pkt_coin.innerHTML = '50'
            required_coins.innerHTML = '4'
            break
        case 7:
            pkt_coin.innerHTML = '40'
            required_coins.innerHTML = '4'
            break
        case 8:
            pkt_coin.innerHTML = '15'
            required_coins.innerHTML = '10'
            break
        case 9:
            pkt_coin.innerHTML = '10'
            required_coins.innerHTML = '10'
            break
        case 10://bonus 2
            pkt_coin.innerHTML = '10'
            required_coins.innerHTML = '16'
            break
        case 11:
            pkt_coin.innerHTML = '5'
            required_coins.innerHTML = '75'
            break
        case 12:
            pkt_coin.innerHTML = '25'
            required_coins.innerHTML = '12'
            break
        case 13:
            pkt_coin.innerHTML = '6'
            required_coins.innerHTML = '50'
            break
        case 14:
            pkt_coin.innerHTML = '19'
            required_coins.innerHTML = '20'
            break
        case 15:// bonus 3
            pkt_coin.innerHTML = '10'
            required_coins.innerHTML = '14'
            break
        case 16:
            pkt_coin.innerHTML = '5'
            required_coins.innerHTML = '50'
            break
        case 17:
            pkt_coin.innerHTML = '10'
            required_coins.innerHTML = '30'
            break
        case 18:
            pkt_coin.innerHTML = '15'
            required_coins.innerHTML = '10'
            break
        case 19:
            pkt_coin.innerHTML = '12'
            required_coins.innerHTML = '10'
            break
        case 20:// bonus 4
            pkt_coin.innerHTML = '6'
            required_coins.innerHTML = '30'
            break
    }
    
        snd_start = new Audio("audio/start.ogg"); // buffers automatically when created
        snd_start.play()
        snd_start.volume = 0.04

        var treeData;
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        var str_level = 'levels/level_'+_poziom_+'.json'
        oReq.open("get", str_level, true);
        oReq.send();

        function reqListener(e) {
            map = JSON.parse(this.responseText);
            document.getElementById('wysokosc_plansza').value = map[0].length
            document.getElementById('szerokosc_plansza').value = map.length
            makeLevel()
            time.innerHTML = 150
            document.getElementById("time").innerHTML = 150
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < heigth; j++) {
                    document.getElementById(i + "_" + j).className = map[i][j]
                }
            }
            var gracz = document.querySelector('.gracz')
            var gra = gracz.id.split('_')

            poz_gracza_x = Number(gra[0])
            poz_gracza_y = Number(gra[1])
            bri = gracz
        } 
}

function admin_tool() {
    if (document.getElementById("admin_tools").checked == true) {
        document.getElementById("zapisz").style.display = 'inline'
        document.getElementById("level").style.display = 'inline'
        document.getElementById("objekciki").style.display = 'inline'
        document.getElementById("wysokosc_plansza").style.display = 'inline'
        document.getElementById("szerokosc_plansza").style.display = 'inline'
        document.getElementById("start").style.display = 'inline'
    }
    if (document.getElementById("admin_tools").checked == false) {
        document.getElementById("level").style.display = 'none'
        document.getElementById("objekciki").style.display = 'none'
        document.getElementById("wysokosc_plansza").style.display = 'none'
        document.getElementById("szerokosc_plansza").style.display = 'none'
        document.getElementById("start").style.display = 'none'
        document.getElementById("zapisz").style.display = 'none'
    }
}

    setInterval(czas_gry, 1000)
    function czas_gry() {
        if (restart) {
            return
        }
        time.innerHTML--
        if (time.innerHTML == 0) {
            gameover()
        }
    

    }
setInterval(bio_mass, 5000)
function bio_mass() {
    var na_stone = 15
    var na_diaxy = 0
    var bio_mass = document.querySelectorAll(".bio_mass")
    var czy_moze_rosnac = false
    for (var i = bio_mass.length - 1; i >= 0; i--) {
        var bio = bio_mass[i].id.split('_');
       
        var bio_wprawo = document.getElementById(bio[0] + '_' + (Number(bio[1]) + 1)) || {}
        var bio_wlewo = document.getElementById(bio[0] + '_' + (Number(bio[1]) - 1)) || {}
        var bio_wdol = document.getElementById((Number(bio[0]) + 1) + '_' + bio[1]) || {}
        var bio_wgore = document.getElementById((Number(bio[0]) - 1) + '_' + bio[1]) || {}

        if ((bio_wprawo.className == 'dirt' || bio_wprawo.className == 'czysto') || (bio_wlewo.className == 'dirt' || bio_wlewo.className == 'czysto') || (bio_wdol.className == 'dirt' || bio_wdol.className == 'czysto') || (bio_wgore.className == 'dirt' || bio_wgore.className == 'czysto')) {
                czy_moze_rosnac = true
        }

        else continue
      
        var _rand_bio_ = Math.floor((Math.random() * 4) + 1);
        switch (_rand_bio_) {
            case 1:
                if ((bio_wprawo.className == 'dirt' || bio_wprawo.className == 'czysto')) {
                    bio_wprawo.className = 'bio_mass'
                }

                break
            case 2:
                if ((bio_wlewo.className == 'dirt' || bio_wlewo.className == 'czysto')) {
                    bio_wlewo.className = 'bio_mass'
                }
               
                break
            case 3:
                if ((bio_wdol.className == 'dirt' || bio_wdol.className == 'czysto')) {
                    bio_wdol.className = 'bio_mass'
                }
               
                break
            case 4:
                if ((bio_wgore.className == 'dirt' || bio_wgore.className == 'czysto')) {
                    bio_wgore.className = 'bio_mass'

                }
               
                break
            default:

        }
       
    }
    if (!czy_moze_rosnac && bio_mass.length > na_stone) {
        for (var i = bio_mass.length - 1; i >= 0; i--) {
            bio_mass[i].className = 'stone'
        }
    }
    else if (!czy_moze_rosnac && bio_mass.length > na_diaxy) {
        for (var i = bio_mass.length - 1; i >= 0; i--) {
            bio_mass[i].className = 'coin'
        }
    }
}
function lifeup() {
    var score = Number(document.getElementById("overall_score").innerHTML)
    while (score >= next_lifeup) {
        document.getElementById('life').innerHTML = zycie + 1
        next_lifeup += 500
        zycie++
    }
    
}
// function highscore(){
//     $.ajax({
//                     type: "POST",
//                     url: "http://projekty.propanek.tk/boulderdash/loadhighscore.php",
//                     dataType: 'text',
//                     success: function (response) {
                        
//                          var ar = response
//                          var obj_um = JSON.parse(ar)
//                          console.log(obj_um)
//                          tab_div = []
//                        for(var i = 0; i < obj_um.length; i++ ){
//                             var div = $("<div class='hover' id='player_" + i+"' >"+ obj_um[i].name +": <br>"+ obj_um[i].highscore + '</div>')
//                             tab_div.push(div)
//                         }
//                         for(var i =0; i< tab_div.length; i++){
//                                     $('#highscore').append(tab_div[i])
//                         }
//                     },
//                     error: function(xhr){
//                         alert("błąd" + xhr.responseText)
//                     }
//                 })
// }
