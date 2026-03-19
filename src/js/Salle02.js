var player;
var clavier;
var bullets;
var lastFired = 0;
var wasSpaceDown = false;
var lastDir = { x: 1, y: 0 };
var enter;
var interact;
var porte1;
var open_porte1 = false;
var boxes = [];
// Variable à ajouter en haut du fichier
var chest_opened = false;
var interact;


export default class Salle02 extends Phaser.Scene {
  constructor() {
    super({ key: "Salle02" });
  }

  preload() {
    this.load.image("B", "src/assets/Background.png");
    this.load.image("D", "src/assets/Dela_dec2.png");
    this.load.tilemapTiledJSON("carte02", "src/assets/Salle01.tmj");
    this.load.image("box", "src/assets/box.png");

    // Sprites Jason
    this.load.image("IdleJason", "src/assets/Jason/IdleJason.png");
    this.load.spritesheet("jason_marcheavant", "src/assets/Jason/jason_marcheavant.png", { frameWidth: 1126 / 6, frameHeight: 320 });
    this.load.spritesheet("jason_back", "src/assets/Jason/jason_back.png", { frameWidth: 984 / 6, frameHeight: 254 });
    this.load.spritesheet("jason_marchedroite", "src/assets/Jason/jason_marchedroite.png", { frameWidth: 769 / 6, frameHeight: 320 });

    // Balles et sons
    this.load.image("img_balle", "src/assets/bullet.png");
    this.load.audio("son_tir", "src/assets/bullet-sound.mp3");

    // Coeurs
    this.load.image("img_heart", "src/assets/heart.png");
    this.load.image("empty_heart", "src/assets/empty_heart.png");

    // Porte
    this.load.spritesheet("img_porte1", "src/assets/porte1finie.png", {
      frameWidth: 103,
      frameHeight: 128
    });
  }

