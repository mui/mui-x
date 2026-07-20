'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import useForkRef from '@mui/utils/useForkRef';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { forwardRef } from '@mui/x-internals/forwardRef';
import {
  gridClasses,
  gridColumnLookupSelector,
  gridEditCellStateSelector,
  gridExpandedSortedRowIdsSelector,
  gridFocusCellSelector,
  gridRowsLookupSelector,
  gridVisibleColumnFieldsSelector,
  useGridEvent,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import type { GridEventListener, GridRowId } from '@mui/x-data-grid-pro';
import { focusElement, vars } from '@mui/x-data-grid/internals';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridPivotActiveSelector } from '../../hooks/features/pivoting/gridPivotingSelectors';
import { columnIndexToLetters, isFormulaSource } from '../../hooks/features/formula/engine';
import { gridFormulaA1PositionContextSelector } from '../../hooks/features/formula/gridFormulaPositionContext';
import { gridFormulaActiveEditSelector } from '../../hooks/features/formula/gridFormulaSelectors';
import { convertCanonicalToA1Display } from '../../hooks/features/formula/gridFormulaA1Transforms';
import { previewFormulaResult } from '../../hooks/features/formula/gridFormulaPreview';
import {
  registerFormulaFocusSafeElement,
  unregisterFormulaFocusSafeElement,
} from '../../hooks/features/formula/gridFormulaBarElements';
import type { GridFormulaResult } from '../../hooks/features/formula/gridFormulaInterfaces';
import { CellValueUpdater } from '../../hooks/features/clipboard/useGridClipboardImport';
import { GridFormulaEditable, valueToText } from '../GridFormulaEditable';
import type { GridFormulaEditableHandle } from '../GridFormulaEditable';

const FormulaBarRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FormulaBar',
})({
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  minHeight: 40,
  padding: vars.spacing(0, 0.75),
  gap: vars.spacing(1),
  borderBottom: `1px solid ${vars.colors.border.base}`,
  font: vars.typography.font.body,
  background: vars.colors.background.base,
});

