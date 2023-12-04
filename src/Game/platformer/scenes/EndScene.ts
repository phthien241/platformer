import Phaser from 'phaser';

export default class EndScene extends Phaser.Scene {
    private score!: number;

    constructor() {
        super({ key: 'EndScene' });
    }

    init(data: { score: number }): void {
        this.score = data.score;
    }

    create(): void {
        this.add.text(100, 100, 'Game Over', { fontSize: '32px', color: '#fff' });
        this.add.text(100, 150, `Score: ${this.score}`, { fontSize: '28px', color: '#fff' });
    }
}
