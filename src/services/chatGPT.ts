import OpenAI from 'openai';

export const GPT_VISION_RESOLUTION = 1024;
export const GPT_TEXT_MODELS: { [key: string]: GPTModel } = {
  best: 'gpt-4-turbo-preview', // Vision
  good: 'gpt-4-turbo',
}

export const GPT_IMAGE_GEN_RESOLUTION = '1024x1024';
export const GPT_IMAGE_MODELS: { [key: string]: GPTModel } = {
  best: 'dall-e-3', // EXPENSIVE
  good: 'dall-e-2', // still expensive lol
}

export type GPTModel = 'gpt-4-turbo' | 'dall-e-2' | 'dall-e-3' | 'gpt-4-turbo-preview';


export class ChatGPTClient {
  private client: OpenAI;
  private oracle: OpenAI.Beta.Assistants.Assistant;
  private context: string[];
  private image_context: string[];

  constructor(apiKey: string) {
    console.log('Creating ChatGPTClient');
    this.client = new OpenAI({
      apiKey,
      // TODO: Make entire backend server lol
      dangerouslyAllowBrowser: true
    });
    this.context = this._getBaseContext();
    this.image_context = this._getBaseImageContext();
  }

  _getBaseContext() {
    return [
      "This image shows the state of the current game.",
    ];
  }

  _getBaseImageContext() {
    return [
      "Generate an image in the style of gameboy advanced (think Pokemon emerald) that matches this description: ",
    ];
  }

  async consultOracle(message: string, base64_image: string): Promise<string> {
    console.log('Consulting the oracle');
    const preamble = this.context.join('\n');
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: `${preamble}\n${message}` },
              {
                type: "image_url",
                image_url: {
                  "url": `data:image/jpeg;base64,${base64_image}`
                },
              },
            ],
          },
        ],
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error talking with the boss:', error);
      return 'Error processing your request.';
    }
  }

  async sendMessage(model: GPTModel, message: string): Promise<string> {
    console.log('Sending message');
    const preamble = this.context.join('\n');
    try {
      const response = await this.client.chat.completions.create({
        messages: [{ role: 'user', content: `${preamble}\n${message}` }],
        model: model,
        max_tokens: 256
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error sending message:', error);
      return 'Error processing your request.';
    }
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
