var player; // désigne le sprite du joueur
var clavier; // pour la gestion du clavier
var bullets; // groupe de projectiles tirés par le joueur
var lastFired = 0;
var wasSpaceDown = false;
var lastDir = { x: 1, y: 0 }; // direction dans laquelle le joueur regarde
var chest_opened = false; // pour éviter de rejouer l'animation du coffre une fois ouvert
var zone1; // zone de détection pour le PNJ
var zone2; // zone de détection pour le PNJ
var zone3; // zone de détection pour le PNJ
var zone4; // zone de détection pour le PNJ
var hasgun = false; // pour savoir si le joueur a récupéré le pistolet dans le PNJ

var zone; // zone de détection pour le PNJ
var interact; // touche pour interagir avec les éléments du jeu
var P;
var V;
var O;
var U;
var interact;
var porte; // pour la porte de transition vers le niveau 2
var open_porte1 = false;//gère l'état de la porte 1

export default class selection extends Phaser.Scene {
  constructor() {
    super({ key: "selection" });
  }

  preload() {
    // tous les assets du jeu sont placés dans le sous-répertoire src/assets/
    this.load.image("img_ciel", "src/assets/sky.png");
    this.load.image("img_plateforme", "src/assets/platform.png");
    this.load.spritesheet("img_perso", "src/assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });
    this.load.image("img_rondblanc", "src/assets/rondblanc.png");
    this.load.image("img_heart", "src/assets/heart.png");
    this.load.spritesheet("img_chest_anim", "src/assets/caisse.png", {
      frameWidth: 72,
      frameHeight: 62
    });
    // assets pour le tilemap
    this.load.image("tuiles_de_jeu1", "src/assets/tileset1.png");
    this.load.image("tuiles_de_jeu3", "src/assets/tileset2.png");
    this.load.tilemapTiledJSON("carte", "src/assets/SafeZone.tmj");

    // asset pour le npc
    this.load.image('npc1', 'src/assets/PNJFILLE1.png');
    this.load.image('npc2', 'src/assets/PNJHOMME1.png');
    this.load.image('npc3', 'src/assets/PNJFILLE2.png');

    this.load.spritesheet('npc4', 'src/assets/Militaire.png', {
      frameWidth: 513 / 4,
      frameHeight: 210
    });


    // Charger le sprite sheet des mobs avec leur sons
    //boss zombie
    this.load.spritesheet("boss_zombie", "src/assets/Zombie boss attack spritesheet.png", {
      frameWidth: 154,
      frameHeight: 159
    });
    this.load.spritesheet("boss_jump1", "src/assets/Zombie boss jump1 spritesheet.png", {
      frameWidth: 126,
      frameHeight: 225
    });
    this.load.spritesheet("boss_jump2", "src/assets/Zombie boss jump2 spritesheet.png", {
      frameWidth: 135,
      frameHeight: 201
    });
    this.load.spritesheet("boss_jump3", "src/assets/Zombie boss jump3 spritesheet.png", {
      frameWidth: 134,
      frameHeight: 140
    });
    this.load.spritesheet("boss_mort", "src/assets/Zombie boss deaths spritesheet.png", {
      frameWidth: 168,
      frameHeight: 169
    });
    this.load.spritesheet("boss_moveG", "src/assets/zombiebossdéplacementG.png", {
      frameWidth: 205,
      frameHeight: 285
    });
    this.load.spritesheet("boss_moveD", "src/assets/zombiebossdéplacementD.png", {
      frameWidth: 221,
      frameHeight: 257
    });
    this.load.audio("son_attaquesautee", "src/assets/boss_zombie_jumpattaque_sound.mp3");
    this.load.audio("son_épée", "src/assets/bosszombie_attaque_sound.mp3");
    this.load.audio("growl", "src/assets/growling_sound.mp3");
    //slime
    this.load.spritesheet("blob_mort", "src/assets/blob mort.png", {
      frameWidth: 68,
      frameHeight: 58
    });

    this.load.spritesheet("blob_move", "src/assets/blob move.png", {
      frameWidth: 25,
      frameHeight: 51,
      spacing : 24
    });

    this.load.spritesheet("blob_attaque", "src/assets/blob attaque.png", {
      frameWidth: 79,
      frameHeight: 58
    });
    this.load.audio("attaque_blob", "src/assets/slime_attack.mp3");


    this.load.spritesheet("zombie_mort", "src/assets/zombiemort.png", {
      frameWidth: 32,
      frameHeight: 30
    });
    this.load.spritesheet("zombie_deplacement", "src/assets/zombiedeplacement.png", {
      frameWidth: 30,
      frameHeight: 30
    });
    this.load.spritesheet("zombie_attaque", "src/assets/zombieattaque.png", {
      frameWidth: 31,
      frameHeight: 32
    });
    this.load.spritesheet("img_porte1", "src/assets/porte1finie.png", {
      frameWidth: 103,
      frameHeight: 128
    });


    this.load.image("Dummy0", "src/assets/Dummy/Dummy0.png");
    this.load.image("Dummy1", "src/assets/Dummy/Dummy1.png");
    this.load.image("Dummy2", "src/assets/Dummy/Dummy2.png");
    this.load.image("Dummy3", "src/assets/Dummy/Dummy3.png");
    this.load.image("Dummy4", "src/assets/Dummy/Dummy4.png");
    this.load.image("Dummy5", "src/assets/Dummy/Dummy5.png");


  }


  create() {

    this.add.image(0, 0, "img_heart").setScale(0.09).setOrigin(0, 0);
    this.add.image(35, 0, "img_heart").setScale(0.09).setOrigin(0, 0);
    this.add.image(70, 0, "img_heart").setScale(0.09).setOrigin(0, 0);

    bullets = this.physics.add.group({
      allowGravity: false
    });
    //sons mobs
    this.sonAttaqueSautée = this.sound.add("son_attaquesautee");
    this.sonAttaqueÉpée = this.sound.add("son_épée");
    this.sonAttaqueBlob = this.sound.add("attaque_blob");
    this.sonGrowl = this.sound.add("growl");

    this.anims.create({
      key: "boss_attack",
      frames: this.anims.generateFrameNumbers("boss_zombie", { start: 0, end: 4 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: "boss_jump1",
      frames: this.anims.generateFrameNumbers("boss_jump1", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: 0
    });

    this.anims.create({
      key: "boss_jump2",
      frames: this.anims.generateFrameNumbers("boss_jump2", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: 0
    });

    this.anims.create({
      key: "boss_jump3",
      frames: this.anims.generateFrameNumbers("boss_jump3", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: 0
    });

    this.anims.create({
      key: "boss_moveG",
      frames: this.anims.generateFrameNumbers("boss_moveG", { start: 0, end: 6 }),
      frameRate: 8,
      repeat: 0
    });

    this.anims.create({
      key: "boss_moveD",
      frames: this.anims.generateFrameNumbers("boss_moveD", { start: 0, end: 5 }),
      frameRate: 8,
      repeat: 0
    });


    this.anims.create({
      key: "boss_mort",
      frames: this.anims.generateFrameNumbers("boss_mort", { start: 0, end: 24 }),
      frameRate: 8,
      repeat: 0
    });

    this.anims.create({
      key: "blob_mort",
      frames: this.anims.generateFrameNumbers("blob_mort", { start: 0, end: 8 }),
      frameRate: 8,
      repeat: 0
    });

    this.anims.create({
      key: "blob_move",
      frames: this.anims.generateFrameNumbers("blob_move", { start: 0, end: 7 }),
      frameRate: 8,
      repeat: 0
    });

    this.anims.create({
      key: "blob_attaque",
      frames: this.anims.generateFrameNumbers("blob_attaque", { start: 0, end: 9 }),
      frameRate: 8,
      repeat: 0
    });

    this.anims.create({
      key: "zombie_mort",
      frames: this.anims.generateFrameNumbers("zombie_mort", { start: 0, end: 7 }),
      frameRate: 8,
      repeat: 0
    });

    this.anims.create({
      key: "zombie_deplacement",
      frames: this.anims.generateFrameNumbers("zombie_deplacement", { start: 0, end: 7 }),
      frameRate: 8,
      repeat: 0
    });

    this.anims.create({
      key: "zombie_attaque",
      frames: this.anims.generateFrameNumbers("zombie_attaque", { start: 0, end: 6 }),
      frameRate: 8,
      repeat: 0
    });

    this.anims.create({
      key: "anim_Dummy",
      frames: [
        { key: "Dummy0" },
        { key: "Dummy1" },
        { key: "Dummy2" },
        { key: "Dummy3" },
        { key: "Dummy4" },
        { key: "Dummy5" }
      ],
      frameRate: 13,
      repeat: 0
    });
    this.bossPatterns = [
    "jumpAttack",
    "swordAttack",
    "moveAttack"
    ];
    // Système d'enchaînement des animations jump
    this.jumpSequence = ['boss_jump1', 'boss_jump2', 'boss_jump3'];
    this.currentJumpIndex = 0;

    // Fonction pour passer à l'animation suivante
    this.nextJumpAnimation = () => {
      this.currentJumpIndex = (this.currentJumpIndex + 1) % this.jumpSequence.length;
      this.boss.anims.play(this.jumpSequence[this.currentJumpIndex]).setOrigin(1, 1);
    };

    this.chest = this.physics.add.sprite(400, 300, "img_chest_anim", 0);
    this.chest.setImmovable(true); // Le coffre ne bougera pas lorsqu'il sera touché par le joueur

    // Désactive le corps physics + visibilité si tu veux qu'il disparaisse aussi
    this.chest.body.enable = false;

    // Création du tilemap et des plateformes à partir de Tiled
    const map = this.add.tilemap("carte");
    const tileset1 = map.addTilesetImage("1", "tuiles_de_jeu1");
    const tileset3 = map.addTilesetImage("3", "tuiles_de_jeu3");
    const calque1 = map.createLayer("Calque de Tuiles 1", [tileset1]);
    const calque3 = map.createLayer("Calque de Tuiles 3", [tileset3]);
    const calque2 = map.createLayer("Calque de Tuiles 2", [tileset3]);
    const calque4 = map.createLayer("Calque de Tuiles 4", [tileset3]);
    calque1.setCollisionByProperty({ estSolide: true });
    calque2.setCollisionByProperty({ estSolide: true });
    calque3.setCollisionByProperty({ estSolide: true });
    calque4.setCollisionByProperty({ estSolide: true });

    // Création du boss zombie sur la map
    this.boss = this.physics.add.sprite(600, 200, "boss_jump1");
    this.boss.setScale(1.5); // taille du boss
    // this.boss.setOrigin(0, 0.5); // Origine 
    this.boss.setBounce(0.2);
    this.boss.anims.play("boss_jump1").setOrigin(1, 1); // Lancement de l'animation jump1 du boss dès sa création
    console.log("Boss zombie avec animation jump1 créé sur la map !");

    //son attaque sautée du boss
    this.boss.on("animationstart", (anim) => {

      if (anim.key === "boss_jump2") {
        this.sonAttaqueSautée.play();
      }

    });

  //son attaque épée du boss
  this.boss.on("animationstart", (anim) => {
    if (anim.key === "boss_attack") {
      this.sonAttaqueÉpée.play();
    }
  });
  // son de déplacement du boss
   this.boss.on("animationstart", (anim) => {
   if (anim.key === "boss_moveG" || anim.key === "boss_moveD") {
     if (!this.sonGrowl.isPlaying) {
      this.sonGrowl.play();
     }
    }
  });
  this.boss.on("animationcomplete", (anim) => {
  if (anim.key === "boss_moveG" || anim.key === "boss_moveD") {
    this.sonGrowl.stop();
   }
  });
    // Timer pour enchaîner les animations jump toutes les 0.5 secondes
    this.time.addEvent({
      delay: 500, // 0.5 seconde - plus rapide !
      callback: this.nextJumpAnimation,
      callbackScope: this,
      loop: true
    });

    // Collisions du boss avec la map
    this.physics.add.collider(this.boss, calque1);
    this.physics.add.collider(this.boss, calque2);
    this.physics.add.collider(this.boss, calque3);
    this.physics.add.collider(this.boss, calque4);

    this.anims.create({
      key: "blob_move_anim",
      frames: this.anims.generateFrameNumbers("blob_move", { start: 0, end: 7 }),
      frameRate: 6,
      repeat: -1
    });
    // Création du slime
    this.slime = this.physics.add.sprite(300, 400, "blob_move");

    this.slime.setBounce(1);
    this.slime.setCollideWorldBounds(true);
    this.slime.setScale(1.2);

    // lancer l'animation de déplacement
    this.slime.setVelocityX(80); // vitesse horizontale
    this.slime.anims.play("blob_move_anim", true).setOrigin(0.5, 0.5);



    this.physics.add.collider(this.slime, calque1);
    this.physics.add.collider(this.slime, calque2);
    this.physics.add.collider(this.slime, calque3);
    this.physics.add.collider(this.slime, calque4);

    //son move du slime
    this.slime.lastSoundFrame = -1;

    this.slime.on("animationupdate", (anim, frame, sprite) => {
      if (anim.key === "blob_move_anim") {
        // Vérifie si on est à la frame 8
        if (frame.index === 7 && this.slime.lastSoundFrame !== 7) {
          this.sonAttaqueBlob.play();
          this.slime.lastSoundFrame = 7; // marque qu’on a joué le son pour ce cycle
        }
        // Réinitialise la variable si on est passé à une autre frame
        if (frame.index !== 7) {
          this.slime.lastSoundFrame = frame.index;
        }
      }
    });
    //son attaque slime
    this.slime.on("animationstart", (anim) => {
      if (anim.key === "blob_attaque") {
        this.sonAttaqueBlob.play();
      }
    });



    // Gestion du clavier
    clavier = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    interact = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    P = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    V = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
    O = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
    U = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);

    //création de la porte
    porte = this.physics.add.staticSprite(625, 60, "img_porte1", 0);
    open_porte1 = false;
    this.anims.create({
      key: "anim_ouvreporte1",
      frames: this.anims.generateFrameNumbers("img_porte1", {
        start: 0, end: 7

      }),
      frameRate: 20,
      repeat: 0
    });

    /****************************
     *  CREATION DU PERSONNAGE  *
     ****************************/

    player = this.physics.add.sprite(100, 450, "img_perso");
    player.setBounce(0.2); // on donne un petit coefficient de rebond
    player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde

    // Caméra centrée sur le joueur
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.anims.create({
      key: "anim_tourne_gauche", // key est le nom de l'animation : doit etre unique poru la scene.
      frames: this.anims.generateFrameNumbers("img_perso", { start: 0, end: 3 }), // on prend toutes les frames de img perso numerotées de 0 à 3
      frameRate: 10, // vitesse de défilement des frames
      repeat: -1 // nombre de répétitions de l'animation. -1 = infini
    });

    // creation de l'animation "anim_tourne_face" qui sera jouée sur le player lorsque ce dernier n'avance pas.
    this.anims.create({
      key: "anim_face",
      frames: [{ key: "img_perso", frame: 4 }],
      frameRate: 20
    });

    // creation de l'animation "anim_tourne_droite" qui sera jouée sur le player lorsque ce dernier tourne à droite
    this.anims.create({
      key: "anim_tourne_droite",
      frames: this.anims.generateFrameNumbers("img_perso", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    // animation du coffre
    this.anims.create({
      key: "anim_chest",
      frames: this.anims.generateFrameNumbers("img_chest_anim", { start: 0, end: 10 }),
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: "anim_militaire",
      frames: this.anims.generateFrameNumbers("npc4", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: 0
    });


    // Collisions avec les calques solides de Tiled
    this.physics.add.collider(player, calque1);
    this.physics.add.collider(player, calque2);
    this.physics.add.collider(player, calque3);
    this.physics.add.collider(player, calque4);

    this.physics.add.collider(bullets, calque1, function (bullet, platform) {
      bullet.destroy();
    });
    this.physics.add.collider(bullets, calque2, function (bullet, platform) {
      bullet.destroy();
    });
    this.physics.add.collider(bullets, calque3, function (bullet, platform) {
      bullet.destroy();
    });
    this.physics.add.collider(bullets, calque4, function (bullet, platform) {
      bullet.destroy();
    });

    // Collision entre le joueur et le coffre
    this.physics.add.collider(this.chest, player, function (chest, player) {
      if (interact.isDown && !chest_opened) {
        chest.anims.play("anim_chest", true);
        chest_opened = true;
      }
    });

    /****************************
     *      CREATION DES PNJs     *
     ****************************/

    // PNJ

    this.npc1 = this.physics.add.staticSprite(150, 150, "npc1");
    this.npc1.setScale(0.45);
    this.npc1.refreshBody();

    this.npc2 = this.physics.add.staticSprite(130, 340, 'npc2');
    this.npc2.setScale(0.30);
    this.npc2.refreshBody();

    this.npc3 = this.physics.add.staticSprite(650, 500, 'npc3');
    this.npc3.setScale(0.40);
    this.npc3.refreshBody();

    this.npc4 = this.physics.add.staticSprite(800, 125, 'npc4');
    this.npc4.setScale(0.40);
    this.npc4.refreshBody();

    this.dummy = this.physics.add.sprite(1200, 440, 'Dummy0');
    this.dummy.setImmovable(true);
    this.dummy.refreshBody();
    this.physics.add.collider(player, this.dummy);

    const widthDummy = this.dummy.displayWidth;
    const heightDummy = this.dummy.displayHeight;

    this.dummy.setSize(widthDummy / 2, heightDummy); // Ajuste la taille de la hitbox du dummy
    this.dummy.setOffset(widthDummy / 4, 0); // Décale la hitbox vers le centre du dummy
    this.dummy.setScale(2);
    this.physics.add.collider(player, this.dummy);
    this.physics.add.collider(bullets, this.dummy, (objA, objB) => {
      // Identifier qui est la balle et qui est le dummy
      let bullet = objA.texture.key === 'img_rondblanc' ? objA : objB;
      let dummy = objA.texture.key === 'img_rondblanc' ? objB : objA;

      bullet.disableBody(true, true);
      dummy.anims.play("anim_Dummy", true);
      dummy.once('animationcomplete', () => {
        dummy.setTexture('Dummy0');
      });
    });

    // Taille complète actuelle
    const width1 = this.npc1.displayWidth;
    const height1 = this.npc1.displayHeight;

    const width2 = this.npc2.displayWidth;
    const height2 = this.npc2.displayHeight;

    const width3 = this.npc3.displayWidth;
    const height3 = this.npc3.displayHeight;

    const width4 = this.npc4.displayWidth;
    const height4 = this.npc4.displayHeight;


    //  Hitbox = seulement partie haute 
    this.npc1.setSize(width1, height1 / (3 / 2));
    this.physics.add.collider(player, this.npc1);
    zone1 = this.add.zone(this.npc1.x, this.npc1.y, width1 * 2, height1 * 1.5);
    this.physics.add.existing(zone1, true);

    this.npc2.setSize(width2, height2 / (3 / 2));
    this.physics.add.collider(player, this.npc2);
    zone2 = this.add.zone(this.npc2.x, this.npc2.y, width2 * 2, height2 * 1.5);
    this.physics.add.existing(zone2, true);

    this.npc3.setSize(width3, height3 / (3 / 2));
    this.physics.add.collider(player, this.npc3);
    zone3 = this.add.zone(this.npc3.x, this.npc3.y, width3 * 2, height3 * 1.5);
    this.physics.add.existing(zone3, true);

    this.npc4.setSize(width4, height4 / (5 / 2));
    this.physics.add.collider(player, this.npc4);
    zone4 = this.add.zone(this.npc4.x, this.npc4.y, width4 * 2, height4 * 1.5);
    this.physics.add.existing(zone4, true);


    //  Décaler vers le haut
    this.npc1.setOffset(0, 0);

    // dialogue
    this.textefille1 = this.add.text(this.npc1.x, this.npc1.y - 100, "Bonjour !", {
      font: "16px Arial",
      fill: "#ffffff",
      backgroundColor: "#000000",
      padding: { x: 10, y: 5 }
    }
    ).setOrigin(0.5);
    this.textefille1.setVisible(false);
    this.physics.add.overlap(player, zone1, () => {
      // Afficher le dialogue
      if (Phaser.Input.Keyboard.JustDown(interact)) {

        this.textefille1.setVisible(true);
        this.time.delayedCall(5000, () => {
          this.textefille1.setVisible(false);
        });
      } else { }



    });




    this.textehomme1 = this.add.text(this.npc2.x, this.npc2.y - 100, "SIX SEVENNNN !", {
      font: "16px Arial",
      fill: "#ffffff",
      backgroundColor: "#000000",
      padding: { x: 10, y: 5 }
    }
    ).setOrigin(0.5);
    this.textehomme1.setVisible(false);
    this.physics.add.overlap(player, zone2, () => {
      // Afficher le dialogue
      if (Phaser.Input.Keyboard.JustDown(interact)) {
        this.textehomme1.setVisible(true);
        this.time.delayedCall(5000, () => {
          this.textehomme1.setVisible(false);
        });
      } else { }

    });


    this.textefille2 = this.add.text(this.npc3.x, this.npc3.y - 100, "Voici ton gun grrr pow", {
      font: "16px Arial",
      fill: "#ffffff",
      backgroundColor: "#000000",
      padding: { x: 10, y: 5 }
    }
    ).setOrigin(0.5);
    this.textefille2.setVisible(false);
    this.physics.add.overlap(player, zone3, () => {
      // Afficher le dialogue
      if (Phaser.Input.Keyboard.JustDown(interact)) {
        this.textefille2.setVisible(true);
        hasgun = true;
        this.time.delayedCall(5000, () => {
          this.textefille2.setVisible(false);
        });
      }
    });

    this.textemilitaire = this.add.text(this.npc4.x, this.npc4.y - 100, "Je suis un militaire !", {
      font: "16px Arial",
      fill: "#ffffff",
      backgroundColor: "#000000",
      padding: { x: 10, y: 5 }
    }
    ).setOrigin(0.5);
    this.textemilitaire.setVisible(false);
    this.hastalkedtomilitaire = false;
    this.physics.add.overlap(player, zone4, () => {
      // Afficher le dialogue
      if (Phaser.Input.Keyboard.JustDown(interact)) {
        if (!this.hastalkedtomilitaire) {
          this.npc4.anims.play("anim_militaire", true);
        }
        if (!hasgun) {
          this.textemilitaire.setText("Va parler à la fille pour avoir une arme !");
        } else {
          this.textemilitaire.setText("Bonne chance pour la suite !");
        }
        this.hastalkedtomilitaire = true;
        this.textemilitaire.setVisible(true);
        this.time.delayedCall(5000, () => {
          this.textemilitaire.setVisible(false);
        });
      }
    });
  }

  update() {
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

    // Update lastDir based on pressed keys
    if (clavier.left.isDown || clavier.right.isDown || clavier.up.isDown || clavier.down.isDown) {
      lastDir.x = 0;
      lastDir.y = 0;
      if (clavier.left.isDown) lastDir.x = -1;
      if (clavier.right.isDown) lastDir.x = 1;
      if (clavier.up.isDown) lastDir.y = -1;
      if (clavier.down.isDown) lastDir.y = 1;
    }

    if (this.keySpace.isDown && !wasSpaceDown && this.time.now > lastFired && hasgun) {

      let bullet = bullets.create(player.x, player.y, "img_rondblanc");
      bullet.setScale(0.05);

      // Tirer dans la direction où regarde le joueur
      bullet.setVelocityX(400 * lastDir.x);
      bullet.setVelocityY(400 * lastDir.y);

      lastFired = this.time.now + 300;
    }

    wasSpaceDown = this.keySpace.isDown;
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

    // Update lastDir based on pressed keys
    if (clavier.left.isDown || clavier.right.isDown || clavier.up.isDown || clavier.down.isDown) {
      lastDir.x = 0;
      lastDir.y = 0;
      if (clavier.left.isDown) lastDir.x = -1;
      if (clavier.right.isDown) lastDir.x = 1;
      if (clavier.up.isDown) lastDir.y = -1;
      if (clavier.down.isDown) lastDir.y = 1;
    }

    if (this.keySpace.isDown && !wasSpaceDown && this.time.now > lastFired) {

      let bullet = bullets.create(player.x, player.y, "img_rondblanc");
      bullet.setScale(0.05);

      // Tirer dans la direction où regarde le joueur
      bullet.setVelocityX(400 * lastDir.x);
      bullet.setVelocityY(400 * lastDir.y);

      lastFired = this.time.now + 300;
    }

    wasSpaceDown = this.keySpace.isDown;

    if (Phaser.Input.Keyboard.JustDown(clavier.shift) == true) {
      this.scene.start("Salle01");
    }

    //ouverture de la porte et transition vers couloir

    if (open_porte1 == false && Phaser.Input.Keyboard.JustDown(interact) == true &&
      this.physics.overlap(player, porte) == true && this.hastalkedtomilitaire == true && hasgun == true) {
      // le personnage est sur la porte1 et vient d'appuyer sur la touche entrée
      open_porte1 = true;
      this.time.delayedCall(500, () => {
        this.scene.start("Couloir1");
      });
      porte.anims.play("anim_ouvreporte1");
    } /*else console.log("Conditions non remplies pour ouvrir la porte : ", {
      overlap: this.physics.overlap(player, porte),
      hastalkedtomilitaire: this.hastalkedtomilitaire,
      hasgun: hasgun
    });*/
// changement de direction du blob si mur
    if (this.slime.body.blocked.right) {
        this.slime.setVelocityX(-80);
        this.slime.flipX = true;
    }

    if (this.slime.body.blocked.left) {
        this.slime.setVelocityX(80);
        this.slime.flipX = false;
    }


    if (Phaser.Input.Keyboard.JustDown(P) == true) {
      this.scene.start("Couloir1");
    }
    if (Phaser.Input.Keyboard.JustDown(V) == true) {
      this.scene.start("Couloir2");
    }
    if (Phaser.Input.Keyboard.JustDown(O) == true) {
      this.scene.start("Couloir3");
    }
    if (Phaser.Input.Keyboard.JustDown(U) == true) {
      this.scene.start("BossZone");
    }
  }
}
var enter;