var player;
var clavier;
var bullets;
var lastFired = 0;
var wasSpaceDown = false;
var lastDir = { x: 1, y: 0 };
var chest_opened = false;
var interact;

export default class Salle01 extends Phaser.Scene {
  constructor() {
    super({ key: "Salle01" });
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
  }

  create() {
    chest_opened = false;
    this.isInvincible = false;

    bullets = this.physics.add.group({ allowGravity: false });
    this.enemies = this.physics.add.group();

    clavier = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    interact = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    const map = this.add.tilemap("carte2");
    const tileset1 = map.addTilesetImage("Background", "B");
    const tileset3 = map.addTilesetImage("1", "D");
    this.calque1 = map.createLayer("Calque de Tuiles 1", [tileset1]);
    this.calque3 = map.createLayer("Calque de Tuiles 2", [tileset3]);
    this.calque1.setCollisionByProperty({ estSolide: true });
    this.calque3.setCollisionByProperty({ estSolide: true });

    player = this.physics.add.sprite(330, 150, "img_perso");
    player.refreshBody();
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, this.calque1);
    this.physics.add.collider(player, this.calque3);
    this.clavier = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: "anim_chest",
      frames: this.anims.generateFrameNumbers("img_chest_anim", { start: 0, end: 10 }),
      frameRate: 10,
      repeat: 0
    });

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

    // ============================================================
    //  COEURS - on affiche hpMax coeurs, pleins ou vides selon hp
    // ============================================================
    let hp = this.registry.get('hp');
    let hpMax = this.registry.get('hpMax');

    // Si hpMax pas encore défini (première fois), on l'initialise à 3
    if (!hpMax) {
      hpMax = 3;
      this.registry.set('hpMax', 3);
    }

    this.hearts = [];
    for (let i = 0; i < hpMax; i++) {
      let h = this.add.image(16 + i * 35, 16, i < hp ? "img_heart" : "empty_heart")
        .setScale(0.09)
        .setOrigin(0, 0)
        .setScrollFactor(0);
      this.hearts.push(h);
    }

    this.physics.add.overlap(player, this.enemies, () => {
      this.takeDamage();
    }, null, this);
  }

  update() {
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
      lastFired = this.time.now + 600;
    }
    wasSpaceDown = this.keySpace.isDown;

    this.zombies.forEach(zombie => {
      if (!zombie || !zombie.active) return;

      let distance = Phaser.Math.Distance.Between(
        zombie.x, zombie.y,
        player.x, player.y
      );

      if (distance < 50) {
        zombie.setVelocity(0);
        if (zombie.anims.currentAnim?.key !== "zombie_attaque") {
          zombie.anims.play("zombie_attaque", true);
          this.takeDamage();
        }
      } else {
        let angle = Phaser.Math.Angle.Between(
          zombie.x, zombie.y,
          player.x, player.y
        );
        zombie.setVelocity(
          Math.cos(angle) * 60,
          Math.sin(angle) * 60
        );
        if (zombie.anims.currentAnim?.key !== "zombie_deplacement") {
          zombie.anims.play("zombie_deplacement", true);
        }
      }
    });
  }

  spawnEnemies() {
    const zombiePositions = [
      { x: 400, y: 200 },
      { x: 600, y: 150 },
      { x: 200, y: 300 }
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

        // ✅ Augmente le max de 1 peu importe la situation
        hpMax += 1;
        this.registry.set('hpMax', hpMax);

        // ✅ Regen tous les PV au nouveau max
        this.registry.set('hp', hpMax);

        // ✅ Remet tous les coeurs existants en plein
        this.hearts.forEach(h => h.setTexture("img_heart"));

        // ✅ Ajoute le nouveau coeur supplémentaire
        let newHeart = this.add.image(16 + (hpMax - 1) * 35, 16, "img_heart")
          .setScale(0.09)
          .setOrigin(0, 0)
          .setScrollFactor(0);
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
      this.scene.start("Menu");
    }
  }
}