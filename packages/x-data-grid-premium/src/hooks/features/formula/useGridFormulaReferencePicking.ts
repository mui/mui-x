'use client';
import * as React from 'react';
import { platform } from '@base-ui/utils/platform';
import type { RefObject } from '@mui/x-internals/types';
import { GRID_ACTIONS_COLUMN_TYPE, gridClasses, useGridEvent } from '@mui/x-data-grid-pro';
import type { GridEventListener, GridEvents } from '@mui/x-data-grid-pro';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { isPointerOnFillHandle } from '../cellSelection/useGridCellSelection';
import { FORMULA_ARGUMENT_SEPARATOR, isFormulaPendingPickValid } from './engine';
import type { FormulaPickMode } from './engine';
import type { GridFormulaPickEditable } from './gridFormulaInterfaces';
import { gridFormulaA1PositionContextSelector } from './gridFormulaPositionContext';
import { getFormulaReferenceTargetKey } from './gridFormulaReferenceHighlights';
import {
  applyFormulaPickFeedback,
  createFormulaPickTarget,
  getActiveFormulaPickEditable,
  getFormulaPendingPickOf,
  getFormulaPickActionForEditable,
  getFormulaPickAnchor,
  getFormulaPickOfCell,
  getPickedReferenceText,
  isFormulaReferencePickingEnabled,
} from './gridFormulaReferencePicking';
import type { FormulaPickCell, FormulaPickTarget } from './gridFormulaReferencePicking';

/**
 * Reference picking: while a formula is edited and the caret is where a
 * reference can be written, or on a reference, a click on a cell writes the
 * reference to that cell into the formula instead of ending the edit.
 *
 * - A drag writes the range between the cell of the mousedown and the cell
 *   under the pointer.
 * - Shift+click turns the reference at the caret into a range that ends on the
 *   clicked cell.
 * - Cmd+click (macOS) or Ctrl+click (elsewhere) adds the reference after the
 *   one at the caret, as one more argument of the function call.
 * - In the editor of the computed columns panel, every pick writes the name of
 *   the clicked column: a drag and a Shift+click are plain clicks there.
 *
 * Must be called before the other listeners of `cellMouseDown`, `cellClick`,
 * `rowClick` and `cellDoubleClick` are registered: a picking click skips them
 * with `defaultMuiPrevented` (no focus move, no selection, no fill, no edit
 * start).
 */
