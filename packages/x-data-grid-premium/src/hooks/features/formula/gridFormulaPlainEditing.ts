import type { RefObject } from '@mui/x-internals/types';
import type { GridColDef, GridRowId, GridValidRowModel } from '@mui/x-data-grid-pro';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { isEscapedFormulaSource, isFormulaSource } from './engine';

/**
 * Texts a native number input lets exist in its box: complete numbers plus the
 * partial states typed on the way there (`-`, `1.`, `.5`, `1e-`, …). The empty
 * string matches (everything is optional).
 */
const PARTIAL_NUMBER_TEXT_REGEX = /^[+-]?(\d+(\.\d*)?|\.\d*)?([eE][+-]?\d*)?$/;

function isTextRepresentable(colDef: GridColDef, text: string): boolean {
  if (colDef.allowFormulas && (text.startsWith('=') || text.startsWith("'"))) {
    // `=…` is a formula and a leading `'` may become an escaped literal
    // (`'=…`) — both must stay typeable in the formula editor.
    return true;
  }
  return PARTIAL_NUMBER_TEXT_REGEX.test(text);
}

/**
 * Whether an insertion into a formula editing surface must be neglected — the
 * behavior of the column's native editor: a number `<input>` ignores characters
 * that would make its text non-numeric. Only insertions that break a
 * representable text are rejected; deleting the `=` of a formula leaves text no
 * native editor could hold, and editing back out of that state stays free.
 */
export function shouldIgnorePlainEditInput(
  colDef: GridColDef | undefined,
  nextText: string,
  previousText: string,
): boolean {
  if (colDef?.type !== 'number') {
    return false;
  }
  return isTextRepresentable(colDef, previousText) && !isTextRepresentable(colDef, nextText);
}

/**
 * The text the column's parser is fed for a given editor text — what the
 * native editor would have reported. A number input reports the empty string
 * for text it cannot represent (`badInput`), never the text itself, which is
 * what keeps `NaN` out of the edit state.
 */
export function getPlainEditParserInput(text: string, colDef: GridColDef | undefined): string {
  if (colDef?.allowFormulas && (isFormulaSource(text) || isEscapedFormulaSource(text))) {
    return text;
  }
  if (colDef?.type === 'number' && Number.isNaN(Number(text))) {
    return '';
  }
  return text;
}

/**
 * Parses editor text to the edit-state value the way the column's native
 * editor would: formula sources pass through, and a number column never
 * produces `NaN` (non-numeric text parses as the empty string does).
 */
export function parsePlainEditValue(
  text: string,
  colDef: GridColDef | undefined,
  row: GridValidRowModel | null | undefined,
  apiRef: RefObject<GridPrivateApiPremium>,
): unknown {
  const parserInput = getPlainEditParserInput(text, colDef);
  if (colDef?.valueParser) {
    return colDef.valueParser(parserInput, row ?? undefined, colDef, apiRef);
  }
  return parserInput;
}

/**
 * The text a formula editing surface displays for the given edit-state value,
 * or `null` to fall back to the value's own string form. While the plain-edit
 * draft matches the cell AND the edit state still holds exactly the value the
 * draft parsed to, the surfaces show the typed text — the parser is lossy
 * mid-edit (`-` parses to `null`, `0.50` to `0.5`, `SUM(` after deleting the
 * leading `=` to `null`) and rendering its output back would rewrite what the
 * user is typing. An external edit-state write breaks the value match and the
 * draft goes inert on its own.
 */
export function getPlainEditDraftText(
  apiRef: RefObject<GridPrivateApiPremium>,
  id: GridRowId,
  field: string,
  editValue: unknown,
): string | null {
  const draft = apiRef.current.caches.formula!.plainEditDraft;
  if (
    draft !== null &&
    draft.id === id &&
    draft.field === field &&
    Object.is(draft.value, editValue)
  ) {
    return draft.text;
  }
  return null;
}
