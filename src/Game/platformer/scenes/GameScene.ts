import { platform } from "os";
import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
    private playerIsHurt = false;
    private player?: any;
    platforms!: Phaser.Physics.Arcade.StaticGroup;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private eagle: any
    private cherry: any
    private width!: number;
    private height!: number;
    constructor() {
        super({ key: "GameScene" });

    }

    preload() {
        this.load.image("background", process.env.PUBLIC_URL + "/assets/environment/Background/back.png")
        this.load.image("crate", process.env.PUBLIC_URL + "/assets/environment/Props/big-crate.png")
        this.load.image("platform", process.env.PUBLIC_URL + "/assets/environment/Props/platform-long.png")
        this.load.image("player", process.env.PUBLIC_URL + "/assets/sprites/player/idle/player-idle-1.png")
        this.load.image("idle-2", process.env.PUBLIC_URL + "/assets/sprites/player/idle/player-idle-2.png")
        this.load.image("idle-3", process.env.PUBLIC_URL + "/assets/sprites/player/idle/player-idle-3.png")
        this.load.image("idle-4", process.env.PUBLIC_URL + "/assets/sprites/player/idle/player-idle-4.png")
        this.load.image("run-1", process.env.PUBLIC_URL + "/assets/sprites/player/run/player-run-1.png")
        this.load.image("run-2", process.env.PUBLIC_URL + "/assets/sprites/player/run/player-run-2.png")
        this.load.image("run-3", process.env.PUBLIC_URL + "/assets/sprites/player/run/player-run-3.png")
        this.load.image("run-4", process.env.PUBLIC_URL + "/assets/sprites/player/run/player-run-4.png")
        this.load.image("run-5", process.env.PUBLIC_URL + "/assets/sprites/player/run/player-run-5.png")
        this.load.image("run-6", process.env.PUBLIC_URL + "/assets/sprites/player/run/player-run-6.png")
        this.load.image("jump-1", process.env.PUBLIC_URL + "/assets/sprites/player/jump/player-jump-1.png")
        this.load.image("jump-2", process.env.PUBLIC_URL + "/assets/sprites/player/jump/player-jump-2.png")
        this.load.spritesheet("eagle", process.env.PUBLIC_URL + "/assets/spritesheets/eagle-attack.png", {
            frameWidth: 39,
            frameHeight: 38
        })
        this.load.spritesheet("enemy-deadth", process.env.PUBLIC_URL + "/assets/spritesheets/enemy-deadth.png", {
            frameWidth: 39,
            frameHeight: 38
        })
        this.load.spritesheet("cherry", process.env.PUBLIC_URL + "/assets/spritesheets/cherry.png", {
            frameWidth: 20,
            frameHeight: 20
        })
        this.load.spritesheet("item-feedback", process.env.PUBLIC_URL + "/assets/spritesheets/item-feedback.png", {
            frameWidth: 35,
            frameHeight: 32
        })
        this.load.image("hurt-1", process.env.PUBLIC_URL + "/assets/sprites/player/hurt/player-hurt-1.png")
        this.load.image("hurt-2", process.env.PUBLIC_URL + "/assets/sprites/player/hurt/player-hurt-2.png")
    }

    create() {
        this.height = this.sys.game.config.height as number;
        this.width = this.sys.game.config.width as number;

        this.createBackground();
        this.createPlatform();
        this.createAnims();

        this.player = this.physics.add.sprite(0, this.height / 2 - 20, 'player').setOrigin(0, 1).setGravityY(300)
        this.eagle = this.physics.add.sprite(this.width / 2, this.height / 2 - 20, "eagle").play("eagle").setOrigin(0, 1).setImmovable(true);
        this.cherry = this.physics.add.sprite(this.width / 2, this.height / 2 - 70, "cherry").play("cherry").setOrigin(0, 1);

        this.createCollider();
        this.player.anims.play('idle', true);
        this.cursors = this.input.keyboard?.createCursorKeys();
    }


    update() {
        if (this.playerIsHurt) return;
        const isOnGround = this.player?.body?.touching.down;
        if (this.cursors?.right?.isDown) {
            if (isOnGround) {
                this.player?.setFlipX(false);
                this.player?.anims.play("run", true)
            }
            this.player?.setVelocityX(150);
        } else if (this.cursors?.left?.isDown) {
            if (isOnGround) {
                this.player?.setFlipX(true);
                this.player?.anims.play("run", true)
            }
            this.player?.setVelocityX(-150);
        }

        else {
            this.player?.setVelocityX(0)
            this.player?.anims.play("idle", true)
        }

        if (this.cursors?.space?.isDown && isOnGround) {
            this.player?.setVelocityY(-200);
        }
        if (!isOnGround) {
            this.player?.anims.play('jump')
        }
        if (!isOnGround && this.player?.body?.velocity.y! > 0) {
            this.player?.anims.play("fail")
        }
    }

    createBackground() {
        const background = this.add.image(0, 0, "background").setOrigin(0)
        const scaleX = this.width / background.width;
        const scaleY = this.height / background.height;
        const scale = Math.max(scaleX, scaleY);
        background.setScale(scale);
    }

    createPlatform() {
        this.platforms = this.physics.add.staticGroup();
        const platformWidth = this.textures.get("platform").getSourceImage().width;
        const numberOfPlatForms = Math.ceil(this.width / platformWidth);
        for (let i = 0; i < numberOfPlatForms; i++) {
            const x = i * platformWidth;
            const y = this.height / 2;
            const platform = this.platforms.create(x, y, "platform")
            platform.setOrigin(0, 0.5)
            platform.refreshBody();
        }
    }

    createAnims() {
        this.anims.create({
            key: 'idle',
            frames: [
                { key: 'player' },
                { key: 'idle-2' },
                { key: 'idle-3' },
                { key: 'idle-4' }
            ],
            frameRate: 10,
            repeat: -1
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
            repeat: -1
        })

        this.anims.create({
            key: "jump",
            frames: [
                { key: "jump-1" },
            ],
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "fail",
            frames: [
                { key: "jump-2" },
            ],
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "hurt",
            frames: [
                { key: "hurt-1" },
                { key: "hurt-2" },
            ],
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "eagle",
            frames: this.anims.generateFrameNumbers("eagle", { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        })

        this.anims.create({
            key: "enemy-deadth",
            frameRate: 12,
            frames: this.anims.generateFrameNumbers("enemy-deadth", { start: 0, end: 5 }),
            repeat: 0
        })

        this.anims.create({
            key: "cherry",
            frameRate: 12,
            frames: this.anims.generateFrameNumbers("cherry", { start: 0, end: 3 }),
            repeat: -1
        })

        this.anims.create({
            key: "item-feedback",
            frameRate: 12,
            frames: this.anims.generateFrameNumbers("item-feedback", { start: 0, end: 3 }),
            repeat: 0
        })
    }

    createCollider() {
        this.physics.add.collider(this.player, this.platforms)
        this.physics.add.collider(this.player, this.eagle, this.handlePlayerEnemyCollision, undefined, this);
        this.physics.add.collider(this.player, this.cherry, this.handlePlayerItemsCollision, undefined, this)
    }

    handlePlayerEnemyCollision(player: any, enemy: any) {
        enemy.setVelocityX(0);
        if (player.body.bottom <= enemy.body.top + 10) {
            player.setVelocityY(-100)
            const deathAnimation = this.add.sprite(this.eagle.x + this.eagle.body.width / 2, this.eagle.y - this.eagle.body.height / 2, 'enemy-deadth');
            deathAnimation.play("enemy-deadth");
            deathAnimation.on('animationcomplete', () => {
                deathAnimation.destroy();
            }, this);
            this.eagle.disableBody(true, true)
        } else {
            this.playerIsHurt = true;
            player.anims.play("hurt", true);
            this.time.delayedCall(1000, () => this.playerIsHurt = false);
            console.log(player.flipX);
            player.setVelocityX(player.flipX ? 30 : -30)
        }
    }

    handlePlayerItemsCollision(player: any, item: any) {
        const feedbackAnims = this.add.sprite(item.x + item.body.width / 2, item.y - item.body.height / 2, 'item-feedback')
        feedbackAnims.play("item-feedback");
        feedbackAnims.on("animationcomplete",()=>{
            feedbackAnims.destroy();
        },this);
        this.cherry.disableBody(true, true)
    }
}
