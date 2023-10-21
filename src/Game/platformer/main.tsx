import React from "react";
import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import { useEffect } from "react";
function PhaserGame() {
    useEffect(()=>{
        const config = {
            type: Phaser.AUTO,
            width: 600,
            height: 500,
            parent:"phaser-game",
            physics:{
                default: "arcade",
                arcade:{
                    // gravity:{y:200},
                    // debug:true
                }
            },
            scene:[GameScene]
        };
        const game = new Phaser.Game(config);
        return ()=>{
            game.destroy(true)
        }
    },[]);
    return(
        <div id="phaser-game">

        </div>
    )
}
export default PhaserGame