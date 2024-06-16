export const EntityCreationMode = {
  random: 'random'
}

export type CreationMode = keyof typeof EntityCreationMode;

export const EntityPropertyDefaults = {
  color: [
    'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white',
    'cyan', 'magenta', 'lime', 'maroon', 'navy', 'teal', 'violet', 'turquoise', 'gold', 'silver',
    'bronze', 'beige', 'crimson', 'lavender', 'peach', 'indigo', 'olive', 'coral', 'ivory', 'khaki'
  ],
  size: [
    'small', 'medium', 'large', 'tiny', 'huge', 'gigantic', 
    'minuscule', 'massive', 'enormous', 'microscopic', 'colossal', 'petite', 'mighty', 'diminutive',
    'bulky', 'slim', 'portly', 'lanky', 'stout', 'lean'
  ],
  vibe: [
    'happy', 'sad', 'angry', 'scared', 'excited', 'bored', 'confused', 'surprised', 'disgusted', 'calm',
    'joyful', 'melancholic', 'furious', 'terrified', 'elated', 'apathetic', 'puzzled', 'astonished',
    'repulsed', 'tranquil', 'ecstatic', 'gloomy', 'irritated', 'anxious', 'thrilled', 'indifferent',
    'bewildered', 'shocked', 'nauseated', 'serene'
  ],
  ['danger it poses to other entities']: [
    'safe', 'dangerous', 'harmless', 'deadly', 'friendly', 'hostile', 'neutral', 
    'benign', 'lethal', 'innocuous', 'mortal', 'amicable', 'antagonistic', 'indifferent', 'secure',
    'threatening', 'perilous', 'protective', 'aggressive', 'guarded', 'combative', 'unpredictable', 'defensive'
  ],
  ['item in its hand']: [
    'hat', 'sword', 'shield', 'book', 'flower', 'crown', 'glasses', 'scarf', 'gloves', 'shoes',
    'staff', 'wand', 'lamp', 'map', 'compass', 'key', 'dagger', 'scroll', 'orb', 'mask',
    'cup', 'torch', 'banner', 'amulet', 'ring', 'coin', 'bottle', 'fan', 'belt', 'brush',
    'hammer', 'flute', 'bell', 'lantern', 'rope', 'chain', 'whistle', 'mirror', 'crystal', 'goblet'
  ],
  habitat: [
    'forest', 'desert', 'mountain', 'ocean', 'river', 'lake', 'swamp', 'jungle', 'cave', 'plains',
    'tundra', 'savanna', 'rainforest', 'volcano', 'island', 'coast', 'underwater', 'sky', 'space', 'urban',
    'suburban', 'village', 'castle', 'temple', 'ruins', 'mine', 'farm', 'garden', 'cemetery', 'fortress'
  ],
  diet: [
    'herbivore', 'carnivore', 'omnivore', 'insectivore', 'frugivore', 'folivore', 'granivore', 'nectarivore', 'planktivore', 'detritivore',
    'scavenger', 'piscivore', 'fungivore', 'coprophage', 'geophagist', 'hematophage', 'sanguinivore', 'myrmecophage', 'bacterivore', 'saprovore'
  ],
  behavior: [
    'nocturnal', 'diurnal', 'crepuscular', 'solitary', 'gregarious', 'migratory', 'territorial', 'nomadic', 'sedentary', 'aggressive',
    'defensive', 'passive', 'playful', 'curious', 'timid', 'bold', 'cautious', 'friendly', 'aloof', 'social',
    'independent', 'cooperative', 'competitive', 'lazy', 'active', 'restless', 'energetic', 'sluggish', 'observant', 'distracted'
  ],
  ['method of communication']: [
    'verbal', 'nonverbal', 'telepathic', 'gestural', 'written', 'pictorial', 'musical', 'chemical', 'electromagnetic', 'vibrational',
    'visual signals', 'body language', 'auditory signals', 'olfactory signals', 'tactile signals', 'pheromones', 'colors', 'light flashes',
    'mimicry', 'dance'
  ],
  ['special ability']: [
    'invisibility', 'flight', 'super strength', 'telekinesis', 'telepathy', 'healing', 'shape-shifting', 'elemental control', 'time manipulation', 'immortality',
    'speed', 'agility', 'invulnerability', 'weather control', 'mind control', 'clairvoyance', 'precognition', 'pyrokinesis', 'hydrokinesis', 'cryokinesis',
    'electrokinesis', 'geokinesis', 'biokinesis', 'energy manipulation', 'light manipulation', 'shadow manipulation', 'sound manipulation', 'force fields',
    'portal creation', 'size alteration'
  ],
};

export type EntityProperty = keyof typeof EntityPropertyDefaults;
