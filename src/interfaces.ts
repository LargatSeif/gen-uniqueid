export enum Dictionary {
  NUMERIC = 'NUMERIC',
  ALPHA_UPPER = 'ALPHAUPPER',
  ALPHA_LOWER = 'ALPHALOWER',
}

export interface UniqueIdOptions {
  length?: number;
  dictionary?: Dictionary[] | Dictionary;
  excludedChars?: string | string[];
}
