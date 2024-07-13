import { OpenAIProvider, createOpenAI, openai } from "@ai-sdk/openai";
import { InjectableService } from "../injectableService";
import { OPEN_AI_SERVICE_NAME } from "../../utils/constants";
import { ServiceLocator } from "../serviceLocator";
import { CoreMessage, streamText } from "ai";
import { MTG_SYSTEM_PROMPT_RAW, MTG_SYSTEM_PROMPT_VARIABLES } from "../../prompts/messageTemplateGenerator";

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
  private generatedMessageTemplates: string[][] = [];
  private messages: CoreMessage[] = [];

  constructor(serviceLocator: ServiceLocator, serviceName: string, public rawPrompt: string, public readonly variables: T[]) {
    super(serviceLocator, serviceName);
    this.openaiService = serviceLocator.getService(OPEN_AI_SERVICE_NAME);
  }

  loadAgentInstructions(values: Record<T, string>) {
    this.instructions = this.processTemplate(this, values);
    this.mtgInstructions = this.processTemplate({ rawPrompt: MTG_SYSTEM_PROMPT_RAW, variables: MTG_SYSTEM_PROMPT_VARIABLES as any }, this.mtgConfig);
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
    console.log(resultText);
    return resultText;
  }

  async advanceScenario(nextMessage: string) {
    this.messages.push({ role: 'user', content: nextMessage });
    console.log(this.instructions);
    console.log(this.messages);
    const result = await streamText({
      model: this.openaiService,
      system: this.instructions,
      messages: this.messages,
    });
  
    const resultText = await result.toTextStreamResponse().text();
    console.log(resultText);
    this.messages.push({ role: 'assistant', content: resultText });

    this.generateNextPromptTemplates();
  }
}
