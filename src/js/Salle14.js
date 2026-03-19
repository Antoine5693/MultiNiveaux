var player;
var clavier;
var bullets;
var lastFired = 0;
var wasSpaceDown = false;
var lastDir = { x: 1, y: 0 };
var enter;
var interact;
var porte;
var open_porte1 = false;
var CibleA, CibleB, CibleC;
var cibleATouchee = false;
var cibleBTouchee = false;
var cibleCTouchee = false;
var rep = false;

export default class Salle14 extends Phaser.Scene {
  constructor() {
    super({ key: "Salle14" });
  }

  preload() {
    this.load.image("B", "src/assets/Background.png");
    this.load.image("D", "src/assets/Dela_dec2.png");
    this.load.image("Cible", "src/assets/Cible1.png");
    this.load.tilemapTiledJSON("carte14", "src/assets/Salle01.tmj");

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
    interact = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    clavier = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.sonTir = this.sound.add("son_tir");
    bullets = this.physics.add.group({ allowGravity: false });

    // Tilemap
    const map = this.add.tilemap("carte14");
    const tileset1 = map.addTilesetImage("Background", "B");
    const tileset3 = map.addTilesetImage("1", "D");
    const calque1 = map.createLayer("Calque de Tuiles 1", [tileset1]);
    const calque3 = map.createLayer("Calque de Tuiles 2", [tileset3]);
    calque1.setCollisionByProperty({ estSolide: true });
    calque3.setCollisionByProperty({ estSolide: true });

    // Porte
    porte = this.physics.add.staticSprite(335, 65, "img_porte1", 0);
    porte.setSize(porte.width, porte.height / 2);
    porte.setOffset(0, 0);
    open_porte1 = false;
    this.anims.create({
      key: "anim_ouvreporte1",
      frames: this.anims.generateFrameNumbers("img_porte1", { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0
    });

    
// Cible A
CibleA = this.physics.add.staticSprite(150, 425, "Cible").setScale(0.15);
CibleA.setSize(CibleA.width * 0.15, CibleA.height * 0.15);
CibleA.refreshBody();

// Cible B
CibleB = this.physics.add.staticSprite(335, 425, "Cible").setScale(0.15);
CibleB.setSize(CibleB.width * 0.15, CibleB.height * 0.15);
CibleB.refreshBody();

// Cible C
CibleC = this.physics.add.staticSprite(520, 425, "Cible").setScale(0.15);
CibleC.setSize(CibleC.width * 0.15, CibleC.height * 0.15);
CibleC.refreshBody();

//  Balles sur cible A
this.physics.add.overlap(bullets, CibleA, (bullet, cible) => {
    bullet.destroy();
    cible.destroy();
    cibleATouchee = true;
    rep = (cibleATouchee && cibleBTouchee && cibleCTouchee); // 
});

//  Balles sur cible B
this.physics.add.overlap(bullets, CibleB, (bullet, cible) => {
    bullet.destroy();
    cible.destroy();
    cibleBTouchee = true;
    rep = (cibleATouchee && cibleBTouchee && cibleCTouchee); // 
});

//  Balles sur cible C
this.physics.add.overlap(bullets, CibleC, (bullet, cible) => {
    bullet.destroy();
    cible.destroy();
    cibleCTouchee = true;
    rep = (cibleATouchee && cibleBTouchee && cibleCTouchee); // 
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

    // Colliders
    this.physics.add.collider(player, calque1);
    this.physics.add.collider(player, calque3);
    this.physics.add.collider(player, porte);

    this.physics.add.collider(bullets, calque1, (bullet) => { bullet.destroy(); });
    this.physics.add.collider(bullets, calque3, (bullet) => { bullet.destroy(); });
  }

  update() {

    // Interaction porte
    if (open_porte1 == false && Phaser.Input.Keyboard.JustDown(interact) == true &&
      this.physics.overlap(player, porte) == true) {
      open_porte1 = true;
      this.time.delayedCall(500, () => {
        this.scene.start("Couloir3", { x: 1876, y: 1696 });
      });
      porte.anims.play("anim_ouvreporte1");
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
    lastDir.x = 0;
    lastDir.y = 0;
    if (clavier.left.isDown) lastDir.x = -1;
    if (clavier.right.isDown) lastDir.x = 1;
    if (clavier.up.isDown) lastDir.y = -1;
    if (clavier.down.isDown) lastDir.y = 1;

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
}
