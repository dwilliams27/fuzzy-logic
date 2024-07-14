import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Phaser from 'phaser';
import { ChatGPTClient, ServiceLocator } from './services';
import { GPT_IMAGE_MODELS, GPT_SERVICE_NAME } from './services/chatGPT';
import { Entity } from './game/entities/entity';
import { OpenAIProvider, openai } from '@ai-sdk/openai';
import { createOpenAI } from '@ai-sdk/openai';
import * as dotenv from 'dotenv';
import { OPEN_AI_SERVICE_NAME } from './utils/constants';
import { MrPresidentScenario } from './services/scenarios/mrPresident';

dotenv.config();

const CoreServiceLocator = new ServiceLocator();

class MainGame extends Phaser.Scene {
  openai: any;
  openaiImage: ChatGPTClient;
  serviceLocator: ServiceLocator;

  constructor() {
    super('MainGame');
    this.serviceLocator = CoreServiceLocator;
    this.openai = this.serviceLocator.addService<any>({
      serviceKey: OPEN_AI_SERVICE_NAME,
      serviceValue: createOpenAI({
        compatibility: 'strict',
        apiKey: process.env.OPENAI_API_KEY,
      })('gpt-4o'),
    });
    this.openaiImage = this.serviceLocator.addService<ChatGPTClient>({
      serviceKey: GPT_SERVICE_NAME,
      serviceValue: new ChatGPTClient(this.serviceLocator, process.env.OPENAI_API_KEY || ''),
    });

    const mrPresidentScenario = new MrPresidentScenario(this.serviceLocator);
    mrPresidentScenario.loadAgentInstructions({
      TOPIC: 'doing some sketchy stuff',
      MIN_SHOT: '2',
      MAX_SHOT: '3',
      GOAL_POSITIVE: `I WILL SIGN`,
      GOAL_NEGATIVE: 'I WILL NOT SIGN'
    });
    mrPresidentScenario.advanceScenario('Sir, I think it is time to sign the bill.');
  }

  preload() {
    (async () => {
      const entity = new Entity({});
      console.log('preload');
      // const test = await this.openaiImage.genImage(GPT_IMAGE_MODELS.best, `An entity that has the following properties: ${entity.getDescription()}`);
      // console.log(test);
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
try {
  // @ts-ignore
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
} catch (Exception) {
  console.error('Error rendering root:', Exception);
}

