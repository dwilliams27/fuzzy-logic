import OpenAI from 'openai';
import { IMAGE_BASE_PROMPT } from '../prompts/images';
import { ServiceLocator } from './serviceLocator';
import { InjectableService } from './injectableService';

export const GPT_VISION_RESOLUTION = 1024;
export const GPT_TEXT_MODELS: { [key: string]: GPTModel } = {
  best: 'gpt-4o',
  good: 'gpt-4-turbo',
}

export const GPT_IMAGE_GEN_RESOLUTION = '1024x1024';
export const GPT_IMAGE_MODELS: { [key: string]: GPTModel } = {
  best: 'dall-e-3', // EXPENSIVE
  good: 'dall-e-2', // still expensive lol
}

export type GPTModel = 'gpt-4o' | 'gpt-4-turbo' | 'dall-e-2' | 'dall-e-3' | 'gpt-4-turbo-preview';

export const GPT_SERVICE_NAME = 'ChatGPTImageService';
export class ChatGPTClient extends InjectableService {
  private client: OpenAI;
  private image_context: string[];

  constructor(serviceLocator: ServiceLocator, apiKey: string) {
    super(serviceLocator, GPT_SERVICE_NAME);

    console.log('Creating ChatGPTClient');
    this.client = new OpenAI({
      apiKey,
      // TODO: Make entire backend server lol
      dangerouslyAllowBrowser: true
    });
    this.image_context = this._getBaseImageContext();
  }

  _getBaseImageContext(): string[] {
    return [
      IMAGE_BASE_PROMPT,
    ];
  }

  async genImage(model: GPTModel, message: string): Promise<string> {
    console.log('Generating image with prompt: ', message);
    const preamble = this.image_context.join('\n');
    let image_url = '';
    try {
      const response = await this.client.images.generate({
        model,
        prompt: `${preamble}\n${message}`,
        n: 1,
        size: GPT_IMAGE_GEN_RESOLUTION,
      });
      image_url = response.data[0].url;
    } catch (error) {
      console.error('Error generating image:', error);
      return 'Error processing your request.';
    }
    return image_url;
  }
}
