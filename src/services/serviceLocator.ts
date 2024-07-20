import { ChatGPTClient } from "./chatGPT";
import { InjectableService, InjectableServiceInstance } from "./injectableService";
import { Scenario } from "./scenarios/scenario";

export class ServiceLocator {
  private services: { [key: string]: InjectableService };

  constructor() {
    this.services = {};
  }

  addService<T>(service: { serviceKey: string, serviceValue: any }): T {
    service.serviceValue.serviceName = service.serviceKey;
    service.serviceValue.serviceLocator = this;

    this.services[service.serviceKey] = service.serviceValue;

    return service.serviceValue;
  }

  getService<T>(name: string): T {
    return this.services[name] as unknown as T;
  }

  getScenarios(): Scenario<any>[] {
    return Object.keys(this.services)
      .filter((serviceName) => serviceName.startsWith(`SCENARIO_`))
      .map((key) => this.services[key]) as Scenario<any>[];
  }
}
