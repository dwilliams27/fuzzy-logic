import './global.css';

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Phaser from 'phaser';
import { ChatGPTClient, ServiceLocator } from './services';
import { GPT_IMAGE_MODELS, GPT_SERVICE_NAME } from './services/chatGPT';
import { Entity } from './game/entities/entity';
import { OpenAIProvider, openai } from '@ai-sdk/openai';
import { createOpenAI } from '@ai-sdk/openai';
import * as dotenv from 'dotenv';
import { GAME_HEIGHT, GAME_WIDTH, OPEN_AI_SERVICE_NAME } from './utils/constants';
import { MR_PRESIDENT_RAW_PROMPT, MR_PRESIDENT_SERVICE_NAME, MrPresidentScenario } from './services/scenarios/mrPresident';
import { UIScene, UI_SCENE_KEY } from './game/scenes/uiScene';
import { META_SCENARIO_PROMPT_SERVICE_NAME, MetaScenario } from './services/scenarios/metaScenario';
import { LEGAL_RAW_PROMPT } from './services/scenarios/legal';

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

    // const mrPresidentScenario = this.serviceLocator.addService<MrPresidentScenario>({
    //   serviceKey: MR_PRESIDENT_SERVICE_NAME,
    //   serviceValue: new MetaScenario(this.serviceLocator),
    // });
    // mrPresidentScenario.loadAgentInstructions({
    //   TOPIC: 'doing some sketchy stuff',
    //   MIN_SHOT: '2',
    //   MAX_SHOT: '3',
    //   GOAL_POSITIVE: `I WILL SIGN`,
    //   GOAL_NEGATIVE: 'I WILL NOT SIGN'
    // });

    const metaScenario = new MetaScenario(this.serviceLocator);
    metaScenario.loadAgentInstructions({
      SYSTEM_INSTRUCTION_1: MR_PRESIDENT_RAW_PROMPT,
      SYSTEM_INSTRUCTION_2: LEGAL_RAW_PROMPT,
    });
  }

  preload() {
    
  }

  create() {
    this.scene.launch(UI_SCENE_KEY, { serviceLocator: this.serviceLocator });
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'root',
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [MainGame, UIScene]
};

const App = () => {
  console.log('Starting main app...');
  useEffect(() => {
    const game = new Phaser.Game(gameConfig);
    window.addEventListener('resize', () => {
      game.scale.resize(window.innerWidth, window.innerHeight);
    });
    return () => {
      game.destroy(true);
    };
  }, []);

  return <div>
    <div id="game-container"></div> {/* Phaser game will render here */}
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

