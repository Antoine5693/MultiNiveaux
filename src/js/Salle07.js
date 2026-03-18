var player;
var clavier;
var enter;
var interact;

// variables pour la porte de transition vers couloir1
var porte; // pour la porte de transition vers couloir1
var open_porte1 = false;//gère l'état de la porte 1
export default class Salle07 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "Salle07" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    // assets pour le tilemap
    this.load.image("B", "src/assets/Background.png");
    this.load.image("D", "src/assets/Dela_dec2.png");
    this.load.tilemapTiledJSON("carte07", "src/assets/Salle01.tmj");
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
    const map = this.add.tilemap( "carte07" );
    const tileset1 = map.addTilesetImage("Background", "B");
    const tileset3 = map.addTilesetImage("1", "D");
    const calque1 = map.createLayer("Calque de Tuiles 1", [tileset1]);
    const calque3 = map.createLayer("Calque de Tuiles 2", [tileset3]);
    calque1.setCollisionByProperty({ estSolide: true });
    calque3.setCollisionByProperty({ estSolide: true });

    //création de la porte
    porte = this.physics.add.staticSprite(335, 65, "img_porte1", 0);
    open_porte1 = false;
    this.anims.create({
      key: "anim_ouvreporte1",
      frames: this.anims.generateFrameNumbers("img_porte1", {
        start: 0, end: 7

      }),
      frameRate: 20,
      repeat: 0
    });

    player = this.physics.add.sprite(335, 150,  "dude.png");
    player.refreshBody();
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, calque1);
    this.physics.add.collider(player, calque3);
    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, this.groupe_plateformes);

  }

  update() {
        // interaction avec la porte de transition vers couloir1
    if (open_porte1 == false && Phaser.Input.Keyboard.JustDown(interact) == true &&
      this.physics.overlap(player, porte) == true) {
      // le personnage est sur la porte1 et vient d'appuyer sur la touche entrée
      open_porte1 = true;
      this.time.delayedCall(500, () => {
        // Envoie des coordonnées de respawn à la scène Couloir2
        this.scene.start("Couloir2", { x: 1120, y: 416 });
      });
      porte.anims.play("anim_ouvreporte1");
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