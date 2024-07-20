import { ServiceLocator } from "../../services";
import { ScenarioEvent, ScenarioEventNames } from "../../services/scenarios/events";
import { MR_PRESIDENT_SERVICE_NAME, MrPresident } from "../../services/scenarios/mrPresident";
import { Scenario } from "../../services/scenarios/scenario";
import ScrollableText from "../ui/messageHistory";
import { BaseScene } from "./baseScene";

export const UI_SCENE_KEY = 'UIScene';
export interface UISceneData {
  serviceLocator: ServiceLocator;
}
export class UIScene extends BaseScene {
  serviceLocator: ServiceLocator | null = null;
  activeScenario: Scenario<MrPresident> | null = null;
  messageHistory: ScrollableText | null = null;

  constructor() {
    super({ key: UI_SCENE_KEY });
  }

  preload() {
    // Load stuff
  }

  init(data: UISceneData) {
    console.log(data.serviceLocator);
    this.serviceLocator = data.serviceLocator;
    this.activeScenario = this.serviceLocator?.getScenarios()[0] || null;
    this.activeScenario?.subscribeToEvents(this.handleScenarioEvent.bind(this));
  }

  create() {
    this.messageHistory = new ScrollableText(this, 50, 70, 600, 500, []);
    console.log('UI Scene');
    this.add.text(10, 10, 'UI', { font: '16px Arial', color: '#ffffff' });

    this.add.text(5, 30, 'Start Scenario', { font: '16px Arial', color: '#00ff00' })
      .setInteractive()
      .on('pointerdown', () => {
        console.log('Starting');
        console.log(this.activeScenario);
        this.activeScenario?.advanceScenario('Sir, I think it is time to sign the bill.');
      });

    this.add.text(5, 50, 'Automatically Advance', { font: '16px Arial', color: '#ff0000' })
      .setInteractive()
      .on('pointerdown', () => {
        this.activeScenario?.automaticallySelectNextResponse();
      });
  }

  handleScenarioEvent(event: ScenarioEvent) {
    switch (event.name) {
      case(ScenarioEventNames.MESSAGE_POSTED): {
        const lastMessage = this.activeScenario?.getLastMessage();
        console.log(lastMessage);
        if (lastMessage) this.messageHistory?.postMessage(lastMessage);
        break;
      }
      default: {}
    }
  }
}
