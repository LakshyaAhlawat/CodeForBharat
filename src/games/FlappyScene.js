import Phaser from "phaser";

export default class FlappyScene extends Phaser.Scene {
  constructor() {
    super("FlappyScene");
  }

  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("bird", "/assets/bird.png");
    this.load.image("pipe", "/assets/pipe.png");
  }

  create() {
    this.add.image(0, 0, "bg").setOrigin(0, 0).setDisplaySize(400, 600);

    this.bird = this.physics.add.sprite(100, 300, "bird").setScale(0.2);
    this.bird.setCollideWorldBounds(true);

    this.input.on("pointerdown", () => {
      this.bird.setVelocityY(-300);
    });

    this.pipes = this.physics.add.group();
    this.timer = this.time.addEvent({
      delay: 1500,
      callback: this.spawnPipe,
      callbackScope: this,
      loop: true,
    });

    this.score = 0;
    this.scoreText = this.add.text(20, 20, "Score: 0", {
      fontSize: "24px",
      fill: "#fff",
    });

    this.physics.add.overlap(this.bird, this.pipes, this.gameOver, null, this);
  }

  update() {
    if (this.bird.y > 600) {
      this.gameOver();
    }

    this.pipes.getChildren().forEach((pipe) => {
      if (!pipe.scored && pipe.x < this.bird.x) {
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);
        pipe.scored = true;
      }
    });
  }

  spawnPipe() {
    const gap = 130;
    const topY = Phaser.Math.Between(120, 400);
    const spawnX = this.game.config.width + 10;

    console.log("Spawning at:", spawnX); // 👈 Debug

    const topPipe = this.pipes.create(spawnX, topY - gap / 2, "pipe");
    topPipe.setOrigin(0, 1).setFlipY(true);

    const bottomPipe = this.pipes.create(spawnX, topY + gap / 2, "pipe");
    bottomPipe.setOrigin(0, 0);

    [topPipe, bottomPipe].forEach((pipe) => {
      pipe.body.allowGravity = false;
      pipe.setVelocityX(-200);
      pipe.setImmovable(true);
      pipe.scored = false;
    });
  }

  gameOver() {
    this.scene.restart();
  }
}
