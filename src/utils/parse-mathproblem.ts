import * as math from 'mathjs';
import { ToWords } from 'to-words';

export type ParsedProblem = {
  type: 'equation' | 'currency-equation';
  problem: string;
  result: {
    value: number;
    label: string;
    shortLabel?: string;
  };
};

// Dictionary for converting words to mathematical symbols or numbers
const wordToMath: Record<string, string> = {
  zero: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
  eleven: '11',
  twelve: '12',
  thirteen: '13',
  fourteen: '14',
  fifteen: '15',
  sixteen: '16',
  seventeen: '17',
  eighteen: '18',
  nineteen: '19',
  twenty: '20',
  thirty: '30',
  forty: '40',
  fifty: '50',
  sixty: '60',
  seventy: '70',
  eighty: '80',
  ninety: '90',
  hundred: '100',
  thousand: '1000',
  million: '1000000',
  plus: '+',
  add: '+',
  minus: '-',
  subtract: '-',
  times: '*',
  multiply: '*',
  multiplied: '*',
  divided: '/',
  'divided by': '/',
  divide: '/',
};

const toWords = new ToWords({ localeCode: 'en-US' });

/**
 * Normalizes a math problem by converting word representations to mathematical symbols
 */
function normalizeMathProblem(input: string): string {
  // Split into tokens while preserving operators and decimal numbers
  const tokens = input.toLowerCase().match(/\b\d*\.\d+\b|\.\d+\b|\b\w+\b|[+\-*/()]/g) || [];

  // Map each token to its mathematical equivalent if it exists
  const normalizedTokens = tokens.map((token) => wordToMath[token] || token);

  // Join the tokens to create a valid math expression
  return normalizedTokens.join('');
}

// Define currency mappings
const CURRENCY_MAPPINGS: Record<string, string> = {
  usd: 'USD',
  dollars: 'USD',
  dollar: 'USD',
  php: 'PHP',
  pesos: 'PHP',
  peso: 'PHP',
};

const CURRENCY_TO_LOCALE: Record<string, string> = {
  PHP: 'en-PH',
  USD: 'en-US',
};

/**
 * Normalizes a currency math problem and extracts currency details
 */
function normalizeCurrencyProblem(input: string): { normalizedInput: string; currency: string } {
  let currency = 'USD'; // Default currency

  // Convert to lowercase and find currency indicators
  const lowerInput = input.toLowerCase();
  for (const [key, value] of Object.entries(CURRENCY_MAPPINGS)) {
    if (lowerInput.includes(key)) {
      currency = value;
      // Remove the currency text from input
      input = input.replace(new RegExp(key, 'gi'), '');
    }
  }

  // Normalize the remaining math expression
  const normalizedMath = normalizeMathProblem(input);

  return {
    normalizedInput: normalizedMath,
    currency,
  };
}

/**
 * Parses a mathematical problem and returns a structured result
 */
export function parseMathProblem(input: string): ParsedProblem {
  try {
    const normalizedProblem = normalizeMathProblem(input);
    const value = math.evaluate(normalizedProblem);

    if (typeof value !== 'number') {
      throw new Error('Evaluation did not result in a number');
    }

    return {
      type: 'equation',
      problem: normalizedProblem,
      result: {
        value,
        label: toWords.convert(value, { currency: false }),
        ...(value % 1 !== 0 && {
          shortLabel: toWords.convert(Number(value.toFixed(2)), { currency: false }),
        }),
      },
    };
  } catch (error) {
    // throw new Error(`Failed to parse math problem: ${(error as Error).message}`);
  }

  try {
    const normalizedCurrencyCalculation = normalizeCurrencyProblem(input);
    const value = math.evaluate(normalizedCurrencyCalculation.normalizedInput);

    if (typeof value !== 'number') {
      throw new Error('Evaluation did not result in a number');
    }

    console.log(normalizedCurrencyCalculation.currency);
    const _toWords = new ToWords({
      localeCode: CURRENCY_TO_LOCALE[normalizedCurrencyCalculation.currency],
      converterOptions: {
        doNotAddOnly: true,
      },
    });

    return {
      type: 'currency-equation',
      problem: normalizedCurrencyCalculation.normalizedInput,
      result: {
        value,
        label: _toWords.convert(value, { currency: true }),
        ...(value % 1 !== 0 && {
          shortLabel: _toWords.convert(Number(value.toFixed(2)), { currency: true }),
        }),
      },
    };
  } catch (error) {
    // throw new Error(`Failed to parse currency problem: ${(error as Error).message}`);
  }
}

export default parseMathProblem;
