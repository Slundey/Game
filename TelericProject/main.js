'use strict'//780
const Game = new Phaser.Game(780, 440, Phaser.AUTO, 'game-canvas', { preload, create, update })
let bg,player,platform1,bg2,bg3,bg4,bg5, platform2,platform3,platform4,platform5,platform6,platform7,platform8,platform9,platform10,platform11,platform12,platform13;
let spikes1, spikes2, spikes3, spikes4, spikes5, allSpikes
let allPlatforms, platform30, platform31, platform32;
let livesicon, coinsicon
let worldHeight = 440
let worldWidth = 3200;
let platform21,platform22,platform23,platform24
let platform40,platform41,platform42,platform43,plataform44,plataform45,plataform46,plataform47
let monster;
let goal
let key1, key2, key3, keys, keyicon, lives, coins, cointext, keytext, lifetext, allKeys, allCoins
let coin1, coin2, coin3, coin4, coin5, coin6, coin7, coin8, coin9, coin10, coin11, coin12
let invulntime, invulnerable
let monsterTurn=0;
let gameIsOver;
let gameWin;
let score;
let scoreText;
let gameTime;


function preload() {
   Game.load.image('bg', 'images/background.jpg');
   Game.load.spritesheet('player', 'images/PC Computer - Spelunky - Ninja.png',1024/13,1038/13);
   Game.load.image('gameover', 'images/gameover.jpg');
   Game.load.image('platformType1', 'images/32x32_tileset_platfprms_.png');
   Game.load.image('platformType2', 'images/32x32_tileset_platfprms2_.png');
   Game.load.image('platformType3', 'images/32x32_tileset_platfprms5_.png');
   Game.load.image('spikes', 'images/spikes.png')
   Game.load.image('key', 'images/keygoal.png')
   Game.load.image('goal', 'images/goal.png')
   Game.load.image('coin', 'images/coin.png')
   Game.load.image('platformType4', 'images/airplatform.png')
   Game.load.spritesheet('monster', 'images/monster.png',480/6,448/8);
   Game.load.image('win', 'images/YouWin.png')
 
}

function create() {
Game.physics.startSystem(Phaser.Physics.ARCADE)


/*var gameOver = function(Game) {}
gameOver.prototype = {
    create: function() {
        var deadtext = Game.add.text(Game.width/2, Game.height/2, "you snooze you loose", "32px Monospace", "#00ff00", "center")
        deadtext.anchor.setTo(0.5)
    }
}*/

//Game.state.add('GameOver', gameOver)

bg = Game.add.sprite(0,0,'bg');
bg2 = Game.add.sprite(770,0,'bg');
bg3 = Game.add.sprite(1440,0,'bg');
bg4 = Game.add.sprite(2210,0,'bg');
bg5 = Game.add.sprite(2980,0,'bg');


//bg.body.immovable = true;

hazards();
monsters();
playerMovement();
setupInteractables();
platforms();
setupStats();

Game.physics.arcade.enable(goal)
goal.body.immovable = true
invulnerable = false
Game.world.setBounds(0,0,worldWidth,worldHeight);
Game.camera.follow(player,Phaser.Camera.FOLLOW_PLATFORMER,0.1)
//game.camera.follow(chovek, Phaser.Camera.FOLLOW_LOCKON)
allPlatforms.forEach(function (_platforms) {
    Game.physics.arcade.enable(_platforms)
    _platforms.body.immovable=true;
})



}
function update() {
    gameTime=Game.time.now;
    //console.log(gameTime)
    //console.log(player.x + " " + player.y)
    //console.log(Game.time.now)
    //console.log(invulntime + "INVULNTIME")
    //console.log(invulnerable + " STATE")
    //console.log(lives)
    Game.physics.arcade.overlap(player, allCoins, onCoin)
    Game.physics.arcade.overlap(player, allKeys, onKey)
    
    Game.physics.arcade.collide(player, allSpikes, onHit)
    Game.physics.arcade.overlap(player, monster, onHit);


    Game.physics.arcade.collide(player, goal, onGoal)


    if (Game.time.now >= invulntime) {
        invulnerable = false
        player.alpha = 1
    }



    allPlatforms.forEach(function (_platforms){
        Game.physics.arcade.collide(player,_platforms)
    })

    allSpikes.forEach(function(_spikes) {
        Game.physics.arcade.collide(player, _spikes)
    });

    let standing = player.body.blocked.down || player.body.touching.down
    //console.log(standing) //collide check

    if(Game.input.keyboard.createCursorKeys().up.isDown && standing==true){
        player.body.velocity.y-=420;
        //player.animations.play('player-jump');
    }
    else if(Game.input.keyboard.createCursorKeys().right.isDown){
        player.body.velocity.x=200;

            player.animations.play('player-walk')


    }
    else if(Game.input.keyboard.createCursorKeys().left.isDown){
        player.body.velocity.x=-200;

            player.animations.play('player-walk')


        
    }
    else{
            player.frame = 0
            player.body.velocity.x*=0.001;

    }
    //console.log(player.body.velocity.x)

    /*if(player.body.velocity.x>0){
        player.body.velocity.x*=0.1;
        console.log(player.body.velocity.x)
    
    }
    if(player.body.velocity.x<0){
        player.body.velocity.x*=0.1;
    
    }*/

    monsterMove()
    updateStats()

    if(lives==0){
        end();
    }
    

}
function playerMovement(){
    player=Game.add.sprite(0, 210, 'player');
    player.animations.add('player-walk',[0,1,2,3,4,5,6,7,8],12,true);
    player.scale.setTo(0.7)
    player.animations.add('player-jump',[118,119,120,121,122,123,124,125,126,127,128,129],12,true);
    player.enableBody = true;
    Game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
    player.body.gravity.y=720;
    player.body.collideWorldBounds = true;
    
    
}

