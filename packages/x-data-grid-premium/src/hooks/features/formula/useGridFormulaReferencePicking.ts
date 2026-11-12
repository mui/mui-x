'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { useGridEvent } from '@mui/x-data-grid-pro';
import type { GridEventListener, GridEvents } from '@mui/x-data-grid-pro';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { getFormulaPickAction } from './engine';
import { toFormulaFieldReference } from './gridFormulaAutocomplete';
import {
  getActiveFormulaPickEditable,
  getPickedReferenceText,
} from './gridFormulaReferencePicking';

/**
 * Reference picking: while a formula is edited and the caret is where a
 * reference can be written, or on a reference, a click on a cell writes the
 * reference to that cell into the formula instead of ending the edit.
 *
 * Must be called before the other listeners of `cellMouseDown`, `cellClick`,
 * `rowClick` and `cellDoubleClick` are registered: a picking click skips them
 * with `defaultMuiPrevented` (no focus move, no selection, no edit start).
 */
export const useGridFormulaReferencePicking = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    'formulaReferencePicking' | 'disableFormulas' | 'dataSource'
  >,
) => {
  const enabled = !!props.formulaReferencePicking && !props.disableFormulas && !props.dataSource;
  const removeMouseUpListener = React.useRef<(() => void) | null>(null);

  const handleCellMouseDown = React.useCallback<GridEventListener<'cellMouseDown'>>(
    (params, event) => {
      const session = apiRef.current.caches.formula!.referencePick;
      // Every click starts with a mousedown: the gesture of the previous one is over.
      session.gesture = null;
      // Modifier clicks keep their regular behavior.
      if (
        !enabled ||
        event.button !== 0 ||
        event.shiftKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
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
      const { pending } = session;
      const action = getFormulaPickAction(
        text,
        selection,
        pending !== null && pending.id === ownerCell.id && pending.field === ownerCell.field
          ? pending.pick
          : null,
        {
          a1Notation,
          // A bare name is a reference when it is the name a click on that column writes.
          isFieldName: (name) =>
            apiRef.current.getColumn(name) != null &&
            toFormulaFieldReference(name, a1Notation) === name,
        },
      );
      if (action.type === 'none') {
        return;
      }
      const reference = getPickedReferenceText(
        apiRef,
        ownerCell,
        { kind: 'cell', field: params.field, rowId: params.id },
        { a1Notation },
      );
      if (reference === null) {
        return;
      }

      // The focus and the caret stay in the editor.
      event.preventDefault();
      event.defaultMuiPrevented = true;
      session.gesture = 'down';
      // The grid handles the `mouseup` on the document. A listener on the window runs after it,
      // so the grid still sees the gesture as in progress and leaves the focus where it is.
      removeMouseUpListener.current?.();
      const view = event.currentTarget.ownerDocument.defaultView!;
      const handleMouseUp = () => {
        removeMouseUpListener.current = null;
        if (session.gesture === 'down') {
          session.gesture = 'up';
        }
      };
      view.addEventListener('mouseup', handleMouseUp, { once: true });
      removeMouseUpListener.current = () => view.removeEventListener('mouseup', handleMouseUp);

      handle.closeSuggestions();
      handle.replaceRange(action.start, action.end, reference, event);
      session.pending = {
        id: ownerCell.id,
        field: ownerCell.field,
        pick: {
          start: action.start,
          end: action.start + reference.length,
          text: text.slice(0, action.start) + reference + text.slice(action.end),
        },
      };
    },
    [apiRef, enabled],
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
