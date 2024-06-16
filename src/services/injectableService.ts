import { ServiceLocator } from "./serviceLocator";

export class InjectableService {
  serviceLocator: ServiceLocator;
  name: string;

  constructor(serviceLocator: ServiceLocator, name: string) {
    this.serviceLocator = serviceLocator;
    this.name = name;
  }
}