function setupStats() {
    lives = 3
    coins = 0
    keys = 0   
    livesicon = Game.add.image(0, 0, 'player')

    livesicon.fixedToCamera = true
    livesicon.scale.setTo(0.8)
    coinsicon = Game.add.image(10, 65, 'coin')
    coinsicon.scale.setTo(0.2)
    coinsicon.fixedToCamera = true
    keyicon = Game.add.image(20, 120, 'key')
    keyicon.scale.setTo(0.2)
    keyicon.fixedToCamera = true

    lifetext = Game.add.text(livesicon.x+=60, livesicon.y+20, "x " + lives)
    lifetext.fixedToCamera = true
    cointext = Game.add.text(lifetext.x, coinsicon.y+8, "x " + coins)
    cointext.fixedToCamera = true
    keytext = Game.add.text(lifetext.x, keyicon.y, "x " + keys)
    keytext.fixedToCamera = true
    

}

function updateStats() {
    lifetext.setText("x " + lives)
    cointext.setText("x " + coins)
    keytext.setText("x " + keys)
}

function setupInteractables() {
    goal = Game.add.sprite(3000, 100, 'goal')
    goal.scale.setTo(0.9)
    key1 = Game.add.sprite(395, 320, 'key')
    key2 = Game.add.sprite(2236, 65, 'key')
    key3 = Game.add.sprite(2510, 254, 'key')
    allKeys = Game.add.group()
    allCoins = Game.add.group()

    goal.enableBody = true
    allCoins.enableBody = true
    allKeys.enableBody = true

    allKeys.add(key1)
    allKeys.add(key2)
    allKeys.add(key3)

    coin1 = Game.add.sprite(650, 179, 'coin')
    coin2 = Game.add.sprite(700, 179, 'coin')
    coin3 = Game.add.sprite(750, 179, 'coin')
    coin4 = Game.add.sprite(1319, 294, 'coin')
    coin5 = Game.add.sprite(1419, 294, 'coin')
    coin6 = Game.add.sprite(1519, 294, 'coin')
    coin7 = Game.add.sprite(2472, 144, 'coin')
    coin8 = Game.add.sprite(2522, 144, 'coin')
    coin9 = Game.add.sprite(2572, 144, 'coin')


    allCoins.add(coin1)
    allCoins.add(coin2)
    allCoins.add(coin3)
    allCoins.add(coin4)
    allCoins.add(coin5)
    allCoins.add(coin6)
    allCoins.add(coin7)
    allCoins.add(coin8)
    allCoins.add(coin9)


    allCoins.forEach(function(_coins) {
        _coins.scale.setTo(0.18)
        //_coins.body.immovable = true
    })

    allKeys.forEach(function(_keys) {
        //_keys.body.immovable = true
        _keys.scale.setTo(0.2)
        _keys.anchor.setTo(0.5)
    })


}

function hazards() {
    allSpikes = Game.add.group()
    spikes1 = Game.add.sprite(1780, 390, 'spikes')
    spikes2 = Game.add.sprite(1985, 390, 'spikes')
    spikes3 = Game.add.sprite(2190, 390, 'spikes')
    spikes4 = Game.add.sprite(2395, 390, 'spikes')
    spikes5 = Game.add.sprite(2600, 390, 'spikes')


    allSpikes.add(spikes1)
    allSpikes.add(spikes2)
    allSpikes.add(spikes3)
    allSpikes.add(spikes4)
    allSpikes.add(spikes5)
    
    

    allSpikes.forEach(function(_spikes) {
        _spikes.scale.setTo(0.12)
        Game.physics.arcade.enable(_spikes)
        _spikes.body.immovable=true;
    })
    allSpikes.enableBody = true
}

