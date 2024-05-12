import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Phaser from 'phaser';
import { ChatGPTClient } from './services';
import { GPT_IMAGE_MODELS } from './services/chatGPT';
import { Entity } from './entities/entity';

class MainGame extends Phaser.Scene {
  chatGPTService: ChatGPTClient;

  constructor() {
    super('MainGame');
    console.log('Main game bootin up');
    this.chatGPTService = new ChatGPTClient(process.env.OPENAI_API_KEY);
    console.log('created gpt');
  }

  preload() {
    (async () => {
      const entity = new Entity({});
      const lol = await this.chatGPTService.genImage(GPT_IMAGE_MODELS.best, `An entity that has the following properties: ${entity.getDescription()}`);
      console.log(lol);
    })();
  }

  create() {
    // Create game entities
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'root',
  width: 800,
  height: 600,
  scene: [MainGame]
};

const App = () => {
  useEffect(() => {
    const game = new Phaser.Game(gameConfig);
    return () => {
      game.destroy(true);
    };
  }, []);

  return <div>
    <div id="game-container"></div> {/* Phaser game will render here */}
    <div>Welcome to the Game</div>
  </div>;
};

// Create a root container
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
