var player;
var clavier;
var enter;
var interact;
// variables pour la porte c2_1
var porte1;
var open_portec2_1 = false;

// variables pour la porte c2_2
var porte2;
var open_portec2_2 = false;

//variable pour la porte c2_3
var porte3;
var open_portec2_3 = false;

// variable pour la porte c2_4
var porte4;
var open_portec2_4 = false;

// variable pour la porte c2_5
var porte5;
var open_portec2_5 = false;

// escaliers1
var escalier1;

export default class Couloir2 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "Couloir2" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    // assets pour le tilemap
    this.load.image("B", "src/assets/Background.png");
    this.load.image("B2", "src/assets/Background2.png");
    this.load.image("D1", "src/assets/Dela_dec1.png");
    this.load.image("D2", "src/assets/Dela_dec2.png");
    this.load.tilemapTiledJSON("carte4", "src/assets/Couloir2.tmj");

    // assets des portes
    this.load.spritesheet("img_porteC2_1", "src/assets/porte1finie.png", {
      frameWidth: 103,
      frameHeight: 128
    });
    this.load.spritesheet("img_porteC2_2", "src/assets/porte1finie.png", {
      frameWidth: 103,
      frameHeight: 128
    });
    this.load.spritesheet("img_porteC2_3", "src/assets/porte1finie.png", {
      frameWidth: 103,
      frameHeight: 128
    });
    this.load.spritesheet("img_porteC2_4", "src/assets/porte1finie.png", {
      frameWidth: 103,
      frameHeight: 128
    });
    this.load.spritesheet("img_porteC2_5", "src/assets/porte1finie.png", {
      frameWidth: 103,
      frameHeight: 128
    });

    //asset escalier
    this.load.image("img_escalier1", "src/assets/escalier.png", {
      frameWidth: 50,
      frameHeight: 200
    });

    // asset pour le joueur
    this.load.spritesheet("dude.png", "src/assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });
  }

  create() {

    interact = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // clavier pour les déplacements du personnage
    clavier = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // Création du tilemap et des plateformes à partir de Tiled
    const map = this.add.tilemap("carte4");
    const tileset1 = map.addTilesetImage("2", "B");
    const tileset2 = map.addTilesetImage("333", "B2");
    const tileset3 = map.addTilesetImage("3", "D1");
    const tileset4 = map.addTilesetImage("1", "D2");
    const calque1 = map.createLayer("Calque de Tuiles 1", [tileset1, tileset3, tileset4, tileset2]);
    const calque2 = map.createLayer("Calque de Tuiles 2", [tileset2, tileset3, tileset4, tileset1]);
    calque1.setCollisionByProperty({ estSolide: true });
    calque2.setCollisionByProperty({ estSolide: true });

    player = this.physics.add.sprite(1024, 2208, "dude.png");
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

    //création de la porte c2_1
    porte1 = this.physics.add.staticSprite(1026, 378, "img_porteC2_1", 0);
    open_portec2_1 = false;
    this.anims.create({
      key: "anim_ouvreporte1",
      frames: this.anims.generateFrameNumbers("img_porteC2_1", { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0
    });
    //création de la porte c2_2
    porte2 = this.physics.add.staticSprite(1696, 378, "img_porteC2_2", 0);
    open_portec2_2 = false;
    this.anims.create({
      key: "anim_ouvreporte2",
      frames: this.anims.generateFrameNumbers("img_porteC2_2", { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0
    });
    //création de la porte c2_3
    porte3 = this.physics.add.staticSprite(2368, 378, "img_porteC2_3", 0);
    open_portec2_3 = false;
    this.anims.create({
      key: "anim_ouvreporte3",
      frames: this.anims.generateFrameNumbers("img_porteC2_3", { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0
    });
    //création de la porte c2_4
    porte4 = this.physics.add.staticSprite(1600, 1498, "img_porteC2_4", 0);
    open_portec2_4 = false;
    this.anims.create({
      key: "anim_ouvreporte4",
      frames: this.anims.generateFrameNumbers("img_porteC2_4", { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0
    });
    //création de la porte c2_5
    porte5 = this.physics.add.staticSprite(2272, 1050, "img_porteC2_5", 0);
    open_portec2_5 = false;
    this.anims.create({
      key: "anim_ouvreporte5",
      frames: this.anims.generateFrameNumbers("img_porteC2_5", { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0
    });


    //création de l'escalier1
    escalier1 = this.physics.add.staticSprite(1054, 2298, "img_escalier1", 0);


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



  }

  update() {
    player.setVelocityX(0);
    player.setVelocityY(0);

    
        //ouverture des portes/escaliers
        if (Phaser.Input.Keyboard.JustDown(interact) == true) {
          //ouverture de la porte 1
          if (open_portec2_1 == false && this.physics.overlap(player, porte1) == true) {
            // le personnage est sur la porte1 et vient d'appuyer sur la touche entrée
            open_portec2_1 = true;
            this.time.delayedCall(500, () => {
              this.scene.start("Salle07");
            });
            porte1.anims.play("anim_ouvreporte1");
          }

          //ouverture de la porte 2
          if (open_portec2_2 == false && this.physics.overlap(player, porte2) == true) {
            // le personnage est sur la porte2 et vient d'appuyer sur la touche entrée
            open_portec2_2 = true;
            this.time.delayedCall(500, () => {
              this.scene.start("Salle08");
            });
            porte2.anims.play("anim_ouvreporte2");
          }
          //ouverture de la porte 3
          if (open_portec2_3 == false && this.physics.overlap(player, porte3) == true) {
            // le personnage est sur la porte3 et vient d'appuyer sur la touche entrée
            open_portec2_3 = true;
            this.time.delayedCall(500, () => {
              this.scene.start("Salle09");
            });
            porte3.anims.play("anim_ouvreporte3");
          }
          //ouverture de la porte 4
          if (open_portec2_4 == false && this.physics.overlap(player, porte4) == true) {
            // le personnage est sur la porte4 et vient d'appuyer sur la touche entrée
            open_portec2_4 = true;
            this.time.delayedCall(500, () => {
              this.scene.start("Salle10");
            });
            porte4.anims.play("anim_ouvreporte4");
          }
          //ouverture de la porte 5
          if (open_portec2_5 == false && this.physics.overlap(player, porte5) == true) {
            // le personnage est sur la porte5 et vient d'appuyer sur la touche entrée
            open_portec2_5 = true;
            this.time.delayedCall(500, () => {
              this.scene.start("Salle01");
            });
            porte5.anims.play("anim_ouvreporte5");
          }
    
          if (this.physics.overlap(player, escalier1) == true) {
            this.scene.start("Couloir1", { x: 3386, y: 2320 });
          }}
    

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


  }
}

