var player;
var clavier;
var bullets;
var lastFired = 0;
var wasSpaceDown = false;
var lastDir = { x: 1, y: 0 };
var enter;
var interact;
var porte1;
var open_portec2_1 = false;
var porte2;
var open_portec2_2 = false;
var porte3;
var open_portec2_3 = false;
var porte4;
var open_portec2_4 = false;
var porte5;
var open_portec2_5 = false;
var escalier1;

export default class Couloir2 extends Phaser.Scene {
  constructor() {
    super({
      key: "Couloir2"
    });
  }

  preload() {
    this.load.image("B", "src/assets/Background.png");
    this.load.image("B2", "src/assets/Background2.png");
    this.load.image("D1", "src/assets/Dela_dec1.png");
    this.load.image("D2", "src/assets/Dela_dec2.png");
    this.load.tilemapTiledJSON("carte4", "src/assets/Couloir2.tmj");

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

    // Portes
    this.load.spritesheet("img_porteC2_1", "src/assets/porte1finie.png", { frameWidth: 103, frameHeight: 128 });
    this.load.spritesheet("img_porteC2_2", "src/assets/porte1finie.png", { frameWidth: 103, frameHeight: 128 });
    this.load.spritesheet("img_porteC2_3", "src/assets/porte1finie.png", { frameWidth: 103, frameHeight: 128 });
    this.load.spritesheet("img_porteC2_4", "src/assets/porte1finie.png", { frameWidth: 103, frameHeight: 128 });
    this.load.spritesheet("img_porteC2_5", "src/assets/porte1finie.png", { frameWidth: 103, frameHeight: 128 });

    // Escalier
    this.load.image("img_escalier1", "src/assets/escalier.png", { frameWidth: 50, frameHeight: 200 });
  }

