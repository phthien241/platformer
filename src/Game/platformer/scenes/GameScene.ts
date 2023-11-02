import { platform } from "os";
import Phaser from "phaser";

interface Eagle {
  sprite: any;
  y: number;
  x: number;
}

interface specialEaglePosition {
  x: number;
  y: number;
}

export default class GameScene extends Phaser.Scene {
  private background: any;
  private playerIsHurt = false;
  private player?: any;
  private platforms: any;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private eagleArray: Eagle[] = [];
  private eaglePosition: specialEaglePosition[] = [{ x: 1915, y: 90 }];
  private cherry: any;
  private gem: any;
  private width!: number;
  private height!: number;
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image(
      "background",
      process.env.PUBLIC_URL + "/assets/environment/Background/back.png"
    );
    this.load.image(
      "crate",
      process.env.PUBLIC_URL + "/assets/environment/Props/big-crate.png"
    );
    this.load.image(
      "platform",
      process.env.PUBLIC_URL + "/assets/environment/Props/platform-long.png"
    );
    this.load.image(
      "player",
      process.env.PUBLIC_URL + "/assets/sprites/player/idle/player-idle-1.png"
    );
    this.load.image(
      "idle-2",
      process.env.PUBLIC_URL + "/assets/sprites/player/idle/player-idle-2.png"
    );
    this.load.image(
      "idle-3",
      process.env.PUBLIC_URL + "/assets/sprites/player/idle/player-idle-3.png"
    );
    this.load.image(
      "idle-4",
      process.env.PUBLIC_URL + "/assets/sprites/player/idle/player-idle-4.png"
    );
    this.load.image(
      "run-1",
      process.env.PUBLIC_URL + "/assets/sprites/player/run/player-run-1.png"
    );
    this.load.image(
      "run-2",
      process.env.PUBLIC_URL + "/assets/sprites/player/run/player-run-2.png"
    );
    this.load.image(
      "run-3",
      process.env.PUBLIC_URL + "/assets/sprites/player/run/player-run-3.png"
    );
    this.load.image(
      "run-4",
      process.env.PUBLIC_URL + "/assets/sprites/player/run/player-run-4.png"
    );
    this.load.image(
      "run-5",
      process.env.PUBLIC_URL + "/assets/sprites/player/run/player-run-5.png"
    );
    this.load.image(
      "run-6",
      process.env.PUBLIC_URL + "/assets/sprites/player/run/player-run-6.png"
    );
    this.load.image(
      "jump-1",
      process.env.PUBLIC_URL + "/assets/sprites/player/jump/player-jump-1.png"
    );
    this.load.image(
      "jump-2",
      process.env.PUBLIC_URL + "/assets/sprites/player/jump/player-jump-2.png"
    );
    this.load.spritesheet(
      "eagle",
      process.env.PUBLIC_URL + "/assets/spritesheets/eagle-attack.png",
      {
        frameWidth: 39,
        frameHeight: 38,
      }
    );
    this.load.spritesheet(
      "enemy-deadth",
      process.env.PUBLIC_URL + "/assets/spritesheets/enemy-deadth.png",
      {
        frameWidth: 39,
        frameHeight: 38,
      }
    );
    this.load.spritesheet(
      "cherry",
      process.env.PUBLIC_URL + "/assets/spritesheets/cherry.png",
      {
        frameWidth: 20,
        frameHeight: 20,
      }
    );
    this.load.spritesheet(
      "item-feedback",
      process.env.PUBLIC_URL + "/assets/spritesheets/item-feedback.png",
      {
        frameWidth: 35,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      "gem",
      process.env.PUBLIC_URL + "/assets/spritesheets/gem.png",
      {
        frameWidth: 15,
        frameHeight: 10,
      }
    );
    this.load.image(
      "hurt-1",
      process.env.PUBLIC_URL + "/assets/sprites/player/hurt/player-hurt-1.png"
    );
    this.load.image(
      "hurt-2",
      process.env.PUBLIC_URL + "/assets/sprites/player/hurt/player-hurt-2.png"
    );
    this.load.image("tiles", process.env.PUBLIC_URL + "/assets/Map/map.png");
    this.load.tilemapTiledJSON(
      "map",
      process.env.PUBLIC_URL + "/assets/Map/map.tmj"
    );
  }

