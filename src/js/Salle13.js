var player;
var clavier;
var enter;
var interact;
var bouton1, bouton2, bouton3;
var lumière1, lumière2, lumière3;
var bouton1Active = false;
var bouton2Active = false;
var bouton3Active = false;
var rep = false;

// variables pour la porte de transition vers couloir1
var porte; // pour la porte de transition vers couloir1
var open_porte1 = false;//gère l'état de la porte 1

export default class Salle13 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "Salle13" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    // assets pour le tilemap
    this.load.image("B", "src/assets/Background.png");
    this.load.image("D", "src/assets/Dela_dec2.png");
    this.load.image("Lamps1", "src/assets/lumière allumé (1).png");
    this.load.image("Lamps2", "src/assets/lumière eteint (1).png");
    this.load.image("Bouton", "src/assets/red-button.png");
    this.load.tilemapTiledJSON("carte13", "src/assets/Salle01.tmj");
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
    const map = this.add.tilemap( "carte13" );
    const tileset1 = map.addTilesetImage("Background", "B");
    const tileset3 = map.addTilesetImage("1", "D");
    const calque1 = map.createLayer("Calque de Tuiles 1", [tileset1]);
    const calque3 = map.createLayer("Calque de Tuiles 2", [tileset3]);
    calque1.setCollisionByProperty({ estSolide: true });
    calque3.setCollisionByProperty({ estSolide: true });

    //création de la porte
    porte = this.physics.add.staticSprite(335, 65, "img_porte1", 0);
     porte.setSize(porte.width, porte.height / 2);         // hauteur divisée par 2
    porte.setOffset(0, 0);  
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

    

    //  Bouton 1
bouton1 = this.physics.add.staticSprite(200, 300, "Bouton", 0).setScale(0.1);
bouton1.setSize(bouton1.width * 0.1, bouton1.height * 0.1);
bouton1.refreshBody();

// Bouton 2
bouton2 = this.physics.add.staticSprite(335, 300, "Bouton", 0).setScale(0.1);
bouton2.setSize(bouton2.width * 0.1, bouton2.height * 0.1);
bouton2.refreshBody();

//  Bouton 3
bouton3 = this.physics.add.staticSprite(470, 300, "Bouton", 0).setScale(0.1);
bouton3.setSize(bouton3.width * 0.1, bouton3.height * 0.1);
bouton3.refreshBody();

//  Lampe 1 (éteinte)
lumière1 = this.physics.add.staticSprite(200, 400, "Lamps2", 0).setScale(0.25);
lumière1.setSize(lumière1.width * 0.1, lumière1.height * 0.1);
lumière1.refreshBody();

//  Lampe 2 (éteinte)
lumière2 = this.physics.add.staticSprite(335, 400, "Lamps2", 0).setScale(0.25);
lumière2.setSize(lumière2.width * 0.1, lumière2.height * 0.1);
lumière2.refreshBody();

//  Lampe 3 (éteinte)
lumière3 = this.physics.add.staticSprite(470, 400, "Lamps2", 0).setScale(0.25);
lumière3.setSize(lumière3.width * 0.1, lumière3.height * 0.1);
lumière3.refreshBody();

player = this.physics.add.sprite(335, 150,  "dude.png");
    player.refreshBody();
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, calque1);
    this.physics.add.collider(player, calque3);
    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, this.groupe_plateformes);
    this.physics.add.collider(player, porte);

  }

  update() {
      const justInteract = Phaser.Input.Keyboard.JustDown(interact);

    // Bouton 1 — allume/éteint
if (justInteract && this.physics.overlap(player, bouton1)) {
    bouton1Active = !bouton1Active;
    lumière1.setTexture(bouton1Active ? "Lamps1" : "Lamps2");
    lumière1.refreshBody();
    rep = (!bouton1Active && !bouton2Active && bouton3Active); 
}

// Bouton 2 — allume/éteint
if (justInteract && this.physics.overlap(player, bouton2)) {
    bouton2Active = !bouton2Active;
    lumière2.setTexture(bouton2Active ? "Lamps1" : "Lamps2");
    lumière2.refreshBody();
    rep = (!bouton1Active && !bouton2Active && bouton3Active); 
}

// Bouton 3 — allume/éteint
if (justInteract && this.physics.overlap(player, bouton3)) {
    bouton3Active = !bouton3Active;
    lumière3.setTexture(bouton3Active ? "Lamps1" : "Lamps2");
    lumière3.refreshBody();
    rep = (!bouton1Active && !bouton2Active && bouton3Active); 
}

    // interaction porte
    if (open_porte1 == false && justInteract &&
        this.physics.overlap(player, porte)) {
        open_porte1 = true;
        this.time.delayedCall(500, () => {
            this.scene.start("Couloir3", { x: 1204, y: 1696 });
        });
        porte.anims.play("anim_ouvreporte1");
    }

    

    // déplacements
    player.setVelocityX(0);
    player.setVelocityY(0);

    if (clavier.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play("anim_tourne_gauche", true);
    } else if (clavier.right.isDown) {
        player.setVelocityX(160);
        player.anims.play("anim_tourne_droite", true);
    }

    if (clavier.up.isDown) {
        player.setVelocityY(-160);
    } else if (clavier.down.isDown) {
        player.setVelocityY(160);
    }

    if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
        player.anims.play("anim_face", true);
    }}}