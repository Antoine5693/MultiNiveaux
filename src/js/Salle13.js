var player;
var clavier;
var bullets;
var lastFired = 0;
var wasSpaceDown = false;
var lastDir = { x: 1, y: 0 };
var enter;
var interact;
var bouton1, bouton2, bouton3;
var lumière1, lumière2, lumière3;
var bouton1Active = false;
var bouton2Active = false;
var bouton3Active = false;
var rep = false;
var chest_opened = false;
var interact;

// variables pour la porte de transition vers couloir1
var porte;
var open_porte1 = false;

export default class Salle13 extends Phaser.Scene {
  constructor() {
    super({ key: "Salle13" });
  }

  preload() {
    this.load.image("B", "src/assets/Background.png");
    this.load.image("D", "src/assets/Dela_dec2.png");
    this.load.image("Lamps1", "src/assets/lumière allumé (1).png");
    this.load.image("Lamps2", "src/assets/lumière eteint (1).png");
    this.load.image("Bouton", "src/assets/red-button.png");
    this.load.tilemapTiledJSON("carte13", "src/assets/Salle01.tmj");

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
    
    chest_opened = false;
    this.artifact = this.registry.get('artifacts') || 0;

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
    const map = this.add.tilemap("carte13");
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

    // Bouton 1
    bouton1 = this.physics.add.staticSprite(200, 300, "Bouton", 0).setScale(0.1);
    bouton1.setSize(bouton1.width * 0.1, bouton1.height * 0.1);
    bouton1.refreshBody();

    // Bouton 2
    bouton2 = this.physics.add.staticSprite(335, 300, "Bouton", 0).setScale(0.1);
    bouton2.setSize(bouton2.width * 0.1, bouton2.height * 0.1);
    bouton2.refreshBody();

    // Bouton 3
    bouton3 = this.physics.add.staticSprite(470, 300, "Bouton", 0).setScale(0.1);
    bouton3.setSize(bouton3.width * 0.1, bouton3.height * 0.1);
    bouton3.refreshBody();

    // Lampe 1 (éteinte)
    lumière1 = this.physics.add.staticSprite(200, 400, "Lamps2", 0).setScale(0.25);
    lumière1.setSize(lumière1.width * 0.1, lumière1.height * 0.1);
    lumière1.refreshBody();

    // Lampe 2 (éteinte)
    lumière2 = this.physics.add.staticSprite(335, 400, "Lamps2", 0).setScale(0.25);
    lumière2.setSize(lumière2.width * 0.1, lumière2.height * 0.1);
    lumière2.refreshBody();

    // Lampe 3 (éteinte)
    lumière3 = this.physics.add.staticSprite(470, 400, "Lamps2", 0).setScale(0.25);
    lumière3.setSize(lumière3.width * 0.1, lumière3.height * 0.1);
    lumière3.refreshBody();

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
    const justInteract = Phaser.Input.Keyboard.JustDown(interact);

    // Bouton 1 — allume/éteint
    if (justInteract && this.physics.overlap(player, bouton1)) {
      bouton1Active = !bouton1Active;
      lumière1.setTexture(bouton1Active ? "Lamps1" : "Lamps2");
      lumière1.refreshBody();
      rep = (!bouton1Active && !bouton2Active && bouton3Active);
      if (rep) this.spawnChest();
    }

    // Bouton 2 — allume/éteint
    if (justInteract && this.physics.overlap(player, bouton2)) {
      bouton2Active = !bouton2Active;
      lumière2.setTexture(bouton2Active ? "Lamps1" : "Lamps2");
      lumière2.refreshBody();
      rep = (!bouton1Active && !bouton2Active && bouton3Active);
      if (rep) this.spawnChest(); // 
    }

    // Bouton 3 — allume/éteint
    if (justInteract && this.physics.overlap(player, bouton3)) {
      bouton3Active = !bouton3Active;
      lumière3.setTexture(bouton3Active ? "Lamps1" : "Lamps2");
      lumière3.refreshBody();
      rep = (!bouton1Active && !bouton2Active && bouton3Active);
      if (rep) this.spawnChest(); // 
    }

    // Interaction porte
    if (open_porte1 == false && justInteract && this.physics.overlap(player, porte)) {
      open_porte1 = true;
      this.time.delayedCall(500, () => {
        this.scene.start("Couloir3", { x: 1204, y: 1696 });
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
      this.cameras.main.width / 4,
      this.cameras.main.height - 75,
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
  }
}