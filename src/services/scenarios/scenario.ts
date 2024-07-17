import { InjectableService } from "../injectableService";
import { OPEN_AI_SERVICE_NAME } from "../../utils/constants";
import { ServiceLocator } from "../serviceLocator";
import { CoreMessage, streamText } from "ai";
import { MTG_SYSTEM_PROMPT_RAW, MTG_SYSTEM_PROMPT_VARIABLES } from "../../prompts/messageTemplateGenerator";
import { WB_SYSTEM_PROMPT_RAW, WB_SYSTEM_PROMPT_VARIABLES, Word, WordBank, WordBankTypedResponse, WordRank, WordType } from "../../prompts/wordBank";
import { MessagePostedEvent, NextPromptTemplatesGeneratedEvent, ScenarioAdvanceCompletedEvent, ScenarioEvent, WordBanksRegeneratedEvent } from "./events";

export interface PromptTemplate<T> {
  rawPrompt: string;
  variables: T[];
}

export enum ScenarioStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface ScenarioSubscription {
  newEvent: (event: ScenarioEvent) => void;
  unsubscribe: () => void;
}

export class Scenario<T extends string> extends InjectableService implements PromptTemplate<T> {
  private openaiService: any;
  private status = ScenarioStatus.IN_PROGRESS;
  private instructions: string = '';
  private scenarioConfig: Record<string, string> = {};
  private mtgInstructions: string = '';
  private mtgConfig: Record<typeof MTG_SYSTEM_PROMPT_VARIABLES[number], string> = {
    TEMPLATE_NUMBER: '3',
    TEMPLATE_REPLACEMENTS_MIN: '1',
    TEMPLATE_REPLACEMENTS_MAX: '3'
  }
  private wbInstructions: string = '';
  private wbConfig: Record<typeof WB_SYSTEM_PROMPT_RAW[number], string> = {
   NUM_WORDS: '5',
  }
  private generatedMessageTemplates: string[][] = [];
  private messages: CoreMessage[] = [];
  private subscriptions: ScenarioSubscription[] = [];
  private nounBank: WordBank = {
    common: [],
    uncommon: [],
    rare: [],
    bankType: WordType.NOUN
  };
  private verbBank: WordBank = {
    common: [],
    uncommon: [],
    rare: [],
    bankType: WordType.VERB
  };
  private adjectiveBank: WordBank = {
    common: [],
    uncommon: [],
    rare: [],
    bankType: WordType.ADJECTIVE
  };

  constructor(serviceLocator: ServiceLocator, serviceName: string, public rawPrompt: string, public readonly variables: T[]) {
    super(serviceLocator, serviceName);
    this.openaiService = serviceLocator.getService(OPEN_AI_SERVICE_NAME);
  }

  loadAgentInstructions(values: Record<T, string>) {
    this.scenarioConfig = values;
    this.instructions = this.processTemplate(this, values);
    this.mtgInstructions = this.processTemplate({ rawPrompt: MTG_SYSTEM_PROMPT_RAW, variables: MTG_SYSTEM_PROMPT_VARIABLES as any }, this.mtgConfig);
    this.wbInstructions = this.processTemplate({ rawPrompt: WB_SYSTEM_PROMPT_RAW, variables: WB_SYSTEM_PROMPT_VARIABLES as any }, this.wbConfig);
  }

  processTemplate(template: PromptTemplate<T>, values: { [key: string]: string }) {
    if (template.variables.filter(v => !values[v as any]).length > 0) {
      throw new Error('Missing values for template');
    }
    return template.rawPrompt.replace(/{(\w+)}/g, (_: any, key: any) => values[key]?.toString() ?? '');
  }

  async generateNextPromptTemplates() {
    const result = await streamText({
      model: this.openaiService,
      system: this.mtgInstructions,
      messages: this.messages,
    });

    const resultText = await result.toTextStreamResponse().text();
    this.generatedMessageTemplates.push(resultText.split('#').map((s: string) => s.trim()).filter((s: string) => s.length > 0));

    this.emitEvent(new NextPromptTemplatesGeneratedEvent());
  }

  async regenerateWordBanks() {
    const result = await streamText({
      model: this.openaiService,
      system: this.wbInstructions,
      messages: [...this.messages, { role: 'user', content: this.generatedMessageTemplates[this.generatedMessageTemplates.length - 1].join('\n') }]
    });

    const resultText: WordBankTypedResponse = JSON.parse(await result.toTextStreamResponse().text());
    this.parseWordBankResponse(resultText);

    this.emitEvent(new WordBanksRegeneratedEvent());
  }

  async advanceScenario(nextMessage: string) {
    console.log('Advancing scenario...');
    this.postMessage({ role: 'user', content: nextMessage });

    const result = await streamText({
      model: this.openaiService,
      system: this.instructions,
      messages: this.messages,
    });
  
    const resultText = await result.toTextStreamResponse().text();
    this.postMessage({ role: 'assistant', content: resultText });

    if (resultText.includes(this.scenarioConfig['GOAL_POSITIVE']) || resultText.includes(this.scenarioConfig['GOAL_NEGATIVE'])) {
      this.status = ScenarioStatus.COMPLETED;
      return;
    }

    await this.generateNextPromptTemplates();
    await this.regenerateWordBanks();

    this.emitEvent(new ScenarioAdvanceCompletedEvent());
    this.logGameState();
  }

