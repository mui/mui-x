import { FORMULA_RESERVED_NAMES } from './formulaAst';
import { getFormulaCompletionContext } from './formulaCompletion';
import { tokenizeFormula } from './formulaTokenizer';
import { isFormulaSource } from './formulaTypes';

/**
 * A text selection in EDITOR coordinates (offsets into the shown text,
 * including its leading `=`). A caret is a collapsed selection (`start === end`).
 */
export interface FormulaPickSelection {
  start: number;
  end: number;
}

/**
 * The reference inserted by the previous pick, while it can still be replaced
 * by the next one.
 */
export interface FormulaPendingPick {
  /**
   * Span of the picked reference in EDITOR coordinates.
   */
  start: number;
  end: number;
  /**
   * The whole editor text right after the pick. Any later edit makes the text
   * differ, which finalizes the reference.
   */
  text: string;
}

/**
 * What the click asks for:
 *
 * - `replace`: a plain click.
 * - `append`: the click adds one more reference to a list of arguments
 *   (Ctrl/Cmd+click).
 * - `extend`: the click turns the reference at the caret into a range that
 *   ends on the clicked cell (Shift+click).
 */
export type FormulaPickMode = 'replace' | 'append' | 'extend';

export type FormulaPickAction =
  | {
      /**
       * `insert`: a new reference goes at the caret (`start === end`).
       * `replace`: the reference takes the place of `text.slice(start, end)` —
       * the pending pick, the reference at the caret or the selected text.
       * `append`: a new reference goes right after the reference that ends at
       * `start` (`start === end`), behind an argument separator.
       * `extend`: the reference `text.slice(start, end)` becomes a range from
       * its first cell to the clicked cell.
       */
      type: 'insert' | 'replace' | 'append' | 'extend';
      start: number;
      end: number;
    }
  | {
      /**
       * The click is not a pick: it keeps its regular behavior.
       */
      type: 'none';
    };

export interface FormulaPickActionOptions {
  /**
   * `true` when the editor shows the A1 dialect. Must match the dialect of
   * `text`, like the completion context.
   * @default false
   */
  a1Notation?: boolean;
  /**
   * Tells whether a bare name of the formula is a reference to a column (the
   * engine does not know the columns). Without it, a bare name is never
   * treated as a reference.
   * @param {string} name The name as written in the formula.
   * @returns {boolean} `true` when the name is a field.
   */
  isFieldName?: (name: string) => boolean;
  /**
   * What the click asks for. `append` and `extend` need a reference at the
   * caret (the pending pick or a complete reference); without one, and for
   * `append` outside the arguments of a function call, the click is a plain
   * one.
   * @default 'replace'
   */
  mode?: FormulaPickMode;
}

const NO_PICK: FormulaPickAction = { type: 'none' };

/**
 * `true` while the reference of the previous pick can still be replaced: the
 * text has not changed since the pick and the caret is still at its end.
 */
export function isFormulaPendingPickValid(
  text: string,
  selection: FormulaPickSelection,
  pending: FormulaPendingPick,
): boolean {
  return (
    pending.text === text &&
    pending.start >= 1 &&
    pending.end > pending.start &&
    pending.end <= text.length &&
    selection.start === selection.end &&
    selection.end === pending.end
  );
}

/**
 * The canonical forms that are a whole reference: a click replaces the call
 * with its arguments.
 */
const REFERENCE_FORMS = new Set(['REF', 'RANGE_REF', 'COLUMN_VALUES', 'FIELD']);

/**
 * The span (EDITOR coordinates) of the complete reference the caret touches:
 * the caret is inside it or at one of its ends. A reference is an A1 reference
 * (`B2`, `B2:C4`), a canonical reference form with its closing parenthesis
 * (`REF(COLUMN("price"), ROW(2))`) or a field name. `null` when the caret is
 * not on a reference.
 */
function getReferenceSpanAt(
  text: string,
  caret: number,
  a1Notation: boolean,
  isFieldName: ((name: string) => boolean) | undefined,
): { start: number; end: number } | null {
  const { tokens } = tokenizeFormula(text.slice(1), { a1Notation, tolerant: true });
  const offset = caret - 1;
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.span.start > offset) {
      break;
    }
    let end: number | null = null;
    if (token.type === 'reference') {
      end = token.span.end;
    } else if (token.type === 'identifier') {
      const next = tokens[index + 1];
      const isCall = next !== undefined && next.type === 'punctuation' && next.value === '(';
      if (!isCall) {
        end = isFieldName?.(token.value) ? token.span.end : null;
      } else if (REFERENCE_FORMS.has(token.value.toUpperCase())) {
        let depth = 0;
        for (let closing = index + 1; closing < tokens.length; closing += 1) {
          const candidate = tokens[closing];
          if (candidate.type === 'punctuation' && candidate.value === '(') {
            depth += 1;
          } else if (candidate.type === 'punctuation' && candidate.value === ')') {
            depth -= 1;
            if (depth === 0) {
              end = candidate.span.end;
              break;
            }
          }
        }
      }
    }
    if (end !== null && offset <= end) {
      return { start: token.span.start + 1, end: end + 1 };
    }
  }
  return null;
}

const RESERVED_NAMES = new Set(FORMULA_RESERVED_NAMES);

