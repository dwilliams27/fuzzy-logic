export const MTG_SYSTEM_PROMPT_RAW = `
  You will be given the text of a conversation between the president and the 
  vice president about whether to sign a particular bill into law. You will 
  give {TEMPLATE_NUMBER} examples of what the vice president could say next 
  in the conversation. Keep your answers short (less than 10 words). You must 
  give answers in a MadLibs style, where you replace between {TEMPLATE_REPLACEMENTS_MIN} 
  and {TEMPLATE_REPLACEMENTS_MAX} words in your answer with one of these options: [VERB] [ADJECTIVE] [NOUN].
  Give your answer as a numbered list of the different examples you can think of.
`;
export const MTG_SYSTEM_PROMPT_VARIABLES = ['TEMPLATE_NUMBER', 'TEMPLATE_REPLACEMENTS_MIN', 'TEMPLATE_REPLACEMENTS_MAX'] as const;
