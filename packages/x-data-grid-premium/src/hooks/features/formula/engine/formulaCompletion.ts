import { FORMULA_BINARY_PRECEDENCE, FORMULA_RESERVED_NAMES } from './formulaAst';
import type { FormulaBinaryOperator } from './formulaAst';
import { FORMULA_BUILT_IN_FUNCTIONS } from './formulaFunctions';
import type { FormulaFunctionDefinition, FormulaFunctionRegistry } from './formulaFunctions';
import { tokenizeFormula } from './formulaTokenizer';
import type { FormulaToken } from './formulaTokenizer';

/**
 * The category a completion token belongs to. Drives the ranking tier and lets
 * the editor group/icon suggestions. `field` and `columnLetter` are produced by
 * the grid adapter (the engine never sees columns) but live here so the pure
 * ranker can tier them consistently with the static vocabulary.
 */
export type FormulaCompletionKind =
  'function' | 'specialForm' | 'constant' | 'operator' | 'field' | 'columnLetter';

export interface FormulaCompletionToken {
  /**
   * Text shown in the dropdown.
   */
  label: string;
  /**
   * Text spliced at the caret. For `callable` tokens the editor appends `(`
   * with the caret placed inside.
   */
  insertText: string;
  kind: FormulaCompletionKind;
  /**
   * Functions and special forms take arguments — inserting one opens a `(`.
   */
  callable?: boolean;
  /**
   * One-line call signature, e.g. `SUM(value1, value2, …)`. Shown as signature
   * help when the caret is inside the call and as a secondary line in the list.
   */
  signature?: string;
  description?: string;
  category?: string;
  /**
   * Optional secondary text (a field's header name, or a column letter's field).
   */
  detail?: string;
}

export interface FormulaCompletionContext {
  /**
   * The partial identifier the caret sits in or right after — the prefix used
   * for matching (`''` when the caret is not on an identifier).
   */
  token: string;
  /**
   * Replace span in EXPRESSION coordinates (the source WITHOUT its leading `=`).
   * Accepting a suggestion replaces `expression.slice(replaceStart, replaceEnd)`.
   */
  replaceStart: number;
  replaceEnd: number;
  /**
   * The caret is in a value position: the start of the expression, or right
   * after `(`, `,` or a binary operator. Functions, fields and constants are
   * offered; operators are suppressed.
   */
  expectValue: boolean;
  /**
   * The caret follows a complete operand (`)`, a number, a string, an
   * identifier): a binary operator is expected next, so value tokens are
   * suppressed.
   */
  expectOperator: boolean;
  /**
   * The caret is inside a string literal (terminated or not) — suggestions are
   * suppressed entirely.
   */
  insideString: boolean;
  /**
   * The caret follows the A1 range operator (`A1:|`, `A1:D|`): a cell reference
   * is the only thing that can come next, so only column letters are offered.
   * Always `false` outside A1 notation, which has no range operator.
   */
  expectReference: boolean;
  /**
   * The caret sits strictly inside a complete reference token (`A1:D|5`) rather
   * than at either end of it. There is nothing to complete — the reference is
   * whole — so suggestions are suppressed.
   */
  insideReference: boolean;
  /**
   * The innermost enclosing function/special-form call, for signature help.
   * `argIndex` is the zero-based argument the caret is in.
   */
  functionContext: { name: string; argIndex: number } | null;
}

/**
 * Signatures and descriptions of the canonical special forms (dedicated AST
 * nodes, not registry functions — so they carry their metadata here).
 */
