import { useEffect } from "react";
import Phaser from "phaser";
import FlappyScene from "./FlappyScene";

const FlappyGame = () => {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 400,
      height: 600,
      parent: "flappy-container",
      physics: {
        default: "arcade",
        arcade: { gravity: { y: 800 }, debug: false },
      },
      scene: [FlappyScene],
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div
      id="flappy-container"
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800"
    ></div>
  );
};

export default FlappyGame;
