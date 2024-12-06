"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueId = exports.generateCharsets = void 0;
const crypto_1 = require("crypto");
const consts_1 = require("./consts");
const helpers_1 = require("./helpers");
// Use webcrypto for secure cryptographic operations
const crypto = crypto_1.webcrypto;
// Generate balanced ID with improved randomness: Uses shuffling and XOR scrambling to ensure uniformity and randomness
function generateImprovedBalancedIdWithShuffling(length, charsets) {
    // Combine all character sets into one array and shuffle it for better randomness
    const combinedCharset = charsets.flat();
    const shuffledCharset = (0, helpers_1.fisherYatesShuffle)(combinedCharset);
    // Create a byte array to generate random values with higher resolution (3 bytes per character)
    const bytes = new Uint8Array(length * 3); // Each character will be represented by 3 bytes
    crypto.getRandomValues(bytes); // Fill the byte array with cryptographically secure random values
    // XOR scramble the random bytes to add another layer of randomness
    const scrambledBytes = (0, helpers_1.xorScramble)(bytes);
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
function generateCharsets({ dictionary, excludedChars, }) {
    const flatDictionaries = Array.isArray(dictionary)
        ? dictionary
        : [dictionary]; // Ensure the dictionary is an array of dictionary keys
    const flatExclusions = Array.isArray(excludedChars)
        ? excludedChars
        : [excludedChars]; // Ensure exclusions is an array of excluded characters
    // For each dictionary, filter out the excluded characters and shuffle the resulting character set
    return flatDictionaries.map((dictKey) => {
        const baseCharset = consts_1.DICTIONARIES[dictKey].filter((char) => !flatExclusions.includes(char) // Remove excluded characters
        );
        return (0, helpers_1.fisherYatesShuffle)(baseCharset); // Shuffle the filtered charset for better randomness
    });
}
exports.generateCharsets = generateCharsets;
// Main function to generate a unique ID: Combines everything to generate a unique ID based on the options provided
function generateUniqueId({ dictionary, excludedChars, length, } = consts_1.DEFAULT_OPTIONS) {
    // Generate the character sets based on provided dictionaries and exclusions
    const charsets = generateCharsets({ dictionary, excludedChars });
    const flatCharset = charsets.flat(); // Flatten the array of character sets into a single array
    // Ensure the charset has enough characters to generate an ID of the desired length
    if (flatCharset.length < length) {
        throw new Error(`Charset size (${flatCharset.length}) is too small to generate IDs of length ${length}`);
    }
    // Generate the ID using the improved shuffling and XOR scrambling method
    const id = generateImprovedBalancedIdWithShuffling(length, charsets);
    // Apply post-process shuffle for the generated ID: This adds a final shuffle to the generated ID for added randomness
    return (0, helpers_1.fisherYatesShuffle)(id.split('')).join('');
}
exports.generateUniqueId = generateUniqueId;
//# sourceMappingURL=uniqueID.js.map