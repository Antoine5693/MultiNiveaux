var player;
var clavier;
var bullets;
var lastFired = 0;
var wasSpaceDown = false;
var lastDir = { x: 1, y: 0 };
var hasgun = true;
var boss;
var hp
var hpMax;
var hearts = [];
var isInvincible = false;

export default class BossZone extends Phaser.Scene {
  constructor() {
    super({ key: "BossZone" });
  }

  preload() {
    this.load.image("B", "src/assets/Background.png");
    this.load.image("D", "src/assets/Dela_dec3.png");
    this.load.tilemapTiledJSON("carte5", "src/assets/BossZone.tmj");

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

    // Boss
    this.load.spritesheet("boss_jump1", "src/assets/Zombie boss jump1 spritesheet.png", { frameWidth: 126, frameHeight: 225 });
    this.load.spritesheet("boss_jump2", "src/assets/Zombie boss jump2 spritesheet.png", { frameWidth: 135, frameHeight: 201 });
    this.load.spritesheet("boss_jump3", "src/assets/Zombie boss jump3 spritesheet.png", { frameWidth: 134, frameHeight: 140 });
    this.load.spritesheet("boss_attack", "src/assets/Zombie boss attack spritesheet.png", { frameWidth: 154, frameHeight: 159 });
    this.load.spritesheet("boss_moveG", "src/assets/bosszombiedeplacementG_v2.png", { frameWidth: 155, frameHeight: 222 });
    this.load.spritesheet("boss_moveD", "src/assets/bosszombiedeplacementD_v2.png", { frameWidth: 188, frameHeight: 220 });

    this.load.audio("son_attaquesautee", "src/assets/boss_zombie_jumpattaque_sound.mp3");
    this.load.audio("son_épée", "src/assets/bosszombie_attaque_sound.mp3");
    this.load.audio("growl", "src/assets/growling_sound.mp3");
  }

