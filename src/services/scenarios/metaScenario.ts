import { ServiceLocator } from "../serviceLocator";
import { Scenario, ScenarioType } from "./scenario";

export const META_SCENARIO_PROMPT_SERVICE_NAME = 'Meta';
export const META_SCENARIO_RAW_PROMPT = `
  Here are a set of system instruction I am passing to ChatGPT:
  
  {SYSTEM_INSTRUCTION_1}
  {SYSTEM_INSTRUCTION_2}

  Generate another sytem instruction of a different scenario using the examples above.
`;
export const META_SCENARIO_PROMPT_VARIABLES = ['SYSTEM_INSTRUCTION_1', 'SYSTEM_INSTRUCTION_2'] as const;
export type Meta = typeof META_SCENARIO_PROMPT_VARIABLES[number];
export class MetaScenario extends Scenario<typeof META_SCENARIO_PROMPT_VARIABLES[number]> {
  constructor(serviceLocator: ServiceLocator) {
    super(serviceLocator, META_SCENARIO_PROMPT_SERVICE_NAME, META_SCENARIO_RAW_PROMPT, [...META_SCENARIO_PROMPT_VARIABLES], ScenarioType.Message);
  }
}
