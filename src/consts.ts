import { Dictionary } from './interfaces';

export const DICTIONARIES: Record<Dictionary, string[]> = {
  NUMERIC: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  ALPHAUPPER: [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ],
  ALPHALOWER: [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ],
};

export const DEFAULT_OPTIONS = {
  length: 8,
  dictionary: [Dictionary.NUMERIC, Dictionary.ALPHA_UPPER],
  excludedChars: ['o', '0', 'I', '1'],
};
