
export function getRandomInteger(x: number) {
  return Math.floor(Math.random() * (x + 1));
}

export function generateNonOverlappingRandomNumbers(listSize: number, numSamples: number) {
  // Validate input
  if (numSamples > listSize + 1) {
    throw new Error('Cannot generate more unique numbers than the range size');
  }

  // Create an array with values from 0 to X
  const array = Array.from({ length: listSize + 1 }, (_, i) => i);

  // Fisher-Yates shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }

  // Return the first n elements
  return array.slice(0, numSamples);
}