const SPECIAL_FORM_META: Record<string, { signature: string; description: string }> = {
  REF: {
    signature: 'REF(column, row)',
    description: 'A single cell, by a column reference and a row reference.',
  },
  COLUMN: { signature: 'COLUMN("field")', description: 'A column, by its field name.' },
  ROW: { signature: 'ROW(id)', description: 'A row, by its row id.' },
  COLUMN_POSITION: {
    signature: 'COLUMN_POSITION(index)',
    description: 'A column, by its 1-based position in the visible column order.',
  },
  ROW_POSITION: {
    signature: 'ROW_POSITION(index)',
    description: 'A row, by its 1-based position in the sorted and filtered rows.',
  },
  FIELD: {
    signature: 'FIELD("field name")',
    description: 'A same-row field by name. Use it for fields whose name is not a bare identifier.',
  },
  RANGE_REF: {
    signature: 'RANGE_REF(COLUMN_FROM(c1), ROW_FROM(r1), COLUMN_TO(c2), ROW_TO(r2))',
    description:
      'The inclusive rectangle of cells between two endpoints. An axis is a view position, ANCHOR(delta) for an offset from the formula cell, or FIXED(…) for an absolute position.',
  },
  COLUMN_FROM: {
    signature: 'COLUMN_FROM(index)',
    description: 'The starting column of a RANGE_REF() window, by 1-based view position.',
  },
  ROW_FROM: {
    signature: 'ROW_FROM(index)',
    description: 'The starting row of a RANGE_REF() window, by 1-based view position.',
  },
  COLUMN_TO: {
    signature: 'COLUMN_TO(index)',
    description: 'The ending column of a RANGE_REF() window, by 1-based view position.',
  },
  ROW_TO: {
    signature: 'ROW_TO(index)',
    description: 'The ending row of a RANGE_REF() window, by 1-based view position.',
  },
  FIXED: {
    signature: 'FIXED(axis)',
    description:
      'Makes a RANGE_REF() axis absolute — the canonical form of the A1 "$" prefix. It never adjusts, on fill or when the view order changes.',
  },
  ANCHOR: {
    signature: 'ANCHOR(delta)',
    description:
      'A RANGE_REF() axis as a signed offset from the cell that owns the formula — the canonical form of a plain (no "$") A1 range endpoint. The window moves with the formula.',
  },
  COLUMN_VALUES: {
    signature: 'COLUMN_VALUES("field")',
    description: 'Every value of a field over the current sorted and filtered rows.',
  },
};

const CONSTANT_NAMES = ['TRUE', 'FALSE'];
const SPECIAL_FORM_NAMES = FORMULA_RESERVED_NAMES.filter((name) => !CONSTANT_NAMES.includes(name));

/**
 * Falls back to a generic signature for custom functions that do not declare one.
 */
function buildDefaultSignature(definition: FormulaFunctionDefinition): string {
  if (definition.maxArgs === null) {
    return `${definition.name}(value1, value2, …)`;
  }
  if (definition.maxArgs <= 1) {
    return `${definition.name}(value)`;
  }
  const params: string[] = [];
  for (let i = 1; i <= definition.maxArgs; i += 1) {
    const param = `value${i}`;
    params.push(i > definition.minArgs ? `[${param}]` : param);
  }
  return `${definition.name}(${params.join(', ')})`;
}

/**
 * Builds the static completion vocabulary: registry functions (with whatever
 * optional metadata they declare — custom functions included), the canonical
 * special forms, the boolean constants and the binary operators. When no
 * registry is passed the built-in function set is used.
 */
export function getFormulaCompletionTokens(
  functions?: FormulaFunctionRegistry,
): FormulaCompletionToken[] {
  const tokens: FormulaCompletionToken[] = [];

  const definitions: FormulaFunctionDefinition[] = functions
    ? functions
        .names()
        .map((name) => functions.get(name))
        .filter((definition): definition is FormulaFunctionDefinition => definition !== undefined)
    : [...FORMULA_BUILT_IN_FUNCTIONS];
  for (const definition of definitions) {
    tokens.push({
      label: definition.name,
      insertText: definition.name,
      kind: 'function',
      callable: true,
      signature: definition.signature ?? buildDefaultSignature(definition),
      description: definition.description,
      category: definition.category ?? 'Functions',
    });
  }

  for (const name of SPECIAL_FORM_NAMES) {
    const meta = SPECIAL_FORM_META[name];
    tokens.push({
      label: name,
      insertText: name,
      kind: 'specialForm',
      callable: true,
      signature: meta?.signature,
      description: meta?.description,
      category: 'References',
    });
  }

  for (const name of CONSTANT_NAMES) {
    tokens.push({ label: name, insertText: name, kind: 'constant', category: 'Constants' });
  }

  for (const operator of Object.keys(FORMULA_BINARY_PRECEDENCE) as FormulaBinaryOperator[]) {
    tokens.push({ label: operator, insertText: operator, kind: 'operator', category: 'Operators' });
  }

  return tokens;
}

