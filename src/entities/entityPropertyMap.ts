import { EntityProperty, EntityPropertyDefaults } from "./types";
import { getRandomInteger } from "../utils";

export class EntityPropertyMap {
  properties: Map<EntityProperty, string>;

  constructor(properties: Map<EntityProperty, string>) {
    this.properties = properties;
  }

  addProperty(propName: EntityProperty, propValue: string) {
    this.properties.set(propName, propValue);
  }

  modifyProperty(propName: EntityProperty, propValue: string) {
    this.properties.set(propName, propValue);
  }

  bulkModifyProperties(properties: Map<EntityProperty, string>) {
    properties.forEach((value, key) => {
      this.properties.set(key, value);
    });
  }

  setProperties(properties: Map<EntityProperty, string>) {
    this.properties = properties;
  }

  generateRandomProperties(): void {
    this.properties = Object.fromEntries(
      Object.keys(EntityPropertyDefaults).map((prop: EntityProperty) => {
        return [prop, EntityPropertyDefaults[prop][getRandomInteger(EntityPropertyDefaults[prop].length - 1)]];
      })
    ) as unknown as Map<EntityProperty, string>;
  }

  getReadableDescription() {
    return Array.from(Object.entries(this.properties))
      .map(([key, value]) => `${key} is ${value}`)
      .join(", ");
  }
}
