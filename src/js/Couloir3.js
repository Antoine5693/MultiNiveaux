var player;
var clavier;
var enter;
var interact;
// variable pour l'escalier' vers couloir1
var escalier1;
// variables pour la porte c3_1
var porte1;
var open_portec3_1 = false;
// variables pour la porte c3_2
var porte2;
var open_portec3_2 = false;
// variables pour la porte c3_3
var porte3;
var open_portec3_3 = false;
// variables pour la porte c3_4   
var porte4;
var open_portec3_4 = false;
// variables pour la porte c3_5
var porte5;
var open_portec3_5 = false;
// escaliers1
var escalier1;

export default class Couloir3 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "Couloir3" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    // assets pour le tilemap
    this.load.image("B", "src/assets/Background.png");
    this.load.image("B2", "src/assets/Background2.png");
    this.load.image("D1", "src/assets/Dela_dec1.png");
    this.load.image("D2", "src/assets/Dela_dec2.png");
    this.load.tilemapTiledJSON("carte3", "src/assets/Couloir3.tmj");
    // asset pour le joueur
    this.load.spritesheet("dude.png", "src/assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });
    // assets des portes
    this.load.spritesheet("img_porteC3_1", "src/assets/porte1finie.png", {
      frameWidth: 103,
      frameHeight: 128
    });
    this.load.spritesheet("img_porteC3_2", "src/assets/porte1finie.png", {
      frameWidth: 103,
      frameHeight: 128
    });
    this.load.spritesheet("img_porteC3_3", "src/assets/porte1finie.png", {
      frameWidth: 103,
      frameHeight: 128
    });
    this.load.spritesheet("img_porteC3_4", "src/assets/porte1finie.png", {
      frameWidth: 103,
      frameHeight: 128
    });
    /*this.load.spritesheet("img_porteC3_5", "src/assets/porte1finie.png", {
      frameWidth: 103,
      frameHeight: 128
    });*/
    this.load.image("img_escalier1", "src/assets/escalier.png", {
      frameWidth: 50,
      frameHeight: 200
    });
    this.load.spritesheet("rodeurGauche", "src/assets/rodeurG.png", {
  frameWidth: 151,
  frameHeight: 178
});

this.load.spritesheet("rodeurDroite", "src/assets/rodeurD.png", {
  frameWidth: 160,
  frameHeight: 162
});

this.load.audio("son_rodeur", "src/assets/rodeur_sound.mp3");
  }
    
  

  create() {

    interact = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);


    // clavier pour les déplacements du personnage
    clavier = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // Création du tilemap et des plateformes à partir de Tiled
    const map = this.add.tilemap("carte3");
    const tileset1 = map.addTilesetImage("2", "B");
    const tileset2 = map.addTilesetImage("333", "B2");
    const tileset3 = map.addTilesetImage("3", "D1");
    const tileset4 = map.addTilesetImage("1", "D2");
    const calque1 = map.createLayer("Calque de Tuiles 1", [tileset1, tileset3, tileset4, tileset2]);
    const calque2 = map.createLayer("Calque de Tuiles 2", [tileset2, tileset3, tileset4, tileset1]);
    calque1.setCollisionByProperty({ estSolide: true });
    calque2.setCollisionByProperty({ estSolide: true });

const spawn = this.scene.settings.data || {};
const startX = spawn.x ?? 1530;
const startY = spawn.y ?? 2325;

