import { ChatGPTClient } from "./chatGPT";
import { InjectableService } from "./injectableService";

export const ServiceName = {
  [ChatGPTClient.name]: ChatGPTClient.name,
};

export type TServiceName = keyof typeof ServiceName;

export type ServiceInstance = InstanceType<typeof InjectableService>;

export class ServiceLocator {
  private services: { [key: TServiceName]: ServiceInstance };

  constructor() {
      this.services = {};
  }

  addService(instance: ServiceInstance) {
      this.services[instance.name] = instance;
      this.services[instance.name].serviceLocator = this;
  }

  getService(name: TServiceName): ServiceInstance {
      return this.services[name];
  }
}
