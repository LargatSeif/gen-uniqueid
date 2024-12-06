import { webcrypto } from 'crypto';

// Use webcrypto for secure cryptographic operations
const crypto = webcrypto as unknown as Crypto;

// Fisher-Yates shuffle function: Randomly shuffles an array using a secure random index
function fisherYatesShuffle(array: string[]): string[] {
  const shuffled = array.slice(); // Create a copy of the input array
  const randomBytes = new Uint8Array(array.length - 1); // Create a random byte array for shuffling
  crypto.getRandomValues(randomBytes); // Fill the byte array with cryptographically secure random values

  // Shuffle the array using the random bytes to ensure randomness
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomBytes[i - 1] % (i + 1); // Generate a secure random index for shuffling
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements in the array
  }

  return shuffled;
}

// XOR function for additional scrambling: Scrambles byte values using bitwise XOR for extra entropy
function xorScramble(array: Uint8Array): Uint8Array {
  const scrambled = new Uint8Array(array.length); // Create a new array for the scrambled values
  for (let i = 0; i < array.length; i++) {
    // Apply XOR with shifted bits to introduce more randomness
    scrambled[i] = array[i] ^ (array[i] >> 3) ^ (array[i] << 5);
  }
  return scrambled;
}

export { fisherYatesShuffle, xorScramble };
