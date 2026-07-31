/**
 * The textual scanning primitives of the A1 editor dialect, in a leaf module of
 * their own so that every scanner agrees on what a reference is.
 *
 * Three scanners share them today — the commit transform (`toCanonicalFormula`),
 * the reference highlighter (`scanA1References`) and the completion tokenizer
 * (`tokenizeFormula` in A1 mode). A reference the highlighter colors is exactly a
 * reference the commit rewrites is exactly a reference completion treats as one
 * operand; they cannot drift apart.
 *
 * They live here rather than in `formulaA1.ts` because that module pulls in the
 * parser and the serializer, and `formulaTokenizer.ts` — which the parser itself
 * imports — needs them: a leaf module is what breaks the cycle.
 */

// `$?` column letters, `$?` row digits, with a boundary that rejects a longer
// identifier (`LOG10X`) or a call (`LOG10(`).
export const CELL_REF_REGEX = /^(\$?)([A-Za-z]+)(\$?)([0-9]+)(?![A-Za-z0-9_(])/;
// Column letters with the same boundary, for `A:A` whole-column ranges.
const COLUMN_LETTERS_REGEX = /^(\$?)([A-Za-z]+)(?![A-Za-z0-9_(])/;
export const IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*/;
export const WHITESPACE_REGEX = /^\s+/;

export interface ParsedRef {
  columnAbsolute: boolean;
  letters: string;
  rowAbsolute: boolean;
  rowNumber: number;
}

export function readParsedRef(match: RegExpExecArray): ParsedRef {
  return {
    columnAbsolute: match[1] === '$',
    letters: match[2],
    rowAbsolute: match[3] === '$',
    rowNumber: parseInt(match[4], 10),
  };
}

function skipInlineWhitespace(expression: string, from: number): number {
  let index = from;
  while (index < expression.length && /\s/.test(expression[index])) {
    index += 1;
  }
  return index;
}

/**
 * Advances past a `"`-delimited string literal (with `""` escapes), returning the
 * index just after the closing quote (or the end of the input when unterminated).
 */
export function scanStringLiteral(expression: string, start: number): number {
  let index = start + 1;
  while (index < expression.length) {
    if (expression[index] === '"') {
      if (expression[index + 1] === '"') {
        index += 2;
        continue;
      }
      return index + 1;
    }
    index += 1;
  }
  return expression.length;
}

/**
 * After a cell reference at `afterFirst`, matches an optional `: <cellRef>` tail
 * that turns it into a `RANGE`.
 */
export function matchRangeTail(
  expression: string,
  afterFirst: number,
): { endRef: ParsedRef; end: number } | null {
  let index = skipInlineWhitespace(expression, afterFirst);
  if (expression[index] !== ':') {
    return null;
  }
  index = skipInlineWhitespace(expression, index + 1);
  const match = CELL_REF_REGEX.exec(expression.slice(index));
  if (match === null) {
    return null;
  }
  return { endRef: readParsedRef(match), end: index + match[0].length };
}

/**
 * Matches a whole-column range `A:A`. Only same-column ranges map to a single
 * `COLUMN_VALUES`; mixed columns return `null` and are copied verbatim.
 */
export function matchColumnRange(
  expression: string,
  start: number,
): { letters: string; absolute: boolean; end: number } | null {
  const first = COLUMN_LETTERS_REGEX.exec(expression.slice(start));
  if (first === null) {
    return null;
  }
  let index = skipInlineWhitespace(expression, start + first[0].length);
  if (expression[index] !== ':') {
    return null;
  }
  index = skipInlineWhitespace(expression, index + 1);
  const second = COLUMN_LETTERS_REGEX.exec(expression.slice(index));
  if (second === null || first[2].toUpperCase() !== second[2].toUpperCase()) {
    return null;
  }
  return { letters: first[2], absolute: first[1] === '$', end: index + second[0].length };
}
