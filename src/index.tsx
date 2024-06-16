import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Phaser from 'phaser';
import { ChatGPTClient, ServiceLocator } from './services';
import { GPT_IMAGE_MODELS } from './services/chatGPT';
import { Entity } from './game/entities/entity';
import { OpenAIProvider, openai } from '@ai-sdk/openai';
import { createOpenAI } from '@ai-sdk/openai';
import * as dotenv from 'dotenv';
import { CardScene } from './game/scenes';

dotenv.config();

const CoreServiceLocator = new ServiceLocator();

export const OPEN_AI_SERVICE_NAME = 'OpenAIService';

class MainGame extends Phaser.Scene {
  openai: { [key: string]: OpenAIProvider };
  openaiImage: ChatGPTClient;
  serviceLocator: ServiceLocator;

  constructor() {
    super('MainGame');
    this.serviceLocator = CoreServiceLocator;
    this.openai = { [OPEN_AI_SERVICE_NAME]: createOpenAI({
      compatibility: 'strict',
      apiKey: process.env.OPENAI_API_KEY,
    })};
    this.serviceLocator.addService(this.openai);
    this.openaiImage = new ChatGPTClient(this.serviceLocator, process.env.OPENAI_API_KEY);

  }

  preload() {
    (async () => {
      const entity = new Entity({});
      console.log('preload');
      const test = await this.openaiImage.genImage(GPT_IMAGE_MODELS.best, `An entity that has the following properties: ${entity.getDescription()}`);
      console.log(test);
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
  }, []);

  return <div>
    <div id="game-container"></div> {/* Phaser game will render here */}
    <div>Welcome to the Game</div>
  </div>;
};

// Create a root container
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