  async selectNextResponse(selectedMessageTemplate: string, selectedWords: { nouns: Word[], verbs: Word[], adjectives: Word[] }) {
    let result = selectedMessageTemplate;
    selectedWords.nouns.forEach((word: Word) => {
      result = result.replace('[NOUN]', word.word);
    });
    selectedWords.verbs.forEach((word: Word) => {
      result = result.replace('[VERB]', word.word);
    });
    selectedWords.adjectives.forEach((word: Word) => {
      result = result.replace('[ADJECTIVE]', word.word);
    });
    await this.advanceScenario(result);
  }

  async automaticallySelectNextResponse() {
    console.log('Automatically selecting next response');
    const nouns = [];
    const verbs = [];
    const adjectives = [];
    let chosenTemplate = this.generatedMessageTemplates[this.generatedMessageTemplates.length - 1][0];
    while (chosenTemplate.includes('[NOUN]')) {
      const bank = this.nounBank.common.concat(this.nounBank.uncommon).concat(this.nounBank.rare);
      const randomIndex = Math.floor(Math.random() * (bank.length - 1));
      const randomWord = bank[randomIndex];
      chosenTemplate = chosenTemplate.replace('[NOUN]', randomWord.word);
      nouns.push(randomWord);
    }
    while (chosenTemplate.includes('[VERB]')) {
      const bank = this.verbBank.common.concat(this.verbBank.uncommon).concat(this.verbBank.rare);
      const randomIndex = Math.floor(Math.random() * (bank.length - 1));
      const randomWord = bank[randomIndex];
      chosenTemplate = chosenTemplate.replace('[VERB]', randomWord.word);
      verbs.push(randomWord);
    }
    while (chosenTemplate.includes('[ADJECTIVE]')) {
      const bank = this.adjectiveBank.common.concat(this.adjectiveBank.uncommon).concat(this.adjectiveBank.rare);
      const randomIndex = Math.floor(Math.random() * (bank.length - 1));
      const randomWord = bank[randomIndex];
      chosenTemplate = chosenTemplate.replace('[ADJECTIVE]', randomWord.word);
      adjectives.push(randomWord);
    }
    await this.selectNextResponse(this.generatedMessageTemplates[this.generatedMessageTemplates.length - 1][0], { nouns, verbs, adjectives });
  }

  logGameState() {
    console.log(this.messages.map((msg) => `${msg.role}: ${msg.content}`).join('\n'));
    // console.log(this.generatedMessageTemplates);
    // console.log(this.nounBank);
    // console.log(this.verbBank);
    // console.log(this.adjectiveBank);
  }

  parseWordBankResponse(res: WordBankTypedResponse) {
    this.nounBank.common = res.nouns.most.map((word: string) => ({ word, type: WordType.NOUN, rank: WordRank.COMMON }));
    this.nounBank.uncommon = res.nouns.medium.map((word: string) => ({ word, type: WordType.NOUN, rank: WordRank.UNCOMMON }));
    this.nounBank.rare = res.nouns.least.map((word: string) => ({ word, type: WordType.NOUN, rank: WordRank.RARE }));

    this.verbBank.common = res.verbs.most.map((word: string) => ({ word, type: WordType.VERB, rank: WordRank.COMMON }));
    this.verbBank.uncommon = res.verbs.medium.map((word: string) => ({ word, type: WordType.VERB, rank: WordRank.UNCOMMON }));
    this.verbBank.rare = res.verbs.least.map((word: string) => ({ word, type: WordType.VERB, rank: WordRank.RARE }));

    this.adjectiveBank.common = res.adjectives.most.map((word: string) => ({ word, type: WordType.ADJECTIVE, rank: WordRank.COMMON }));
    this.adjectiveBank.uncommon = res.adjectives.medium.map((word: string) => ({ word, type: WordType.ADJECTIVE, rank: WordRank.UNCOMMON }));
    this.adjectiveBank.rare = res.adjectives.least.map((word: string) => ({ word, type: WordType.ADJECTIVE, rank: WordRank.RARE }));
  }

  subscribeToEvents(newEvent: (event: any) => void): ScenarioSubscription {
    const subscription = {
      newEvent,
      unsubscribe: () => {
        const index = this.subscriptions.findIndex((sub) => sub === subscription);
        if (index >= 0) {
          this.subscriptions.splice(index, 1);
        }
      }
    };
    this.subscriptions.push(subscription);
    return subscription;
  }

  emitEvent(event: any) {
    this.subscriptions.forEach((sub) => sub.newEvent(event));
  }

  postMessage(message: CoreMessage) {
    this.messages.push(message);
    console.log(`Posted message: ${message.role} - ${message.content}`);
    this.emitEvent(new MessagePostedEvent());
  }

  getLastMessage() {
    return this.messages[this.messages.length - 1];
  }

  getLastNMessages(n: number) {
    return this.messages.slice(-n);
  }
}
