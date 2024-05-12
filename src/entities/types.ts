export const EntityCreationMode = {
  random: 'random'
}

export type CreationMode = keyof typeof EntityCreationMode;

export const EntityPropertyDefaults = {
  color: ['red','blue','green','yellow','purple','orange','pink','brown','black','white'],
  size: ['small','medium','large','tiny','huge','gigantic'],
  vibe: ['happy','sad','angry','scared','excited','bored','confused','surprised','disgusted','calm'],
  ['danger it poses to other entities']: ['safe','dangerous','harmless','deadly','friendly','hostile','neutral'],
  ['item in its hand']: ['hat','sword','shield','book','flower','crown','glasses','scarf','gloves','shoes'],
}

export type EntityProperty = keyof typeof EntityPropertyDefaults;
