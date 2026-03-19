var player;
var clavier;
var bullets;
var lastFired = 0;
var wasSpaceDown = false;
var lastDir = { x: 1, y: 0 };
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
    this.load.spritesheet("img_porteC3_1", "src/assets/porte1finie.png", { frameWidth: 103, frameHeight: 128 });
    this.load.spritesheet("img_porteC3_2", "src/assets/porte1finie.png", { frameWidth: 103, frameHeight: 128 });
    this.load.spritesheet("img_porteC3_3", "src/assets/porte1finie.png", { frameWidth: 103, frameHeight: 128 });
    this.load.spritesheet("img_porteC3_4", "src/assets/porte1finie.png", { frameWidth: 103, frameHeight: 128 });
    /*this.load.spritesheet("img_porteC3_5", "src/assets/porte1finie.png", { frameWidth: 103, frameHeight: 128 });*/

    // Escalier
    this.load.image("img_escalier1", "src/assets/escalier.png", { frameWidth: 50, frameHeight: 200 });

    // Rodeur
    this.load.spritesheet("rodeurGauche", "src/assets/rodeurG.png", { frameWidth: 151, frameHeight: 178 });
    this.load.spritesheet("rodeurDroite", "src/assets/rodeurD.png", { frameWidth: 160, frameHeight: 162 });
    this.load.audio("son_rodeur", "src/assets/rodeur_sound.mp3");
    this.load.audio("son_screamer", "src/assets/elf-fang-screamer.mp3");
    this.load.image("img_screamer", "src/assets/tetescreemer.png");
  }

  create() {

    interact = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);


    // clavier pour les déplacements du personnage
    clavier = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.sonTir = this.sound.add("son_tir");
    bullets = this.physics.add.group({ allowGravity: false });

    // Tilemap
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
    porte5 = this.physics.add.staticSprite(1535, 512, "img_porteC3_5", 0);
    open_portec3_5 = false;
    this.anims.create({
      key: "anim_ouvreporte5",
      frames: this.anims.generateFrameNumbers("img_porteC3_5", { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0
    });

    escalier1 = this.physics.add.staticSprite(1536, 2420, "img_escalier1", 0);
    const e1w = escalier1.width;
    const e1h = escalier1.height;
    escalier1.setSize(e1w, e1h - 150);
    this.zone_escalier1 = this.add.zone(1536, 2420, e1w, e1h);
    this.zone_escalier1.setOrigin(0.5, 0.5);
    this.physics.add.existing(this.zone_escalier1, true);


    player = this.physics.add.sprite(startX, startY, "IdleJason");
    player.setScale(0.4);
    player.setSize(160, 250);
    player.setOffset(40, 20);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, calque1);
    this.physics.add.collider(player, calque2);
    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, this.groupe_plateformes);

    // Caméra centrée sur le joueur
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

    // Animations rodeur
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

    // Rodeur
    this.rodeur = this.physics.add.sprite(1500, 1300, "rodeurDroite");
    this.rodeur.setScale(0.6);
    this.rodeur.body.setSize(60, 90);
    this.rodeur.body.setOffset(50, 70);
    this.sonRodeur = this.sound.add("son_rodeur", { loop: true, volume: 0.4 });
    this.sonRodeur.play();
    this.rodeur.anims.play("rodeurDroite", true);
    this.physics.add.collider(this.rodeur, calque1);
    this.physics.add.collider(this.rodeur, calque2);
    this.physics.add.overlap(player, this.rodeur, () => {
    
    // Stoppe le joueur et le rodeur
    player.setVelocity(0);
    this.rodeur.setVelocity(0);

    // Affiche l'image du screamer sur toute la caméra
    let screamer = this.add.image(this.cameras.main.scrollX + this.cameras.main.width / 2,
                                  this.cameras.main.scrollY + this.cameras.main.height / 2,
                                  "img_screamer");
    screamer.setOrigin(0.5, 0.5);
    screamer.setDepth(100); // au-dessus de tout
    screamer.setScale(1.5); // optionnel : agrandir si nécessaire
    screamer.setScrollFactor(0); // reste fixe à l'écran

    // Joue le son du screamer
    this.sound.play("son_screamer", { volume: 1 });

    // Après 1.5 secondes, retourne au menu
    this.time.delayedCall(1500, () => {
        this.scene.start("Menu");
     });
   });
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

    /*porte5.setSize(103, 64);
    porte5.setOffset(0, 0);
    this.physics.add.collider(player, porte5);*/

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

    // Ouverture des portes / escaliers
    if (Phaser.Input.Keyboard.JustDown(interact) == true) {

      if (open_portec3_1 == false && this.physics.overlap(player, porte1) == true) {
        // le personnage est sur la porte1 et vient d'appuyer sur la touche entrée
        open_portec3_1 = true;
        porte1.anims.play("anim_ouvreporte1");
        this.time.delayedCall(500, () => { this.scene.start("Salle11"); });
        this.time.delayedCall(500, () => {
          this.scene.start("Salle11");
        });
      }

      if (open_portec3_2 == false && this.physics.overlap(player, porte2) == true) {
        open_portec3_2 = true;
        porte2.anims.play("anim_ouvreporte2");
        this.time.delayedCall(500, () => { this.scene.start("Salle12"); });
      }

      if (open_portec3_3 == false && this.physics.overlap(player, porte3) == true) {
        open_portec3_3 = true;
        porte3.anims.play("anim_ouvreporte3");
        this.time.delayedCall(500, () => { this.scene.start("Salle13"); });
      }

      if (open_portec3_4 == false && this.physics.overlap(player, porte4) == true) {
        open_portec3_4 = true;
        porte4.anims.play("anim_ouvreporte4");
        this.time.delayedCall(500, () => { this.scene.start("Salle14"); });
      }
      if (open_portec3_5 == false && this.physics.overlap(player, porte5) == true) {
        // le personnage est sur la porte5 et vient d'appuyer sur la touche entrée
        open_portec3_5 = true;
        porte5.anims.play("anim_ouvreporte5");
        this.time.delayedCall(500, () => { this.scene.start("selection"); });
      }
      this.time.delayedCall(500, () => {
        this.scene.start("BossZone");
      });
      porte5.anims.play("anim_ouvreporte5");
    

    if (this.physics.overlap(player, this.zone_escalier1) == true) {
      this.scene.start("Couloir1", { x: 1279, y: 2110 });
    }
  }

    // IA du rodeur
    if (this.rodeur && player) {
      let dx = player.x - this.rodeur.x;
      let dy = player.y - this.rodeur.y;
      let vitesse = 60;

      this.rodeur.setVelocityX(0);
      this.rodeur.setVelocityY(0);

      if (dx > 5) {
        this.rodeur.setVelocityX(vitesse);
        this.rodeur.anims.play("rodeurDroite", true);
      } else if (dx < -5) {
        this.rodeur.setVelocityX(-vitesse);
        this.rodeur.anims.play("rodeurGauche", true);
      }

      if (dy > 5) this.rodeur.setVelocityY(vitesse);
      else if (dy < -5) this.rodeur.setVelocityY(-vitesse);
    }
  }
}