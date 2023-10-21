import Phaser from "phaser";

export default class GameScene extends Phaser.Scene{
    private trailTimer: number
    constructor(){
        super({key: "GameScene"});
        this.trailTimer = 0;
    }

    preload(){
        this.load.image("background",process.env.PUBLIC_URL+"/assets/environment/Background/back.png")
        this.load.image("crate", process.env.PUBLIC_URL+"/assets/environment/Props/big-crate.png")
        this.load.image("platform",process.env.PUBLIC_URL+"/assets/environment/Props/platform-long.png")
    }

    create(){
        const width = this.sys.game.config.width as number;
        const height = this.sys.game.config.height as number;
        const background = this.add.image(0,0,"background").setOrigin(0)
        const scaleX = width/background.width;
        const scaleY = height/background.height;
        const scale = Math.max(scaleX,scaleY);
        background.setScale(scale);

        this.add.image(0,height/2,"platform").setOrigin(0,0.5)

    }

    update(time: number, delta: number){

    }
}
