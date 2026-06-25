'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { gridEditCellStateSelector, useGridSelector } from '@mui/x-data-grid-pro';
import type { GridRenderEditCellParams, GridSlotProps } from '@mui/x-data-grid-pro';
import { NotRendered, vars } from '@mui/x-data-grid/internals';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import type { FormulaCompletionToken } from '../hooks/features/formula/engine';
import { useGridFormulaAutocomplete } from '../hooks/features/formula/gridFormulaAutocomplete';
import type { GridFormulaSuggestionState } from '../hooks/features/formula/gridFormulaAutocomplete';
import {
  buildFormulaTextSegments,
  getFormulaReferencePaletteStyles,
  useGridFormulaReferenceModel,
} from '../hooks/features/formula/gridFormulaReferenceHighlights';
import {
  getCaretOffset,
  getSelectionOffsets,
  normalizeSingleLine,
  renderSegments,
  setCaretOffset,
  setSelectionOffsets,
} from './formulaEditorCaret';
import type { FormulaTextSegment } from '../hooks/features/formula/gridFormulaReferenceHighlights';

// The editor root. Replaces `GridEditInputCell` for formula cells: it matches the
// edit-input metrics (`font: body`, `padding: 1px 0`, inner `padding: 0 16px`) so
// the cell looks identical, vertically centers the single editable line, and hosts
// the palette CSS vars the colored tokens resolve against (light/dark).
const GridFormulaEditorRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FormulaEditor',
})(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  padding: '1px 0',
  boxSizing: 'border-box',
  font: vars.typography.font.body,
  color: (theme.vars || theme).palette.text.primary,
  ...getFormulaReferencePaletteStyles(theme),
}));

// The `contenteditable` itself. Its children are the colored token `<span>`s and
// plain text nodes, managed imperatively (`renderSegments`) — never by React — so
// the caret is never clobbered by reconciliation. `white-space: pre` keeps the
// single line intact; the browser auto-scrolls it to the caret, so there is no
// scroll-sync to maintain. It must NOT be `display: flex` (that would turn the
// inline text/spans into anonymous flex items and break `white-space: pre`).
const GridFormulaEditorEditable = styled('div')({
  flex: 1,
  minWidth: 0,
  padding: '0 10px',
  whiteSpace: 'pre',
  overflowX: 'auto',
  outline: 'none',
  cursor: 'text',
  // Formulas always read from the start edge (left in LTR, right in RTL): align to
  // `start` even in a right-aligned (`type: 'number'`) column, which would
  // otherwise push the text to the far edge away from where it is typed.
  textAlign: 'start',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
});

const GridFormulaEditorPopper = styled(NotRendered<GridSlotProps['basePopper']>, {
  name: 'MuiDataGrid',
  slot: 'FormulaAutocompletePopper',
})({
  zIndex: vars.zIndex.menu,
});

const GridFormulaEditorPanel = styled('div')(({ theme }) => ({
  minWidth: 220,
  maxWidth: 360,
  background: (theme.vars || theme).palette.background.paper,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderRadius: (theme.vars || theme).shape.borderRadius,
  boxShadow: (theme.vars || theme).shadows[4],
  boxSizing: 'border-box',
  overflow: 'hidden',
}));