/**
 * `true` when `offset` (EDITOR coordinates) is directly inside the argument
 * list of a function call: the innermost parenthesis still open there belongs
 * to a call (`SUM(`), not to a group (`(`) and not to a reference form
 * (`REF(`).
 */
function isInsideCallArguments(text: string, offset: number, a1Notation: boolean): boolean {
  const { tokens } = tokenizeFormula(text.slice(1), { a1Notation, tolerant: true });
  const openCalls: boolean[] = [];
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.span.start >= offset - 1) {
      break;
    }
    if (token.type !== 'punctuation') {
      continue;
    }
    if (token.value === '(') {
      const previous = tokens[index - 1];
      openCalls.push(
        previous !== undefined &&
          previous.type === 'identifier' &&
          !RESERVED_NAMES.has(previous.value.toUpperCase()),
      );
    } else if (token.value === ')') {
      openCalls.pop();
    }
  }
  return openCalls.length > 0 && openCalls[openCalls.length - 1];
}

/**
 * `true` when the first token at or after `caret` (EDITOR coordinates) starts
 * an operand: a name, a number, a string, a reference or an opening
 * parenthesis. A reference written right before it would be glued to it
 * (`=|B2` → `=C3B2`).
 */
function isOperandNext(text: string, caret: number, a1Notation: boolean): boolean {
  const { tokens } = tokenizeFormula(text.slice(1), { a1Notation, tolerant: true });
  const next = tokens.find((token) => token.span.start >= caret - 1);
  if (next === undefined) {
    return false;
  }
  if (next.type === 'punctuation') {
    return next.value === '(';
  }
  return (
    next.type === 'identifier' ||
    next.type === 'number' ||
    next.type === 'string' ||
    next.type === 'reference'
  );
}

/**
 * `true` when a reference can be written at `caret` (EDITOR coordinates): the
 * caret is outside a string literal, in a value position (the start of the
 * expression, or right after an operator, `(`, `,` or the A1 `:`), neither on
 * a partially typed identifier nor inside a complete reference (`=pri|` and
 * `=B|2` are value positions for the tokenizer, but the user is editing a
 * name or a reference there), and not right before another operand (`=|B2`).
 */
function isReferenceExpectedAt(text: string, caret: number, a1Notation: boolean): boolean {
  const context = getFormulaCompletionContext(text.slice(1), caret - 1, { a1Notation });
  return (
    !context.insideString &&
    !context.insideReference &&
    context.expectValue &&
    context.token === '' &&
    !isOperandNext(text, caret, a1Notation)
  );
}

/**
 * Decides what a click on a grid cell does to the formula being edited.
 * Pure and tolerant: partial and malformed text is safe.
 *
 * 1. The text is not a formula → not a pick.
 * 2. The previous pick is still pending (the text has not changed since and
 *    the caret is still at its end) → the new reference replaces it.
 * 3. Some text is selected → the new reference replaces the selection, when a
 *    reference can be written at the start of the selection once the selected
 *    text is removed.
 * 4. The caret is on a complete reference (inside it or at one of its ends) →
 *    the new reference replaces it.
 * 5. A reference can be written at the caret → it is inserted there.
 * 6. Anything else (the caret follows or precedes an operand that is not a
 *    reference, sits inside a string or on a partially typed name) → not a
 *    pick.
 *
 * The `append` and `extend` modes change what happens to the reference of
 * rules 2 and 4: `extend` turns it into a range, and `append` keeps it and
 * adds a reference after it when it is an argument of a function call. In
 * every other case they behave like a plain click.
 */
export function getFormulaPickAction(
  text: string,
  selection: FormulaPickSelection,
  pending: FormulaPendingPick | null,
  options: FormulaPickActionOptions = {},
): FormulaPickAction {
  if (!isFormulaSource(text)) {
    return NO_PICK;
  }
  const a1Notation = options.a1Notation === true;
  const start = Math.max(0, Math.min(selection.start, selection.end, text.length));
  const end = Math.max(0, Math.min(Math.max(selection.start, selection.end), text.length));

  let reference: { start: number; end: number } | null;
  if (pending !== null && isFormulaPendingPickValid(text, { start, end }, pending)) {
    reference = { start: pending.start, end: pending.end };
  } else {
    // Offset 0 is before the leading `=`: writing there would stop the text
    // from being a formula.
    if (start < 1) {
      return NO_PICK;
    }

    if (start !== end) {
      const textWithoutSelection = text.slice(0, start) + text.slice(end);
      return isReferenceExpectedAt(textWithoutSelection, start, a1Notation)
        ? { type: 'replace', start, end }
        : NO_PICK;
    }

    reference = getReferenceSpanAt(text, start, a1Notation, options.isFieldName);
  }

  if (reference !== null) {
    if (options.mode === 'extend') {
      return { type: 'extend', start: reference.start, end: reference.end };
    }
    if (options.mode === 'append' && isInsideCallArguments(text, reference.start, a1Notation)) {
      return { type: 'append', start: reference.end, end: reference.end };
    }
    return { type: 'replace', start: reference.start, end: reference.end };
  }

  return isReferenceExpectedAt(text, start, a1Notation) ? { type: 'insert', start, end } : NO_PICK;
}
