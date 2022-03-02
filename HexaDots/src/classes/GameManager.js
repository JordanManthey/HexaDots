import { constants } from '../constants';

export class GameManager {

  /**
 * Creates a GameManager that handles the round logic.
 * @param {Phaser.Scene} scene - The game scene that this class manages.
 * @param {number} timeLimit - The amount of time the player gets each round (seconds).
 */
  constructor(scene, timeLimit) {
    this.scene = scene;
    this.timer = this.scene.time.delayedCall(timeLimit * 1000, this.endGame, {}, this);
    this.score = 0;
    this.gameOver = false;
  }

  incrementScore(amount) {
    this.score += amount;
    this.scoreText.text = this.score;
  }

  resetScore() {
    this.score = 0;
    this.scoreText.text = this.score;
  }

  startGame() {
    this.screenCenter = {
      x: this.scene.cameras.main.centerX,
      y: this.scene.cameras.main.centerY * (4/3)
    };

    let fontConfig = { fontFamily: 'Monospace', fontSize: 48, color: '#2f3030' };
    this.timerText = this.scene.add.text(150, this.screenCenter.y + 75, this.getFormattedTime(), fontConfig).setOrigin(0.5, 0.5);
    this.scoreText = this.scene.add.text((this.screenCenter.x * 2) - 125, this.screenCenter.y + 75, this.score, fontConfig).setOrigin(0.5, 0.5);
  }

  endGame() {
    this.gameOver = true;
    this.scene.add.image(this.screenCenter.x, this.screenCenter.y / 2, constants.IMAGES.GAMEOVER).setOrigin(0.5, 0.5);

    let restartButton = this.scene.add.image(this.screenCenter.x, this.screenCenter.y + 50, constants.IMAGES.RESTART).setOrigin(0.5, 0.5).setScale(0.5);
    restartButton.setInteractive();
    restartButton.on('pointerup', ()=> { this.scene.scene.start(constants.SCENES.PLAY); });

    let quitButton = this.scene.add.image(this.screenCenter.x, this.screenCenter.y + 100, constants.IMAGES.QUIT).setOrigin(0.5, 0.5).setScale(0.5);
    quitButton.setInteractive();
    quitButton.on('pointerup', ()=> { this.scene.scene.start(constants.SCENES.MENU); });
  }

  getFormattedTime() {
    let timeRemaining = Phaser.Math.FloorTo(this.timer.getRemainingSeconds())
    let min = Phaser.Math.FloorTo(timeRemaining / 60);
    let sec = timeRemaining % 60;

    if (sec < 10) {
      sec = '0' + sec;
    }

    return min + ':' + sec;
  }

  update() {
    this.timerText.text = this.getFormattedTime();
  }
}
