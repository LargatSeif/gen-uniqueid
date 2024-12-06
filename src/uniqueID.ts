import { webcrypto } from 'crypto';
import { UniqueIdOptions } from './interfaces';
import { DEFAULT_OPTIONS, DICTIONARIES } from './consts';
import { fisherYatesShuffle, xorScramble } from './helpers';

// Use webcrypto for secure cryptographic operations
const crypto = webcrypto as unknown as Crypto;

// Generate balanced ID with improved randomness: Uses shuffling and XOR scrambling to ensure uniformity and randomness
function generateImprovedBalancedIdWithShuffling(
  length: number,
  charsets: string[][]
): string {
  // Combine all character sets into one array and shuffle it for better randomness
  const combinedCharset = charsets.flat();
  const shuffledCharset = fisherYatesShuffle(combinedCharset);

  // Create a byte array to generate random values with higher resolution (3 bytes per character)
  const bytes = new Uint8Array(length * 3); // Each character will be represented by 3 bytes
  crypto.getRandomValues(bytes); // Fill the byte array with cryptographically secure random values

  // XOR scramble the random bytes to add another layer of randomness
  const scrambledBytes = xorScramble(bytes);

  // Map each byte to a character in the shuffled character set
  return Array.from({ length }, (_, i) => {
    const index =
      // Combine three bytes into one index (higher resolution)
      ((scrambledBytes[i] << 16) |
        (scrambledBytes[length + i] << 8) |
        scrambledBytes[2 * length + i]) %
      shuffledCharset.length; // Ensure the index is within the bounds of the charset
    return shuffledCharset[index]; // Select the character from the shuffled charset
  }).join(''); // Join the characters to form the final ID
}

// Generate character sets with exclusions applied: This function creates character sets with exclusions based on the provided options
export function generateCharsets({
  dictionary,
  excludedChars,
}: Omit<UniqueIdOptions, 'length'>): string[][] {
  const flatDictionaries = Array.isArray(dictionary)
    ? dictionary
    : [dictionary]; // Ensure the dictionary is an array of dictionary keys
  const flatExclusions = Array.isArray(excludedChars)
    ? excludedChars
    : [excludedChars]; // Ensure exclusions is an array of excluded characters

  // For each dictionary, filter out the excluded characters and shuffle the resulting character set
  return flatDictionaries.map((dictKey) => {
    const baseCharset = DICTIONARIES[dictKey].filter(
      (char) => !flatExclusions.includes(char) // Remove excluded characters
    );
    return fisherYatesShuffle(baseCharset); // Shuffle the filtered charset for better randomness
  });
}

// Main function to generate a unique ID: Combines everything to generate a unique ID based on the options provided
export function generateUniqueId({
  dictionary,
  excludedChars,
  length,
}: UniqueIdOptions = DEFAULT_OPTIONS): string {
  // Generate the character sets based on provided dictionaries and exclusions
  const charsets = generateCharsets({ dictionary, excludedChars });
  const flatCharset = charsets.flat(); // Flatten the array of character sets into a single array

  // Ensure the charset has enough characters to generate an ID of the desired length
  if (flatCharset.length < length) {
    throw new Error(
      `Charset size (${flatCharset.length}) is too small to generate IDs of length ${length}`
    );
  }

  // Generate the ID using the improved shuffling and XOR scrambling method
  const id = generateImprovedBalancedIdWithShuffling(length, charsets);

  // Apply post-process shuffle for the generated ID: This adds a final shuffle to the generated ID for added randomness
  return fisherYatesShuffle(id.split('')).join('');
}