  create() {

    this.sound.stopByKey("son_rodeur");
    this.anims.create({
      key: "anim_chest",
      frames: this.anims.generateFrameNumbers("img_chest_anim", { start: 0, end: 10 }),
      frameRate: 10,
      repeat: 0
    });

    interact = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    clavier = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.sonTir = this.sound.add("son_tir");
    bullets = this.physics.add.group({ allowGravity: false });

    // Tilemap
    const map = this.add.tilemap("carte02");
    const tileset1 = map.addTilesetImage("Background", "B");
    const tileset3 = map.addTilesetImage("1", "D");
    const calque1 = map.createLayer("Calque de Tuiles 1", [tileset1]);
    const calque3 = map.createLayer("Calque de Tuiles 2", [tileset3]);
    calque1.setCollisionByProperty({ estSolide: true });
    calque3.setCollisionByProperty({ estSolide: true });

    // Porte
    porte1 = this.physics.add.staticSprite(335, 65, "img_porte1", 0);
    porte1.setSize(porte1.width, porte1.height / 2);
    porte1.setOffset(0, 0);
    open_porte1 = false;
    this.anims.create({
      key: "anim_ouvreporte1",
      frames: this.anims.generateFrameNumbers("img_porte1", { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0
    });

    // Joueur Jason
    player = this.physics.add.sprite(335, 150, "IdleJason");
    player.setScale(0.4);
    player.setSize(160, 250);
    player.setOffset(40, 20);
    player.setCollideWorldBounds(true);

    // Caméra
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Animations Jason
    this.anims.create({
      key: "anim_tourne_droite",
      frames: this.anims.generateFrameNumbers("jason_marchedroite", { start: 0, end: 5 }),
      frameRate: 10, repeat: -1
    });
    this.anims.create({
      key: "anim_marche_arriere",
      frames: this.anims.generateFrameNumbers("jason_back", { start: 0, end: 5 }),
      frameRate: 10, repeat: -1
    });
    this.anims.create({
      key: "anim_marche_avant",
      frames: this.anims.generateFrameNumbers("jason_marcheavant", { start: 0, end: 5 }),
      frameRate: 10, repeat: -1
    });

    // Coeurs
    let hp = this.registry.get('hp');
    let hpMax = this.registry.get('hpMax');
    if (!hpMax) { hpMax = 3; this.registry.set('hpMax', 3); }
    if (!hp) { hp = 3; this.registry.set('hp', 3); }
    this.hearts = [];
    for (let i = 0; i < hpMax; i++) {
      let h = this.add.image(16 + i * 35, 16, i < hp ? "img_heart" : "empty_heart")
        .setScale(0.09).setOrigin(0, 0).setScrollFactor(0);
      this.hearts.push(h);
    }

    // Colliders calques + porte
    this.physics.add.collider(player, calque1);
    this.physics.add.collider(player, calque3);
    this.physics.add.collider(player, porte1);

    this.physics.add.collider(bullets, calque1, (bullet) => { bullet.destroy(); });
    this.physics.add.collider(bullets, calque3, (bullet) => { bullet.destroy(); });

    // Spawn coffre
    this.spawnChest();

    // Boxes
    this.boxGroup = this.physics.add.group();

    const boxPositions = [
      { x: 100, y: 300 }, { x: 160, y: 300 }, { x: 220, y: 300 }, { x: 280, y: 300 }, { x: 340, y: 300 },
      { x: 400, y: 300 }, { x: 460, y: 300 }, { x: 520, y: 300 }, { x: 580, y: 300 }, { x: 640, y: 300 },
      { x: 100, y: 360 }, { x: 160, y: 360 }, { x: 220, y: 360 }, { x: 280, y: 360 }, { x: 340, y: 360 },
      { x: 400, y: 360 }, { x: 460, y: 360 }, { x: 520, y: 360 }, { x: 580, y: 360 }, { x: 640, y: 360 },
      { x: 100, y: 420 }, { x: 160, y: 420 }, { x: 220, y: 420 }, { x: 280, y: 420 }, { x: 340, y: 420 },
      { x: 400, y: 420 }, { x: 460, y: 420 }, { x: 520, y: 420 }, { x: 580, y: 420 }, { x: 640, y: 420 },
      { x: 100, y: 480 }, { x: 160, y: 480 }, { x: 220, y: 480 }, { x: 280, y: 480 }, { x: 340, y: 480 },
      { x: 400, y: 480 }, { x: 460, y: 480 }, { x: 520, y: 480 }, { x: 580, y: 480 }, { x: 640, y: 480 },
      { x: 100, y: 540 }, { x: 160, y: 540 }, { x: 220, y: 540 }, { x: 280, y: 540 }, { x: 340, y: 540 },
      { x: 400, y: 540 }, { x: 460, y: 540 }, { x: 520, y: 540 }, { x: 580, y: 540 }, { x: 640, y: 540 }
    ];

    boxPositions.forEach(pos => {
      const b = this.physics.add.sprite(pos.x, pos.y, "box").setScale(0.20);
      const scaledW = b.width * 0.50;
      const scaledH = b.height * 0.50;
      b.setSize(scaledW, scaledH);
      b.setOffset((b.width - scaledW) / 2, (b.height - scaledH) / 2);
      b.body.setCollideWorldBounds(true);
      b.body.allowGravity = false;
      b.body.setMass(10);
      b.body.setDragX(800);
      b.body.setDragY(800);

      this.physics.add.collider(player, b);
      this.physics.add.collider(b, calque1, () => { b.setVelocityX(0); b.setVelocityY(0); });
      this.physics.add.collider(b, calque3, () => { b.setVelocityX(0); b.setVelocityY(0); });

      boxes.forEach(existingBox => {
        this.physics.add.collider(b, existingBox, () => {
          if (b.body.blocked.left || b.body.blocked.right || b.body.blocked.up || b.body.blocked.down) {
            b.setVelocityX(0); b.setVelocityY(0);
          }
          if (existingBox.body.blocked.left || existingBox.body.blocked.right ||
            existingBox.body.blocked.up || existingBox.body.blocked.down) {
            existingBox.setVelocityX(0); existingBox.setVelocityY(0);
          }
        });
      });

      boxes.push(b);
    });
    this.artifact = this.registry.get('artifacts') || 0;
  }

  update() {

    boxes.forEach(b => {
      if (b.body.blocked.left || b.body.blocked.right || b.body.blocked.up || b.body.blocked.down) {
        b.body.immovable = true;
        b.setVelocityX(0);
        b.setVelocityY(0);
      } else {
        b.body.immovable = false;
      }
    });

    // Interaction porte
    if (open_porte1 == false && Phaser.Input.Keyboard.JustDown(interact) == true &&
      this.physics.overlap(player, porte1) == true) {
      open_porte1 = true;
      this.time.delayedCall(500, () => {
        this.scene.start("Couloir1", { x: 3520, y: 800 });
      });
      porte1.anims.play("anim_ouvreporte1");
    }

    // Déplacements
    player.setVelocity(0);

    if (clavier.left.isDown) {
      player.setVelocityX(-160);
      player.setScale(0.6);
      player.setSize(100, 150);
      player.setFlipX(true);
      player.anims.play("anim_tourne_droite", true);
    } else if (clavier.right.isDown) {
      player.setVelocityX(160);
      player.setScale(0.6);
      player.setSize(100, 150);
      player.setFlipX(false);
      player.anims.play("anim_tourne_droite", true);
    }

    if (clavier.up.isDown) {
      player.setVelocityY(-160);
      player.setScale(0.55);
      player.setSize(100, 150);
      player.setOffset(player.width / 2 - 50, player.height / 2 - 75);
      player.anims.play("anim_marche_arriere", true);
    } else if (clavier.down.isDown) {
      player.setVelocityY(160);
      player.setScale(0.45);
      player.setSize(130, 200);
      player.setOffset(player.width / 2 - 65, player.height / 2 - 75);
      player.anims.play("anim_marche_avant", true);
    }

    // Idle
    if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
      player.setTexture("IdleJason");
      player.setScale(0.4);
      player.setSize(160, 250);
      player.setOffset(40, 20);
    }

    // Direction pour tirer
    if (clavier.left.isDown) { lastDir.x = -1; lastDir.y = 0; }
    else if (clavier.right.isDown) { lastDir.x = 1; lastDir.y = 0; }
    if (clavier.up.isDown) { lastDir.y = -1; lastDir.x = 0; }
    else if (clavier.down.isDown) { lastDir.y = 1; lastDir.x = 0; }

    // Tir
    if (this.keySpace.isDown && !wasSpaceDown && this.time.now > lastFired) {
      let bullet = bullets.create(player.x, player.y, "img_balle");
      bullet.setScale(0.25);
      this.sonTir.play();
      bullet.setVelocityX(400 * lastDir.x);
      bullet.setVelocityY(400 * lastDir.y);
      lastFired = this.time.now + 300;
    }
    wasSpaceDown = this.keySpace.isDown;
  }



spawnChest() {
  this.chest = this.physics.add.sprite(
    this.cameras.main.width /4,
    this.cameras.main.height -75,
    "img_chest_anim", 0
  );
  const w = this.chest.displayWidth;
  const h = this.chest.displayHeight;
  this.chest.setSize(w / 2, h / 2);
  this.chest.setOffset(w / 4, h / 2);
  this.chest.setImmovable(true);
  this.physics.add.collider(this.chest, player);

  this.chestZone = this.add.zone(this.chest.x, this.chest.y, w * 2, h * 2);
  this.physics.add.existing(this.chestZone, true);

  this.physics.add.overlap(player, this.chestZone, () => {
    if (Phaser.Input.Keyboard.JustDown(interact) && !chest_opened) {
      this.chest.anims.play("anim_chest", true);
      
      chest_opened = true;
      this.artifact += 1;
      this.registry.set('artifacts', this.artifact);
      
      this.add.text(this.chest.x, this.chest.y - 50, 
      `ARTEFACT OBTENU ! Plus que ${3 - this.artifact}/3`, {
      fontSize: '16px', fill: '#fff'
    }).setOrigin(0.5);
    }
  });
}}