const VALUE_ENDING_TOKEN_TYPES = new Set<FormulaToken['type']>([
  'number',
  'string',
  'identifier',
  'reference',
]);

function isValueEndingToken(token: FormulaToken | null): boolean {
  if (token === null) {
    return false;
  }
  if (token.type === 'punctuation') {
    return token.value === ')';
  }
  return VALUE_ENDING_TOKEN_TYPES.has(token.type);
}

export interface FormulaCompletionContextOptions {
  /**
   * `true` when the expression is written in the A1 editor dialect, so that
   * `$A$1`, `A1:B2` and `A:A` are read as single references. The editor shows
   * whichever dialect the grid is configured for and completion must analyze
   * the same one — a canonical tokenization of A1 text stops dead at the first
   * `:` or `$` and reports a stale enclosing call for everything after it.
   * @default false
   */
  a1Notation?: boolean;
}

/**
 * Analyzes the caret in a formula expression (the source WITHOUT its leading
 * `=`) and returns the partial token, replace span, coarse value/operator
 * context, string-literal guard and enclosing call for signature help. Built on
 * a tolerant tokenization, so partial and malformed input is safe.
 */
export function getFormulaCompletionContext(
  expression: string,
  caret: number,
  options: FormulaCompletionContextOptions = {},
): FormulaCompletionContext {
  const clampedCaret = Math.max(0, Math.min(caret, expression.length));
  const { tokens } = tokenizeFormula(expression, {
    a1Notation: options.a1Notation,
    tolerant: true,
  });

  // String-literal guard: the caret is strictly inside a terminated string
  // (between the quotes), or anywhere past the opening quote of an unterminated
  // one — whose token runs to the end of the input, so its end counts as inside.
  let insideString = false;
  let insideReference = false;
  for (const token of tokens) {
    if (clampedCaret <= token.span.start) {
      // Tokens come in source order: nothing further back can contain the caret.
      break;
    }
    if (token.type === 'string') {
      // An unterminated literal spans to the end of the input, so every caret
      // past its opening quote — its span end included — is inside it.
      if (clampedCaret < token.span.end || token.unterminated === true) {
        insideString = true;
        break;
      }
    } else if (token.type === 'reference' && clampedCaret < token.span.end) {
      insideReference = true;
      break;
    }
  }

  // The partial identifier under the caret: an identifier token the caret is
  // inside of or sits right at the end of. The whole token is replaced; the
  // matching prefix is only the part the user has typed (start..caret).
  let token = '';
  let replaceStart = clampedCaret;
  let replaceEnd = clampedCaret;
  for (const candidate of tokens) {
    if (
      candidate.type === 'identifier' &&
      clampedCaret > candidate.span.start &&
      clampedCaret <= candidate.span.end
    ) {
      token = expression.slice(candidate.span.start, clampedCaret);
      replaceStart = candidate.span.start;
      replaceEnd = candidate.span.end;
      break;
    }
  }

  const hasPartialToken = token !== '';
  const boundary = hasPartialToken ? replaceStart : clampedCaret;
  let previousToken: FormulaToken | null = null;
  for (const candidate of tokens) {
    if (candidate.span.end <= boundary) {
      previousToken = candidate;
    } else {
      break;
    }
  }

  const expectOperator = !insideString && !hasPartialToken && isValueEndingToken(previousToken);
  const expectValue = !insideString && !expectOperator;
  // A `:` survives as its own token only when it did not join two references,
  // i.e. the range's end is still being typed (`A1:` or `A1:D`).
  const expectReference =
    expectValue &&
    previousToken !== null &&
    previousToken.type === 'punctuation' &&
    previousToken.value === ':';

  // Enclosing-call stack for signature help: walk tokens that start before the
  // caret, tracking parenthesis depth. An identifier immediately before a `(`
  // names the call; commas advance the current call's argument index.
  const callStack: { name: string | null; argIndex: number }[] = [];
  for (let i = 0; i < tokens.length; i += 1) {
    const current = tokens[i];
    if (current.span.start >= clampedCaret) {
      break;
    }
    if (current.type === 'punctuation') {
      if (current.value === '(') {
        const previous = tokens[i - 1];
        callStack.push({
          name: previous && previous.type === 'identifier' ? previous.value.toUpperCase() : null,
          argIndex: 0,
        });
      } else if (current.value === ')') {
        callStack.pop();
      } else if (current.value === ',' && callStack.length > 0) {
        callStack[callStack.length - 1].argIndex += 1;
      }
    }
  }
  let functionContext: FormulaCompletionContext['functionContext'] = null;
  for (let i = callStack.length - 1; i >= 0; i -= 1) {
    if (callStack[i].name !== null) {
      functionContext = { name: callStack[i].name!, argIndex: callStack[i].argIndex };
      break;
    }
  }

  return {
    token,
    replaceStart,
    replaceEnd,
    expectValue,
    expectOperator,
    insideString,
    expectReference,
    insideReference,
    functionContext,
  };
}

