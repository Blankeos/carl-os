import * as math from 'mathjs';

export type ParsedProblem = {
  type: 'equation';
  problem: string;
  result: {
    value: number;
    label: string;
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

/**
 * Converts a number to its word representation
 */
function numberToWords(num: number): string {
  if (num === 0) return 'Zero';

  const units = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  function toWords(n: number): string {
    if (n < 0) return 'Negative ' + toWords(Math.abs(n));
    if (n < 20) return units[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + units[n % 10] : '');
    if (n < 1000)
      return (
        units[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + toWords(n % 100) : '')
      );
    if (n < 1000000)
      return (
        toWords(Math.floor(n / 1000)) +
        ' Thousand' +
        (n % 1000 !== 0 ? ' ' + toWords(n % 1000) : '')
      );
    return (
      toWords(Math.floor(n / 1000000)) +
      ' Million' +
      (n % 1000000 !== 0 ? ' ' + toWords(n % 1000000) : '')
    );
  }

  return toWords(num);
}

/**
 * Normalizes a math problem by converting word representations to mathematical symbols
 */
function normalizeMathProblem(input: string): string {
  // Split into tokens while preserving operators
  const tokens = input.toLowerCase().match(/\b\w+\b|[+\-*/()]/g) || [];

  // Map each token to its mathematical equivalent if it exists
  const normalizedTokens = tokens.map((token) => wordToMath[token] || token);

  // Join the tokens to create a valid math expression
  return normalizedTokens.join('');
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
        label: numberToWords(value),
      },
    };
  } catch (error) {
    throw new Error(`Failed to parse math problem: ${(error as Error).message}`);
  }
}

export default parseMathProblem;
