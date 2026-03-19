var player;
var clavier;
var bullets;
var lastFired = 0;
var wasSpaceDown = false;
var lastDir = { x: 1, y: 0 };
var chest_opened = false;
var interact;

var porte;
var open_porte1 = false;

export default class Salle05 extends Phaser.Scene {
  constructor() {
    super({ key: "Salle05" });
  }

  preload() {
    this.load.image("B", "src/assets/Background.png");
    this.load.image("D", "src/assets/Dela_dec2.png");
    this.load.image("img_rondblanc", "src/assets/rondblanc.png");
    this.load.tilemapTiledJSON("carte2", "src/assets/Salle01.tmj");
    this.load.spritesheet("img_chest_anim", "src/assets/caisse.png", {
      frameWidth: 72,
      frameHeight: 62
    });
    this.load.spritesheet("img_porte1", "src/assets/porte1finie.png", {
      frameWidth: 103,
      frameHeight: 128
    });

    this.load.image("IdleJason", "src/assets/Jason/IdleJason.png");
    this.load.spritesheet("jason_marcheavant", "src/assets/Jason/jason_marcheavant.png", { frameWidth: 1126 / 6, frameHeight: 320 });
    this.load.spritesheet("jason_back", "src/assets/Jason/jason_back.png", { frameWidth: 984 / 6, frameHeight: 254 });
    this.load.spritesheet("jason_marchedroite", "src/assets/Jason/jason_marchedroite.png", { frameWidth: 769 / 6, frameHeight: 320 });

    this.load.image("img_balle", "src/assets/bullet.png");
    this.load.image("img_heart", "src/assets/heart.png");
    this.load.image("empty_heart", "src/assets/empty_heart.png");
    this.load.audio("son_tir", "src/assets/bullet-sound.mp3");

    this.load.spritesheet("zombie_mort", "src/assets/zombiemort.png", { frameWidth: 32, frameHeight: 30 });
    this.load.spritesheet("zombie_deplacement", "src/assets/zombiedeplacement.png", { frameWidth: 30, frameHeight: 30 });
    this.load.spritesheet("zombie_attaque", "src/assets/zombieattaque.png", { frameWidth: 31, frameHeight: 32 });
    this.load.spritesheet("blob_move", "src/assets/blob move.png", { frameWidth: 25, frameHeight: 51, spacing: 24 });
  }

