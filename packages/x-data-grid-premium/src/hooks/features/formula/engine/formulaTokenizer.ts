import { CELL_REF_REGEX, matchColumnRange, matchRangeTail } from './formulaA1Tokens';
import type { FormulaSourceSpan } from './formulaTypes';

/**
 * `reference` and `unknown` are produced ONLY under the matching
 * `TokenizeFormulaOptions` flag. The parser tokenizes with the defaults, so it
 * never sees either of them and its canonical grammar stays closed.
 */
export type FormulaTokenType =
  'number' | 'string' | 'identifier' | 'operator' | 'punctuation' | 'reference' | 'unknown';

export interface FormulaToken {
  type: FormulaTokenType;
  /**
   * For `string` tokens this is the unescaped value (`""` -> `"`);
   * for every other type it is the raw source text.
   */
  value: string;
  span: FormulaSourceSpan;
  /**
   * Set on the `string` token a tolerant tokenization emits for a literal whose
   * closing quote is missing — the span then runs to the end of the input.
   */
  unterminated?: boolean;
}

export interface TokenizeFormulaOptions {
  /**
   * Recognizes the A1 editor dialect's references — `B5`, `$A$1`, the `A1:B2`
   * range and the `A:A` whole-column range — as single `reference` tokens, and
   * `:` as punctuation. Off by default: the canonical dialect the parser reads
   * has no A1 forms, and the same text must not tokenize two ways.
   * @default false
   */
  a1Notation?: boolean;
  /**
   * Never stops at a problem: an unexpected character becomes an `unknown`
   * token, an unterminated string an `unterminated` `string` token, and `error`
   * comes back `null`. For consumers that analyze half-typed text (autocomplete)
   * rather than parse it, where aborting would blind everything downstream of
   * the first stray character.
   * @default false
   */
  tolerant?: boolean;
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
 * Tokenizes a formula expression (the source without its leading `=`) in the
 * canonical dialect, stopping at the first problem: on error, `tokens` contains
 * everything tokenized up to the error position. `options` opens it up to the A1
 * dialect and to never stopping — see `TokenizeFormulaOptions`.
 */
export function tokenizeFormula(
  expression: string,
  options: TokenizeFormulaOptions = {},
): FormulaTokenizeResult {
  const { a1Notation = false, tolerant = false } = options;
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
          if (!tolerant) {
            return failure('Invalid number literal.', start, exponentIndex);
          }
          // Tolerant reading: the number ends before the `e`, which is then
          // tokenized as an identifier of its own.
        } else {
          index = exponentIndex;
          while (index < length && isDigit(expression.charCodeAt(index))) {
            index += 1;
          }
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
        if (!tolerant) {
          return failure('Unterminated string literal.', start, length);
        }
        tokens.push({ type: 'string', value, span: { start, end: length }, unterminated: true });
        continue;
      }
      tokens.push({ type: 'string', value, span: { start, end: index } });
      continue;
    }

    // A1 references are scanned with the very primitives the commit transform
    // uses, so a range is ONE token here exactly as it is one rewritten
    // reference there. Placed ahead of the identifier rule so `B5` reads as a
    // reference, and after the number rule, which no reference can start with.
    if (a1Notation) {
      const cellMatch = CELL_REF_REGEX.exec(expression.slice(index));
      if (cellMatch !== null) {
        const rangeTail = matchRangeTail(expression, index + cellMatch[0].length);
        index = rangeTail === null ? index + cellMatch[0].length : rangeTail.end;
        tokens.push({
          type: 'reference',
          value: expression.slice(start, index),
          span: { start, end: index },
        });
        continue;
      }
      const columnRange = matchColumnRange(expression, index);
      if (columnRange !== null) {
        index = columnRange.end;
        tokens.push({
          type: 'reference',
          value: expression.slice(start, index),
          span: { start, end: index },
        });
        continue;
      }
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

    // `:` is the A1 dialect's range operator. It reaches this point only when it
    // did not join two cell references above (a dangling `A1:`, mid-typing).
    if (PUNCTUATION.has(char) || (a1Notation && char === ':')) {
      index += 1;
      tokens.push({ type: 'punctuation', value: char, span: { start, end: index } });
      continue;
    }

    if (!tolerant) {
      return failure(`Unexpected character "${char}".`, start, start + 1);
    }
    index += 1;
    tokens.push({ type: 'unknown', value: char, span: { start, end: index } });
  }

  return { tokens, error: null };
}