  create() {
    this.cameras.main.setZoom(1.5);
    this.add.image(0, 0, "tiles").setOrigin(0).setDepth(100);
    this.height = this.sys.game.config.height as number;
    this.width = this.sys.game.config.width as number;

    this.createBackground();
    this.createPlatform();
    this.createAnims();

    this.player = this.physics.add
      .sprite(0, 0, "player")
      .setOrigin(0, 1)
      .setGravityY(300);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(20, 32);

    for (let i = 0; i < 10; i++) {
      const x = Math.floor(Math.random() * (2000 - 45 + 1)) + 45;
      const y = Math.floor(Math.random() * (600 - 50 + 1)) + 50;
      let eagle: Eagle = {
        sprite: this.physics.add
          .sprite(x, y, "eagle")
          .play("eagle")
          .setOrigin(0, 1)
          .setImmovable(true)
          .setVelocityY(100),
        y: y,
        x: x,
      };
      this.eagleArray.push(eagle);
    }

    for (let i = 0; i < this.eaglePosition.length; i++) {
      let eagle: Eagle = {
        sprite: this.physics.add
          .sprite(this.eaglePosition[i].x, this.eaglePosition[i].y, "eagle")
          .play("eagle")
          .setOrigin(0, 1)
          .setImmovable(true)
          .setVelocityY(100),
        y: this.eaglePosition[i].y,
        x: this.eaglePosition[i].x,
      };
      this.eagleArray.push(eagle);
    }
    this.cherry = this.physics.add
      .sprite(this.width / 2, this.height / 2 - 70, "cherry")
      .play("cherry")
      .setOrigin(0, 1);
    this.gem = this.physics.add
      .sprite(this.width / 2 + 30, this.height / 2 - 90, "gem")
      .play("gem")
      .setOrigin(0, 1)
      .setScale(1.5);

    this.createCollider();
    this.player.anims.play("idle", true);
    this.cursors = this.input.keyboard?.createCursorKeys();

    this.physics.world.setBounds(0, 0, 5000, 800);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, 5000, 800);
  }
  update() {
    // console.log(this.player.body.x, this.player.body.y);
    // 50-600(height), 45-2000(width)
    if (this.playerIsHurt) return;
    for (let i = 0; i < this.eagleArray.length; i++) {
      if (this.eagleArray[i].sprite.y > this.eagleArray[i].y + 50) {
        this.eagleArray[i].sprite.setVelocityY(-100);
      } else if (this.eagleArray[i].sprite.y < this.eagleArray[i].y - 100) {
        this.eagleArray[i].sprite.setVelocityY(100);
      }
    }

    // const isOnGround = this.player?.body?.touching.down;
    const isOnGround = this.player.body.velocity.y === 0;
    if (this.cursors?.right?.isDown) {
      if (isOnGround) {
        this.player?.setFlipX(false);
        this.player?.anims.play("run", true);
        this.player?.setVelocityX(150);
      } else {
        this.player?.setVelocityX(130);
      }
    } else if (this.cursors?.left?.isDown) {
      if (isOnGround) {
        this.player?.setFlipX(true);
        this.player?.anims.play("run", true);
        this.player?.setVelocityX(-150);
      } else {
        this.player?.setVelocityX(-130);
      }
    } else {
      this.player?.setVelocityX(0);
      this.player?.anims.play("idle", true);
    }

    if (this.cursors?.space?.isDown && isOnGround) {
      this.player?.setVelocityY(-150);
    }
    if (!isOnGround) {
      this.player?.anims.play("jump");
    }
    if (!isOnGround && this.player?.body?.velocity.y! > 0) {
      this.player?.anims.play("fail");
    }

    this.background.x = this.cameras.main.scrollX;
    this.background.y = this.cameras.main.scrollY;
  }

  createBackground() {
    this.background = this.add.image(0, 0, "background").setOrigin(0);
    const scaleX = this.width / this.background.width;
    const scaleY = this.height / this.background.height;
    const scale = Math.max(scaleX, scaleY);
    this.background.setScale(scale);
  }

  createPlatform() {
    const map = this.make.tilemap({ key: "map" });
    const tiles = map?.addTilesetImage("tileset", "tiles");
    if (tiles) {
      this.platforms = map.createLayer("Tile Layer 1", tiles)?.setOrigin(0);
      console.log(this.platforms.body);
    }
    this.platforms.setCollisionByExclusion([-1]);
  }

  createEnemies() {}

  createAnims() {
    this.anims.create({
      key: "idle",
      frames: [
        { key: "player" },
        { key: "idle-2" },
        { key: "idle-3" },
        { key: "idle-4" },
      ],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "run",
      frames: [
        { key: "run-1" },
        { key: "run-2" },
        { key: "run-3" },
        { key: "run-4" },
        { key: "run-5" },
        { key: "run-6" },
      ],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "jump",
      frames: [{ key: "jump-1" }],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "fail",
      frames: [{ key: "jump-2" }],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "hurt",
      frames: [{ key: "hurt-1" }, { key: "hurt-2" }],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "eagle",
      frames: this.anims.generateFrameNumbers("eagle", { start: 0, end: 3 }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "enemy-deadth",
      frameRate: 12,
      frames: this.anims.generateFrameNumbers("enemy-deadth", {
        start: 0,
        end: 5,
      }),
      repeat: 0,
    });

    this.anims.create({
      key: "cherry",
      frameRate: 12,
      frames: this.anims.generateFrameNumbers("cherry", { start: 0, end: 3 }),
      repeat: -1,
    });

    this.anims.create({
      key: "item-feedback",
      frameRate: 12,
      frames: this.anims.generateFrameNumbers("item-feedback", {
        start: 0,
        end: 3,
      }),
      repeat: 0,
    });
    this.anims.create({
      key: "item-feedback",
      frameRate: 12,
      frames: this.anims.generateFrameNumbers("item-feedback", {
        start: 0,
        end: 3,
      }),
      repeat: 0,
    });
    this.anims.create({
      key: "gem",
      frameRate: 12,
      frames: this.anims.generateFrameNumbers("gem", { start: 0, end: 4 }),
      repeat: -1,
    });
  }

  createCollider() {
    this.physics.add.collider(this.player, this.platforms);
    for (let i = 0; i < this.eagleArray.length; i++) {
      this.physics.add.collider(
        this.player,
        this.eagleArray[i].sprite,
        this.handlePlayerEnemyCollision,
        undefined,
        this
      );
    }

    this.physics.add.collider(
      this.player,
      this.cherry,
      this.handlePlayerItemsCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.player,
      this.gem,
      this.handlePlayerItemsCollision,
      undefined,
      this
    );
  }

  handlePlayerEnemyCollision(player: any, enemy: any) {
    enemy.setVelocityX(0);
    if (player.body.bottom <= enemy.body.top + 10) {
      player.setVelocityY(-100);
      const deathAnimation = this.add.sprite(
        enemy.x + enemy.body.width / 2,
        enemy.y - enemy.body.height / 2,
        "enemy-deadth"
      );
      deathAnimation.play("enemy-deadth");
      deathAnimation.on(
        "animationcomplete",
        () => {
          deathAnimation.destroy();
        },
        this
      );
      enemy.disableBody(true, true);
    } else {
      this.playerIsHurt = true;
      player.anims.play("hurt", true);
      this.time.delayedCall(1000, () => (this.playerIsHurt = false));
      console.log(player.flipX);
      player.setVelocityX(player.flipX ? 30 : -30);
    }
  }

  handlePlayerItemsCollision(player: any, item: any) {
    const feedbackAnims = this.add.sprite(
      item.x + item.body.width / 2,
      item.y - item.body.height / 2,
      "item-feedback"
    );
    feedbackAnims.play("item-feedback");
    feedbackAnims.on(
      "animationcomplete",
      () => {
        feedbackAnims.destroy();
      },
      this
    );
    item.disableBody(true, true);
  }
}