  create() {

    this.sound.stopByKey("son_rodeur");
    interact = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    chest_opened = false;
    this.isInvincible = false;

    bullets = this.physics.add.group({ allowGravity: false });
    this.enemies = this.physics.add.group();

    clavier = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    const map = this.add.tilemap("carte2");
    const tileset1 = map.addTilesetImage("Background", "B");
    const tileset3 = map.addTilesetImage("1", "D");
    this.calque1 = map.createLayer("Calque de Tuiles 1", [tileset1]);
    this.calque3 = map.createLayer("Calque de Tuiles 2", [tileset3]);
    this.calque1.setCollisionByProperty({ estSolide: true });
    this.calque3.setCollisionByProperty({ estSolide: true });

    porte = this.physics.add.staticSprite(335, 65, "img_porte1", 0);
    porte.setSize(porte.width, porte.height / 2);         // hauteur divisée par 2
    porte.setOffset(0, 0);
    open_porte1 = false;
    open_porte1 = false;
    this.anims.create({
      key: "anim_ouvreporte1",
      frames: this.anims.generateFrameNumbers("img_porte1", { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0
    });

    player = this.physics.add.sprite(335, 150, "IdleJason");
    player.setScale(0.4);
    player.setSize(160, 250);
    player.setOffset(40, 20);
    player.setCollideWorldBounds(true);

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

    this.anims.create({
      key: "zombie_deplacement",
      frames: this.anims.generateFrameNumbers("zombie_deplacement", { start: 0, end: 7 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: "zombie_attaque",
      frames: this.anims.generateFrameNumbers("zombie_attaque", { start: 0, end: 6 }),
      frameRate: 8,
      repeat: 0
    });
    this.anims.create({
      key: "blob_move_anim",
      frames: this.anims.generateFrameNumbers("blob_move", { start: 0, end: 7 }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: "anim_chest",
      frames: this.anims.generateFrameNumbers("img_chest_anim", { start: 0, end: 10 }),
      frameRate: 10,
      repeat: 0
    });

    this.physics.add.collider(player, this.calque1);
    this.physics.add.collider(player, this.calque3);

    this.physics.add.collider(bullets, this.calque1, (bullet) => { bullet.destroy(); });
    this.physics.add.collider(bullets, this.calque3, (bullet) => { bullet.destroy(); });

    this.cameras.main.setViewport(35, 0, 750, 600);

    let msg = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'DIE !',
      { fontSize: '28px' }
    );
    this.time.delayedCall(2000, () => { msg.destroy(); });

    this.physics.add.collider(bullets, this.enemies, (bullet, enemy) => {
      bullet.destroy();
      enemy.hp -= 1;
      let currentVX = enemy.body.velocity.x > 0 ? 80 : -80;
      enemy.setVelocity(currentVX, 0);
      if (enemy.hp <= 0) {
        enemy.disableBody(true, true);
        this.checkEnemiesDead();
      }
    });

    this.spawnEnemies();

    let hp = this.registry.get('hp');
    let hpMax = this.registry.get('hpMax');
    if (!hpMax) {
      hpMax = 3;
      this.registry.set('hpMax', 3);
    }
    this.hearts = [];
    for (let i = 0; i < hpMax; i++) {
      let h = this.add.image(16 + i * 35, 16, i < hp ? "img_heart" : "empty_heart")
        .setScale(0.09).setOrigin(0, 0).setScrollFactor(0);
      this.hearts.push(h);
    }

    this.physics.add.overlap(player, this.enemies, () => {
      this.takeDamage();
    }, null, this);

    this.physics.add.collider(porte, player);
  }

  update() {
    if (open_porte1 == false && Phaser.Input.Keyboard.JustDown(interact) == true &&
      this.physics.overlap(player, porte) == true) {
      open_porte1 = true;
      this.time.delayedCall(500, () => {
        this.scene.start("Couloir1", { x: 1792, y: 1696 });
      });
      porte.anims.play("anim_ouvreporte1");
    }

    player.setVelocity(0);

    // Horizontal
    if (clavier.left.isDown) {
      player.setVelocityX(-160);
      player.setScale(0.6);
      player.setSize(100, 150);
      player.setFlipX(true);
      player.anims.play("anim_tourne_droite", true);
      player.setScale(0.6);
    } else if (clavier.right.isDown) {
      player.setVelocityX(160);
      player.setScale(0.6);
      player.setSize(100, 150);
      player.setFlipX(false);
      player.anims.play("anim_tourne_droite", true);
      player.setScale(0.6);
    }

    // Vertical
    if (clavier.up.isDown) {
      player.setVelocityY(-160);
      player.setScale(0.55);
      player.setSize(100, 150);
      player.setOffset(player.width / 2 - 50, player.height / 2 - 75);
      player.anims.play("anim_marche_arriere", true);
      player.setScale(0.55);
    } else if (clavier.down.isDown) {
      player.setVelocityY(160);
      player.setScale(0.45);
      player.setSize(130, 200);
      player.setOffset(player.width / 2 - 65, player.height / 2 - 75);
      player.anims.play("anim_marche_avant", true);
      player.setScale(0.45);
    }

    // Idle
    if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
      player.setTexture("IdleJason");
      player.setScale(0.4);
      player.setSize(160, 250);
      player.setOffset(40, 20);
    }

    if (clavier.left.isDown || clavier.right.isDown || clavier.up.isDown || clavier.down.isDown) {
      lastDir.x = 0;
      lastDir.y = 0;
      if (clavier.left.isDown) lastDir.x = -1;
      if (clavier.right.isDown) lastDir.x = 1;
      if (clavier.up.isDown) lastDir.y = -1;
      if (clavier.down.isDown) lastDir.y = 1;
    }

    if (this.keySpace.isDown && !wasSpaceDown && this.time.now > lastFired) {
      let bullet = bullets.create(player.x, player.y, "img_balle");
      bullet.setScale(0.25);
      bullet.setVelocityX(400 * lastDir.x);
      bullet.setVelocityY(400 * lastDir.y);
      lastFired = this.time.now + this.registry.get('fireRate');
    }
    wasSpaceDown = this.keySpace.isDown;

    this.zombies.forEach(zombie => {
      if (!zombie || !zombie.active) return;
      let distance = Phaser.Math.Distance.Between(zombie.x, zombie.y, player.x, player.y);
      if (distance < 50) {
        zombie.setVelocity(0);
        if (zombie.anims.currentAnim?.key !== "zombie_attaque") {
          zombie.anims.play("zombie_attaque", true);
          this.takeDamage();
        }
      } else {
        let angle = Phaser.Math.Angle.Between(zombie.x, zombie.y, player.x, player.y);
        zombie.setVelocity(Math.cos(angle) * 60, Math.sin(angle) * 60);
        if (zombie.anims.currentAnim?.key !== "zombie_deplacement") {
          zombie.anims.play("zombie_deplacement", true);
        }
      }
    });
  }

  spawnEnemies() {
    const zombiePositions = [
      { x: 400, y: 300 },
      { x: 600, y: 250 },
      { x: 200, y: 400 }
    ];

    this.zombies = [];

    zombiePositions.forEach(pos => {
      let z = this.enemies.create(pos.x, pos.y, "zombie_deplacement");
      z.setCollideWorldBounds(true);
      z.setBounce(1);
      z.setVelocityX(80);
      z.anims.play("zombie_deplacement", true);
      z.hp = 5;
      this.zombies.push(z);
    });

    const blobPositions = [
      { x: 500, y: 300 },
      { x: 300, y: 400 }
    ];

    blobPositions.forEach(pos => {
      let b = this.enemies.create(pos.x, pos.y, "blob_move");
      b.setCollideWorldBounds(true);
      b.setBounce(1);
      b.setVelocityX(80);
      b.anims.play("blob_move_anim", true);
      b.hp = 2;
    });

    this.physics.add.collider(this.enemies, this.calque1);
    this.physics.add.collider(this.enemies, this.calque3);
  }

  spawnChest() {
    this.chest = this.physics.add.sprite(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
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
        this.add.text(this.chest.x, this.chest.y - 50, "+1 MAX HP", { fontSize: '16px', fill: '#fff' }).setOrigin(0.5);
        chest_opened = true;

        let hpMax = this.registry.get('hpMax');
        hpMax += 1;
        this.registry.set('hpMax', hpMax);
        this.registry.set('hp', hpMax);

        this.hearts.forEach(h => h.setTexture("img_heart"));

        let newHeart = this.add.image(16 + (hpMax - 1) * 35, 16, "img_heart")
          .setScale(0.09).setOrigin(0, 0).setScrollFactor(0);
        this.hearts.push(newHeart);
      }
    });
  }

  checkEnemiesDead() {
    if (this.enemies.countActive() === 0) {
      this.spawnChest();
    }
  }

  takeDamage() {
    if (this.isInvincible) return;

    let hp = this.registry.get('hp');
    if (hp <= 0) return;

    hp -= 1;
    this.registry.set('hp', hp);
    this.hearts[hp].setTexture("empty_heart");

    this.isInvincible = true;

    this.tweens.add({
      targets: player,
      alpha: 0,
      duration: 100,
      yoyo: true,
      repeat: 9,
      onComplete: () => { player.setAlpha(1); }
    });

    this.time.delayedCall(2000, () => {
      this.isInvincible = false;
    });
    if (hp <= 0) {
      // Freeze le joueur
      player.setVelocity(0);
      player.body.enable = false;

      // Affiche l'image de game over au centre de l'écran
      this.add.image(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        "game_over"
      ).setScrollFactor(0).setDepth(10).setScale(2);

      // Attend 3 secondes puis renvoi au Menu
      this.time.delayedCall(3000, () => {
        this.scene.start("Menu");
      });
    }
  }
}