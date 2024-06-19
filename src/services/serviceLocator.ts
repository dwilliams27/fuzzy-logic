import { ChatGPTClient } from "./chatGPT";
import { InjectableService, InjectableServiceInstance } from "./injectableService";

export const ServiceName = {
  [ChatGPTClient.name]: ChatGPTClient.name,
};

export type TServiceName = keyof typeof ServiceName;

export class ServiceLocator {
  private services: { [key: TServiceName]: InjectableService };

  constructor() {
    this.services = {};
  }

  addService<T>(service: { serviceKey: string, serviceValue: any }): T {
    service.serviceValue.serviceName = service.serviceKey;
    service.serviceValue.serviceLocator = this;

    this.services[service.serviceKey] = service.serviceValue;

    return service.serviceValue;
  }

  getService<T>(name: TServiceName): T {
    return this.services[name] as unknown as T;
  }
}
