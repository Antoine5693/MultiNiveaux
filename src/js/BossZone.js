var player;
var clavier; 
var enter;

export default class BossZone extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "BossZone" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    // assets pour le tilemap
    this.load.image("B", "src/assets/Background.png");
    this.load.image("D", "src/assets/Dela_dec3.png");
    this.load.tilemapTiledJSON("carte5", "src/assets/BossZone.tmj");
    // asset pour le joueur
    this.load.spritesheet("dude.png", "src/assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });
  }

  create() {
    
    // clavier pour les déplacements du personnage
    clavier = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // Création du tilemap et des plateformes à partir de Tiled
    const map = this.add.tilemap( "carte5" );
    const tileset1 = map.addTilesetImage("1", "B");
    const tileset2 = map.addTilesetImage("888", "D");
    const calque1 = map.createLayer("Calque de Tuiles 1", [tileset1]);
    const calque2 = map.createLayer("Calque de Tuiles 2", [tileset2]);
    calque1.setCollisionByProperty({ estSolide: true });
    calque2.setCollisionByProperty({ estSolide: true });

    player = this.physics.add.sprite(480, 864, "dude.png");
    player.refreshBody();
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, calque1);
    this.physics.add.collider(player, calque2);
    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, this.groupe_plateformes);

    // Caméra centrée sur le joueur
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Animations du joueur
    this.anims.create({
      key: "anim_tourne_gauche",
      frames: this.anims.generateFrameNumbers("dude.png", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_face",
      frames: [{ key: "dude.png", frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: "anim_tourne_droite",
      frames: this.anims.generateFrameNumbers("dude.png", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

  }

  update() {
    
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