function platforms(){
    //platformsType1
    platform1=Game.add.sprite(0,350,'platformType1');
    platform2=Game.add.sprite(255,350,'platformType1');
    platform3=Game.add.sprite(510,350,'platformType1');
    platform4=Game.add.sprite(765,350,'platformType1');
    platform5=Game.add.sprite(1020,350,'platformType1');
    platform6=Game.add.sprite(1270,350,'platformType1');
    platform7=Game.add.sprite(1525,350,'platformType1');
    //platform8=Game.add.sprite(1780,350,'platformType1');
    //platform9=Game.add.sprite(2035,350,'platformType1');
    //platform10=Game.add.sprite(2290,350,'platformType1');
    //platform11=Game.add.sprite(2545,350,'platformType1');
    platform12=Game.add.sprite(2800,350,'platformType1');
    platform13=Game.add.sprite(3055,350,'platformType1');

    //platformsType2

    platform21=Game.add.sprite(300,288,'platformType2');
    platform22=Game.add.sprite(363,229,'platformType2');
    platform23=Game.add.sprite(1000,288,'platformType2');
    platform24=Game.add.sprite(1063,229,'platformType2');
    //platform23=Game.add.sprite(365,225,'platformType2');


    ////platformsType3 why is it named 40 not 30 bruh
    platform40=Game.add.sprite(363,290,'platformType3');
    platform40.scale.setTo(1.04)
    platform41=Game.add.sprite(1061,290,'platformType3');
    platform41.scale.setTo(1.04)

    //platformsType4 but its actually 3 i guess
    platform30 = Game.add.sprite(1898, 240, 'platformType4')
    platform31 = Game.add.sprite(platform30.x+500, 200, 'platformType4')
    platform32 = Game.add.sprite(platform31.x, 290, 'platformType4')


    //platform1.width = worldWidth
    allPlatforms = Game.add.group();
    allPlatforms.enableBody=true;
    allPlatforms.add(platform1);
    allPlatforms.add(platform2);
    allPlatforms.add(platform3);
    allPlatforms.add(platform4);
    allPlatforms.add(platform5);
    allPlatforms.add(platform6);
    allPlatforms.add(platform7);
    //allPlatforms.add(platform8);
    //allPlatforms.add(platform9);
    //allPlatforms.add(platform10);
    //allPlatforms.add(platform11);
    allPlatforms.add(platform12);
    allPlatforms.add(platform13);
    allPlatforms.add(platform21);
    allPlatforms.add(platform22);
    allPlatforms.add(platform23);
    allPlatforms.add(platform24);
    allPlatforms.add(platform41);
    //allPlatforms.add(platform40)
    allPlatforms.add(platform30)
    allPlatforms.add(platform31)
    allPlatforms.add(platform32)

    
}

function monsters(){
    monster=Game.add.sprite(440,300,'monster');
    monster.animations.add('monster-walk-right',[0,1,2,3,4,5],12,true);
    monster.animations.add('monster-walk-left',[12,13,14,15,16,17],12,true);
    Game.physics.arcade.enable(monster);
    monster.immovable = true
    

}

function monsterMove(){
    if(monsterTurn==0){
        monster.body.velocity.x=100;
        monster.play('monster-walk-right')
    }
    if(monster.x<430){
        monsterTurn=0;
    }
    if(monster.x>925){
        monsterTurn=1;
    }
    if(monsterTurn==1){
        monster.body.velocity.x=-100;
        monster.play('monster-walk-left')
    }
    //console.log(monsterTurn)
    //console.log(monster.x)


}

function onHit(sprite1, sprite2) {
    if (invulnerable == false) {
        lives -= 1
        invuln()
    }
}

function onCoin(sprite1, sprite2) {
    sprite2.destroy()
    coins += 1
}

function onKey(sprite1, sprite2) {
    sprite2.destroy()
    keys += 1
}

function onGoal(sprite1, sprite2) {
    if (keys == 3) {
        sprite2.destroy()
        gameWin = Game.add.sprite(0,0,'win')
        gameWin.fixedToCamera=true;
        gameWin.height=440;
        gameWin.width=780;
        score = gameTime*coins;
        console.log(score)
        scoreText = Game.add.text(coinsicon.x, coinsicon.y, "Score: " + score, { fontFamily: 'Arial', fontSize: 64, color: '#00ff00', boundsAlignH: "center"})
        scoreText.fixedToCamera = true
        Game.paused=true;


    } else {
        alert("you need 3 keys!")
    }
}
function end(){
    Game.paused=true;
    gameIsOver=Game.add.sprite(0,0,'gameover');
    gameIsOver.fixedToCamera = true;
    gameIsOver.height=440;
    gameIsOver.width=780;
}

function invuln() {
    invulnerable = true
    player.alpha = 0.5
    invulntime = Game.time.now + 3000
}