export const useGridFormulaReferencePicking = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    'formulaReferencePicking' | 'disableFormulas' | 'dataSource'
  >,
) => {
  const enabled = isFormulaReferencePickingEnabled(props);
  const removeMouseUpListener = React.useRef<(() => void) | null>(null);

  /**
   * Writes `prefix + reference` over `text.slice(start, end)` and makes the
   * reference the pending one.
   */
  const writePick = React.useCallback(
    (
      editable: GridFormulaPickEditable,
      text: string,
      span: { start: number; end: number },
      prefix: string,
      reference: string,
      target: FormulaPickTarget,
      anchor: FormulaPickCell,
      event: React.SyntheticEvent,
    ) => {
      const start = span.start + prefix.length;
      editable.getHandle()!.replaceRange(span.start, span.end, prefix + reference, event);
      apiRef.current.caches.formula!.referencePick.pending = {
        id: editable.ownerCell.id,
        field: editable.ownerCell.field,
        pick: {
          start,
          end: start + reference.length,
          text: text.slice(0, span.start) + prefix + reference + text.slice(span.end),
        },
        target,
        anchor,
      };
      // The next click replaces this reference: its rectangle is the solid one.
      applyFormulaPickFeedback(apiRef, true, target);
    },
    [apiRef],
  );

  const handleCellMouseDown = React.useCallback<GridEventListener<'cellMouseDown'>>(
    (params, event) => {
      const session = apiRef.current.caches.formula!.referencePick;
      // Every click starts with a mousedown: the gesture of the previous one is over.
      session.gesture = null;
      // Cmd on macOS, where Ctrl+click opens the context menu; Ctrl elsewhere.
      const appendKey = platform.os.mac ? event.metaKey : event.ctrlKey;
      // The other modifier clicks keep their regular behavior.
      if (
        !enabled ||
        event.button !== 0 ||
        event.altKey ||
        ((event.ctrlKey || event.metaKey) && !appendKey) ||
        (appendKey && event.shiftKey)
      ) {
        return;
      }
      // The fill handle of the cell selection keeps its corner of the cell.
      if (
        isPointerOnFillHandle(
          apiRef.current.getCellElement(params.id, params.field),
          event,
          apiRef.current.state.isRtl,
        )
      ) {
        return;
      }
      const editable = getActiveFormulaPickEditable(apiRef);
      const handle = editable?.getHandle();
      if (!editable || !handle || handle.isComposing()) {
        return;
      }
      const selection = handle.getSelection();
      if (selection === null) {
        return;
      }
      const { ownerCell, a1Notation } = editable;
      const text = handle.getText();
      let mode: FormulaPickMode = 'replace';
      if (event.shiftKey) {
        mode = 'extend';
      } else if (appendKey) {
        mode = 'append';
      }
      const action = getFormulaPickActionForEditable(apiRef, editable, text, selection, mode);
      if (action.type === 'none') {
        return;
      }
      const cell: FormulaPickCell = { field: params.field, rowId: params.id };
      const pick = getFormulaPickOfCell(apiRef, editable, cell);
      if (pick === null) {
        return;
      }
      let { reference, target } = pick;

      let anchor = cell;
      if (action.type === 'extend') {
        // The range starts where the reference at the caret starts: the cell of the mousedown
        // that wrote it, or its first cell when it was typed.
        const pending = getFormulaPendingPickOf(apiRef, editable);
        const isPending =
          pending !== null && isFormulaPendingPickValid(text, selection, pending.pick);
        const rangeAnchor = isPending
          ? pending.anchor
          : getFormulaPickAnchor(apiRef, editable, text, action);
        const rangeTarget =
          rangeAnchor === null
            ? null
            : createFormulaPickTarget(
                gridFormulaA1PositionContextSelector(apiRef),
                rangeAnchor,
                cell,
              );
        const rangeReference =
          rangeTarget === null
            ? null
            : getPickedReferenceText(apiRef, ownerCell, rangeTarget, { a1Notation });
        // Without a range (the reference is a whole column, or is not in the view), the click
        // replaces the reference like a plain one.
        if (rangeAnchor !== null && rangeTarget !== null && rangeReference !== null) {
          anchor = rangeAnchor;
          target = rangeTarget;
          reference = rangeReference;
        }
      }

      // The focus and the caret stay in the editor.
      event.preventDefault();
      event.defaultMuiPrevented = true;
      session.gesture = 'down';
      removeMouseUpListener.current?.();
      // Moving the pointer with the button down picks a range, not text.
      const root = apiRef.current.rootElementRef?.current;
      root?.classList.add(gridClasses['root--disableUserSelection']);
      // The grid handles the `mouseup` on the document. A listener on the window runs after it,
      // so the grid still sees the gesture as in progress and leaves the focus where it is.
      const view = event.currentTarget.ownerDocument.defaultView!;
      const handleMouseUp = () => {
        removeMouseUpListener.current = null;
        root?.classList.remove(gridClasses['root--disableUserSelection']);
        if (session.gesture === 'down') {
          session.gesture = 'up';
        }
      };
      view.addEventListener('mouseup', handleMouseUp, { once: true });
      removeMouseUpListener.current = () => {
        view.removeEventListener('mouseup', handleMouseUp);
        root?.classList.remove(gridClasses['root--disableUserSelection']);
      };

      let prefix = action.type === 'append' ? FORMULA_ARGUMENT_SEPARATOR : '';
      if (text.trim() === '') {
        // Only the panel picks into a cleared formula, which gets its `=` back.
        prefix = '=';
      }
      handle.closeSuggestions();
      writePick(editable, text, action, prefix, reference, target, anchor, event);
    },
    [apiRef, enabled, writePick],
  );

  // With the button down, the pending reference follows the pointer: it is the range between
  // the anchor of the pick and the cell under the pointer.
  const handleCellMouseOver = React.useCallback<GridEventListener<'cellMouseOver'>>(
    (params, event) => {
      const session = apiRef.current.caches.formula!.referencePick;
      if (session.gesture !== 'down') {
        return;
      }
      const editable = getActiveFormulaPickEditable(apiRef);
      const handle = editable?.getHandle();
      const pending = editable ? getFormulaPendingPickOf(apiRef, editable) : null;
      // The text is the one the pick left: nothing was typed since, and the editor shows it.
      if (!editable || !handle || pending === null || handle.getText() !== pending.pick.text) {
        return;
      }
      // The panel builds no range: its pick stays the column of the mousedown.
      if (editable.kind === 'panel') {
        return;
      }
      if (apiRef.current.getColumn(params.field)?.type === GRID_ACTIONS_COLUMN_TYPE) {
        return;
      }
      const { ownerCell, a1Notation } = editable;
      const target = createFormulaPickTarget(
        gridFormulaA1PositionContextSelector(apiRef),
        pending.anchor,
        { field: params.field, rowId: params.id },
      );
      if (
        target === null ||
        getFormulaReferenceTargetKey(target) === getFormulaReferenceTargetKey(pending.target)
      ) {
        return;
      }
      const reference = getPickedReferenceText(apiRef, ownerCell, target, { a1Notation });
      if (reference === null) {
        return;
      }
      writePick(
        editable,
        pending.pick.text,
        pending.pick,
        '',
        reference,
        target,
        pending.anchor,
        event,
      );
    },
    [apiRef, writePick],
  );

  // The `click` and `dblclick` that follow a picking mousedown belong to the pick.
  const skipPickClick = React.useCallback<
    GridEventListener<'cellClick' | 'rowClick' | 'cellDoubleClick'>
  >(
    (params, event) => {
      if (apiRef.current.caches.formula!.referencePick.gesture !== null) {
        event.defaultMuiPrevented = true;
      }
    },
    [apiRef],
  );

  useGridEvent(apiRef, 'cellMouseDown', handleCellMouseDown);
  useGridEvent(apiRef, 'cellMouseOver', handleCellMouseOver);
  useGridEvent(apiRef, 'cellClick', skipPickClick as GridEventListener<GridEvents>);
  useGridEvent(apiRef, 'rowClick', skipPickClick as GridEventListener<GridEvents>);
  useGridEvent(apiRef, 'cellDoubleClick', skipPickClick as GridEventListener<GridEvents>);

  React.useEffect(
    () => () => {
      removeMouseUpListener.current?.();
      removeMouseUpListener.current = null;
    },
    [],
  );
};
