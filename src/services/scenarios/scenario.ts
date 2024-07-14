import { OpenAIProvider, createOpenAI, openai } from "@ai-sdk/openai";
import { InjectableService } from "../injectableService";
import { OPEN_AI_SERVICE_NAME } from "../../utils/constants";
import { ServiceLocator } from "../serviceLocator";
import { CoreMessage, streamText } from "ai";
import { MTG_SYSTEM_PROMPT_RAW, MTG_SYSTEM_PROMPT_VARIABLES } from "../../prompts/messageTemplateGenerator";
import { WB_SYSTEM_PROMPT_RAW, WB_SYSTEM_PROMPT_VARIABLES, Word, WordBank, WordBankTypedResponse, WordRank, WordType } from "../../prompts/wordBank";

export interface PromptTemplate<T> {
  rawPrompt: string;
  variables: T[];
}

export class Scenario<T extends string> extends InjectableService implements PromptTemplate<T> {
  private openaiService: any;
  private instructions: string = '';
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
    console.log('Generated message templates:', resultText.split('#').map((s: string) => s.trim()).filter((s: string) => s.length > 0));
    this.generatedMessageTemplates.push(resultText.split('#').map((s: string) => s.trim()).filter((s: string) => s.length > 0));
  }

  async regenerateWordBanks() {
    const result = await streamText({
      model: this.openaiService,
      system: this.wbInstructions,
      messages: [...this.messages, { role: 'user', content: this.generatedMessageTemplates[this.generatedMessageTemplates.length - 1].join('\n') }]
    });

    const resultText: WordBankTypedResponse = JSON.parse(await result.toTextStreamResponse().text());
    this.parseWordBankResponse(resultText);
  }

  async advanceScenario(nextMessage: string) {
    this.messages.push({ role: 'user', content: nextMessage });
    const result = await streamText({
      model: this.openaiService,
      system: this.instructions,
      messages: this.messages,
    });
  
    const resultText = await result.toTextStreamResponse().text();
    this.messages.push({ role: 'assistant', content: resultText });

    await this.generateNextPromptTemplates();
    await this.regenerateWordBanks();

    this.logGameState();
    if (this.messages.length > 16) {
      return;
    }
    await this.automaticallySelectNextResponse();
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
    console.log('Using template:', chosenTemplate);
    console.log('Nouns:', this.nounBank);
    console.log('Verbs:', this.verbBank);
    console.log('Adjectives:', this.adjectiveBank);
    while (chosenTemplate.includes('[NOUN]')) {
      const bank = this.nounBank.common.concat(this.nounBank.uncommon).concat(this.nounBank.rare);
      const randomIndex = Math.floor(Math.random() * bank.length);
      const randomWord = bank[randomIndex];
      chosenTemplate = chosenTemplate.replace('[NOUN]', randomWord.word);
      nouns.push(randomWord);
    }
    while (chosenTemplate.includes('[VERB]')) {
      const bank = this.verbBank.common.concat(this.verbBank.uncommon).concat(this.verbBank.rare);
      const randomIndex = Math.floor(Math.random() * bank.length);
      const randomWord = bank[randomIndex];
      chosenTemplate = chosenTemplate.replace('[VERB]', randomWord.word);
      verbs.push(randomWord);
    }
    while (chosenTemplate.includes('[ADJECTIVE]')) {
      const bank = this.adjectiveBank.common.concat(this.adjectiveBank.uncommon).concat(this.adjectiveBank.rare);
      const randomIndex = Math.floor(Math.random() * bank.length);
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
}
