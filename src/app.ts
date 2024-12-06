import { DEFAULT_OPTIONS, DICTIONARIES } from './consts';
import { Dictionary } from './interfaces';
import { generateCharsets, generateUniqueId } from './uniqueID';

const say = console.info;

// Parameters
const SAMPLE_SIZE = 100000; // Number of IDs to generate
const CHARSET = [
  ...DICTIONARIES[Dictionary.NUMERIC],
  ...DICTIONARIES[Dictionary.ALPHA_UPPER],
];
const EXCLUDED_CHARS = DEFAULT_OPTIONS.excludedChars;

// Helper function to calculate Shannon entropy
const calculateEntropy = (frequencies: number[], total: number): number => {
  return frequencies.reduce((sum, freq) => {
    if (freq === 0) return sum;
    const p = freq / total;
    return sum - p * Math.log2(p);
  }, 0);
};

// Function to calculate Chi-Squared statistic
const calculateChiSquared = (
  observedFrequencies: number[],
  expectedCount: number
): number => {
  return observedFrequencies.reduce((sum, observed) => {
    const diff = observed - expectedCount;
    return sum + (diff * diff) / expectedCount;
  }, 0);
};

// Helper function for a runs test
const runsTest = (
  sequence: string[]
): { runs: number; expectedRuns: number; zScore: number } => {
  let runs = 1;
  for (let i = 1; i < sequence.length; i++) {
    if (sequence[i] !== sequence[i - 1]) runs++;
  }
  const n = sequence.length;
  const p = 1 / (CHARSET.length - EXCLUDED_CHARS.length); // Uniform probability
  const expectedRuns = 2 * n * p * (1 - p) + 1;
  const variance =
    (2 * n * p * (1 - p) * (1 - 2 * p)) /
    (CHARSET.length - EXCLUDED_CHARS.length);
  const zScore = (runs - expectedRuns) / Math.sqrt(variance);
  return { runs, expectedRuns, zScore };
};

// Main Test Function
const testRandomness = async (options = DEFAULT_OPTIONS) => {
  const { dictionary, excludedChars, length } = options;

  // Generate the effective charset (excluding characters)
  const charsets = generateCharsets({ dictionary, excludedChars });
  const effectiveCharset = charsets.flat();
  const charCount: Record<string, number> = Object.fromEntries(
    effectiveCharset.map((char) => [char, 0])
  );

  const ids: string[] = [];
  const sequence: string[] = [];

  // Generate IDs and collect stats
  for (let i = 0; i < SAMPLE_SIZE; i++) {
    const id = generateUniqueId({ dictionary, excludedChars, length });
    ids.push(id);
    for (const char of id) {
      if (char in charCount) {
        charCount[char]++;
        sequence.push(char);
      }
    }
  }

  // Chi-Squared Test
  const totalCharacters = SAMPLE_SIZE * length;
  const expectedCount = totalCharacters / effectiveCharset.length;
  const observedFrequencies = Object.values(charCount);
  const chiSquared = calculateChiSquared(observedFrequencies, expectedCount);

  // Entropy Calculation
  const entropy = calculateEntropy(observedFrequencies, totalCharacters);

  // Uniqueness Test
  const uniqueIds = new Set(ids);
  const allUnique = uniqueIds.size === SAMPLE_SIZE;

  // Runs Test
  const { runs, expectedRuns, zScore } = runsTest(sequence);

  // Results
  say('Character Frequencies:', charCount);
  say('Chi-Squared Statistic:', chiSquared);
  say('Entropy:', entropy, 'Max Entropy:', Math.log2(effectiveCharset.length));
  say('All IDs Unique:', allUnique);
  say('Runs Test:');
  say(' - Runs:', runs);
  say(' - Expected Runs:', expectedRuns);
  say(' - Z-Score:', zScore);
};

testRandomness();
