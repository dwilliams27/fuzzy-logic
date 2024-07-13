import { InjectableService } from "./injectableService";
import { ServiceLocator } from "./serviceLocator";
import axios from 'axios';

export const OLLAMA_SERVICE_NAME = 'OllamaService';

export class OllamaService extends InjectableService {
  constructor(serviceLocator: ServiceLocator) {
    super(serviceLocator, OLLAMA_SERVICE_NAME);
  }

  async queryLocal(query: string) {
    const response = await axios.post('http://localhost:5000/query', { query });
    return response.data;
  }
}