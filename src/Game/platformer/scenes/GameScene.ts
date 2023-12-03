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
  private trap: any;
  private stairs: any;
  private collectingCherry: any;
  private collectingDiamond: any;
  private jumpEagle: any;
  private music: any;
  private enemyCollision: any;
  private jumpSound: any;
  private footstep: any;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private eagleArray: Eagle[] = [];
  private eaglePosition: specialEaglePosition[] = [
    { x: 1915, y: 90 },
    { x: 1070, y: 800 },
    { x: 1153, y: 760 },
    { x: 1244, y: 730 },
    { x: 186, y: 535 },
    { x: 269, y: 554 },
    { x: 139, y: 570 },
  ];
  private cherryGroup!: Phaser.GameObjects.Group;
  private opossumGroup!: Phaser.GameObjects.Group;
  private frogGroup!: Phaser.GameObjects.Group;
  private gemGroup!: Phaser.GameObjects.Group;
  private width!: number;
  private height!: number;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private imageGroup!: Phaser.GameObjects.Group;
  private HP = 4;
  private lastFootstepTime: number = 0;
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
    this.load.audio(
      "cherry", process.env.PUBLIC_URL + "/assets/sound/cherry.wav"
    );
    this.load.audio(
      "eagle", process.env.PUBLIC_URL + "/assets/sound/eagle.wav"
    );
    this.load.audio(
      "diamond", process.env.PUBLIC_URL + "/assets/sound/diamond.wav"
    );
    this.load.audio(
      "music", process.env.PUBLIC_URL + "/assets/sound/music.wav"
    )
    this.load.audio(
      "footstep", process.env.PUBLIC_URL + "/assets/sound/footstep.wav"
    )
    this.load.audio(
      "jump", process.env.PUBLIC_URL + "/assets/sound/jump.wav"
    )
    this.load.audio(
      "enemyCollision", process.env.PUBLIC_URL + "/assets/sound/enemyCollision.wav"
    )
    this.load.spritesheet(
      "eagle",
      process.env.PUBLIC_URL + "/assets/spritesheets/eagle-attack.png",
      {
        frameWidth: 39,
        frameHeight: 38,
      }
    );
    this.load.spritesheet(
      "opossum",
      process.env.PUBLIC_URL + "/assets/spritesheets/oposum.png",
      {
        frameWidth: 36,
        frameHeight: 28,
      }
    );
    this.load.spritesheet(
      "frog-idle",
      process.env.PUBLIC_URL + "/assets/spritesheets/frog-idle.png",
      {
        frameWidth: 36,
        frameHeight: 28,
      }
    );
    this.load.spritesheet(
      "frog-jump",
      process.env.PUBLIC_URL + "/assets/spritesheets/frog-jump.png",
      {
        frameWidth: 33,
        frameHeight: 32,
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
        frameHeight: 13,
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
    this.load.image(
      "heart",
      process.env.PUBLIC_URL + "/assets/environment/Props/Heart.png"
    );

    this.load.text(
      "cherryPos",
      process.env.PUBLIC_URL + "/assets/cherryPos.txt"
    );
    this.load.text("gemPos", process.env.PUBLIC_URL + "/assets/gemPos.txt");
    this.load.text(
      "opossumPos",
      process.env.PUBLIC_URL + "/assets/opossumPos.txt"
    );
    this.load.text(
      "frog",
      process.env.PUBLIC_URL + "/assets/frog.txt"
    );
  }

  create() {
    this.addSound();
    this.addText();
    this.createBackground();
    this.createPlatform();
    this.createAnims();
    this.addCharacter();
    this.setCamera();
    this.addItems();
    this.addEagle();
    this.createCollider();
    this.setWorld();
  }

  update(time: number) {
    if (this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S).isDown) {
      console.log(this.player.body.x, this.player.body.y);
    }
    this.handleEndScene();
    this.eagleMove();
    this.background.x = this.cameras.main.scrollX;
    this.background.y = this.cameras.main.scrollY;
    if (this.playerIsHurt) return;
    this.handleCharacterMove(time);
  }


  handleEndScene() {
    if (this.HP < 0) {
      this.scene.start("EndScene", { score: this.score })
      this.sound.stopAll()
    }
  }
  handleCharacterMove(time: number) {
    const isOnGround = this.player?.body?.blocked.down;
    // const isOnGround = this.player.body.velocity.y === 0;
    if (this.cursors?.right?.isDown) {
      if (isOnGround) {
        if (time - this.lastFootstepTime > 500) {
          this.footstep.play();
          this.lastFootstepTime = time;
        }
        this.player?.setFlipX(false);
        this.player?.anims.play("run", true);
        this.player?.setVelocityX(150);
      } else {
        this.player?.setVelocityX(130);
      }
    } else if (this.cursors?.left?.isDown) {
      if (isOnGround) {
        if (time - this.lastFootstepTime > 500) {
          this.footstep.play();
          this.lastFootstepTime = time;
        }
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
      this.jumpSound.play();
      this.player?.setVelocityY(-150);
    }
    if (!isOnGround) {
      this.player?.anims.play("jump");
    }
    if (!isOnGround && this.player?.body?.velocity.y! > 0) {
      this.player?.anims.play("fail");
    }
  }

  eagleMove() {
    this.opossumGroup.children.iterate((opossum: Phaser.GameObjects.GameObject): boolean | null => {
      const sprite = opossum as Phaser.Physics.Arcade.Sprite;
      if (!sprite.getData('initialX') && sprite.body) {
        sprite.setData('initialX', sprite.x);
        sprite.setData('movingLeft', true);
        sprite.setVelocityX(-100);
        sprite.setFlipX(false);
      }
      const initialX = sprite.getData('initialX') as number;
      const movingLeft = sprite.getData('movingLeft') as boolean;
      if (sprite.body) {
        if (movingLeft && sprite.x <= initialX - 200) {
          sprite.setVelocityX(100); // Move right
          sprite.setData('movingLeft', false);
          sprite.setFlipX(true); // Unflip sprite
        } else if (!movingLeft && sprite.x >= initialX) {
          sprite.setVelocityX(-100); // Move left
          sprite.setData('movingLeft', true);
          sprite.setFlipX(false);
        }
      }
      return null;
    });

    this.frogGroup.children.iterate((frog: Phaser.GameObjects.GameObject): boolean | null => {
      const arcadeFrog = frog as Phaser.Physics.Arcade.Sprite;
      let isOnGround = arcadeFrog.body && arcadeFrog.body instanceof Phaser.Physics.Arcade.Body && arcadeFrog.body.blocked.down;
      const sprite = frog as Phaser.Physics.Arcade.Sprite;
      if (isOnGround) {
        if (frog.getData("canJump")) {
          if (frog.getData("moveLeft")) {
            sprite.setVelocity(-100, -150);
          } else {
            sprite.setVelocity(100, -150);
          }
          sprite.setFlipX(!frog.getData("moveLeft"))
          frog.setData("canJump", false)
          this.time.delayedCall(4000, () => {
            frog.setData("moveLeft", !frog.getData("moveLeft"))
            frog.setData("canJump", true)
          });
        }
        if (sprite.body?.velocity.y == 0) {
          sprite.setVelocityX(0);
        }
        sprite.play("frog-idle", true)
      }
      else if (!isOnGround && frog.body?.velocity.y! < 0) {
        sprite.play("frog-jump-up");
      }
      else if (!isOnGround && frog.body?.velocity.y! >= 0) {
        sprite.play("frog-jump-down");
      }
      return null;
    });

    for (let i = 0; i < this.eagleArray.length; i++) {
      if (
        this.eagleArray[i].sprite &&
        this.eagleArray[i].sprite.y > this.eagleArray[i].y + 50
      ) {
        this.eagleArray[i].sprite.setVelocityY(-100);
      } else if (
        this.eagleArray[i] &&
        this.eagleArray[i].sprite.y < this.eagleArray[i].y - 100
      ) {
        this.eagleArray[i].sprite.setVelocityY(100);
      }
    }
  }

  setCamera() {
    this.cameras.main.setZoom(1.5);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, 5000, 800);
  }

  setWorld() {
    this.physics.world.setBounds(0, 0, 5000, 800, false, false, false, false);
    this.physics.world.on('worldbounds', (up: boolean, down: boolean, left: boolean, right: boolean) => {
      if (down) {
        this.HP--;
        this.handleHPChange();
        this.restartPosition();
      }
    });
  }


  addItems() {
    this.cherryGroup = this.add.group();

    let data = this.cache.text.get("cherryPos");

    let lines = data.split("\n");

    for (let line of lines) {
      let pos = line.split(",");
      if (pos.length == 2) {
        let x = parseFloat(pos[0].trim());
        let y = parseFloat(pos[1].trim());
        let cherry = this.physics.add
          .sprite(x, y, "cherry")
          .play("cherry")
          .setOrigin(0, 1)
          .setDepth(100);
        this.cherryGroup.add(cherry);
      }
    }

    this.gemGroup = this.add.group();

    data = this.cache.text.get("gemPos");

    lines = data.split("\n");

    for (let line of lines) {
      let pos = line.split(",");
      if (pos.length == 2) {
        let x = parseFloat(pos[0].trim());
        let y = parseFloat(pos[1].trim());
        let gem = this.physics.add
          .sprite(x, y, "gem")
          .play("gem")
          .setOrigin(0, 1)
          .setDepth(100);
        this.gemGroup.add(gem);
      }
    }
  }

  addEagle() {
    this.opossumGroup = this.add.group();

    let data = this.cache.text.get("opossumPos");

    let lines = data.split("\n");

    for (let line of lines) {
      let pos = line.split(",");
      if (pos.length == 2) {
        let x = parseFloat(pos[0].trim());
        let y = parseFloat(pos[1].trim());
        let opossum = this.physics.add
          .sprite(x, y, "opossum")
          .play("opossum")
          .setOrigin(0, 1)
          .setDepth(100)
          .setGravityY(300)
        this.opossumGroup.add(opossum);
      }
    }

    this.frogGroup = this.add.group();

    data = this.cache.text.get("frog");

    lines = data.split("\n");

    for (let line of lines) {
      let pos = line.split(",");
      if (pos.length == 2) {
        let x = parseFloat(pos[0].trim());
        let y = parseFloat(pos[1].trim());
        let frog = this.physics.add
          .sprite(x, y, "frog-idle")
          .play("frog-idle")
          .setOrigin(0, 1)
          .setDepth(100)
          .setGravityY(300)
          .setData("canJump", true)
          .setData("moveLeft", true);
        this.frogGroup.add(frog);
      }
    }

    for (let i = 0; i < 9; i++) {
      const x = Math.floor(Math.random() * (2000 - 45 + 1)) + 45;
      const y = Math.floor(Math.random() * (600 - 50 + 1)) + 50;
      let eagle: Eagle = {
        sprite: this.physics.add
          .sprite(x, y, "eagle")
          .play("eagle")
          .setOrigin(0, 1)
          .setImmovable(true)
          .setVelocityY(100)
          .setDepth(100)
          .setData("canOverlap", true),
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
          .setVelocityY(100)
          .setDepth(100),
        y: this.eaglePosition[i].y,
        x: this.eaglePosition[i].x,
      };
      this.eagleArray.push(eagle);
    }
  }

  addCharacter() {
    this.player = this.physics.add
      .sprite(10, 40, "player")
      // .sprite(1797, 600, "player")
      .setOrigin(0, 1)
      .setGravityY(300)
      .setDepth(100)
      .setData("canOverlap", true);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(20, 22);
    this.player.body.setOffset(this.player.body.offset.x, 10);
    this.player.anims.play("idle", true);
    this.cursors = this.input.keyboard?.createCursorKeys();
  }


  addSound() {
    this.collectingCherry = this.sound.add("cherry");
    this.collectingDiamond = this.sound.add("diamond")
    this.jumpEagle = this.sound.add("eagle");
    this.footstep = this.sound.add("footstep");
    this.jumpSound = this.sound.add("jump")
    this.enemyCollision = this.sound.add("enemyCollision")
    this.music = this.sound.add("music", { loop: true });
    this.music.play();
  }

  addText() {
    this.scoreText = this.add
      .text(110, 150, `Score:0`, {
        fontSize: "18px",
        color: "#000",
      })
      .setDepth(2)
      .setScrollFactor(0);
    this.add
      .text(110, 180, "HP:", {
        fontSize: "18px",
        color: "#000",
      })
      .setDepth(2)
      .setScrollFactor(0);
    this.imageGroup = this.add
      .group({
        key: "heart",
        repeat: 4,
        setXY: { x: 120, y: 160, stepX: 20 },
      })
      .setDepth(2)
      .setOrigin(0);

    (this.imageGroup.getChildren() as Phaser.GameObjects.Image[]).forEach(
      (image) => {
        image.setScrollFactor(0);
      }
    );

    this.add.image(0, 0, "tiles").setOrigin(0).setDepth(1);
    this.height = this.sys.game.config.height as number;
    this.width = this.sys.game.config.width as number;
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
    const tilesTrap = map?.addTilesetImage("tileset3", "tiles")
    if (tiles) {
      this.platforms = map.createLayer("Tile Layer 1", tiles)?.setOrigin(0);
      this.trap = map.createLayer("trap", tilesTrap!)?.setOrigin(0);
      this.stairs = map.createLayer("invisibleStair", tiles)?.setOrigin(0);
    }
    this.platforms.setCollisionByExclusion([-1]);
    this.trap.setCollisionByExclusion([-1]);
    this.stairs.setCollisionByExclusion([-1]);
  }

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
      key: "opossum",
      frames: this.anims.generateFrameNumbers("opossum", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "frog-idle",
      frames: this.anims.generateFrameNumbers("frog-idle", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "frog-jump-up",
      frames: this.anims.generateFrameNumbers("frog-jump", { start: 1, end: 1 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "frog-jump-down",
      frames: this.anims.generateFrameNumbers("frog-jump", { start: 2, end: 2 }),
      frameRate: 10,
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
      key: "gem",
      frameRate: 12,
      frames: this.anims.generateFrameNumbers("gem", { start: 0, end: 4 }),
      repeat: -1,
    });
    this.anims.create({
      key: "key",
      frameRate: 12,
      frames: this.anims.generateFrameNumbers("key", { start: 0, end: 11 }),
      repeat: -1,
    });
  }

  createCollider() {
    this.physics.add.collider(this.player, this.platforms);
    for (let i = 0; i < this.eagleArray.length; i++) {
      this.physics.add.overlap(
        this.player,
        this.eagleArray[i].sprite,
        this.handlePlayerEnemyCollision,
        undefined,
        this
      );
    }
    this.physics.add.overlap(this.player, this.opossumGroup, this.handlePlayerEnemyCollision, undefined, this)

    this.physics.add.overlap(this.player, this.frogGroup, this.handlePlayerEnemyCollision, undefined, this)

    this.physics.add.collider(this.opossumGroup, this.platforms);

    this.physics.add.collider(this.frogGroup, this.platforms);

    this.physics.add.collider(this.player, this.trap, (player, trap) => {
      this.HP--;
      this.handleHPChange();
      this.restartPosition();
    });

    this.physics.add.collider(this.player, this.stairs, (player, stairs) => { });

    this.physics.add.overlap(
      this.player,
      this.cherryGroup,
      this.handlePlayerItemsCollision,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.gemGroup,
      this.handlePlayerItemsCollision,
      undefined,
      this
    );
  }

  handlePlayerEnemyCollision(player: any, enemy: any) {
    if (!player.getData('canOverlap')) {
      return;
    }
    if (player.body.bottom <= enemy.body.top + 10) {
      this.jumpEagle.play();
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
      this.enemyCollision.play();
      this.startBlinking(player)
      this.playerIsHurt = true;
      player.anims.play("hurt", true);
      this.time.delayedCall(1000, () => {
        this.playerIsHurt = false;
      });
      player.setVelocityX(player.flipX ? 30 : -30);
      this.HP--;
      this.handleHPChange();
      player.setData('canOverlap', false);
      this.time.delayedCall(3000, () => {
        player.setData('canOverlap', true);
        this.stopBlinking(player);
      });
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
    if (item.texture.key == "cherry") {
      this.collectingCherry.play();
      this.score++;
      this.scoreText.setText(`Score:${this.score}`);
    } else {
      this.collectingDiamond.play();
      this.HP = 4;
      this.handleHPChange();
    }
    item.disableBody(true, true);
  }

  handleHPChange() {
    this.imageGroup.clear(true, true);
    this.imageGroup = this.add
      .group({
        key: "heart",
        repeat: this.HP,
        setXY: { x: 120, y: 160, stepX: 20 },
      })
      .setDepth(2)
      .setOrigin(0);

    (this.imageGroup.getChildren() as Phaser.GameObjects.Image[]).forEach(
      (image) => {
        image.setScrollFactor(0);
      }
    );
  }
  restartPosition() {
    if (this.player.body.y <= 90) {
      this.player.body.y = 40;
      this.player.body.x = 40;
    } else if (this.player.body.y < 295) {
      this.player.body.y = 90;
      this.player.body.x = 1997;
    }
    else if (this.player.body.y < 442) {
      this.player.body.y = 310;
      this.player.body.x = 10;
    } else {
      this.player.body.y = 500;
      this.player.body.x = 2036;
    }
  }

  startBlinking(character: Phaser.GameObjects.Sprite) {
    if (!character.getData('isBlinking')) {
      character.setData('isBlinking', true);
      const originalTint = character.tint;

      character.setData('blinkTween', this.tweens.add({
        targets: character,
        tint: 0xFF0000,
        ease: 'Linear',
        duration: 100,
        yoyo: true,
        repeat: -1,
        onStart: () => {
          character.setTint(0xFF0000);
        },
        onYoyo: () => {
          character.clearTint();
        },
        onComplete: () => {
          character.clearTint();
          character.setTint(originalTint);
        }
      }));
    }
  }
  stopBlinking(character: Phaser.GameObjects.Sprite) {
    character.setData('isBlinking', false);
    if (character.getData('blinkTween')) {
      character.getData('blinkTween').stop();
      character.clearTint();
    }
  }
}
