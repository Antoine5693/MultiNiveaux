var player; // désigne le sprite du joueur
var clavier; // pour la gestion du clavier
var bullets; // groupe de projectiles tirés par le joueur
var lastFired = 0;
var wasSpaceDown = false;
var lastDir = { x: 1, y: 0 }; // direction dans laquelle le joueur regarde
var chest_opened = false; // pour éviter de rejouer l'animation du coffre une fois ouvert
var zone; // zone de détection pour le PNJ
var porte; // pour la porte de transition vers le niveau 2
var interact;
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
    // Charger le sprite sheet du boss zombie
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
    this.load.spritesheet("blob_mort", "src/assets/blob mort spritesheet.png", {
      frameWidth: 68,
      frameHeight: 58
    });
    this.load.spritesheet("blob_move", "src/assets/blob move spritesheet.png", {
      frameWidth: 73,
      frameHeight: 52
    });
    this.load.spritesheet("blob_move", "src/assets/blob move spritesheet.png", {
      frameWidth: 79,
      frameHeight: 58
    });
    this.load.spritesheet("zombie_mort", "src/assets/zombiemort spritesheet.png", {
      frameWidth: 32,
      frameHeight: 30
    });
    this.load.spritesheet("zombie_deplacement", "src/assets/zombiedeplacement spritesheet.png", {
      frameWidth: 30,
      frameHeight: 30
    });
    this.load.spritesheet("zombie_attaque", "src/assets/zombieattaque spritesheet.png", {
      frameWidth: 31,
      frameHeight: 32
    });
  }


  create() {

    this.add.image(0, 0, "img_heart").setScale(0.09).setOrigin(0, 0);
    this.add.image(35, 0, "img_heart").setScale(0.09).setOrigin(0, 0);
    this.add.image(70, 0, "img_heart").setScale(0.09).setOrigin(0, 0);

    bullets = this.physics.add.group({
      allowGravity: false
    });
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
    



    // Gestion du clavier
    clavier = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    interact = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

           //création de la porte
    porte = this.physics.add.staticSprite(625,60, "img_porte1", 0); 
    //this.porte.setscale(0.5);
    this.anims.create({
    key: "anim_ouvreporte1",
    frames: this.anims.generateFrameNumbers("img_porte1", { start: 0, end: 8 }),
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
    this.npc1.setScale(0.5);
    this.npc1.refreshBody();

    // Taille complète actuelle
    const width = this.npc1.displayWidth;
    const height = this.npc1.displayHeight;

    //  Hitbox = seulement partie haute 
    this.npc1.setSize(width, height / (3 / 2));
    this.physics.add.collider(player, this.npc1);
    zone = this.add.zone(this.npc1.x, this.npc1.y, width * 2, height * 1.5);
    this.physics.add.existing(zone, true);

    //  Décaler vers le haut
    this.npc1.setOffset(0, 0);

    // dialogue
    this.textefille1 = this.add.text(this.npc1.x, this.npc1.y -100 , "Bonjour !", { 
      font: "16px Arial",
       fill: "#ffffff"  ,  
       backgroundColor: "#000000",
    padding: { x: 10, y: 5 }}
    ).setOrigin(0.5);
    this.textefille1.setVisible(false);
    this.physics.add.overlap(player, zone, () => {
      // Afficher le dialogue
      if (Phaser.Input.Keyboard.JustDown(interact)) {
        this.textefille1.setVisible(true);
      } else { }
    


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

      if (this.keySpace.isDown && !wasSpaceDown && this.time.now > lastFired) {

        let bullet = bullets.create(player.x, player.y, "img_rondblanc");
        bullet.setScale(0.05);

        // Tirer dans la direction où regarde le joueur
        bullet.setVelocityX(400 * lastDir.x);
        bullet.setVelocityY(400 * lastDir.y);

        lastFired = this.time.now + 300;
      }

    wasSpaceDown = this.keySpace.isDown;

    if (Phaser.Input.Keyboard.JustDown(clavier.shift)==true) {
      this.scene.start("Salle01");
  }

  if (open_porte1==false && Phaser.Input.Keyboard.JustDown(interact) == true &&
    this.physics.overlap(player, porte) == true) {
   // le personnage est sur la porte1 et vient d'appuyer sur la touche entrée
      open_porte1 = true;
   porte.anims.play("anim_ouvreporte1");
  } 

}
}
var enter;