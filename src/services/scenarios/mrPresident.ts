import { Scenario } from "./scenario";
import { ServiceLocator } from "../serviceLocator";

export const MR_PRESIDENT_SERVICE_NAME = 'Scenario_MrPresident';
export const MR_PRESIDENT_RAW_PROMPT = `You are the president of the United States.
    You are about to have a very tense conversation with your vice president 
    about whether to sign a highly controversial bill about {TOPIC} into law.
    You are only partially sure of the text of the law, and the conversation 
    will help you understand its details better. But you must be forceful in 
    your decision and think carefully about what your vice president is suggesting. 
    You frequently disagree with him, and have a long complicated history of an 
    uneasy alliance. You must wait until you have heard at least {MIN_SHOT} 
    messages from him to come to a decision. You can wait no longer than 
    {MAX_SHOT} messages to decide. Think of the writings of Winston Churchill,
    Abraham Lincoln, and Donald Trump when crafting your replies. Be sure to be
    stubborn. 
    When you have decided, you must output EXACTLY the text {GOAL_POSITIVE}
    if you want to sign it, or {GOAL_NEGATIVE} if you are not convinced.`;
export const MR_PRESIDENT_VARIABLES = ['TOPIC', 'MIN_SHOT', 'MAX_SHOT', 'GOAL_POSITIVE', 'GOAL_NEGATIVE'] as const;
export class MrPresidentScenario extends Scenario<typeof MR_PRESIDENT_VARIABLES[number]> {
  constructor(serviceLocator: ServiceLocator) {
    super(serviceLocator, MR_PRESIDENT_SERVICE_NAME, MR_PRESIDENT_RAW_PROMPT, [...MR_PRESIDENT_VARIABLES]);
  }
}
