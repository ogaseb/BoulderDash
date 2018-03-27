
function eventsContainer() {
    // highscore()
    startGameLoop()
    time = document.getElementById('time')
    
    document.getElementById('life').innerHTML = player_life
    document.getElementById("overall_score").innerHTML = '000000'
    map_load(document.getElementById("level").value)
    document.getElementById("load").style.display = 'none'
    document.getElementById("start").addEventListener("click", startgame);
    document.getElementById("suicide").addEventListener("click", gameover);
    document.getElementById("bricks").addEventListener("mouseover", map_edit);
    document.getElementById("bricks").addEventListener("mouseup", function (){
        can_edit = false
    });
    document.getElementById("bricks").addEventListener("mousedown", function(event){
        can_edit = true
        map_edit(event)
    })
    document.getElementById("levels").addEventListener("click", function (event) {
        if (document.getElementById("admin_tools").checked == false) {
            alert('STAY DETERMINED!') // yeah i know Undertale reference
            event.preventDefault()
        }      
    })
    document.getElementById("levels").addEventListener("change", function (event) {
        if (document.getElementById('levels').value) {
            _map_level_ = document.getElementById('levels').value
            map_load(document.getElementById("level").value)
        }
    })
    document.getElementById("save").addEventListener("click", function () {
        document.getElementById("level").value = map_save() 
    })
    document.getElementById("load").addEventListener("click", function () {
        document.getElementById("overall_score").innerHTML = '000000'
        map_load(document.getElementById("level").value)
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
var can_edit, restart;
var next_lifeup = 500;
var currentlyPressedKey;
var is_active;
var player_life = 3;
var player_can_walk = true;
var pos_player_x = 0;
var pos_player_y = 0;
Object.defineProperty(window, '_map_level_', {
        get: function() { // wczytuje wartość zmiennej _map_level_ bezpośrednio z HTML
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
    //map_load()
    document.getElementById("coin_score").innerHTML = 0
    document.getElementById("overall_score").innerHTML = '000000'
    document.getElementById('time').innerHTML = Infinity
};
function makeLevel() {
    restart = true
    width = document.getElementById('width_board').value
    heigth = document.getElementById('height_board').value
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
            //var poz = document.querySelector('.player').id.split('_')
            player_can_walk = true
            document.getElementById("scoreboard2").style.display = 'none'
            document.getElementById("scoreboard").style.display = 'flex'
            clearInterval(interval_scoreboard)
            restart = false
                    
        }
    }, 6)

    

    bri = document.getElementById(pos_player_x + '_' + pos_player_y);
    bri.className = 'player'
}
function kolizja(bri) {
    switch (bri.className) {
        case "dirt":
            var snd = new Audio("audio/dirt.ogg"); // buffers automatically when created
            snd.play();
            snd.volume = 0.04
            return true;
            break;
        case "clear":
            var snd = new Audio("audio/clear.ogg"); // buffers automatically when created
            snd.play();
            snd.volume = 0.04
            return true;
            break;
        case "stone":
            
            var pos_stone = bri.id.split('_')
            var to_right = document.getElementById(pos_stone[0] + '_' + (Number(pos_stone[1]) + 1))
            var to_left = document.getElementById(pos_stone[0] + '_' + (Number(pos_stone[1]) - 1))
            var player_bottom = document.getElementById((Number(pos_stone[0])+1) + '_' + pos_stone[1]) || {className: ''}
            var player_top = document.getElementById((Number(pos_stone[0]) - 1) + '_' + pos_stone[1]) || { className: '' }

            if (player_bottom.className == 'player' || player_top.className == 'player') {
                return false;
            }

            if (to_right.className == 'clear') {
                to_right.className = 'stone'
                return true;
            }
            
            if (to_left.className == 'clear') {
                to_left.className = 'stone'
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
                
                switch (_map_level_) {
                    case 1:
                        if (coin_score.innerHTML == '12') {
                            pkt_coin.innerHTML = '15'
                           // document.getElementById('coin_img').innerHTML = '<img style="display:inline" src="textures/coin.gif" /><img style="display:inline" src="textures/coin.gif" /><img style="display:inline" src="textures/coin.gif" />'
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
                    map_load(document.getElementById("level").value)
                    //alert("poziom " + _map_level_ + "!")
                    
                }
            }, 28)
            _map_level_++
            
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
            document.querySelector('.player').style.backgroundImage = ''
            var new_x = pos_player_x -1; 
            var new_y = pos_player_y - 0;
            bricks.style.opacity = 1;
            var can_walk = true;
            restart = false
            break;
        case 83:
            document.querySelector('.player').style.backgroundImage = ''
            var new_x = pos_player_x +1; 
            var new_y = pos_player_y - 0;
            bricks.style.opacity = 1;
            var can_walk = true;
            restart = false
            break;
        case 65:
            document.querySelector('.player').style.backgroundImage = ''
            var player_texture = 'url(textures/player_left.gif)'
            var new_x = pos_player_x - 0; 
            var new_y = pos_player_y - 1;
            bricks.style.opacity = 1;
            var can_walk = true;
            restart = false
            break;
        case 68:
            document.querySelector('.player').style.backgroundImage = ''
            var player_texture = 'url(textures/player_right.gif)'
            var new_x = pos_player_x - 0;
            var new_y = pos_player_y + 1;
            bricks.style.opacity = 1;
            var can_walk = true;
            restart = false
            break;
        case 38://strzałki
            document.querySelector('.player').style.backgroundImage = ''
            var new_x = pos_player_x - 1;
            var new_y = pos_player_y - 0;
            bricks.style.opacity = 1;
            var can_walk = false;
            break;
        case 40:
            document.querySelector('.player').style.backgroundImage = ''
            var new_x = pos_player_x + 1;
            var new_y = pos_player_y - 0;
            bricks.style.opacity = 1;
            var can_walk = false;
            break;
        case 37:
            document.querySelector('.player').style.backgroundImage = 'url(textures/player_left.gif)'
           
            
            var new_x = pos_player_x - 0;
            var new_y = pos_player_y - 1;
            bricks.style.opacity = 1;
            var can_walk = false;
            break;
        case 39:
            
            document.querySelector('.player').style.backgroundImage = 'url(textures/player_right.gif)'
            var new_x = pos_player_x - 0;
            var new_y = pos_player_y + 1;
            bricks.style.opacity = 1;
            var can_walk = false;
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
    
        var _bri = document.getElementById(new_x + '_' + new_y)
        if (_bri != null && kolizja(_bri)) {
            if (can_walk) {
                _bri.className = 'player'
                _bri.style.backgroundImage = player_texture || ''
                var star_poz = document.getElementById(pos_player_x + '_' + pos_player_y)

                star_poz.className = 'clear';

                pos_player_y = new_y;
                pos_player_x = new_x;
            } else {
                _bri.className = 'clear'
            }
        }
 
}
function map_edit(event){
    if(event.target!==event.currentTarget && can_edit && document.getElementById("admin_tools").checked) {  // MAGICZNY IF
        var game_objects = document.getElementById('game_objects').value
        event.target.className = game_objects; 
    }
}

setInterval (falling, 150)
function falling() {
    if (restart) {
        return
    };
    var player = document.querySelector(".player")
    var stone_coin = document.querySelectorAll(".stone, .coin, .cobble")
     magic_cobble = document.querySelectorAll(".magic_cobble")
  

    for (var j = magic_cobble.length - 1; j >= 0; j--) {
     
        var mag_cobble = magic_cobble[j] 
        var pos_mag_cobble = mag_cobble.id.split('_')
        
        var mag_top = document.getElementById(Number(pos_mag_cobble[0]) - 1 + '_' + pos_mag_cobble[1]) || { }
        var mag_bottom = document.getElementById(Number(pos_mag_cobble[0]) + 1 + '_' + pos_mag_cobble[1]) || { }
        var mag_left = document.getElementById(pos_mag_cobble[0]+ '_' + (Number(pos_mag_cobble[1]) - 1) )|| {}
        var mag_right = document.getElementById(pos_mag_cobble[0] + '_' + (Number(pos_mag_cobble[1]) + 1)) || { }
        
        window.active_mag_el = function(el) { 
            is_active = true
            //el.style.background = 'yellow'
            //var all = el.querySelectorAll('.magic_cobble') 
            for (var i = 0; i < magic_cobble.length; i++) {
                magic_cobble[i].style.backgroundImage = 'url(textures/magic_stone.gif)'
            };
        }
        
        window.deactive_mag_el = function(el) {
            
            is_active = false
            //var all = magic_cobble.querySelectorAll('.af_magic_cobble') 
            for (var i = 0; i < magic_cobble.length; i++) {
                magic_cobble[i].className = 'cobble'
                magic_cobble[i].style.background = ''
            };
           
        }
        
        if (mag_top.className == 'stone' && ( mag_top.fall || is_active) && mag_bottom.className == 'clear'){
            if (_map_level_ == 9) {
                var czas = 20000
            }
            if (_map_level_ == 18 || _map_level_ == 20) {
                var time = 10000
            }
            if (_map_level_ == 19) {
                var time = 25000
            }
            if (_map_level_ == 20) {
                var time = 25000
            }
            active_mag_el(mag_cobble)
            setTimeout(deactive_mag_el, time, mag_cobble) 
            if (is_active) {
                mag_top.className = 'clear'
                mag_bottom.className = 'coin'
            };
            
        }
        else if (mag_top.className == 'coin' && is_active && mag_bottom.className == 'clear') {
            if (_map_level_ == 9) {
                var time = 20000
            }
            if (_map_level_ == 18 || _map_level_ == 20) {
                var time = 10000
            }
            if (_map_level_ == 19) {
                var time = 25000
            }
            if (_map_level_ == 20) {
                var time = 25000
            }
            active_mag_el(mag_cobble)
            setTimeout(deactive_mag_el, time, mag_cobble)
            if (is_active) { 
                mag_top.className = 'clear'
            mag_bottom.className = 'stone'};
           
        }
    }
    for (var i = stone_coin.length - 1; i >= 0; i--) {
        // because we dont want mess with gravity
        // making it working for f**k s**e!!! DONT TOUCH IT! YOU!!!
        if (player_can_walk == false) {
            return
        }
        //if (restart) {   
        //    return
        //}
        var player = player
        var pos_player = player.id.split('_');
        var stone = stone_coin[i]
        var pos  = stone.id.split('_');//dzieli id na dwie zmienne
        //wybieranie id elementu ponizej
        var bottom = document.getElementById(Number(pos[0]) + 1 + '_' + pos[1]) || { className: '' } 

        
        if (stone.className != 'stone' && stone.className != 'coin') {
            continue    
        }
        
        //funkcja losujaca w ktora stronie spadnie stoneien                                                       
        var x = [1, -1]
        function random(x){
            return x[Math.floor(x.length * Math.random())]
        }
        var rand_x = random(x)
        //wybieranie id dla stoneienia fallingacego z stoneienia
        var stone_near = document.getElementById(pos[0] + '_' + ((Number(pos[1]) + rand_x)))
        var stone_near_top = document.getElementById((Number(pos[0]) - 1) + '_' + ((Number(pos[1]) + rand_x)))
        var stone_near_bottom = document.getElementById((Number(pos[0]) + 1) + '_' + ((Number(pos[1]) + rand_x)))
        // sprawdzanie nad stone_coinm
        var stone_top = document.getElementById((Number(pos[0]) - 1) + '_' + pos[1]) || { className: '' }
        //spadanie kamienia gdy jest w powietrzu
        if (bottom.className == 'clear') {
            if (stone.className == 'coin') {
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
            bottom.className = stone.className;
            bottom.fall= true
            stone.className = 'clear'
            
            continue
        }
        //spadanie stoneienia z stoneienia
        if (stone_near != null && stone_near.className == 'clear' && (stone_top.className == 'stone' || stone_top.className == 'coin') && stone_near_top.className == 'clear') {
            stone_near_top.className = stone_top.className;
            stone_top.className = 'clear' 
        }
        else if (bottom.className == 'cobble' && stone_near_bottom.className == 'clear' && stone_near.className == "clear") {
            stone_near.className = stone.className
            stone.fall = true
            stone.className = 'clear'
        }
        //smierc playera przy spadaniu stoneienia, nie gdy jest bottom nim
        
        if (bottom.className != 'clear' && stone.fall == true && stone.className != 'coin') {
            var snd = new Audio("audio/stone.ogg"); // buffers automatically when created
            
            snd.play();
            snd.volume = 0.03
            }
        
        if (stone.fall) {
            if (bottom.className == 'player' ) {
                
                coin_explosion(bottom.id.split('_'), 'clear')
                gameover()
                stone.fall = false
            }
            
            else if (bottom.className == 'butterfly')  {

                coin_explosion(bottom.id.split('_'), 'coin')
            }
            else if (bottom.className == 'firefly') {
                coin_explosion(bottom.id.split('_'), 'clear')
            }
        }

        if (bottom.className != 'clear') {
            stone.fall = false
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
    var enemy_pos = enemy.id.split('_')
    var new_position = (new Position(enemy_pos[0], enemy_pos[1])).add(direction).get()
    if (new_position.className == 'clear') {
        new_position.className = enemy.className
        enemy.className = 'clear'
        return new_position
    }
    else if (new_position.className == 'player') {
        coin_explosion(new_position.id.split('_'), 'clear')
        gameover()
    }
    else if (new_position.className == 'bio_mass') {
        if (enemy.className == 'firefly') {
            coin_explosion(enemy_pos, 'clear')
        }
        else if (enemy.className == 'butterfly'){
            coin_explosion(enemy_pos, 'coin')
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
            
    if (_map_level_ % 5 == 0) {
        _map_level_++
    }
    else {
    document.getElementById('life').innerHTML = player_life - 1
    player_life--
    //alert('umar, zostało ci ' + player_life + ' żyć!')
    
    if (player_life == 0) {
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
    //                         swal("", "zapisałem twój wynik bottom nazwą: " + inputValue+"", "success")
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
        _map_level_ = 1
        player_life = 3
        next_lifeup = 500
        document.getElementById("overall_score").innerHTML = '000000'
    }
    }
    document.querySelector('.player').className = 'explosion'
    player_can_walk = false
    if (document.getElementById('time').innerHTML === '0')
        map_load(document.getElementById("level").value)
    else {
        setTimeout(map_load, 3000, document.getElementById("level").value)
    }
}

function coin_explosion(pos_player, typ) {
    var wokol_player = [
        document.getElementById(Number(pos_player[0]) + '_' + pos_player[1]) || {},
        document.getElementById(Number(pos_player[0]) + 1 + '_' + pos_player[1]) || {},
        document.getElementById(Number(pos_player[0]) + -1 + '_' + pos_player[1]) || {},
        document.getElementById(Number(pos_player[0]) + 1 + '_' + (Number(pos_player[1]) + 1)) || {},
        document.getElementById(Number(pos_player[0]) + 1 + '_' + (Number(pos_player[1]) - 1)) || {},
        document.getElementById(Number(pos_player[0]) - 1 + '_' + (Number(pos_player[1]) + 1)) || {},
        document.getElementById(Number(pos_player[0]) - 1 + '_' + (Number(pos_player[1]) - 1)) || {},
        document.getElementById(pos_player[0] + '_' + (Number(pos_player[1]) + 1)) || {},
        document.getElementById(pos_player[0] + '_' + (Number(pos_player[1]) - 1)) || {}
    ]
    document.getElementById(pos_player[0]+'_'+pos_player[1]).style.backgroundImage = ''
    for (var i = 0; i < wokol_player.length; i++) {
        if (wokol_player[i].className == 'player') {
            //document.getElementById("coin_score").innerHTML++
        }
        else if (wokol_player[i].className != 'obsidian' ) {
            wokol_player[i].className = 'explosion'
            
        }

            
    }
    setTimeout(function () {
        for (var i = 0; i < wokol_player.length; i++) {

            if (wokol_player[i].className == 'player') {
                if (typ == 'coin')
                    document.getElementById("coin_score").innerHTML++
            }
            else if (wokol_player[i].className == 'obsidian') {
                //emm
            }
            else wokol_player[i].className = typ

        }
    }, 600)
}

function map_save() {
    var map = []
    for (var i = 0; i < width; i++) {
        map[i] = []
        for (var j = 0; j < heigth; j++) {
            map[i][j] = document.getElementById(i + "_" + j).className
        }
    }  
    return JSON.stringify(map)
}

function map_load(s) {
    var required_coins = document.getElementById('required_coins')
    
        pkt_coin = document.getElementById('pkt_coin')
    if (_map_level_ == 21) {
        _map_level_ = 1
    }
    switch (_map_level_) {
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
        var str_level = 'levels/level_'+_map_level_+'.json'
        oReq.open("get", str_level, true);
        oReq.send();

        function reqListener(e) {
            map = JSON.parse(this.responseText);
            document.getElementById('height_board').value = map[0].length
            document.getElementById('width_board').value = map.length
            makeLevel()
            time.innerHTML = 150
            document.getElementById("time").innerHTML = 150
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < heigth; j++) {
                    document.getElementById(i + "_" + j).className = map[i][j]
                }
            }
            var player = document.querySelector('.player')
            var player = player.id.split('_')

            pos_player_x = Number(player[0])
            pos_player_y = Number(player[1])
            bri = player
        } 
}

function admin_tool() {
    if (document.getElementById("admin_tools").checked == true) {
        document.getElementById("save").style.display = 'inline'
        document.getElementById("level").style.display = 'inline'
        document.getElementById("game_objects").style.display = 'inline'
        document.getElementById("height_board").style.display = 'inline'
        document.getElementById("width_board").style.display = 'inline'
        document.getElementById("start").style.display = 'inline'
    }
    if (document.getElementById("admin_tools").checked == false) {
        document.getElementById("level").style.display = 'none'
        document.getElementById("game_objects").style.display = 'none'
        document.getElementById("height_board").style.display = 'none'
        document.getElementById("width_board").style.display = 'none'
        document.getElementById("start").style.display = 'none'
        document.getElementById("save").style.display = 'none'
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
    var for_stone = 15
    var for_coins = 0
    var bio_mass = document.querySelectorAll(".bio_mass")
    var can_expand = false
    for (var i = bio_mass.length - 1; i >= 0; i--) {
        var bio = bio_mass[i].id.split('_');
       
        var bio_right = document.getElementById(bio[0] + '_' + (Number(bio[1]) + 1)) || {}
        var bio_left = document.getElementById(bio[0] + '_' + (Number(bio[1]) - 1)) || {}
        var bio_bottom = document.getElementById((Number(bio[0]) + 1) + '_' + bio[1]) || {}
        var bio_top = document.getElementById((Number(bio[0]) - 1) + '_' + bio[1]) || {}

        if ((bio_right.className == 'dirt' || bio_right.className == 'clear') || (bio_left.className == 'dirt' || bio_left.className == 'clear') || (bio_bottom.className == 'dirt' || bio_bottom.className == 'clear') || (bio_top.className == 'dirt' || bio_top.className == 'clear')) {
                can_expand = true
        }

        else continue
      
        var _rand_bio_ = Math.floor((Math.random() * 4) + 1);
        switch (_rand_bio_) {
            case 1:
                if ((bio_right.className == 'dirt' || bio_right.className == 'clear')) {
                    bio_right.className = 'bio_mass'
                }

                break
            case 2:
                if ((bio_left.className == 'dirt' || bio_left.className == 'clear')) {
                    bio_left.className = 'bio_mass'
                }
               
                break
            case 3:
                if ((bio_bottom.className == 'dirt' || bio_bottom.className == 'clear')) {
                    bio_bottom.className = 'bio_mass'
                }
               
                break
            case 4:
                if ((bio_top.className == 'dirt' || bio_top.className == 'clear')) {
                    bio_top.className = 'bio_mass'

                }
               
                break
            default:

        }
       
    }
    if (!can_expand && bio_mass.length > for_stone) {
        for (var i = bio_mass.length - 1; i >= 0; i--) {
            bio_mass[i].className = 'stone'
        }
    }
    else if (!can_expand && bio_mass.length > for_coins) {
        for (var i = bio_mass.length - 1; i >= 0; i--) {
            bio_mass[i].className = 'coin'
        }
    }
}
function lifeup() {
    var score = Number(document.getElementById("overall_score").innerHTML)
    while (score >= next_lifeup) {
        document.getElementById('life').innerHTML = player_life + 1
        next_lifeup += 500
        player_life++
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