  create() {
    
    console.log("Texture moveG existe ?", this.textures.exists("boss_moveG"));
    console.log("Texture moveD existe ?", this.textures.exists("boss_moveD"));
    this.H = 180;
    this.attackDistance = 120;
    this.patternTimer = 0;

    hp = 3;
    hpMax = 3;

    for (let i = 0; i < hpMax; i++) {
    let h = this.add.image(16 + i * 35, 16, i < hp ? "img_heart" : "empty_heart")
        .setScale(0.09)
        .setOrigin(0, 0)
        .setScrollFactor(0);
    hearts.push(h);
}

    clavier = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    bullets = this.physics.add.group({ allowGravity: false });
    this.sonTir = this.sound.add("son_tir");

    const map = this.add.tilemap("carte5");
    const tileset1 = map.addTilesetImage("1", "B");
    const tileset2 = map.addTilesetImage("888", "D");
    const calque1 = map.createLayer("Calque de Tuiles 1", [tileset1]);
    const calque2 = map.createLayer("Calque de Tuiles 2", [tileset2]);
    calque1.setCollisionByProperty({ estSolide: true });
    calque2.setCollisionByProperty({ estSolide: true });

    // Joueur Jason
    player = this.physics.add.sprite(480, 864, "IdleJason");
    player.setScale(0.4);
    player.setSize(160, 250);
    player.setOffset(40, 20);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, calque1);
    this.physics.add.collider(player, calque2);

    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Animations Jason
    this.anims.create({
      key: "anim_tourne_droite",
      frames: this.anims.generateFrameNumbers("jason_marchedroite", { start: 0, end: 5 }),
      frameRate: 10, repeat: -1
    });
    this.anims.create({
      key: "anim_marche_arriere",
      frames: this.anims.generateFrameNumbers("jason_back", { start: 0, end: 5 }),
      frameRate: 10, repeat: -1
    });
    this.anims.create({
      key: "anim_marche_avant",
      frames: this.anims.generateFrameNumbers("jason_marcheavant", { start: 0, end: 5 }),
      frameRate: 10, repeat: -1
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

    // Colliders balles
    this.physics.add.collider(bullets, calque1, (bullet) => { bullet.destroy(); });
    this.physics.add.collider(bullets, calque2, (bullet) => { bullet.destroy(); });

    this.sonAttaqueSautée = this.sound.add("son_attaquesautee");
    this.sonAttaqueÉpée = this.sound.add("son_épée");
    this.sonGrowl = this.sound.add("growl");

    // Animations boss
    this.anims.create({ key: "boss_jump1",  frames: this.anims.generateFrameNumbers("boss_jump1",  { start: 0, end: 3 }), frameRate: 24, repeat: 0 });
    this.anims.create({ key: "boss_jump2",  frames: this.anims.generateFrameNumbers("boss_jump2",  { start: 0, end: 3 }), frameRate: 24, repeat: 0 });
    this.anims.create({ key: "boss_jump3",  frames: this.anims.generateFrameNumbers("boss_jump3",  { start: 0, end: 3 }), frameRate: 24, repeat: 0 });
    this.anims.create({ key: "boss_attack", frames: this.anims.generateFrameNumbers("boss_attack", { start: 0, end: 4 }), frameRate: 5,  repeat: 0 });
    this.anims.create({ key: "boss_moveG",  frames: this.anims.generateFrameNumbers("boss_moveG",  { start: 0, end: 6 }), frameRate: 8,  repeat: -1 });
    this.anims.create({ key: "boss_moveD",  frames: this.anims.generateFrameNumbers("boss_moveD",  { start: 0, end: 5 }), frameRate: 8,  repeat: -1 });

    // Hitbox invisible
    boss = this.physics.add.sprite(600, 200, "boss_jump1");
    boss.setVisible(false);
    boss.setBounce(0.2);
    boss.setCollideWorldBounds(true);
    this.physics.add.collider(boss, calque1);
    this.physics.add.collider(boss, calque2);

    // Sprites visuels séparés
    this.bossSprites = {
      jump1:  this.add.sprite(0, 0, "boss_jump1"),
      jump2:  this.add.sprite(0, 0, "boss_jump2"),
      jump3:  this.add.sprite(0, 0, "boss_jump3"),
      attack: this.add.sprite(0, 0, "boss_attack"),
      moveG:  this.add.sprite(0, 0, "boss_moveG"),
      moveD:  this.add.sprite(0, 0, "boss_moveD"),
    };

    const hauteurs = { jump1: 225, jump2: 201, jump3: 140, attack: 159, moveG: 285, moveD: 257 };
    Object.entries(this.bossSprites).forEach(([key, sprite]) => {
      sprite.setVisible(false);
      sprite.setScale(this.H / hauteurs[key]);
      sprite.setOrigin(0.5, 1);
    });
    this.bossSprites.moveD.setOrigin(0.5, 0.8);

    this.bossCurrentAnim = "moveG";
  }

  playBossAnim(key) {
    if (this.bossCurrentAnim === key) return;
    console.log("Changement vers :", key);
    console.log("Anim existe ?", this.anims.exists("boss_" + key));
    console.log("Frames :", this.anims.get("boss_" + key)?.frames?.map(f => f?.duration));
    this.bossSprites[this.bossCurrentAnim].setVisible(false);
    this.bossSprites[this.bossCurrentAnim].anims.stop();
    this.bossCurrentAnim = key;
    this.bossSprites[key].setVisible(true);
    this.bossSprites[key].anims.play("boss_" + key, true);
  }

  update() {
    if (!player) return;

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
    let dirX = 0, dirY = 0;
    if (clavier.left.isDown)  dirX -= 1;
    if (clavier.right.isDown) dirX += 1;
    if (clavier.up.isDown)    dirY -= 1;
    if (clavier.down.isDown)  dirY += 1;
    if (dirX !== 0 || dirY !== 0) {
      let mag = Math.sqrt(dirX * dirX + dirY * dirY);
      lastDir.x = dirX / mag;
      lastDir.y = dirY / mag;
    }

    // Tir
    if (this.keySpace.isDown && !wasSpaceDown && this.time.now > lastFired && hasgun) {
      let bullet = bullets.create(player.x, player.y, "img_balle");
      bullet.setScale(0.25);
      bullet.setVelocityX(400 * lastDir.x);
      bullet.setVelocityY(400 * lastDir.y);
      this.sonTir.play();
      lastFired = this.time.now + 300;
    }
    wasSpaceDown = this.keySpace.isDown;

    // IA Boss
    if (boss) {
      Object.values(this.bossSprites).forEach(s => { s.x = boss.x; s.y = boss.y; });

      let dx = player.x - boss.x;
      let dy = player.y - boss.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > this.attackDistance) {
        boss.setVelocityX((dx / distance) * 80);
        boss.setVelocityY((dy / distance) * 80);
        this.playBossAnim(dx < 0 ? "moveG" : "moveD");
      } else {
        boss.setVelocity(0);

        let currentKey = this.bossCurrentAnim;
        let isMoving = currentKey === "moveG" || currentKey === "moveD";
        let animDone = isMoving || !this.bossSprites[currentKey].anims.isPlaying;

        if (this.time.now > this.patternTimer && animDone) {
          this.patternTimer = this.time.now + 3000;
          if (Phaser.Math.Between(0, 1) === 0) {
            this.playBossAnim("attack");
            this.sonAttaqueÉpée.play();
          } else {
            this.playBossAnim("jump" + Phaser.Math.Between(1, 3));
            this.sonAttaqueSautée.play();
          }
        }
      }
    }
  }
}