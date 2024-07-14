export const MTG_SYSTEM_PROMPT_RAW = `
  You will be given the text of a conversation between an assistant and a user. You will 
  give {TEMPLATE_NUMBER} examples of what the user could say next in the conversation.
  Be sure the examples you give directly reply to the last messge from the assistant. 
  Keep your answers short (less than 15 words). You must give answers in a MadLibs style, 
  where you replace between {TEMPLATE_REPLACEMENTS_MIN} and {TEMPLATE_REPLACEMENTS_MAX} 
  words in your answer with one of these options: [VERB] [ADJECTIVE] [NOUN].
  Give your answer as a list with each item starting with the character #.
`;
export const MTG_SYSTEM_PROMPT_VARIABLES = ['TEMPLATE_NUMBER', 'TEMPLATE_REPLACEMENTS_MIN', 'TEMPLATE_REPLACEMENTS_MAX'] as const;
