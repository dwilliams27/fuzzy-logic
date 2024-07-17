export enum ScenarioEventNames {
  NEXT_PROMPT_TEMPLATES_GENERATED = 'NEXT_PROMPT_TEMPLATES_GENERATED',
  WORD_BANKS_REGENREATED = 'WORD_BANKS_REGENREATED',
  MESSAGE_POSTED = 'MESSAGE_POSTED',
  SCENARIO_ADVANCE_COMPLETED = 'SCENARIO_ADVANCE_COMPLETED',
}

export class ScenarioEvent {
  name: ScenarioEventNames;
  payload: any;

  constructor(name: ScenarioEventNames, payload: any) {
    this.name = name;
    this.payload = payload;
  }
}

export class NextPromptTemplatesGeneratedEvent extends ScenarioEvent {
  constructor() {
    super(ScenarioEventNames.NEXT_PROMPT_TEMPLATES_GENERATED, null);
  };
}

export class WordBanksRegeneratedEvent extends ScenarioEvent {
  constructor() {
    super(ScenarioEventNames.WORD_BANKS_REGENREATED, null);
  };
}

export class ScenarioAdvanceCompletedEvent extends ScenarioEvent {
  constructor() {
    super(ScenarioEventNames.SCENARIO_ADVANCE_COMPLETED, null);
  };
}

export class MessagePostedEvent extends ScenarioEvent {
  constructor() {
    super(ScenarioEventNames.MESSAGE_POSTED, null);
  };
}
