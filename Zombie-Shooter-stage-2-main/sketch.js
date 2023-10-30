var bg, bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;

var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;

var zombieGroup;

var lives = 3

var counter = 0

var gameState = "start"

function preload() {

  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")

  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  z1 = loadImage("assets/zombie.png")
  z2 = loadImage("assets/zombie2.png")
  z3 = loadImage("assets/zombie3.png")
  z4 = loadImage("assets/zombie4.png")

  bulletImg = loadImage("assets/bullet.png")

  reloadImg = loadImage("assets/reload.png")
  winImg = loadImage("assets/winner.png")
  bgImg = loadImage("assets/bg.jpeg")

}

function setup() {


  createCanvas(windowWidth, windowHeight);

  //adding the background image
  bg = createSprite(displayWidth / 2 - 20, displayHeight / 2 - 40, 20, 20)
  bg.addImage(bgImg)
  bg.scale = 1.1


  //creating the player sprite
  player = createSprite(displayWidth - 1150, displayHeight - 300, 50, 50);
  player.addImage(shooterImg)
  player.scale = 0.3
  // player.debug = true
  player.setCollider("rectangle", 0, 0, 300, 300)


  //creating sprites to depict lives remaining
  heart1 = createSprite(displayWidth - 150, 40, 20, 20)
  heart1.visible = false
  heart1.addImage("heart1", heart1Img)
  heart1.scale = 0.4

  heart2 = createSprite(displayWidth - 100, 40, 20, 20)
  heart2.visible = false
  heart2.addImage("heart2", heart2Img)
  heart2.scale = 0.4

  heart3 = createSprite(displayWidth - 150, 40, 20, 20)
  heart3.addImage("heart3", heart3Img)
  heart3.scale = 0.4


  //creating group for zombies    
  zombieGroup = new Group();

  bulletGroup = new Group();
}

function draw() {
  background(0);

  drawSprites();

  if (gameState == "start") {

    //moving the player up and down and making the game mobile compatible using touches
    if (keyDown("UP_ARROW") || touches.length > 0) {
      player.y = player.y - 30
    }
    if (keyDown("DOWN_ARROW") || touches.length > 0) {
      player.y = player.y + 30
    }


    //release bullets and change the image of shooter to shooting position when space is pressed
    if (keyWentDown("space")) {
      player.addImage(shooter_shooting)
      showBullets()
    }

    //player goes back to original standing image once we stop pressing the space bar
    else if (keyWentUp("space")) {
      player.addImage(shooterImg)
    }


    //destroy zombie when player touches it
    if (zombieGroup.isTouching(player)) {
      for (var i = 0; i < zombieGroup.length; i++) {
        if (zombieGroup[i].isTouching(player)) {
          zombieGroup[i].destroy()

          lives -= 1
        }
      }
    }

    // destroy the zombies everytime the bullet is touching zombie
    if (zombieGroup.isTouching(bulletGroup)) {
      for (var i = 0; i < zombieGroup.length; i++) {
        if (zombieGroup[i].isTouching(bulletGroup)) {
          zombieGroup[i].destroy()
          bulletGroup.destroyEach()
          counter += 1
        }
      }
    }

    //calling the function to spawn zombies
    enemy();


    if (lives === 3) {
      heart3.visible = true
      heart1.visible = false
      heart2.visible = false
    }
    if (lives == 2) {
      heart2.visible = true
      heart1.visible = false
      heart3.visible = false
    }
    if (lives == 1) {
      heart1.visible = true
      heart3.visible = false
      heart2.visible = false
    }

    if (lives == 0) {
      gameState = "end"
    }

    textSize(26)
    fill("yellow")
    text("Lives : " + lives, width - 340, 100)

    textSize(26)
    fill("red")
    text("Kills : " + counter, width - 340, 130)

    if (counter == 5) {
      gameState = "win"
    }

  }

  if (gameState == "win") {
    textSize(36)
    fill("yellow")
    text("You WON!!", 530, height / 2 + 200)

    zombieGroup.destroyEach()
    bulletGroup.destroyEach()
    player.destroy()

    winner = createSprite(width / 2, height / 2)
    winner.addImage(winImg)
    winner.scale = 0.7

    if (mousePressedOver(winner)) {
      window.location.reload()
    }
  }


  if (gameState == "end") {
    textSize(36)
    fill("yellow")
    text("You Lost!!", 530, height / 2 + 180)
    zombieGroup.destroyEach()
    bulletGroup.destroyEach()
    player.destroy()
    heart1.visible = false

    reset = createSprite(width / 2, height / 2)
    reset.addImage(reloadImg)

    if (mousePressedOver(reset)) {
      window.location.reload()
    }

  }

}


//creating function to spawn zombies
function enemy() {
  if (frameCount % 50 === 0) {

    //giving random x and y positions for zombie to appear
    zombie = createSprite(width, random(200, height - 200), 40, 40)

    var n = Math.round(random(1, 4))

    if (n == 1) {
      zombie.addImage(z1)
      zombie.scale = 0.2
      zombie.setCollider("rectangle", 0, 0, 600, 800)
    }
    else if (n == 2) {
      zombie.addImage(z2)
      zombie.setCollider("rectangle", 0, 0, 200, 350)
      zombie.scale = 0.6
    }
    else if (n == 3) {
      zombie.addImage(z3)
      zombie.setCollider("rectangle", -20, 0, 100, 200)
      zombie.scale = 1.2
    }
    else if (n == 4) {
      zombie.addImage(z4)
      zombie.scale = 0.3
    };


    zombie.velocityX = -13
    // zombie.debug = true
    zombie.setCollider("rectangle", 0, 0, 400, 400)

    zombie.lifetime = 400
    zombieGroup.add(zombie)
  }

};

function showBullets() {
  bullet = createSprite(player.x + 120, player.y - 53)
  bullet.addImage(bulletImg)
  bullet.velocityX = 20
  bullet.scale = 0.07

  bulletGroup.add(bullet)
}