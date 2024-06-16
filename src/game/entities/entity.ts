import { EntityPropertyMap } from "./entityPropertyMap";
import { CreationMode, EntityCreationMode } from "./types";

export interface EntityProps {
  propertyMap?: EntityPropertyMap;
  creationMode?: CreationMode;
}

export class Entity {
  coreProperties: EntityPropertyMap;

  constructor(props: EntityProps) {
    this.coreProperties = props.propertyMap || new EntityPropertyMap(new Map());
    this.handleCreationMode(props.creationMode || EntityCreationMode.random);
  }

  handleCreationMode(creationMode: string) {
    switch (creationMode) {
      case EntityCreationMode.random: {
        this.coreProperties.generateRandomProperties();
        break;
      }
      default:
        break;
    }
  }

  getDescription() {
    return this.coreProperties.getReadableDescription();
  }
}
