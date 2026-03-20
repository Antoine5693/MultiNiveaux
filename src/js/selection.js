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
var E;
var interact;
var porte; // pour la porte de transition vers le niveau 2
var open_porte1 = false;//gère l'état de la porte 1
var fireRate = 300; // délai entre chaque tir en ms

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
    this.load.image("img_balle", "src/assets/bullet.png", {
      frameWidth: 46,
      frameHeight: 21
    });
    this.load.audio("son_tir", "src/assets/bullet-sound.mp3");

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
    this.load.spritesheet("boss_moveG", "src/assets/bosszombiedeplacementG_v2.png", {
      frameWidth: 155,
      frameHeight: 222
    });
    this.load.spritesheet("boss_moveD", "src/assets/bosszombiedeplacementD_v2.png", {
      frameWidth: 188,
      frameHeight: 220
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
      spacing: 24
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
    this.load.audio("son_zombie_attaque", "src/assets/zombie_attack_sound.mp3");
    this.load.audio("zombie_mort", "src/assets/zombie_dying_sound.mp3");
    this.load.spritesheet("img_porte1", "src/assets/porte1finie - Copie.png", {
      frameWidth: 103,
      frameHeight: 128
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

    this.load.image("Dummy0", "src/assets/Dummy/Dummy0.png");
    this.load.image("Dummy1", "src/assets/Dummy/Dummy1.png");
    this.load.image("Dummy2", "src/assets/Dummy/Dummy2.png");
    this.load.image("Dummy3", "src/assets/Dummy/Dummy3.png");
    this.load.image("Dummy4", "src/assets/Dummy/Dummy4.png");
    this.load.image("Dummy5", "src/assets/Dummy/Dummy5.png");

    this.load.image("empty_heart", "src/assets/empty_heart.png");


    this.load.image("IdleJason", "src/assets/Jason/IdleJason.png");
    this.load.image("jason_tirebas", "src/assets/Jason/jason_tirebas.png");
    this.load.image("jason_tirehaut", "src/assets/Jason/jason_tirehaut.png");
    this.load.image("jason_tiregauche", "src/assets/Jason/jason_tiregauche.png");
    this.load.image("jason_tiredroite", "src/assets/Jason/jason_tiredroite.png");

    this.load.spritesheet("jason_marcheavant", "src/assets/Jason/jason_marcheavant.png", { frameWidth: 1126 / 6, frameHeight: 320 });
    this.load.spritesheet("jason_back", "src/assets/Jason/jason_back.png", { frameWidth: 984 / 6, frameHeight: 254 });
    this.load.spritesheet("jason_marchedroite", "src/assets/Jason/jason_marchedroite.png", { frameWidth: 769 / 6, frameHeight: 320 });

    this.load.image("game_over", "src/assets/Game_Over.png")

    this.load.image("victory", "src/assets/Victory.png");
  }


  create() {



    bullets = this.physics.add.group({
      allowGravity: false
    });
    //sons mobs
    this.sonAttaqueSautée = this.sound.add("son_attaquesautee");
    this.sonAttaqueÉpée = this.sound.add("son_épée");
    this.sonAttaqueBlob = this.sound.add("attaque_blob");
    this.sonGrowl = this.sound.add("growl");
    this.sonZombieAttaque = this.sound.add("son_zombie_attaque");
    this.sonZombieMort = this.sound.add("zombie_mort");
    this.sonTir = this.sound.add("son_tir");

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
      repeat: -1
    });

    this.anims.create({
      key: "boss_moveD",
      frames: this.anims.generateFrameNumbers("boss_moveD", { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1
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
    this.boss.disableBody(true, true);
    console.log("Boss zombie avec animation jump1 créé sur la map !");

    //son attaque sautée du boss
    this.boss.on("animationstart", (anim) => {

      if (anim.key === "boss_jump2") {
        this.sonAttaqueSautée.play();
      }
    this.sonAttaqueSautée.setMute(true);
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

    this.slime.disableBody(true, true);

    this.physics.add.collider(this.slime, calque1);
    this.physics.add.collider(this.slime, calque2);
    this.physics.add.collider(this.slime, calque3);
    this.physics.add.collider(this.slime, calque4);

    //son move du slime
    this.slime.lastSoundFrame = -1;

    this.slime.on("animationupdate", (anim, frame, sprite) => {
      if (anim.key === "blob_move_anim") {
        // Vérifie si on est à la frame 1
        if (frame.index === 1 && this.slime.lastSoundFrame !== 1) {
          this.sonAttaqueBlob.play();
          this.slime.lastSoundFrame = 1; // marque qu’on a joué le son pour ce cycle
        }
        // Réinitialise la variable si on est passé à une autre frame
        if (frame.index !== 1) {

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
    //creation zombie
    this.zombie = this.physics.add.sprite(500, 350, "zombie_deplacement");



    this.zombie.setScale(2.9);
    this.zombie.setCollideWorldBounds(true);
    this.zombie.setBounce(1);

    // animation de déplacement
    this.zombie.anims.play("zombie_deplacement", true);
    this.physics.add.collider(this.zombie, calque1);
    this.physics.add.collider(this.zombie, calque2);
    this.physics.add.collider(this.zombie, calque3);
    this.physics.add.collider(this.zombie, calque4);


    this.rodeur = this.physics.add.sprite(700, 400, "rodeurDroite");
    this.zombie.disableBody(true, true);
    this.rodeur.setScale(0.6);
    this.rodeur.setCollideWorldBounds(true);
    this.rodeur.setBounce(1);
    this.sonRodeur = this.sound.add("son_rodeur", {
      loop: true,
      volume: 1.8
    });
    //this.sonRodeur.play();
    this.rodeur.setVelocityX(100);
    this.rodeur.anims.play("rodeurDroite", true);
    this.rodeur.disableBody(true, true);
    this.physics.add.collider(this.rodeur, calque1);
    this.physics.add.collider(this.rodeur, calque2);
    this.physics.add.collider(this.rodeur, calque3);
    this.physics.add.collider(this.rodeur, calque4);



    // Gestion du clavier
    clavier = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    interact = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    P = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    V = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
    O = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
    U = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
    E = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    //création de la porte
    porte = this.physics.add.staticSprite(625, 60, "img_porte1", 0);
    porte.setSize(porte.width, porte.height / 2);         // hauteur divisée par 2
    porte.setOffset(0, 0);  
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

    player = this.physics.add.sprite(100, 450, "IdleJason");
    player.setScale(0.300); // taille du sprite du joueur
    player.setSize(200, 250); // ajuste la taille de la hitbox du joueur
    player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde

    // Caméra centrée sur le joueur
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);



    // creation de l'animation "anim_tourne_droite" qui sera jouée sur le player lorsque ce dernier tourne à droite
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

     this.physics.add.collider(porte, player)  // Collision entre le joueur et la porte

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
      let bullet = objA.texture.key === 'img_balle' ? objA : objB;
      let dummy = objA.texture.key === 'img_balle' ? objB : objA;

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
    this.textefille1 = this.add.text(this.npc1.x+100, this.npc1.y - 100, "Ne t'inquète pas si parfois ton corps ne répond pas comme tu le souhaites et commence à diverger, ces lieux sont obscurs.", {
      font: "16px Arial",
      fill: "#ffffff",
      backgroundColor: "#000000",
      padding: { x: 10, y: 5 },
      wordWrap: { width: 200 }
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




    this.textehomme1 = this.add.text(this.npc2.x, this.npc2.y - 100, "Le labo jlab07 a été contaminé par un mystèrieux virus, tu dois enquêter sur les lieux.", {
      font: "16px Arial",
      fill: "#ffffff",
      backgroundColor: "#000000",
      padding: { x: 10, y: 5 },
       wordWrap: { width: 200 }
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


    this.textefille2 = this.add.text(this.npc3.x, this.npc3.y - 100, "Voici ton gun grrr pow, entraîne-toi, et vas voir le militaire !", {
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
          this.textemilitaire.setText("Entre par la porte... et bonne chance pour la suite !");
        }
        this.hastalkedtomilitaire = true;
        this.textemilitaire.setVisible(true);
        this.time.delayedCall(5000, () => {
          this.textemilitaire.setVisible(false);
        });
      }
    });

    // Initialisation de la vie du joueur à 3 et affichage des coeurs
    this.registry.set('hp', 3);
    this.registry.set('hpMax', 3);
    this.add.image(16, 16, "img_heart").setScale(0.09).setOrigin(0, 0).setScrollFactor(0);
    this.add.image(51, 16, "img_heart").setScale(0.09).setOrigin(0, 0).setScrollFactor(0);
    this.add.image(86, 16, "img_heart").setScale(0.09).setOrigin(0, 0).setScrollFactor(0);


    this.registry.set('fireRate', 300); // 300 ms entre chaque tir
  }

  update() {

    // Sécurité : vérifier que le joueur existe
    if (!player) return;

    // Réinitialisation des vitesses du joueur
    player.setVelocity(0);

    // Déplacement horizontal
    if (clavier.left.isDown) {
      player.setVelocityX(-160);
      player.setScale(0.6);
      player.setSize(100, 150);
      player.setFlipX(true);  // ✅ miroir de l'animation droite
      player.anims.play("anim_tourne_droite", true);
      player.setScale(0.6);
    } else if (clavier.right.isDown) {
      player.setVelocityX(160);
      player.setScale(0.6);
      player.setSize(100, 150);
      player.setFlipX(false); // ✅ animation normale
      player.anims.play("anim_tourne_droite", true);
      player.setScale(0.6);
    }

    // vertical
    if (clavier.up.isDown) {
      player.setVelocityY(-160);
      player.setScale(0.55);
      player.setSize(100, 150);
      player.setOffset(player.width / 2 - 50, player.height / 2 - 75); // ajuste l'offset pour que la hitbox soit centrée
      player.anims.play("anim_marche_arriere", true);
      player.setScale(0.55);
    } else if (clavier.down.isDown) {
      player.setVelocityY(160);
      player.setScale(0.45);
      player.setSize(130, 200);
      player.setOffset(player.width / 2 - 65, player.height / 2 - 75); // ajuste l'offset pour que la hitbox soit centrée
      player.anims.play("anim_marche_avant", true);
      player.setScale(0.45);
    }


    // Idling
    if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
      player.setTexture("IdleJason");   // ← texture EN PREMIER
      player.setScale(0.4);
      player.setSize(160, 250);
      player.setOffset(40, 20);         // ← valeurs fixes, pas calculées
    }

    // Mise à jour de la dernière direction pour tirer
    if (clavier.left.isDown) {
    lastDir.x = -1;
    lastDir.y = 0;
  } else if (clavier.right.isDown) {
    lastDir.x = 1;
    lastDir.y = 0;
  } else if (clavier.up.isDown) {
    lastDir.x = 0;
    lastDir.y = -1;
  } else if (clavier.down.isDown) {
    lastDir.x = 0;
    lastDir.y = 1;
  }

    // Tir du joueur
    if (this.keySpace.isDown && !wasSpaceDown && this.time.now > lastFired && hasgun) {
      let bullet = bullets.create(player.x, player.y, "img_balle");
      bullet.setScale(0.25);
      this.sonTir.play();
      bullet.setVelocityX(400 * lastDir.x);
      bullet.setVelocityY(400 * lastDir.y);
      lastFired = this.time.now + fireRate;
    }
    wasSpaceDown = this.keySpace.isDown;

    // Déplacement du rodeur vers le joueur
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
      } else if (dx < -5) {
        this.rodeur.setVelocityX(-vitesse);
        this.rodeur.anims.play("rodeurGauche", true);
      }

      // Mouvement vertical
      if (dy > 5) this.rodeur.setVelocityY(vitesse);
      else if (dy < -5) this.rodeur.setVelocityY(-vitesse);
    }

    // Déplacement du boss vers le joueur
    if (this.boss && player) {
      let dx = player.x - this.boss.x;
      let dy = player.y - this.boss.y;
      let magnitude = Math.sqrt(dx * dx + dy * dy);
      let speed = 80;

      // Sécurité contre division par zéro
      if (magnitude > 0) {
        let vx = (dx / magnitude) * speed;
        let vy = (dy / magnitude) * speed;
        this.boss.setVelocityX(vx);
        this.boss.setVelocityY(vy);
      }
    }

    // Ouverture de la porte et transition vers le couloir
    if (!open_porte1 &&
      Phaser.Input.Keyboard.JustDown(interact) &&
      this.physics.overlap(player, porte) &&
      this.hastalkedtomilitaire &&
      hasgun) {
      open_porte1 = true;
      porte.anims.play("anim_ouvreporte1");
      this.time.delayedCall(500, () => {
        this.scene.start("Couloir1");
      });
    }

    // Raccourcis pour tester les transitions de scènes
    if (Phaser.Input.Keyboard.JustDown(P)) this.scene.start("Couloir1");
    if (Phaser.Input.Keyboard.JustDown(V)) this.scene.start("Couloir2");
    if (Phaser.Input.Keyboard.JustDown(O)) this.scene.start("Couloir3");
    if (Phaser.Input.Keyboard.JustDown(U)) this.scene.start("BossZone");
    if (Phaser.Input.Keyboard.JustDown(E)) this.scene.start("Salle14");
  }
}
