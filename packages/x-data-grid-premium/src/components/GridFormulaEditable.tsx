'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import type { GridRowId, GridSlotProps } from '@mui/x-data-grid-pro';
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
import type { FormulaTextSegment } from '../hooks/features/formula/gridFormulaReferenceHighlights';
import {
  registerFormulaFocusSafeElement,
  unregisterFormulaFocusSafeElement,
} from '../hooks/features/formula/gridFormulaBarElements';
import {
  getCaretOffset,
  getSelectionOffsets,
  normalizeSingleLine,
  renderSegments,
  scrollCaretIntoView,
  setCaretOffset,
  setSelectionOffsets,
} from './formulaEditorCaret';

// The `contenteditable` itself. Its children are the colored token `<span>`s and
// plain text nodes, managed imperatively (`renderSegments`) — never by React — so
// the caret is never clobbered by reconciliation. `white-space: pre` keeps the
// single line intact; the browser auto-scrolls it to the caret, so there is no
// scroll-sync to maintain. It must NOT be `display: flex` (that would turn the
// inline text/spans into anonymous flex items and break `white-space: pre`).
// The reference palette CSS variables live directly on the editable so the
// colored token `<span>`s resolve wherever the editable is mounted (the in-cell
// floating surface or the formula bar).
const GridFormulaEditableRoot = styled('div')(({ theme }) => ({
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
  ...getFormulaReferencePaletteStyles(theme),
}));

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

/**
 * The edit value as the string the editor displays. Non-string values (e.g. a
 * number parsed from a plain edit) render through their string form; the
 * reference model treats them as non-formulas (no coloring).
 */
