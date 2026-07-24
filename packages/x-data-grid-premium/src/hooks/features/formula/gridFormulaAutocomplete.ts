import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { gridColumnLookupSelector } from '@mui/x-data-grid-pro';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import {
  FORMULA_RESERVED_NAMES,
  getFormulaCompletionContext,
  getFormulaCompletionTokens,
  isFormulaSource,
  rankFormulaCompletions,
} from './engine';
import type { FormulaCompletionToken } from './engine';
import {
  getFormulaColumnLetter,
  gridFormulaA1PositionContextSelector,
  gridFormulaReferenceableFieldsSelector,
} from './gridFormulaPositionContext';

/**
 * Signature help shown while the caret is inside a function/special-form call.
 */
export interface GridFormulaSignatureHelp {
  name: string;
  signature: string;
  description?: string;
  /**
   * Zero-based index of the argument the caret is in.
   */
  argIndex: number;
}

/**
 * The autocomplete state for one caret position, ready for the editor to render.
 */
export interface GridFormulaSuggestionState {
  /**
   * The partial token used for matching (`''` when none).
   */
  token: string;
  /**
   * Replace span in FULL source coordinates (including the leading `=`):
   * accepting a suggestion replaces `value.slice(replaceStart, replaceEnd)`.
   */
  replaceStart: number;
  replaceEnd: number;
  /**
   * Ranked suggestions for the caret.
   */
  options: FormulaCompletionToken[];
  /**
   * Signature help for the enclosing call, or `null`.
   */
  signatureHelp: GridFormulaSignatureHelp | null;
}

const RESERVED_NAME_SET = new Set(FORMULA_RESERVED_NAMES);
const BARE_IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;

/**
 * The reference text that resolves to `field` as a same-row reference. A field
 * whose name is not a bare identifier — or collides with a reserved name or a
 * boolean constant — must go through the `FIELD("…")` escape.
 */
export function toFormulaFieldReference(field: string): string {
  if (BARE_IDENTIFIER_REGEX.test(field) && !RESERVED_NAME_SET.has(field.toUpperCase())) {
    return field;
  }
  return `FIELD("${field.replace(/"/g, '""')}")`;
}

/**
 * Computes the ranked autocomplete suggestions for a formula source and caret
 * position. Returns `null` when the value is not a formula (so escaped `'=`
 * literals and plain values show nothing).
 *
 * Token sourcing (D20): the static vocabulary (functions from the cell's
 * registry — custom functions included — special forms, constants, operators)
 * plus same-row field references in both modes, plus A1 column letters when A1
 * notation is on. Ranking is the pure engine ranker.
 */
export function getFormulaSuggestions(
  apiRef: RefObject<GridPrivateApiPremium>,
  value: string,
  caret: number,
  a1NotationEnabled: boolean,
): GridFormulaSuggestionState | null {
  if (!isFormulaSource(value)) {
    return null;
  }
  // The editor value carries the leading `=`; the engine works on the
  // expression. Map the caret in and the replace span back out by one.
  const expression = value.slice(1);
  const expressionCaret = caret - 1;
  if (expressionCaret < 0) {
    return null;
  }

  const context = getFormulaCompletionContext(expression, expressionCaret);

  const staticTokens = getFormulaCompletionTokens(apiRef.current.caches.formula.registry);
  const columnLookup = gridColumnLookupSelector(apiRef);
  const fields = gridFormulaReferenceableFieldsSelector(apiRef);
  const positionContext = a1NotationEnabled ? gridFormulaA1PositionContextSelector(apiRef) : null;

  const columnTokens: FormulaCompletionToken[] = [];
  for (const field of fields) {
    const headerName = columnLookup[field]?.headerName;
    columnTokens.push({
      label: field,
      insertText: toFormulaFieldReference(field),
      kind: 'field',
      detail: headerName && headerName !== field ? headerName : undefined,
    });
    if (positionContext !== null) {
      const letter = getFormulaColumnLetter(positionContext, field);
      if (letter !== '') {
        columnTokens.push({
          label: letter,
          insertText: letter,
          kind: 'columnLetter',
          detail: headerName || field,
        });
      }
    }
  }

  const options = rankFormulaCompletions([...staticTokens, ...columnTokens], context);

  let signatureHelp: GridFormulaSignatureHelp | null = null;
  if (context.functionContext !== null) {
    const match = staticTokens.find(
      (token) =>
        (token.kind === 'function' || token.kind === 'specialForm') &&
        // `functionContext.name` is upper-cased by the engine (function names are
        // case-insensitive); token labels keep the registered casing, so compare
        // case-insensitively or signature help is lost for non-uppercase custom names.
        token.label.toUpperCase() === context.functionContext!.name &&
        token.signature !== undefined,
    );
    if (match) {
      signatureHelp = {
        name: match.label,
        signature: match.signature!,
        description: match.description,
        argIndex: context.functionContext.argIndex,
      };
    }
  }

  return {
    token: context.token,
    replaceStart: context.replaceStart + 1,
    replaceEnd: context.replaceEnd + 1,
    options,
    signatureHelp,
  };
}

export type GetFormulaSuggestions = (
  value: string,
  caret: number,
) => GridFormulaSuggestionState | null;

/**
 * Returns a stable callback computing autocomplete suggestions for the formula
 * editor. The suggestions read the current registry, visible fields and A1
 * position context through `apiRef` on each call (the editor is short-lived and
 * recomputes per keystroke), so no selector subscription is needed.
 */
export function useGridFormulaAutocomplete(
  apiRef: RefObject<GridPrivateApiPremium>,
  a1NotationEnabled: boolean,
): GetFormulaSuggestions {
  return React.useCallback(
    (value, caret) => getFormulaSuggestions(apiRef, value, caret, a1NotationEnabled),
    [apiRef, a1NotationEnabled],
  );
}
