"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
const interfaces_1 = require("./interfaces");
const uniqueID_1 = require("./uniqueID");
const say = console.info;
// Parameters
const SAMPLE_SIZE = 100000; // Number of IDs to generate
const CHARSET = [
    ...consts_1.DICTIONARIES[interfaces_1.Dictionary.NUMERIC],
    ...consts_1.DICTIONARIES[interfaces_1.Dictionary.ALPHA_UPPER],
];
const EXCLUDED_CHARS = consts_1.DEFAULT_OPTIONS.excludedChars;
// Helper function to calculate Shannon entropy
const calculateEntropy = (frequencies, total) => {
    return frequencies.reduce((sum, freq) => {
        if (freq === 0)
            return sum;
        const p = freq / total;
        return sum - p * Math.log2(p);
    }, 0);
};
// Function to calculate Chi-Squared statistic
const calculateChiSquared = (observedFrequencies, expectedCount) => {
    return observedFrequencies.reduce((sum, observed) => {
        const diff = observed - expectedCount;
        return sum + (diff * diff) / expectedCount;
    }, 0);
};
// Helper function for a runs test
const runsTest = (sequence) => {
    let runs = 1;
    for (let i = 1; i < sequence.length; i++) {
        if (sequence[i] !== sequence[i - 1])
            runs++;
    }
    const n = sequence.length;
    const p = 1 / (CHARSET.length - EXCLUDED_CHARS.length); // Uniform probability
    const expectedRuns = 2 * n * p * (1 - p) + 1;
    const variance = (2 * n * p * (1 - p) * (1 - 2 * p)) /
        (CHARSET.length - EXCLUDED_CHARS.length);
    const zScore = (runs - expectedRuns) / Math.sqrt(variance);
    return { runs, expectedRuns, zScore };
};
// Main Test Function
const testRandomness = (options = consts_1.DEFAULT_OPTIONS) => __awaiter(void 0, void 0, void 0, function* () {
    const { dictionary, excludedChars, length } = options;
    // Generate the effective charset (excluding characters)
    const charsets = (0, uniqueID_1.generateCharsets)({ dictionary, excludedChars });
    const effectiveCharset = charsets.flat();
    const charCount = Object.fromEntries(effectiveCharset.map((char) => [char, 0]));
    const ids = [];
    const sequence = [];
    // Generate IDs and collect stats
    for (let i = 0; i < SAMPLE_SIZE; i++) {
        const id = (0, uniqueID_1.generateUniqueId)({ dictionary, excludedChars, length });
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
});
testRandomness();
//# sourceMappingURL=app.js.map