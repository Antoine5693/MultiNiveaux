var player;
var clavier;
var enter;
var interact;

// variables pour la porte de transition vers couloir1
var porte1; // pour la porte de transition vers couloir1
var open_porte1 = false;//gère l'état de la porte 1
var boxes = [];


export default class Salle02 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "Salle02" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    // assets pour le tilemap
    this.load.image("B", "src/assets/Background.png");
    this.load.image("D", "src/assets/Dela_dec2.png");
    this.load.tilemapTiledJSON("carte02", "src/assets/Salle01.tmj");
    this.load.image("box", "src/assets/box.png");

    //asset pour la porte de transition vers couloir1
    this.load.spritesheet("img_porte1", "src/assets/porte1finie.png", {
      frameWidth: 103,
      frameHeight: 128
    });
  }

  create() {

    interact = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // clavier pour les déplacements du personnage
    clavier = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // Création du tilemap et des plateformes à partir de Tiled
    const map = this.add.tilemap("carte02");
    const tileset1 = map.addTilesetImage("Background", "B");
    const tileset3 = map.addTilesetImage("1", "D");
    const calque1 = map.createLayer("Calque de Tuiles 1", [tileset1]);
    const calque3 = map.createLayer("Calque de Tuiles 2", [tileset3]);
    calque1.setCollisionByProperty({ estSolide: true });
    calque3.setCollisionByProperty({ estSolide: true });

    //création de la porte
    porte1 = this.physics.add.staticSprite(335, 65, "img_porte1", 0);
    porte1.setSize(porte1.width, porte1.height / 2);         // hauteur divisée par 2
    porte1.setOffset(0, 0);
    open_porte1 = false;
    open_porte1 = false;
    this.anims.create({
      key: "anim_ouvreporte1",
      frames: this.anims.generateFrameNumbers("img_porte1", {
        start: 0, end: 7

      }),
      frameRate: 20,
      repeat: 0
    });

    player = this.physics.add.sprite(335, 150, "dude.png");
    player.refreshBody();
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, calque1);
    this.physics.add.collider(player, calque3);
    this.physics.add.collider(player, porte1);
    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, this.groupe_plateformes);

    this.boxGroup = this.physics.add.group();

const boxPositions = [
    { x: 100, y: 300 },
    { x: 160, y: 300 },
    { x: 220, y: 300 },
    { x: 280, y: 300 },
    { x: 340, y: 300 },
    { x: 400, y: 300 },
    { x: 460, y: 300 },
    { x: 520, y: 300 },
    { x: 580, y: 300 },
    { x: 640, y: 300 },
    { x: 100, y: 360 },
    { x: 160, y: 360 },
    { x: 220, y: 360 },
    { x: 280, y: 360 },
    { x: 340, y: 360 },
    { x: 400, y: 360 },
    { x: 460, y: 360 },
    { x: 520, y: 360 },
    { x: 580, y: 360 },
    { x: 640, y: 360 },
    { x: 100, y: 420 },
    { x: 160, y: 420 },
    { x: 220, y: 420 },
    { x: 280, y: 420 },
    { x: 340, y: 420 },
    { x: 400, y: 420 },
    { x: 460, y: 420 },
    { x: 520, y: 420 },
    { x: 580, y: 420 },
    { x: 640, y: 420 },
    { x: 100, y: 480 },
    { x: 160, y: 480 },
    { x: 220, y: 480 },
    { x: 280, y: 480 },
    { x: 340, y: 480 },
    { x: 400, y: 480 },
    { x: 460, y: 480 },
    { x: 520, y: 480 },
    { x: 580, y: 480 },
    { x: 640, y: 480 },
    { x: 100, y: 540 },
    { x: 160, y: 540 },
    { x: 220, y: 540 },
    { x: 280, y: 540 },
    { x: 340, y: 540 },
    { x: 400, y: 540 },
    { x: 460, y: 540 },
    { x: 520, y: 540 },
    { x: 580, y: 540 },
    { x: 640, y: 540 }
];
boxPositions.forEach(pos => {
    const b = this.physics.add.sprite(pos.x, pos.y, "box").setScale(0.20);

      const scaledW = b.width * 0.50;
      const scaledH = b.height * 0.50;
      b.setSize(scaledW, scaledH);
      b.setOffset(
        (b.width - scaledW) / 2,
        (b.height - scaledH) / 2
      );

      b.body.setCollideWorldBounds(true);
      b.body.allowGravity = false;
      b.body.setMass(10);
      b.body.setDragX(800);
      b.body.setDragY(800);

      this.physics.add.collider(player, b);

      // ✅ Colliders calques avec arrêt immédiat
      this.physics.add.collider(b, calque1, () => {
        b.setVelocityX(0);
        b.setVelocityY(0);
      });
      this.physics.add.collider(b, calque3, () => {
        b.setVelocityX(0);
        b.setVelocityY(0);
      });

      // ✅ Colliders entre boxes avec arrêt si bloquée
      boxes.forEach(existingBox => {
        this.physics.add.collider(b, existingBox, () => {
          if (b.body.blocked.left || b.body.blocked.right ||
            b.body.blocked.up || b.body.blocked.down) {
            b.setVelocityX(0);
            b.setVelocityY(0);
          }
          if (existingBox.body.blocked.left || existingBox.body.blocked.right ||
            existingBox.body.blocked.up || existingBox.body.blocked.down) {
            existingBox.setVelocityX(0);
            existingBox.setVelocityY(0);
          }
        });
      });

      boxes.push(b);
    });




  }

  update() {



    boxes.forEach(b => {
      // ✅ Si la box touche un mur, elle devient immovable
      if (b.body.blocked.left || b.body.blocked.right ||
        b.body.blocked.up || b.body.blocked.down) {
        b.body.immovable = true;
        b.setVelocityX(0);
        b.setVelocityY(0);
      } else {
        b.body.immovable = false;
      }
    });


    // interaction avec la porte de transition vers couloir1
    if (open_porte1 == false && Phaser.Input.Keyboard.JustDown(interact) == true &&
      this.physics.overlap(player, porte1) == true) {
      // le personnage est sur la porte1 et vient d'appuyer sur la touche entrée
      open_porte1 = true;
      this.time.delayedCall(500, () => {
        // Envoie des coordonnées de respawn à la scène Couloir1
        this.scene.start("Couloir1", { x: 3520, y: 800 });
      });
      porte1.anims.play("anim_ouvreporte1");
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


  }
}
