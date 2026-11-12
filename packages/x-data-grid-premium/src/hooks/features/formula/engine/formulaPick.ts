import { getFormulaCompletionContext } from './formulaCompletion';
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

export type FormulaPickAction =
  | {
      /**
       * `insert`: a new reference goes at the caret (`start === end`).
       * `replace`: the reference takes the place of `text.slice(start, end)` —
       * the pending pick or the selected text.
       */
      type: 'insert' | 'replace';
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
}

const NO_PICK: FormulaPickAction = { type: 'none' };

function isPendingPickValid(
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
 * `true` when a reference can be written at `caret` (EDITOR coordinates): the
 * caret is outside a string literal, in a value position (the start of the
 * expression, or right after an operator, `(`, `,` or the A1 `:`), and neither
 * on a partially typed identifier nor inside a complete reference (`=pri|`
 * and `=B|2` are value positions for the tokenizer, but the user is editing a
 * name or a reference there).
 */
function isReferenceExpectedAt(text: string, caret: number, a1Notation: boolean): boolean {
  const context = getFormulaCompletionContext(text.slice(1), caret - 1, { a1Notation });
  return (
    !context.insideString && !context.insideReference && context.expectValue && context.token === ''
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
 * 4. A reference can be written at the caret → it is inserted there.
 * 5. Anything else (the caret follows a complete operand, sits inside a
 *    string, inside a reference or on a partially typed name) → not a pick.
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

  if (pending !== null && isPendingPickValid(text, { start, end }, pending)) {
    return { type: 'replace', start: pending.start, end: pending.end };
  }

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

  return isReferenceExpectedAt(text, start, a1Notation) ? { type: 'insert', start, end } : NO_PICK;
}
