

var player; // désigne le sprite du joueur
var groupe_plateformes; // contient toutes les plateformes
var clavier; // pour la gestion du clavier
var bullets; // groupe de projectiles tirés par le joueur
var lastFired = 0;
var wasSpaceDown = false;
var lastDir = { x: 1, y: 0 }; // direction dans laquelle le joueur regarde
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
  }

  create() {

    this.add.image(400, 300, "img_ciel");
bullets = this.physics.add.group({
  allowGravity: false
});
    groupe_plateformes = this.physics.add.staticGroup();

    groupe_plateformes.create(200, 584, "img_plateforme");
    groupe_plateformes.create(600, 584, "img_plateforme");

    //  on ajoute 3 platesformes flottantes
    groupe_plateformes.create(600, 450, "img_plateforme");
    groupe_plateformes.create(50, 300, "img_plateforme");
    groupe_plateformes.create(750, 270, "img_plateforme");

    /****************************
     *  CREATION DU PERSONNAGE  *
     ****************************/

    player = this.physics.add.sprite(100, 450, "img_perso");
    player.setBounce(0.2); // on donne un petit coefficient de rebond
    player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde

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


    clavier = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    //  Collide the player and the groupe_etoiles with the groupe_plateformes
    this.physics.add.collider(player, groupe_plateformes);
    this.physics.add.collider(bullets, groupe_plateformes, function(bullet, platform) {
      bullet.destroy();
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
  }}

