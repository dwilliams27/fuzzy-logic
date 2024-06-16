import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Phaser from 'phaser';
import { ChatGPTClient } from './services';
import { GPT_IMAGE_MODELS } from './services/chatGPT';
import { Entity } from './game/entities/entity';
import { OpenAIProvider, openai } from '@ai-sdk/openai';
import { createOpenAI } from '@ai-sdk/openai';
import * as dotenv from 'dotenv';

dotenv.config();
let initialized = false;

class MainGame extends Phaser.Scene {
  openai: OpenAIProvider;
  openaiImage: ChatGPTClient;

  constructor() {
    super('MainGame');
    this.openai = createOpenAI({
      compatibility: 'strict',
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openaiImage = new ChatGPTClient(process.env.OPENAI_API_KEY);
  }

  preload() {
    (async () => {
      const entity = new Entity({});
      console.log('preload');
      const test = await this.openaiImage.genImage(GPT_IMAGE_MODELS.best, `An entity that has the following properties: ${entity.getDescription()}`);
      console.log(test);
      // const test2 = await this.chatGPTService.sendMessage(ENTITY_PROPERTIES_PROMPT);
      // console.log(test2);
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
  console.log('Starting main app...');
  useEffect(() => {
    const game = new Phaser.Game(gameConfig);
    return () => {
      game.destroy(true);
    };
    return null;
  }, []);

  return <div>
    <div id="game-container"></div> {/* Phaser game will render here */}
    <div>Welcome to the Game</div>
  </div>;
};

// Create a root container
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