export function valueToText(value: unknown): string {
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
 * Imperative access the hosting component needs to the editable — entry focus,
 * caret placement, session bookkeeping, and closing the suggestion popup from
 * outside (e.g. when a column drag-resize starts).
 */
export interface GridFormulaEditableHandle {
  getRoot: () => HTMLDivElement | null;
  focus: (options?: FocusOptions) => void;
  /**
   * @returns {number | null} Character offset of the collapsed caret, or `null` when there is none.
   */
  getCaret: () => number | null;
  /**
   * Places the caret and scrolls it into view.
   * @param {number | null} offset The character offset, or `null` for the end of the text.
   */
  placeCaret: (offset: number | null) => void;
  /**
   * @returns {boolean} The engaged flag: `false` until the first real edit (seeding parks the caret at the end).
   */
  isEngaged: () => boolean;
  setEngaged: (engaged: boolean) => void;
  closeSuggestions: () => void;
}

export interface GridFormulaEditableProps {
  /** The text the editable displays — the single source of truth (controlled). */
  value: string;
  /**
   * The cell the text belongs to, for reference highlighting (self-references
   * are never highlighted) and the shared model. `null` disables highlighting.
   */
  ownerCell: { id: GridRowId; field: string } | null;
  /** Whether references are shown in A1 notation rather than the canonical dialect. */
  a1Notation: boolean;
  /** Whether the autocomplete suggestion popup is enabled. */
  suggestionsEnabled: boolean;
  /**
   * Hides the popup without touching its state — e.g. while the floating editor
   * is unfocused (row edit mode) or its row is virtualized out of the viewport.
   */
  popupDisabled?: boolean;
  /**
   * Renders the text non-editable (and not focusable) — the formula bar's state
   * for non-editable cells. Coloring still applies.
   */
  readOnly?: boolean;
  /** Stable DOM id prefix for the popup's listbox/options (aria wiring). */
  popupId: string;
  ariaLabel: string;
  className?: string;
  /**
   * Called on every user edit (typing, paste, IME commit, accepted suggestion).
   * The host writes the text to its store; the new text flows back through
   * `value`, and the rebuild effect restores the caret.
   * @param {string} text The normalized single-line text.
   * @param {number | null} caret The caret offset to restore after the rebuild.
   * @param {React.SyntheticEvent} event The originating event.
   */
  onValueChange: (text: string, caret: number | null, event: React.SyntheticEvent) => void;
  /**
   * Enter pressed while the popup is closed (or the accept was a no-op). The
   * newline is always prevented; when this is not provided the event keeps
   * propagating so an enclosing grid cell commits the edit.
   * @param {React.KeyboardEvent<HTMLDivElement>} event The keyboard event.
   */
  onCommitKey?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  /**
   * Escape pressed while the popup is closed.
   * @param {React.KeyboardEvent<HTMLDivElement>} event The keyboard event.
   */
  onCancelKey?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  /**
   * Runs inside the rebuild layout effect, after the colored children are
   * rendered and before the caret is restored — the hook for content-driven
   * geometry (the floating editor's grow-to-fit).
   * @param {HTMLDivElement} root The editable element.
   */
  onAfterRebuild?: (root: HTMLDivElement) => void;
  /**
   * Any user interaction that may have moved the caret (input, accept, keyup,
   * mouseup) — the floating editor mirrors these into its remount session.
   * @param {number | null} caret The caret offset after the interaction.
   */
  onInteraction?: (caret: number | null) => void;
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
}

/**
 * The single-layer formula text editor: a `contenteditable` whose children are
 * the colored reference token `<span>`s themselves, so the caret, the native
 * selection, and the colors share one element (nothing to keep aligned). It is a
 * controlled component — the host owns the value — and layers the autocomplete
 * popup (suggestions from `useGridFormulaAutocomplete`, highlight colors from
 * `useGridFormulaReferenceModel`). Caret save/restore around each rebuild,
 * IME-composition guarding and explicit paste/newline handling are the cost of
 * `contenteditable`; each is handled below. Shared by the in-cell floating
 * editor (`GridFormulaEditor`) and the formula bar.
 */
const GridFormulaEditable = React.forwardRef<GridFormulaEditableHandle, GridFormulaEditableProps>(
  function GridFormulaEditable(props, ref) {
    const {
      value,
      ownerCell,
      a1Notation,
      suggestionsEnabled,
      popupDisabled = false,
      readOnly = false,
      popupId,
      ariaLabel,
      className,
      onValueChange,
      onCommitKey,
      onCancelKey,
      onAfterRebuild,
      onInteraction,
      onBlur,
    } = props;
    const apiRef = useGridPrivateApiContext();
    const rootProps = useGridRootProps();

    const editableRef = React.useRef<HTMLDivElement | null>(null);
    // The caret to restore on the next rebuild (set by typing/accepting); `null`
    // means "no explicit caret — place at the end on entry, otherwise preserve".
    const pendingCaretRef = React.useRef<number | null>(null);
    // True while an IME composition is in flight: skip rebuilds so the DOM
    // mutation does not abort the composition.
    const composingRef = React.useRef(false);
    // Flips true on the first real edit. Before that, every rebuild (entry + the
    // source seeding) parks the caret at the end; after it, the caret is preserved.
    const engagedRef = React.useRef(false);
    // Set by an accepted suggestion so the rebuild that follows recomputes the
    // popup (e.g. shows the arguments right after `SUM(`).
    const refreshAfterRebuildRef = React.useRef(false);
    // The segments currently rendered into the DOM and the text they were built
    // from. Used to skip no-op recolors (identical content) and to tell a source
    // seeding (a text change) apart from a pure recolor (text unchanged) for
    // caret placement.
    const renderedSegmentsRef = React.useRef<FormulaTextSegment[]>([]);
    const renderedTextRef = React.useRef('');

    const model = useGridFormulaReferenceModel(apiRef, ownerCell, a1Notation, value);
    const segments = React.useMemo(
      () => buildFormulaTextSegments(value, model.references),
      [value, model.references],
    );

    const getSuggestions = useGridFormulaAutocomplete(apiRef, a1Notation);
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const [open, setOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [suggestion, setSuggestion] = React.useState<GridFormulaSuggestionState | null>(null);

    const options = React.useMemo(() => suggestion?.options ?? [], [suggestion]);
    const signatureHelp = suggestion?.signatureHelp ?? null;
    // The list only opens for a non-empty partial token (the user is actively
    // typing an identifier). An empty prefix — right after `=`, `(`, `,` or an
    // operator — shows at most signature help and never traps Enter/Tab, so a
    // completed formula commits on Enter instead of accepting a stray suggestion.
    const hasList = (suggestion?.token ?? '') !== '' && options.length > 0;
    const showPopup =
      suggestionsEnabled && !popupDisabled && open && (hasList || signatureHelp !== null);
    const activeDescendant =
      showPopup && hasList
        ? `${popupId}-option-${Math.min(activeIndex, options.length - 1)}`
        : undefined;

    /**
     * Recomputes the suggestions from the editor's current text and caret,
     * opening the popup when there is something to show. Only called from user
     * actions (typing, caret moves, accepting) — never on mount/focus.
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

    // The core: rebuild the colored children and restore the caret/selection on
    // every value or model change, inside a layout effect (before paint, no
    // flicker). Skipped while an IME composition is active.
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
      // Capture the whole selection (both edges) before the rebuild wipes the
      // DOM, so a recolor that does change the spans preserves a range, not just
      // the caret.
      const selection = isActive ? getSelectionOffsets(root) : null;
      const textChanged = value !== renderedTextRef.current;

      renderSegments(root, segments);
      renderedSegmentsRef.current = segments;
      renderedTextRef.current = value;

      // The content changed — let the host react to the new intrinsic size
      // (typing, paste, an accepted suggestion, and the source seeding all pass
      // through here). Pre-paint, so any growth and the new text land together.
      onAfterRebuild?.(root);

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
        // A recolor (or external value change) while the user is mid-edit: keep
        // the caret/selection where it was, do not snap it to the end.
        setSelectionOffsets(root, selection);
      } else {
        setCaretOffset(root, (root.textContent ?? '').length);
      }
      // The browser reveals the caret only for native typing; a programmatically
      // placed caret (entry seed, accepted suggestion) on a formula longer than
      // the box would otherwise sit out of view past the internal scroll.
      scrollCaretIntoView(root);

      if (refreshAfterRebuildRef.current) {
        refreshAfterRebuildRef.current = false;
        refresh(getCaretOffset(root));
      }
    }, [segments, value, refresh, onAfterRebuild]);

    // Keep the highlighted option scrolled into view.
    useEnhancedEffect(() => {
      if (!showPopup || !hasList) {
        return;
      }
      const node = document.getElementById(`${popupId}-option-${activeIndex}`);
      node?.scrollIntoView?.({ block: 'nearest' });
    }, [showPopup, hasList, activeIndex, popupId]);

    const runInput = React.useCallback(
      (event: React.SyntheticEvent) => {
        const root = editableRef.current;
        if (!root) {
          return;
        }
        engagedRef.current = true;
        const rawText = normalizeSingleLine(root.textContent ?? '');
        pendingCaretRef.current = getCaretOffset(root);
        onValueChange(rawText, pendingCaretRef.current, event);
        refresh(pendingCaretRef.current);
        onInteraction?.(pendingCaretRef.current);
      },
      [onInteraction, onValueChange, refresh],
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
        // `contenteditable="plaintext-only"` is unavailable below the Firefox
        // floor, so insert the plain text explicitly. `insertText` fires its own
        // `input` event (which runs the input pipeline); the manual fallback does
        // not, so it runs it itself.
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
        // Accepting an already-fully-typed token is a no-op — bail before touching
        // the pending-caret / refresh-after-rebuild flags (which would otherwise
        // stay set with no value change to consume them), mirroring the keydown
        // accept's guard.
        if (nextValue === source) {
          return;
        }
        engagedRef.current = true;
        pendingCaretRef.current = current.replaceStart + insertText.length;
        refreshAfterRebuildRef.current = true;
        onValueChange(nextValue, pendingCaretRef.current, event);
        onInteraction?.(pendingCaretRef.current);
      },
      [onInteraction, onValueChange, suggestion],
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
                // Accepting a token that is already fully typed is a no-op — let
                // the key reach the host so a completed formula commits / Tab
                // navigates.
                if (nextValue !== source) {
                  event.preventDefault();
                  event.stopPropagation();
                  acceptOption(option, event);
                  return;
                }
              }
              // No-op accept: fall through to the host. Enter must still not
              // insert a newline, but must keep its commit semantics.
              if (event.key === 'Enter') {
                event.preventDefault();
                onCommitKey?.(event);
              }
              return;
            }
            case 'Escape':
              // First Escape closes the list; a second (list closed) reaches the
              // host and cancels the edit.
              event.preventDefault();
              event.stopPropagation();
              setOpen(false);
              return;
            default:
              return;
          }
        }
        // Popup closed: keep the editor single-line. Enter must not insert a
        // newline but keeps its commit semantics (propagation for an enclosing
        // grid cell, or the host's explicit commit callback).
        if (event.key === 'Enter') {
          event.preventDefault();
          onCommitKey?.(event);
        } else if (event.key === 'Escape') {
          onCancelKey?.(event);
        }
      },
      [acceptOption, activeIndex, hasList, onCancelKey, onCommitKey, open, options, suggestion],
    );

    const handleKeyUp = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        // Any key may have moved the caret.
        const root = editableRef.current;
        onInteraction?.(root ? getCaretOffset(root) : null);
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
      [onInteraction, refresh],
    );

    // A click (or a drag-selection ending inside the editable) places the caret.
    const handleMouseUp = React.useCallback(() => {
      const root = editableRef.current;
      onInteraction?.(root ? getCaretOffset(root) : null);
    }, [onInteraction]);

    const handleBlur = React.useCallback(
      (event: React.FocusEvent<HTMLDivElement>) => {
        setOpen(false);
        onBlur?.(event);
      },
      [onBlur],
    );

    const handleEditableRef = React.useCallback((node: HTMLDivElement | null) => {
      editableRef.current = node;
      setAnchorEl(node);
    }, []);

    // The popup panel is body-portaled — a click RELEASED over an option lands
    // on the grid's document `mouseup` handler with a target outside every
    // grid-containment check and would clear the cell focus (stopping the edit
    // the popup belongs to) before the option's own click handler runs. The
    // panel registers itself as a focus-safe element for the `canUpdateFocus`
    // veto; the callback ref tracks the panel's mount/unmount (the popper only
    // mounts its children while open).
    const panelElementRef = React.useRef<HTMLDivElement | null>(null);
    const handlePanelRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        if (panelElementRef.current) {
          unregisterFormulaFocusSafeElement(apiRef, panelElementRef.current);
        }
        panelElementRef.current = node;
        if (node) {
          registerFormulaFocusSafeElement(apiRef, node);
        }
      },
      [apiRef],
    );

    React.useImperativeHandle(
      ref,
      () => ({
        getRoot: () => editableRef.current,
        focus: (options?: FocusOptions) => editableRef.current?.focus(options),
        getCaret: () => {
          const root = editableRef.current;
          return root ? getCaretOffset(root) : null;
        },
        placeCaret: (offset: number | null) => {
          const root = editableRef.current;
          if (!root) {
            return;
          }
          setCaretOffset(root, offset ?? (root.textContent ?? '').length);
          scrollCaretIntoView(root);
        },
        isEngaged: () => engagedRef.current,
        setEngaged: (engaged: boolean) => {
          engagedRef.current = engaged;
        },
        closeSuggestions: () => setOpen(false),
      }),
      [],
    );

    return (
      <React.Fragment>
        <GridFormulaEditableRoot
          ref={handleEditableRef}
          className={className}
          contentEditable={!readOnly}
          aria-readonly={readOnly || undefined}
          suppressContentEditableWarning
          role={suggestionsEnabled ? 'combobox' : 'textbox'}
          aria-label={ariaLabel}
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
          onMouseUp={handleMouseUp}
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
              ref={handlePanelRef}
              // Keep the editor focused when the panel is clicked, so clicking an
              // option does not blur the editable and end the edit.
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
      </React.Fragment>
    );
  },
);

export { GridFormulaEditable };