const FormulaBarAddress = styled('div')({
  minWidth: 64,
  alignSelf: 'stretch',
  display: 'flex',
  alignItems: 'center',
  paddingInline: vars.spacing(1),
  borderInlineEnd: `1px solid ${vars.colors.border.base}`,
  color: vars.colors.foreground.muted,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const FormulaBarFx = styled('span')({
  fontStyle: 'italic',
  fontFamily: 'serif',
  fontWeight: 600,
  color: vars.colors.foreground.muted,
  userSelect: 'none',
});

const FormulaBarPreview = styled('div')({
  color: vars.colors.foreground.muted,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '30%',
  paddingInline: vars.spacing(1),
});

// A stable dummy cell so the edit-state subscription has constant args when no
// cell is active (the selector simply returns `null` for it).
const NO_CELL = { rowId: '__formula_bar_no_cell__', field: '__formula_bar_no_cell__' };

const PREVIEW_DEBOUNCE_MS = 150;

export interface FormulaBarProps extends React.HTMLAttributes<HTMLDivElement> {}

interface FormulaBarCell {
  id: GridRowId;
  field: string;
}

/**
 * An Excel-like formula bar for the Data Grid Premium formulas feature. It is a
 * permanently-open formula editor for the focused cell:
 *
 * - With the cell in view mode it edits a local draft — references are colored,
 *   the referenced cells are outlined in the grid, and the draft's would-be
 *   result is evaluated on the fly — and nothing is committed while typing
 *   (Enter, Tab, leaving the bar, or focusing another cell commits the draft;
 *   Escape discards it).
 * - With the cell in edit mode it is a live two-way mirror of the edit session,
 *   and interacting with the bar does not close the cell's editor.
 *
 * It renders on the default toolbar with `slotProps.toolbar.formulaBar`, can be
 * composed into a custom `<Toolbar />`, and — because it only needs the grid's
 * React context — can be portaled anywhere in the page with `createPortal`.
 *
 * It renders nothing when formulas are disabled (`disableFormulas`, a data
 * source, or active pivoting).
 *
 * Demos:
 *
 * - [Formula Bar](https://mui.com/x/react-data-grid/components/formula-bar/)
 *
 * API:
 *
 * - [FormulaBar API](https://mui.com/x/api/data-grid/formula-bar/)
 */
const FormulaBar = forwardRef<HTMLDivElement, FormulaBarProps>(function FormulaBar(props, ref) {
  const { className, onKeyDown, onMouseDown, ...other } = props;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const popupId = React.useId();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  // Registration for the `canUpdateFocus` veto follows the ELEMENT lifecycle
  // through this callback ref, not the component's: the bar stays mounted while
  // rendering `null` (formulas disabled, pivoting active) and must re-register
  // its fresh root element when it reappears.
  const handleRootRegistration = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (rootRef.current) {
        unregisterFormulaFocusSafeElement(apiRef, rootRef.current);
      }
      rootRef.current = node;
      if (node) {
        registerFormulaFocusSafeElement(apiRef, node);
      }
    },
    [apiRef],
  );
  const handleRef = useForkRef(handleRootRegistration, ref);
  const coreRef = React.useRef<GridFormulaEditableHandle | null>(null);

  const pivotActive = useGridSelector(apiRef, gridPivotActiveSelector);
  const enabled = !rootProps.disableFormulas && !rootProps.dataSource && !pivotActive;
  const a1Enabled = Boolean(rootProps.formulaA1Notation) && enabled;
  const suggestionsEnabled = enabled && !rootProps.disableFormulaAutocomplete;

  // ----- Active cell (retained across focus leaving the cells) -----

  const [activeCell, setActiveCell] = React.useState<FormulaBarCell | null>(() => {
    const focused = gridFocusCellSelector(apiRef);
    return focused === null ? null : { id: focused.id, field: focused.field };
  });

  const rowsLookup = useGridSelector(apiRef, gridRowsLookupSelector);
  const columnsLookup = useGridSelector(apiRef, gridColumnLookupSelector);
  const positionContext = useGridSelector(apiRef, gridFormulaA1PositionContextSelector);

  const cell =
    activeCell !== null &&
    rowsLookup[activeCell.id] !== undefined &&
    columnsLookup[activeCell.field] !== undefined
      ? activeCell
      : null;
  const colDef = cell === null ? undefined : columnsLookup[cell.field];
  const allowFormulas = Boolean(colDef?.allowFormulas) && enabled;

  // ----- Edit-state mirror (cell in edit mode) -----

  const editCellState = useGridSelector(
    apiRef,
    gridEditCellStateSelector,
    cell ? { rowId: cell.id, field: cell.field } : NO_CELL,
  );
  const isMirror = cell !== null && editCellState !== null;

  // ----- Local draft (cell in view mode) -----

  const [draft, setDraft] = React.useState<string | null>(null);
  // Synchronous mirror of `draft` for same-tick event cascades (see below).
  const draftRef = React.useRef<string | null>(null);
  // The display value the draft started from — the dirty check's baseline.
  const draftSeedRef = React.useRef('');
  const [preview, setPreview] = React.useState<GridFormulaResult | null>(null);
  const previewTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const displayValue = React.useMemo(() => {
    if (cell === null) {
      return '';
    }
    const formula = allowFormulas ? apiRef.current.getCellFormula(cell.id, cell.field) : null;
    if (formula !== null) {
      return a1Enabled ? convertCanonicalToA1Display(formula, apiRef) : formula;
    }
    const value = apiRef.current.getCellValue(cell.id, cell.field);
    return value == null ? '' : String(value);
    // rowsLookup: the raw source lives in row data; positionContext: A1 display
    // re-renders when the view order changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiRef, cell, allowFormulas, a1Enabled, rowsLookup, positionContext]);

  const text = isMirror ? valueToText(editCellState?.value) : (draft ?? displayValue);

  const isEditable =
    cell !== null &&
    Boolean(colDef?.editable) &&
    apiRef.current.isCellEditable(apiRef.current.getCellParams(cell.id, cell.field));
  const readOnly = !isEditable || (isMirror && rootProps.editMode === 'row');

  // ----- Draft lifecycle helpers -----

  const clearPreview = React.useCallback(() => {
    if (previewTimerRef.current !== null) {
      clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }
    setPreview(null);
  }, []);

  const schedulePreview = React.useCallback(
    (targetCell: FormulaBarCell, nextText: string) => {
      if (previewTimerRef.current !== null) {
        clearTimeout(previewTimerRef.current);
      }
      if (!allowFormulas || !isFormulaSource(nextText)) {
        previewTimerRef.current = null;
        setPreview(null);
        return;
      }
      previewTimerRef.current = setTimeout(() => {
        previewTimerRef.current = null;
        setPreview(previewFormulaResult(apiRef, targetCell, nextText, { a1Notation: a1Enabled }));
      }, PREVIEW_DEBOUNCE_MS);
    },
    [apiRef, allowFormulas, a1Enabled],
  );

  // Publishes the draft for the in-grid reference highlighting, and clears it —
  // only ever touching `formula.activeEdit` when the bar owns it (a `draft`
  // entry); the cell editor owns it during cell edits.
  const publishDraftHighlights = React.useCallback(
    (targetCell: FormulaBarCell, nextText: string) => {
      if (allowFormulas && isFormulaSource(nextText)) {
        apiRef.current.setFormulaActiveEdit({
          id: targetCell.id,
          field: targetCell.field,
          draft: nextText,
        });
        return;
      }
      const current = gridFormulaActiveEditSelector(apiRef);
      if (current !== null && current.draft !== undefined) {
        apiRef.current.setFormulaActiveEdit(null);
      }
    },
    [apiRef, allowFormulas],
  );

  const clearDraft = React.useCallback(() => {
    // The ref clears synchronously: the commit flow triggers `cellFocusIn` and
    // `blur` in the same tick, and their dirty checks must not see the old
    // draft (a stale ref would double-commit).
    draftRef.current = null;
    setDraft(null);
    draftSeedRef.current = '';
    clearPreview();
    coreRef.current?.setEngaged(false);
    const current = gridFormulaActiveEditSelector(apiRef);
    if (current !== null && current.draft !== undefined) {
      apiRef.current.setFormulaActiveEdit(null);
    }
  }, [apiRef, clearPreview]);

  // The commit is a programmatic one-cell paste: `CellValueUpdater` applies the
  // wrapped `pastedValueParser` (freezing bar-typed A1 references with a zero
  // offset), the `valueSetter`, the editability checks, `processRowUpdate`, and
  // — through the `clipboardPasteEnd` event — a single undo step.
  // `clipboardPasteStart` re-arms the formula paste origin, so relative
  // references anchor to the target cell itself.
  const commitDraft = React.useCallback(
    (targetCell: FormulaBarCell, nextText: string) => {
      apiRef.current.publishEvent('clipboardPasteStart', { data: [[nextText]] });
      const updater = new CellValueUpdater({
        apiRef,
        processRowUpdate: rootProps.processRowUpdate,
        onProcessRowUpdateError: rootProps.onProcessRowUpdateError,
        getRowId: rootProps.getRowId,
      });
      updater.updateCell({
        rowId: targetCell.id,
        field: targetCell.field,
        pastedCellValue: nextText,
      });
      updater.applyUpdates();
    },
    [apiRef, rootProps.processRowUpdate, rootProps.onProcessRowUpdateError, rootProps.getRowId],
  );

  // Refs for the event handlers below (subscribed once, must see live state).
  // `draftRef` is written synchronously at the draft's write sites — event
  // cascades (Enter → cellFocusIn → blur) run before React re-renders, and
  // their dirty checks must see the up-to-date draft.
  const cellRef = React.useRef(cell);
  cellRef.current = cell;

  const commitDraftIfDirty = React.useCallback(
    (targetCell: FormulaBarCell | null) => {
      const currentDraft = draftRef.current;
      if (targetCell === null || currentDraft === null || currentDraft === draftSeedRef.current) {
        return false;
      }
      commitDraft(targetCell, currentDraft);
      return true;
    },
    [commitDraft],
  );

  // ----- Focus movement (Excel: Enter → below, Tab → right) -----

  const focusCell = React.useCallback(
    (targetCell: FormulaBarCell) => {
      // Move the grid focus state AND the DOM focus explicitly: `setCellFocus`
      // never moves DOM focus to a different cell itself (`GridCell`'s focus
      // sync does — but it is vetoed while the bar holds the focus), and its
      // same-cell branch refuses to pull focus from outside the grid root (a
      // portaled bar).
      apiRef.current.setCellFocus(targetCell.id, targetCell.field);
      const element = apiRef.current.getCellElement(targetCell.id, targetCell.field);
      if (element) {
        focusElement(element, apiRef);
      }
    },
    [apiRef],
  );

  const moveFocus = React.useCallback(
    (from: FormulaBarCell, direction: 'below' | 'right' | 'left' | 'same') => {
      let targetId = from.id;
      let targetField = from.field;
      if (direction === 'below') {
        const rowIds = gridExpandedSortedRowIdsSelector(apiRef);
        const index = rowIds.indexOf(from.id);
        if (index !== -1 && index + 1 < rowIds.length) {
          targetId = rowIds[index + 1];
        }
      } else if (direction === 'right' || direction === 'left') {
        const fields = gridVisibleColumnFieldsSelector(apiRef);
        const index = fields.indexOf(from.field);
        const nextIndex = direction === 'right' ? index + 1 : index - 1;
        if (index !== -1 && nextIndex >= 0 && nextIndex < fields.length) {
          targetField = fields[nextIndex];
        }
      }
      focusCell({ id: targetId, field: targetField });
    },
    [apiRef, focusCell],
  );

  // ----- Editable wiring -----

  const handleValueChange = React.useCallback(
    (nextText: string, caret: number | null, event: React.SyntheticEvent) => {
      const targetCell = cellRef.current;
      if (targetCell === null || readOnly) {
        return;
      }
      if (isMirror) {
        // The same write path as the in-cell editor: parse plain values through
        // the column parser, let formula text pass through.
        const column = apiRef.current.getColumn(targetCell.field);
        const parsedValue = column.valueParser
          ? column.valueParser(nextText, apiRef.current.getRow(targetCell.id), column, apiRef)
          : nextText;
        apiRef.current.setEditCellValue(
          {
            id: targetCell.id,
            field: targetCell.field,
            value: parsedValue,
            unstable_skipValueParser: true,
          },
          event,
        );
      } else {
        if (draftRef.current === null) {
          draftSeedRef.current = displayValue;
        }
        draftRef.current = nextText;
        setDraft(nextText);
        publishDraftHighlights(targetCell, nextText);
      }
      schedulePreview(targetCell, nextText);
    },
    [apiRef, displayValue, isMirror, publishDraftHighlights, readOnly, schedulePreview],
  );

  // Invalidates any pending mirror-stop focus move (new interaction, cancel,
  // disablement, unmount).
  const moveTokenRef = React.useRef(0);

  const commitAndMove = React.useCallback(
    (direction: 'below' | 'right' | 'left') => {
      const targetCell = cellRef.current;
      if (targetCell === null || readOnly) {
        return;
      }
      if (isMirror) {
        clearPreview();
        apiRef.current.stopCellEditMode({ id: targetCell.id, field: targetCell.field });
        // The stop resolves asynchronously (editor validation, processRowUpdate)
        // and can be rejected, keeping the cell in edit mode — only move on when
        // the session actually ended, like the grid's own Enter handling. Bounded
        // poll; a rejected/slow stop simply loses the auto-advance.
        moveTokenRef.current += 1;
        const token = moveTokenRef.current;
        const tryMove = (attempt: number) => {
          if (token !== moveTokenRef.current) {
            return;
          }
          if (apiRef.current.getCellMode(targetCell.id, targetCell.field) === 'view') {
            moveFocus(targetCell, direction);
            return;
          }
          if (attempt < 50) {
            setTimeout(() => tryMove(attempt + 1), 10);
          }
        };
        tryMove(0);
        return;
      }
      commitDraftIfDirty(targetCell);
      clearDraft();
      moveFocus(targetCell, direction);
    },
    [apiRef, clearDraft, clearPreview, commitDraftIfDirty, isMirror, moveFocus, readOnly],
  );

  const handleCommitKey = React.useCallback(() => commitAndMove('below'), [commitAndMove]);

  const handleCancelKey = React.useCallback(() => {
    const targetCell = cellRef.current;
    if (targetCell === null) {
      return;
    }
    moveTokenRef.current += 1;
    if (isMirror) {
      clearPreview();
      apiRef.current.stopCellEditMode({
        id: targetCell.id,
        field: targetCell.field,
        ignoreModifications: true,
      });
    } else {
      clearDraft();
    }
    focusCell(targetCell);
  }, [apiRef, clearDraft, clearPreview, focusCell, isMirror]);

  const handleRootKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      // Tab with the suggestion popup open is consumed by the editable
      // (stopPropagation) — reaching here means "commit and move" (Excel:
      // Tab → right, Shift+Tab → left).
      if (event.key === 'Tab' && !event.defaultPrevented && cellRef.current !== null) {
        event.preventDefault();
        commitAndMove(event.shiftKey ? 'left' : 'right');
      }
    },
    [commitAndMove, onKeyDown],
  );

  // Clicking the bar's own chrome (address box, fx, preview, padding) must not
  // blur the editable — the blur would force-commit a dirty draft and drop the
  // caret mid-edit (the floating surface has the identical guard).
  const handleRootMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onMouseDown?.(event);
      const editable = coreRef.current?.getRoot();
      if (editable && !editable.contains(event.target as Node)) {
        event.preventDefault();
      }
    },
    [onMouseDown],
  );

  const handleBlur = React.useCallback(() => {
    // Excel's Enter-mode semantics: leaving the bar commits the pending draft;
    // Escape is the only discard. A mirrored cell edit stays alive (the
    // `canUpdateFocus` veto) or commits through the grid's own outside-click
    // handling.
    if (!isMirror) {
      commitDraftIfDirty(cellRef.current);
    }
    clearDraft();
    clearPreview();
  }, [clearDraft, clearPreview, commitDraftIfDirty, isMirror]);

  // ----- Grid events -----

  const handleCellFocusIn = React.useCallback<GridEventListener<'cellFocusIn'>>(
    (params) => {
      const previous = cellRef.current;
      if (previous !== null && (previous.id !== params.id || previous.field !== params.field)) {
        // A dirty draft commits to the cell it was written for (the pointer
        // path already committed on blur — the draft is cleared by then).
        commitDraftIfDirty(previous);
        clearDraft();
        clearPreview();
        coreRef.current?.setEngaged(false);
      }
      setActiveCell({ id: params.id, field: params.field });
    },
    [clearDraft, clearPreview, commitDraftIfDirty],
  );
  useGridEvent(apiRef, 'cellFocusIn', handleCellFocusIn);

  // ----- Disablement + unmount cleanup -----

  // Formulas turning unavailable mid-draft (pivot activated, `disableFormulas`
  // flipped, a data source set): drop the in-flight draft — committing it later
  // against a re-enabled grid would write stale text, and the highlight draft
  // must not linger as a ghost overlay.
  useEnhancedEffect(() => {
    if (!enabled) {
      moveTokenRef.current += 1;
      clearDraft();
    }
  }, [enabled, clearDraft]);

  React.useEffect(() => {
    // The api instance is stable for the grid's lifetime — capture it so the
    // unmount cleanup does not read the ref after it may have been detached.
    const api = apiRef.current;
    return () => {
      moveTokenRef.current += 1;
      if (previewTimerRef.current !== null) {
        clearTimeout(previewTimerRef.current);
      }
      const current = gridFormulaActiveEditSelector(apiRef);
      if (current !== null && current.draft !== undefined) {
        api.setFormulaActiveEdit(null);
      }
    };
  }, [apiRef]);

  // ----- Address (name box) -----

  const address = React.useMemo(() => {
    if (cell === null) {
      return '';
    }
    const rowPosition = positionContext.getPositionOfRowId(cell.id);
    if (a1Enabled) {
      const columnPosition = positionContext.getPositionOfField(cell.field);
      if (columnPosition !== undefined && rowPosition !== undefined) {
        return `${columnIndexToLetters(columnPosition)}${rowPosition}`;
      }
    }
    const label = colDef?.headerName ?? cell.field;
    return rowPosition === undefined ? label : `${label} ${rowPosition}`;
  }, [cell, colDef, a1Enabled, positionContext]);

  if (!enabled) {
    return null;
  }

  return (
    <FormulaBarRoot
      {...other}
      ref={handleRef}
      role="group"
      aria-label={apiRef.current.getLocaleText('formulaBarLabel')}
      className={clsx(gridClasses.formulaBar, className)}
      onKeyDown={handleRootKeyDown}
      onMouseDown={handleRootMouseDown}
    >
      <FormulaBarAddress
        // `note` allows naming the element — aria-label is ignored on a plain div.
        role="note"
        aria-label={apiRef.current.getLocaleText('formulaBarAddressLabel')}
      >
        {address}
      </FormulaBarAddress>
      <FormulaBarFx aria-hidden>fx</FormulaBarFx>
      <GridFormulaEditable
        ref={coreRef}
        value={text}
        ownerCell={cell}
        a1Notation={a1Enabled}
        suggestionsEnabled={suggestionsEnabled && allowFormulas}
        readOnly={readOnly}
        popupId={popupId}
        ariaLabel={apiRef.current.getLocaleText('formulaBarInputLabel')}
        onValueChange={handleValueChange}
        onCommitKey={handleCommitKey}
        onCancelKey={handleCancelKey}
        onBlur={handleBlur}
      />
      {preview !== null && (
        <FormulaBarPreview role="status">
          {preview.type === 'error' ? preview.code : `= ${String(preview.value ?? '')}`}
        </FormulaBarPreview>
      )}
    </FormulaBarRoot>
  );
});

export { FormulaBar };