  create() {

    this.sound.stopByKey("attaque_blob");
    this.sound.stopByKey("son_zombie_attaque");
    this.sound.stopByKey("son_rodeur");
    interact = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    clavier = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.sonTir = this.sound.add("son_tir");
    bullets = this.physics.add.group({ allowGravity: false });

    // Tilemap
    const map = this.add.tilemap("carte4");
    const tileset1 = map.addTilesetImage("2", "B");
    const tileset2 = map.addTilesetImage("333", "B2");
    const tileset3 = map.addTilesetImage("3", "D1");
    const tileset4 = map.addTilesetImage("1", "D2");
    const calque1 = map.createLayer("Calque de Tuiles 1", [tileset1, tileset3, tileset4, tileset2]);
    const calque2 = map.createLayer("Calque de Tuiles 2", [tileset2, tileset3, tileset4, tileset1]);
    calque1.setCollisionByProperty({ estSolide: true });
    calque2.setCollisionByProperty({ estSolide: true });

    // Spawn du joueur
    const spawn = this.scene.settings.data || {};
    const startX = spawn.x ?? 1056;
    const startY = spawn.y ?? 2204;

    // Création des portes
    porte1 = this.physics.add.staticSprite(1107, 383, "img_porteC2_1", 0);
    open_portec2_1 = false;
    this.anims.create({
      key: "anim_ouvreporte1",
      frames: this.anims.generateFrameNumbers("img_porteC2_1", { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0
    });

    porte2 = this.physics.add.staticSprite(1681, 383, "img_porteC2_2", 0);
    open_portec2_2 = false;
    this.anims.create({
      key: "anim_ouvreporte2",
      frames: this.anims.generateFrameNumbers("img_porteC2_2", { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0
    });

    porte3 = this.physics.add.staticSprite(2353, 383, "img_porteC2_3", 0);
    open_portec2_3 = false;
    this.anims.create({
      key: "anim_ouvreporte3",
      frames: this.anims.generateFrameNumbers("img_porteC2_3", { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0
    });

    porte4 = this.physics.add.staticSprite(1585, 1503, "img_porteC2_4", 0);
    open_portec2_4 = false;
    this.anims.create({
      key: "anim_ouvreporte4",
      frames: this.anims.generateFrameNumbers("img_porteC2_4", { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0
    });

    porte5 = this.physics.add.staticSprite(2257, 1055, "img_porteC2_5", 0);
    open_portec2_5 = false;
    this.anims.create({
      key: "anim_ouvreporte5",
      frames: this.anims.generateFrameNumbers("img_porteC2_5", { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0
    });

    // Escalier — hitbox physique + zone de détection
    escalier1 = this.physics.add.staticSprite(1054, 2298, "img_escalier1", 0);
    var e1w = escalier1.width;
    var e1h = escalier1.height;
    escalier1.setSize(e1w, e1h - 150); // hitbox réduite
    this.zone_escalier1 = this.add.zone(1054, 2298, e1w, e1h); // zone pleine taille
    this.physics.add.existing(this.zone_escalier1, true);


    // Joueur Jason
    player = this.physics.add.sprite(startX, startY, "IdleJason");
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
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "anim_marche_arriere",
      frames: this.anims.generateFrameNumbers("jason_back", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "anim_marche_avant",
      frames: this.anims.generateFrameNumbers("jason_marcheavant", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
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

    // ---- COLLIDERS CALQUES ----
    this.physics.add.collider(player, calque1);
    this.physics.add.collider(player, calque2);

    this.physics.add.collider(bullets, calque1, (bullet) => { bullet.destroy(); });
    this.physics.add.collider(bullets, calque2, (bullet) => { bullet.destroy(); });

    // ---- HITBOX MOITIÉ SUPÉRIEURE + COLLIDERS PORTES ----
    porte1.setSize(103, 64);
    porte1.setOffset(0, 0);
    this.physics.add.collider(player, porte1);

    porte2.setSize(103, 64);
    porte2.setOffset(0, 0);
    this.physics.add.collider(player, porte2);

    porte3.setSize(103, 64);
    porte3.setOffset(0, 0);
    this.physics.add.collider(player, porte3);

    porte4.setSize(103, 64);
    porte4.setOffset(0, 0);
    this.physics.add.collider(player, porte4);

    porte5.setSize(103, 64);
    porte5.setOffset(0, 0);
    this.physics.add.collider(player, porte5);

    // ---- COLLIDER ESCALIER ----
    this.physics.add.collider(player, escalier1);
  }

  update() {

    player.setVelocity(0);

    // Déplacement horizontal
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

    // Déplacement vertical
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
    if (clavier.left.isDown) {
  lastDir.x = -1;
  lastDir.y = 0;
  }

  else if (clavier.right.isDown) {
  lastDir.x = 1;
  lastDir.y = 0;
  }

  else if (clavier.up.isDown) {
  lastDir.x = 0;
  lastDir.y = -1;
  }

  else if (clavier.down.isDown) {
  lastDir.x = 0;
  lastDir.y = 1;
  }

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

    // Ouverture des portes / escaliers
    if (Phaser.Input.Keyboard.JustDown(interact) == true) {

      if (open_portec2_1 == false && this.physics.overlap(player, porte1) == true) {
        open_portec2_1 = true;
        porte1.anims.play("anim_ouvreporte1");
        this.time.delayedCall(500, () => { this.scene.start("Salle07"); });
      }

      if (open_portec2_2 == false && this.physics.overlap(player, porte2) == true) {
        open_portec2_2 = true;
        porte2.anims.play("anim_ouvreporte2");
        this.time.delayedCall(500, () => { this.scene.start("Salle08"); });
      }

      if (open_portec2_3 == false && this.physics.overlap(player, porte3) == true) {
        open_portec2_3 = true;
        porte3.anims.play("anim_ouvreporte3");
        this.time.delayedCall(500, () => { this.scene.start("Salle09"); });
      }

      if (open_portec2_4 == false && this.physics.overlap(player, porte4) == true) {
        open_portec2_4 = true;
        porte4.anims.play("anim_ouvreporte4");
        this.time.delayedCall(500, () => { this.scene.start("Salle10"); });
      }

      if (open_portec2_5 == false && this.physics.overlap(player, porte5) == true) {
        open_portec2_5 = true;
        porte5.anims.play("anim_ouvreporte5");
        this.time.delayedCall(500, () => { this.scene.start("Salle01"); });
      }

      if (this.physics.overlap(player, this.zone_escalier1) == true) {
        this.scene.start("Couloir1", { x: 3392, y: 2330 });
      }
    }
  }
}