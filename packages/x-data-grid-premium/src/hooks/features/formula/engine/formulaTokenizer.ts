import type { FormulaSourceSpan } from './formulaTypes';

export type FormulaTokenType = 'number' | 'string' | 'identifier' | 'operator' | 'punctuation';

export interface FormulaToken {
  type: FormulaTokenType;
  /**
   * For `string` tokens this is the unescaped value (`""` -> `"`);
   * for every other type it is the raw source text.
   */
  value: string;
  span: FormulaSourceSpan;
}

export interface FormulaTokenizeError {
  message: string;
  span: FormulaSourceSpan;
}

export interface FormulaTokenizeResult {
  tokens: FormulaToken[];
  error: FormulaTokenizeError | null;
}

const isDigit = (charCode: number) => charCode >= 48 && charCode <= 57; // 0-9

const isIdentifierStart = (charCode: number) =>
  (charCode >= 65 && charCode <= 90) || // A-Z
  (charCode >= 97 && charCode <= 122) || // a-z
  charCode === 95; // _

const isIdentifierPart = (charCode: number) => isIdentifierStart(charCode) || isDigit(charCode);

const isWhitespace = (char: string) =>
  char === ' ' || char === '\t' || char === '\n' || char === '\r';

const SINGLE_CHAR_OPERATORS = new Set(['+', '-', '*', '/', '^', '&', '=']);
const PUNCTUATION = new Set(['(', ')', ',']);

/**
 * Tokenizes a formula expression (the source without its leading `=`).
 * On error, `tokens` contains everything tokenized up to the error position.
 */
export function tokenizeFormula(expression: string): FormulaTokenizeResult {
  const tokens: FormulaToken[] = [];
  let index = 0;
  const { length } = expression;

  const failure = (message: string, start: number, end: number): FormulaTokenizeResult => ({
    tokens,
    error: { message, span: { start, end } },
  });

  while (index < length) {
    const char = expression[index];

    if (isWhitespace(char)) {
      index += 1;
      continue;
    }

    const start = index;
    const charCode = expression.charCodeAt(index);

    // Number literal: starts with a digit, or `.` followed by a digit.
    if (isDigit(charCode) || (char === '.' && isDigit(expression.charCodeAt(index + 1)))) {
      while (index < length && isDigit(expression.charCodeAt(index))) {
        index += 1;
      }
      if (expression[index] === '.') {
        index += 1;
        while (index < length && isDigit(expression.charCodeAt(index))) {
          index += 1;
        }
      }
      if (expression[index] === 'e' || expression[index] === 'E') {
        let exponentIndex = index + 1;
        if (expression[exponentIndex] === '+' || expression[exponentIndex] === '-') {
          exponentIndex += 1;
        }
        if (!isDigit(expression.charCodeAt(exponentIndex))) {
          return failure('Invalid number literal.', start, exponentIndex);
        }
        index = exponentIndex;
        while (index < length && isDigit(expression.charCodeAt(index))) {
          index += 1;
        }
      }
      tokens.push({
        type: 'number',
        value: expression.slice(start, index),
        span: { start, end: index },
      });
      continue;
    }

    if (char === '"') {
      let value = '';
      index += 1;
      let closed = false;
      while (index < length) {
        const current = expression[index];
        if (current === '"') {
          if (expression[index + 1] === '"') {
            // `""` escapes a literal quote (spreadsheet convention).
            value += '"';
            index += 2;
            continue;
          }
          index += 1;
          closed = true;
          break;
        }
        value += current;
        index += 1;
      }
      if (!closed) {
        return failure('Unterminated string literal.', start, length);
      }
      tokens.push({ type: 'string', value, span: { start, end: index } });
      continue;
    }

    if (isIdentifierStart(charCode)) {
      index += 1;
      while (index < length && isIdentifierPart(expression.charCodeAt(index))) {
        index += 1;
      }
      tokens.push({
        type: 'identifier',
        value: expression.slice(start, index),
        span: { start, end: index },
      });
      continue;
    }

    if (char === '<') {
      const next = expression[index + 1];
      let value = '<';
      if (next === '=') {
        value = '<=';
      } else if (next === '>') {
        value = '<>';
      }
      index += value.length;
      tokens.push({ type: 'operator', value, span: { start, end: index } });
      continue;
    }

    if (char === '>') {
      const value = expression[index + 1] === '=' ? '>=' : '>';
      index += value.length;
      tokens.push({ type: 'operator', value, span: { start, end: index } });
      continue;
    }

    if (SINGLE_CHAR_OPERATORS.has(char)) {
      index += 1;
      tokens.push({ type: 'operator', value: char, span: { start, end: index } });
      continue;
    }

    if (PUNCTUATION.has(char)) {
      index += 1;
      tokens.push({ type: 'punctuation', value: char, span: { start, end: index } });
      continue;
    }

    return failure(`Unexpected character "${char}".`, start, start + 1);
  }

  return { tokens, error: null };
}