export interface RankFormulaCompletionsOptions {
  /**
   * Maximum number of ranked suggestions to return.
   * @default 8
   */
  limit?: number;
}

const KIND_TIER: Record<FormulaCompletionKind, number> = {
  field: 6,
  function: 5,
  specialForm: 3,
  constant: 2,
  operator: 2,
  columnLetter: 1,
};

/**
 * Prefix-match strength: an exact (case-sensitive) prefix beats a
 * case-insensitive prefix beats a substring; no match scores 0.
 */
function prefixStrength(label: string, query: string, queryLower: string): number {
  if (query === '') {
    return 1;
  }
  if (label.startsWith(query)) {
    return 4;
  }
  const labelLower = label.toLowerCase();
  if (labelLower.startsWith(queryLower)) {
    return 3;
  }
  if (labelLower.includes(queryLower)) {
    return 2;
  }
  return 0;
}

/**
 * Pure ranking: filters the token list by the caret context's partial token and
 * orders by `prefix-match strength × category tier`. Suppresses operators in a
 * value position, value tokens in an operator position, everything but column
 * letters after the range operator, and everything inside a string literal,
 * inside a complete reference, or in an operator position with no typed prefix.
 */
export function rankFormulaCompletions(
  tokens: readonly FormulaCompletionToken[],
  context: FormulaCompletionContext,
  options: RankFormulaCompletionsOptions = {},
): FormulaCompletionToken[] {
  if (context.insideString || context.insideReference) {
    return [];
  }
  const query = context.token;
  // After a complete operand with no typed prefix there is nothing useful to
  // offer (the user needs an operator, which letters never match).
  if (context.expectOperator && query === '') {
    return [];
  }
  const queryLower = query.toLowerCase();

  const scored: { token: FormulaCompletionToken; score: number }[] = [];
  for (const token of tokens) {
    const isOperator = token.kind === 'operator';
    if (isOperator !== context.expectOperator) {
      // Operators only in operator position; value tokens only in value position.
      continue;
    }
    if (context.expectReference && token.kind !== 'columnLetter') {
      // Only a cell reference can close a range, and a column letter is the
      // only completion that starts one.
      continue;
    }
    const strength = prefixStrength(token.label, query, queryLower);
    if (strength === 0) {
      continue;
    }
    scored.push({ token, score: strength * 100 + KIND_TIER[token.kind] });
  }

  scored.sort((a, b) => b.score - a.score || a.token.label.localeCompare(b.token.label));
  return scored.slice(0, options.limit ?? 8).map((entry) => entry.token);
}