//création des portes de transition vers les salles
    porte1 = this.physics.add.staticSprite(1011, 512, "img_porteC3_1", 0);
    open_portec3_1 = false;
    this.anims.create({
      key: "anim_ouvreporte1",
      frames: this.anims.generateFrameNumbers("img_porteC3_1", { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0
    });
    porte2 = this.physics.add.staticSprite(2065, 512, "img_porteC3_2", 0);
    open_portec3_2 = false;
    this.anims.create({
      key: "anim_ouvreporte2",
      frames: this.anims.generateFrameNumbers("img_porteC3_2", { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0
    });
    porte3 = this.physics.add.staticSprite(1201, 1632, "img_porteC3_3", 0);
    open_portec3_3 = false;
    this.anims.create({
      key: "anim_ouvreporte3",
      frames: this.anims.generateFrameNumbers("img_porteC3_3", { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0
    });
    porte4 = this.physics.add.staticSprite(1873, 1632, "img_porteC3_4", 0);
    open_portec3_4 = false;
    this.anims.create({
      key: "anim_ouvreporte4",
      frames: this.anims.generateFrameNumbers("img_porteC3_4", { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0
    });
    /*porte5 = this.physics.add.staticSprite(128, 608, "img_porteC3_5", 0);
    open_portec3_5 = false;
    this.anims.create({
      key: "anim_ouvreporte5",
      frames: this.anims.generateFrameNumbers("img_porteC3_5", { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0
    });*/

    //création de l'escalier1
    escalier1 = this.physics.add.staticSprite(1536, 2420, "img_escalier1", 0);


player = this.physics.add.sprite(startX, startY, "dude.png");
    player.refreshBody();
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, calque1);
    this.physics.add.collider(player, calque2);
    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, this.groupe_plateformes);

    // Caméra centrée sur le joueur
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Animations du joueur
    this.anims.create({
      key: "anim_tourne_gauche",
      frames: this.anims.generateFrameNumbers("dude.png", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_face",
      frames: [{ key: "dude.png", frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: "anim_tourne_droite",
      frames: this.anims.generateFrameNumbers("dude.png", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
  key: "rodeurDroite",
  frames: this.anims.generateFrameNumbers("rodeurDroite", { start: 0, end: 5 }),
  frameRate: 5,
  repeat: -1
});

this.anims.create({
  key: "rodeurGauche",
  frames: this.anims.generateFrameNumbers("rodeurGauche", { start: 0, end: 5 }),
  frameRate: 5,
  repeat: -1
});

// création du rodeur
this.rodeur = this.physics.add.sprite(1500, 1300, "rodeurDroite");

this.rodeur.setScale(0.6);

// réduction de la hitbox
this.rodeur.body.setSize(60, 90);

// repositionnement de la hitbox dans le sprite
this.rodeur.body.setOffset(50, 70);
// son
this.sonRodeur = this.sound.add("son_rodeur", {
  loop: true,
  volume: 1.8
});

this.sonRodeur.play();

this.rodeur.anims.play("rodeurDroite", true);

// collisions map
this.physics.add.collider(this.rodeur, calque1);
this.physics.add.collider(this.rodeur, calque2);

  
  }

  update() {

    //ouverture des portes/escaliers
    if (Phaser.Input.Keyboard.JustDown(interact) == true) {
      //ouverture de la porte 1
      if (open_portec3_1 == false && this.physics.overlap(player, porte1) == true) {
        // le personnage est sur la porte1 et vient d'appuyer sur la touche entrée
        open_portec3_1 = true;
        this.time.delayedCall(500, () => {
          this.scene.start("Salle11");
        });
        porte1.anims.play("anim_ouvreporte1");
      }
      if (open_portec3_2 == false && this.physics.overlap(player, porte2) == true) {
        // le personnage est sur la porte2 et vient d'appuyer sur la touche entrée
        open_portec3_2 = true;
        this.time.delayedCall(500, () => {
          this.scene.start("Salle12");
        });

        porte2.anims.play("anim_ouvreporte2");
      }
      if (open_portec3_3 == false && this.physics.overlap(player, porte3) == true) {
        // le personnage est sur la porte3 et vient d'appuyer sur la touche entrée
        open_portec3_3 = true;
        this.time.delayedCall(500, () => {
          this.scene.start("Salle13");
        });
        porte3.anims.play("anim_ouvreporte3");
      }
      if (open_portec3_4 == false && this.physics.overlap(player, porte4) == true) {
        // le personnage est sur la porte4 et vient d'appuyer sur la touche entrée
        open_portec3_4 = true;
        this.time.delayedCall(500, () => {
          this.scene.start("Salle14");
        });
        porte4.anims.play("anim_ouvreporte4");
      }
      /*if (open_portec3_5 == false && this.physics.overlap(player, porte5) == true) {
        // le personnage est sur la porte5 et vient d'appuyer sur la touche entrée
        open_portec3_5 = true;
        this.time.delayedCall(500, () => {
          this.scene.start("selection");
        });
        porte5.anims.play("anim_ouvreporte5");
      }*/

      if (this.physics.overlap(player, escalier1) == true) {
        this.scene.start("Couloir1", { x: 1279, y: 2110 });
      }
    }

    // DEPLACEMENT DU PERSONNAGE

    player.setVelocityX(0);
    player.setVelocityY(0);

    // horizontal
    if (clavier.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play("anim_tourne_gauche", true);
    } else if (clavier.right.isDown) {
      player.setVelocityX(160);
      player.anims.play("anim_tourne_droite", true);
    }

    // vertical
    if (clavier.up.isDown) {
      player.setVelocityY(-160);
    } else if (clavier.down.isDown) {
      player.setVelocityY(160);
    }

    // idling
    if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
      player.anims.play("anim_face", true);
    }

 // DEPLACEMENT DU PERSONNAGE

    player.setVelocityX(0);
    player.setVelocityY(0);

    // horizontal
    if (clavier.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play("anim_tourne_gauche", true);
    } else if (clavier.right.isDown) {
      player.setVelocityX(160);
      player.anims.play("anim_tourne_droite", true);
    }

    // vertical
    if (clavier.up.isDown) {
      player.setVelocityY(-160);
    } else if (clavier.down.isDown) {
      player.setVelocityY(160);
    }

    // idling
    if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
      player.anims.play("anim_face", true);
    }

    // IA DU RODEUR
if (this.rodeur && player) {

  let dx = player.x - this.rodeur.x;
  let dy = player.y - this.rodeur.y;
  let vitesse = 60;

  this.rodeur.setVelocityX(0);
  this.rodeur.setVelocityY(0);

  // Mouvement horizontal
  if (dx > 5) {
    this.rodeur.setVelocityX(vitesse);
    this.rodeur.anims.play("rodeurDroite", true);
  } 
  else if (dx < -5) {
    this.rodeur.setVelocityX(-vitesse);
    this.rodeur.anims.play("rodeurGauche", true);
  }

  // Mouvement vertical
  if (dy > 5) {
    this.rodeur.setVelocityY(vitesse);
  } 
  else if (dy < -5) {
    this.rodeur.setVelocityY(-vitesse);
  }

  }
}}