const GridFormulaEditorSignature = styled('div')(({ theme }) => ({
  ...theme.typography.caption,
  padding: '6px 10px',
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  color: (theme.vars || theme).palette.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const GridFormulaEditorList = styled('ul')({
  listStyle: 'none',
  margin: 0,
  padding: 4,
  maxHeight: 240,
  overflowY: 'auto',
});

const GridFormulaEditorOption = styled('li')(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 8,
  padding: '4px 8px',
  borderRadius: (theme.vars || theme).shape.borderRadius,
  cursor: 'pointer',
  ...theme.typography.body2,
  '&[data-focused="true"]': {
    background: (theme.vars || theme).palette.action.hover,
  },
}));

const GridFormulaEditorOptionLabel = styled('span')({
  fontVariantLigatures: 'none',
  whiteSpace: 'nowrap',
});

const GridFormulaEditorOptionDetail = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export interface GridFormulaEditorProps extends GridRenderEditCellParams {
  /**
   * Whether references are shown in A1 notation (column letters / 1-based rows)
   * rather than the canonical `REF(...)` dialect.
   */
  a1Notation: boolean;
  /**
   * Whether the autocomplete suggestion popup is enabled. When `false`
   * (`disableFormulaAutocomplete`/`dataSource`) the same editor still colors
   * references — only the popup is suppressed.
   */
  suggestionsEnabled: boolean;
}

/**
 * The edit-state value as the string the editor displays. Non-string values
 * (e.g. a number parsed from a plain edit) render through their string form; the
 * reference model treats them as non-formulas (no coloring).
 */
function valueToText(value: unknown): string {
  if (value == null) {
    return '';
  }
  return typeof value === 'string' ? value : String(value);
}

/**
 * Whether two segment runs render identical content. A model change that produces
 * the same text and colors (a no-op recolor) can then skip the DOM rebuild
 * entirely, leaving the caret and any selection untouched.
 */
function segmentsEqual(a: FormulaTextSegment[], b: FormulaTextSegment[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let index = 0; index < a.length; index += 1) {
    if (a[index].text !== b[index].text || a[index].colorIndex !== b[index].colorIndex) {
      return false;
    }
  }
  return true;
}

/**
 * Single-layer formula editor: a `contenteditable` whose children are the colored
 * reference token `<span>`s themselves, so the caret, the native selection, and the
 * colors share one element (nothing to keep aligned). It renders inline in the cell,
 * derives its DOM from the edit-state value, syncs typed text back with no debounce,
 * and layers the autocomplete popup (suggestions from `useGridFormulaAutocomplete`,
 * the highlight colors from `useGridFormulaReferenceModel`). Caret save/restore
 * around each rebuild, IME-composition guarding and explicit paste/newline handling
 * are the cost of `contenteditable`; each is handled below.
 */
function GridFormulaEditor(props: GridFormulaEditorProps) {
  const { id, field, hasFocus, a1Notation, suggestionsEnabled } = props;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();

  const editableRef = React.useRef<HTMLDivElement | null>(null);
  // The caret to restore on the next rebuild (set by typing/accepting); `null`
  // means "no explicit caret — place at the end on entry, otherwise preserve".
  const pendingCaretRef = React.useRef<number | null>(null);
  // True while an IME composition is in flight: skip rebuilds so the DOM mutation
  // does not abort the composition.
  const composingRef = React.useRef(false);
  // Flips true on the first real edit. Before that, every rebuild (entry + the
  // source seeding) parks the caret at the end; after it, the caret is preserved.
  const engagedRef = React.useRef(false);
  // Set by an accepted suggestion so the rebuild that follows recomputes the popup
  // (e.g. shows the arguments right after `SUM(`).
  const refreshAfterRebuildRef = React.useRef(false);
  // The segments currently rendered into the DOM and the text they were built from.
  // Used to skip no-op recolors (identical content) and to tell a source seeding (a
  // text change) apart from a pure recolor (text unchanged) for caret placement.
  const renderedSegmentsRef = React.useRef<FormulaTextSegment[]>([]);
  const renderedTextRef = React.useRef('');

  const editState = useGridSelector(apiRef, gridEditCellStateSelector, { rowId: id, field });
  const text = valueToText(editState?.value);

  const model = useGridFormulaReferenceModel(apiRef, { id, field }, a1Notation);
  const segments = React.useMemo(
    () => buildFormulaTextSegments(text, model.references),
    [text, model.references],
  );

  const getSuggestions = useGridFormulaAutocomplete(apiRef, a1Notation);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [suggestion, setSuggestion] = React.useState<GridFormulaSuggestionState | null>(null);

  const options = React.useMemo(() => suggestion?.options ?? [], [suggestion]);
  const signatureHelp = suggestion?.signatureHelp ?? null;
  // The list only opens for a non-empty partial token (the user is actively typing
  // an identifier). An empty prefix — right after `=`, `(`, `,` or an operator —
  // shows at most signature help and never traps Enter/Tab, so a completed formula
  // commits on Enter instead of accepting a stray suggestion.
  const hasList = (suggestion?.token ?? '') !== '' && options.length > 0;
  const showPopup = suggestionsEnabled && hasFocus && open && (hasList || signatureHelp !== null);
  const popupId = `${id}-${field}-formula-autocomplete`;
  const activeDescendant =
    showPopup && hasList
      ? `${popupId}-option-${Math.min(activeIndex, options.length - 1)}`
      : undefined;

  const commit = React.useCallback(
    (nextValue: unknown, event?: React.SyntheticEvent) => {
      // Writes are NOT debounced: a debounced keystroke timer firing after an
      // accepted-suggestion immediate write would clobber it. Per-keystroke writes
      // are negligible for one editing cell.
      apiRef.current.setEditCellValue(
        { id, field, value: nextValue, unstable_skipValueParser: true },
        event,
      );
    },
    [apiRef, field, id],
  );

  /**
   * Recomputes the suggestions from the editor's current text and caret, opening
   * the popup when there is something to show. Only called from user actions
   * (typing, caret moves, accepting) — never on mount/focus.
   */
  const refresh = React.useCallback(
    (caretOverride?: number | null) => {
      if (!suggestionsEnabled) {
        return;
      }
      const root = editableRef.current;
      if (!root) {
        return;
      }
      const source = root.textContent ?? '';
      const caret = caretOverride ?? getCaretOffset(root) ?? source.length;
      const next = getSuggestions(source, caret);
      setSuggestion(next);
      setActiveIndex(0);
      const nextHasList = next !== null && next.token !== '' && next.options.length > 0;
      setOpen(next !== null && (nextHasList || next.signatureHelp !== null));
    },
    [getSuggestions, suggestionsEnabled],
  );

  // The core: rebuild the colored children and restore the caret/selection on every
  // value or model change, inside a layout effect (before paint, no flicker).
  // Skipped while an IME composition is active.
  useEnhancedEffect(() => {
    const root = editableRef.current;
    if (!root || composingRef.current) {
      return;
    }
    // A no-op recolor (identical text and colors) leaves the DOM, caret and any
    // selection untouched — nothing to rebuild.
    if (segmentsEqual(renderedSegmentsRef.current, segments)) {
      renderedSegmentsRef.current = segments;
      return;
    }

    const isActive = root.ownerDocument.activeElement === root;
    // Capture the whole selection (both edges) before the rebuild wipes the DOM, so
    // a recolor that does change the spans preserves a range, not just the caret.
    const selection = isActive ? getSelectionOffsets(root) : null;
    const textChanged = text !== renderedTextRef.current;

    renderSegments(root, segments);
    renderedSegmentsRef.current = segments;
    renderedTextRef.current = text;

    if (!isActive) {
      pendingCaretRef.current = null;
      return;
    }
    if (pendingCaretRef.current !== null) {
      // An edit (typing/accept) queued an explicit caret.
      setCaretOffset(root, pendingCaretRef.current);
      pendingCaretRef.current = null;
    } else if (textChanged && !engagedRef.current) {
      // Entry / source seeding before the first edit: caret to the end.
      setCaretOffset(root, (root.textContent ?? '').length);
    } else if (selection) {
      // A recolor (or external value change) while the user is mid-edit: keep the
      // caret/selection where it was, do not snap it to the end.
      setSelectionOffsets(root, selection);
    } else {
      setCaretOffset(root, (root.textContent ?? '').length);
    }

    if (refreshAfterRebuildRef.current) {
      refreshAfterRebuildRef.current = false;
      refresh(getCaretOffset(root));
    }
  }, [segments, text, refresh]);

  // Focus on entry and place the caret at the end (the rebuild effect handles the
  // caret on a later source seed). Runs on mount (the editor mounts when the surface
  // popper opens) and on focus acquisition.
  useEnhancedEffect(() => {
    const root = editableRef.current;
    if (!root || !hasFocus) {
      return;
    }
    if (root.ownerDocument.activeElement !== root) {
      root.focus();
    }
    // On entry (before the first edit), collapse any stray selection to the end —
    // a fresh edit starts with the caret at the end of the seeded formula, not a
    // select-all left over from the double-click/open gesture.
    if (!engagedRef.current) {
      setCaretOffset(root, (root.textContent ?? '').length);
    }
  }, [hasFocus]);

  // Keep the highlighted option scrolled into view.
  useEnhancedEffect(() => {
    if (!showPopup || !hasList) {
      return;
    }
    const node = document.getElementById(`${popupId}-option-${activeIndex}`);
    node?.scrollIntoView?.({ block: 'nearest' });
  }, [showPopup, hasList, activeIndex, popupId]);

  const runInput = React.useCallback(
    (event?: React.SyntheticEvent) => {
      const root = editableRef.current;
      if (!root) {
        return;
      }
      engagedRef.current = true;
      const rawText = normalizeSingleLine(root.textContent ?? '');
      const column = apiRef.current.getColumn(field);
      // Run the column's value parser exactly like the plain edit input: a formula
      // source passes through (the formula wrapper protects `=` strings), a plain
      // value is parsed to its typed form (e.g. a number on a number column) so the
      // commit stores the right type.
      const parsedValue = column.valueParser
        ? column.valueParser(rawText, apiRef.current.getRow(id), column, apiRef)
        : rawText;
      pendingCaretRef.current = getCaretOffset(root);
      commit(parsedValue, event);
      refresh(pendingCaretRef.current);
    },
    [apiRef, commit, field, id, refresh],
  );

  const handleInput = React.useCallback(
    (event: React.FormEvent<HTMLDivElement>) => {
      if (composingRef.current) {
        return;
      }
      runInput(event);
    },
    [runInput],
  );

  const handleCompositionStart = React.useCallback(() => {
    composingRef.current = true;
  }, []);

  const handleCompositionEnd = React.useCallback(
    (event: React.CompositionEvent<HTMLDivElement>) => {
      composingRef.current = false;
      runInput(event);
    },
    [runInput],
  );

  const handlePaste = React.useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      event.preventDefault();
      const root = editableRef.current;
      if (!root) {
        return;
      }
      const pasted = normalizeSingleLine(event.clipboardData.getData('text/plain'));
      // `contenteditable="plaintext-only"` is unavailable below the Firefox floor,
      // so insert the plain text explicitly. `insertText` fires its own `input`
      // event (which runs the input pipeline); the manual fallback does not, so it
      // runs it itself.
      if (root.ownerDocument.execCommand('insertText', false, pasted)) {
        return;
      }
      const caret = getCaretOffset(root) ?? (root.textContent ?? '').length;
      const current = root.textContent ?? '';
      root.textContent = current.slice(0, caret) + pasted + current.slice(caret);
      setCaretOffset(root, caret + pasted.length);
      runInput(event);
    },
    [runInput],
  );

  const acceptOption = React.useCallback(
    (option: FormulaCompletionToken, event: React.SyntheticEvent) => {
      const current = suggestion;
      const root = editableRef.current;
      if (!current || !root) {
        return;
      }
      const source = root.textContent ?? '';
      const insertText = option.insertText + (option.callable ? '(' : '');
      const nextValue =
        source.slice(0, current.replaceStart) + insertText + source.slice(current.replaceEnd);
      // Accepting an already-fully-typed token is a no-op — bail before touching the
      // pending-caret / refresh-after-rebuild flags (which would otherwise stay set
      // with no commit to consume them), mirroring the keydown accept's guard.
      if (nextValue === source) {
        return;
      }
      engagedRef.current = true;
      pendingCaretRef.current = current.replaceStart + insertText.length;
      refreshAfterRebuildRef.current = true;
      commit(nextValue, event);
    },
    [commit, suggestion],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (open && hasList) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            event.stopPropagation();
            setActiveIndex((index) => (index + 1) % options.length);
            return;
          case 'ArrowUp':
            event.preventDefault();
            event.stopPropagation();
            setActiveIndex((index) => (index - 1 + options.length) % options.length);
            return;
          case 'Enter':
          case 'Tab': {
            const option = options[Math.min(activeIndex, options.length - 1)];
            const root = editableRef.current;
            if (option && root && suggestion) {
              const source = root.textContent ?? '';
              const insertText = option.insertText + (option.callable ? '(' : '');
              const nextValue =
                source.slice(0, suggestion.replaceStart) +
                insertText +
                source.slice(suggestion.replaceEnd);
              // Accepting a token that is already fully typed is a no-op — let the
              // key reach the grid so a completed formula commits / Tab navigates.
              if (nextValue !== source) {
                event.preventDefault();
                event.stopPropagation();
                acceptOption(option, event);
                return;
              }
            }
            // No-op accept: fall through to the grid. Enter must still not insert a
            // newline, but must keep propagating so the grid commits.
            if (event.key === 'Enter') {
              event.preventDefault();
            }
            return;
          }
          case 'Escape':
            // First Escape closes the list; a second (list closed) propagates to
            // the grid and cancels the edit.
            event.preventDefault();
            event.stopPropagation();
            setOpen(false);
            return;
          default:
            return;
        }
      }
      // Popup closed: keep the editor single-line. Enter must not insert a newline
      // but must propagate so the grid commits the edit.
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    },
    [acceptOption, activeIndex, hasList, open, options, suggestion],
  );

  const handleKeyUp = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // A caret move without a value change can still change the suggestion
      // context.
      if (
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === 'Home' ||
        event.key === 'End'
      ) {
        refresh();
      }
    },
    [refresh],
  );

  const handleBlur = React.useCallback(() => setOpen(false), []);

  const handleEditableRef = React.useCallback((node: HTMLDivElement | null) => {
    editableRef.current = node;
    setAnchorEl(node);
  }, []);

  return (
    <GridFormulaEditorRoot className="MuiDataGrid-formulaEditor">
      <GridFormulaEditorEditable
        ref={handleEditableRef}
        contentEditable
        suppressContentEditableWarning
        role={suggestionsEnabled ? 'combobox' : 'textbox'}
        aria-multiline={false}
        aria-autocomplete={suggestionsEnabled ? 'list' : undefined}
        aria-haspopup={suggestionsEnabled ? 'listbox' : undefined}
        aria-expanded={suggestionsEnabled ? showPopup && hasList : undefined}
        aria-controls={showPopup && hasList ? `${popupId}-listbox` : undefined}
        aria-activedescendant={activeDescendant}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onPaste={handlePaste}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onBlur={handleBlur}
        /* No React children — managed imperatively by the rebuild effect. */
      />
      {suggestionsEnabled && (
        <GridFormulaEditorPopper
          as={rootProps.slots.basePopper}
          open={showPopup}
          target={anchorEl}
          placement="bottom-start"
          flip
        >
          <GridFormulaEditorPanel
            // Keep the editor focused when the panel is clicked, so clicking an
            // option does not blur the cell and commit the edit.
            onMouseDown={(event) => event.preventDefault()}
          >
            {signatureHelp !== null && (
              <GridFormulaEditorSignature>{signatureHelp.signature}</GridFormulaEditorSignature>
            )}
            {hasList && (
              <GridFormulaEditorList role="listbox" id={`${popupId}-listbox`}>
                {options.map((option, index) => (
                  <GridFormulaEditorOption
                    key={`${option.label}-${index}`}
                    id={`${popupId}-option-${index}`}
                    role="option"
                    data-focused={index === activeIndex}
                    aria-selected={index === activeIndex}
                    onMouseMove={() => setActiveIndex(index)}
                    onClick={(event) => acceptOption(option, event)}
                  >
                    <GridFormulaEditorOptionLabel>{option.label}</GridFormulaEditorOptionLabel>
                    {(option.detail || option.signature || option.category) && (
                      <GridFormulaEditorOptionDetail>
                        {option.detail || option.signature || option.category}
                      </GridFormulaEditorOptionDetail>
                    )}
                  </GridFormulaEditorOption>
                ))}
              </GridFormulaEditorList>
            )}
          </GridFormulaEditorPanel>
        </GridFormulaEditorPopper>
      )}
    </GridFormulaEditorRoot>
  );
}

export { GridFormulaEditor };
