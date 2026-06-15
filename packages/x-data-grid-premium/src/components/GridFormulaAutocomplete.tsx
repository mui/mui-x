'use client';
import * as React from 'react';
import useAutocomplete from '@mui/material/useAutocomplete';
import { styled } from '@mui/material/styles';
import setRef from '@mui/utils/setRef';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { gridClasses } from '@mui/x-data-grid';
import type { GridRenderEditCellParams, GridSlotProps } from '@mui/x-data-grid-pro';
import { NotRendered, vars } from '@mui/x-data-grid/internals';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import type { FormulaCompletionToken } from '../hooks/features/formula/engine';
import {
  useGridFormulaAutocomplete,
  type GridFormulaSuggestionState,
} from '../hooks/features/formula/gridFormulaAutocomplete';

const GridFormulaAutocompleteInput = styled(NotRendered<GridSlotProps['baseInput']>, {
  name: 'MuiDataGrid',
  slot: 'EditInputCell',
})({
  font: vars.typography.font.body,
  padding: '1px 0',
  '& input': {
    padding: '0 16px',
    height: '100%',
  },
});

const GridFormulaAutocompletePopper = styled(NotRendered<GridSlotProps['basePopper']>, {
  name: 'MuiDataGrid',
  slot: 'FormulaAutocompletePopper',
})({
  zIndex: vars.zIndex.menu,
});

const GridFormulaAutocompletePanel = styled('div')(({ theme }) => ({
  minWidth: 220,
  maxWidth: 360,
  background: (theme.vars || theme).palette.background.paper,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderRadius: (theme.vars || theme).shape.borderRadius,
  boxShadow: (theme.vars || theme).shadows[4],
  boxSizing: 'border-box',
  overflow: 'hidden',
}));

const GridFormulaAutocompleteSignature = styled('div')(({ theme }) => ({
  ...theme.typography.caption,
  padding: '6px 10px',
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  color: (theme.vars || theme).palette.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const GridFormulaAutocompleteList = styled('ul')({
  listStyle: 'none',
  margin: 0,
  padding: 4,
  maxHeight: 240,
  overflowY: 'auto',
});

const GridFormulaAutocompleteOption = styled('li')(({ theme }) => ({
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

const GridFormulaAutocompleteOptionLabel = styled('span')({
  fontVariantLigatures: 'none',
  whiteSpace: 'nowrap',
});

const GridFormulaAutocompleteOptionDetail = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export type GridFormulaAutocompleteProps = GridRenderEditCellParams;

/**
 * Formula text editor with a suggestion dropdown (D20). It renders the grid's
 * base input (so it stays visually identical to `GridEditInputCell`) and layers
 * a headless `useAutocomplete` listbox in a `basePopper`. Suggestions are
 * spliced at the caret into the free text — the whole value is never replaced —
 * and the popup intercepts Arrow/Enter/Tab/Escape so the grid does not navigate
 * or commit while it is open.
 */
function GridFormulaAutocomplete(props: GridFormulaAutocompleteProps) {
  const { id, value, field, hasFocus } = props;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const a1NotationEnabled =
    !!rootProps.formulaA1Notation && !rootProps.disableFormulas && !rootProps.dataSource;
  const getSuggestions = useGridFormulaAutocomplete(apiRef, a1NotationEnabled);

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [valueState, setValueState] = React.useState(value);
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [suggestion, setSuggestion] = React.useState<GridFormulaSuggestionState | null>(null);
  const pendingCaretRef = React.useRef<number | null>(null);

  const options = React.useMemo(() => suggestion?.options ?? [], [suggestion]);
  const signatureHelp = suggestion?.signatureHelp ?? null;
  // The list only opens for a non-empty partial token (the user is actively
  // typing an identifier). An empty prefix — right after `=`, `(`, `,` or an
  // operator — shows at most signature help and never traps Enter/Tab, so a
  // completed formula commits on Enter instead of accepting a stray suggestion.
  const hasList = (suggestion?.token ?? '') !== '' && options.length > 0;
  const showPopup = hasFocus && open && (hasList || signatureHelp !== null);

  const popupId = `${id}-${field}-formula-autocomplete`;

  /**
   * Recomputes the suggestions from the input's current value and caret, and
   * opens the popup when there is something to show. Only called from user
   * actions (typing, caret moves, accepting) — never on mount/focus — so the
   * dropdown does not pop open just from entering edit mode.
   */
  const refresh = React.useCallback(
    (caretOverride?: number) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }
      const caret = caretOverride ?? input.selectionStart ?? input.value.length;
      const next = getSuggestions(input.value, caret);
      setSuggestion(next);
      setActiveIndex(0);
      const nextHasList = next !== null && next.token !== '' && next.options.length > 0;
      setOpen(next !== null && (nextHasList || next.signatureHelp !== null));
    },
    [getSuggestions],
  );

  const meta = apiRef.current.unstable_getEditCellMeta(id, field);
  React.useEffect(() => {
    if (meta?.changeReason !== 'debouncedSetEditCellValue') {
      setValueState(value);
    }
  }, [meta, value]);

  useEnhancedEffect(() => {
    if (hasFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasFocus]);

  // Apply the caret position queued by an accepted suggestion after the new
  // value has rendered, then recompute (e.g. show the arguments after `SUM(`).
  useEnhancedEffect(() => {
    if (pendingCaretRef.current === null || !inputRef.current) {
      return;
    }
    const caret = pendingCaretRef.current;
    pendingCaretRef.current = null;
    inputRef.current.setSelectionRange(caret, caret);
    refresh();
  }, [valueState, refresh]);

  // Keep the highlighted option scrolled into view.
  useEnhancedEffect(() => {
    if (!showPopup || !hasList) {
      return;
    }
    const node = document.getElementById(`${popupId}-option-${activeIndex}`);
    node?.scrollIntoView?.({ block: 'nearest' });
  }, [showPopup, hasList, activeIndex, popupId]);

  // The headless `useAutocomplete` needs its own input ref bound (it validates
  // it in a dev effect). We forward to it from one stable callback — composing
  // the hook's (possibly per-render) ref directly would detach/reattach every
  // render and thrash `anchorEl`.
  const autocompleteInputRef = React.useRef<React.Ref<HTMLInputElement>>(null);
  const handleInputRef = React.useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node;
    setAnchorEl(node);
    setRef(autocompleteInputRef.current, node);
  }, []);

  // Writes are NOT debounced. Debouncing the keystroke write while accepting a
  // suggestion with an immediate write would strand the keystroke's timer, which
  // fires later and overwrites the accepted value (data loss). Per-keystroke
  // immediate writes are negligible for a single editing cell.
  const commitEditValue = React.useCallback(
    (nextValue: string, event: React.SyntheticEvent) => {
      setValueState(nextValue);
      apiRef.current.setEditCellValue(
        { id, field, value: nextValue, unstable_skipValueParser: true },
        event,
      );
    },
    [apiRef, field, id],
  );

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      const column = apiRef.current.getColumn(field);
      const parsedValue = column.valueParser
        ? column.valueParser(newValue, apiRef.current.getRow(id), column, apiRef)
        : newValue;
      commitEditValue(parsedValue, event);
      refresh(event.target.selectionStart ?? undefined);
    },
    [apiRef, commitEditValue, field, id, refresh],
  );

  const acceptOption = React.useCallback(
    (option: FormulaCompletionToken, event: React.SyntheticEvent) => {
      const current = suggestion;
      const input = inputRef.current;
      if (!current || !input) {
        return;
      }
      const sourceValue = input.value;
      const insertText = option.insertText + (option.callable ? '(' : '');
      const nextValue =
        sourceValue.slice(0, current.replaceStart) +
        insertText +
        sourceValue.slice(current.replaceEnd);
      pendingCaretRef.current = current.replaceStart + insertText.length;
      commitEditValue(nextValue, event);
    },
    [commitEditValue, suggestion],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
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
            const input = inputRef.current;
            const current = suggestion;
            if (option && input && current) {
              const insertText = option.insertText + (option.callable ? '(' : '');
              const nextValue =
                input.value.slice(0, current.replaceStart) +
                insertText +
                input.value.slice(current.replaceEnd);
              // Accepting a token that is already fully typed is a no-op — let
              // the key reach the grid so a completed formula commits / Tab
              // navigates instead of re-accepting the same suggestion.
              if (nextValue !== input.value) {
                event.preventDefault();
                event.stopPropagation();
                acceptOption(option, event);
              }
            }
            return;
          }
          case 'Escape':
            // First Escape closes the list; a second (list closed) propagates
            // to the grid and cancels the edit.
            event.preventDefault();
            event.stopPropagation();
            setOpen(false);
            return;
          default:
            break;
        }
      }
    },
    [acceptOption, activeIndex, hasList, open, options, suggestion],
  );

  const handleKeyUp = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      // A caret move (without a value change) can change the suggestion context.
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

  const autocomplete = useAutocomplete<FormulaCompletionToken, false, true, true>({
    id: popupId,
    options,
    open: showPopup && hasList,
    inputValue: suggestion?.token ?? '',
    filterOptions: (currentOptions) => currentOptions,
    freeSolo: true,
    disableClearable: true,
    clearOnBlur: false,
    getOptionLabel: (option) => (typeof option === 'string' ? option : option.label),
    isOptionEqualToValue: () => false,
  });
  autocompleteInputRef.current = autocomplete.getInputProps().ref;

  const optionProps = hasList
    ? options.map((option, index) => autocomplete.getOptionProps({ option, index }))
    : [];
  const activeDescendant =
    showPopup && hasList
      ? `${popupId}-option-${Math.min(activeIndex, options.length - 1)}`
      : undefined;

  return (
    <React.Fragment>
      <GridFormulaAutocompleteInput
        as={rootProps.slots.baseInput}
        className={gridClasses.editInputCell}
        fullWidth
        type="text"
        inputRef={handleInputRef}
        value={valueState ?? ''}
        onChange={handleChange}
        slotProps={{
          htmlInput: {
            onKeyDown: handleKeyDown,
            onKeyUp: handleKeyUp,
            onBlur: handleBlur,
            role: 'combobox',
            'aria-autocomplete': 'list',
            'aria-expanded': showPopup && hasList,
            'aria-controls': showPopup && hasList ? `${popupId}-listbox` : undefined,
            'aria-activedescendant': activeDescendant,
          },
        }}
      />
      <GridFormulaAutocompletePopper
        as={rootProps.slots.basePopper}
        open={showPopup}
        target={anchorEl}
        placement="bottom-start"
        flip
      >
        <GridFormulaAutocompletePanel
          // Keep the input focused when the panel is clicked, so clicking an
          // option does not blur the cell and commit the edit.
          onMouseDown={(event) => event.preventDefault()}
        >
          {signatureHelp !== null && (
            <GridFormulaAutocompleteSignature>
              {signatureHelp.signature}
            </GridFormulaAutocompleteSignature>
          )}
          {hasList && (
            <GridFormulaAutocompleteList
              {...autocomplete.getListboxProps()}
              id={`${popupId}-listbox`}
            >
              {options.map((option, index) => {
                const { key, ...liProps } = optionProps[index];
                return (
                  <GridFormulaAutocompleteOption
                    key={key}
                    {...liProps}
                    id={`${popupId}-option-${index}`}
                    data-focused={index === activeIndex}
                    aria-selected={index === activeIndex}
                    onMouseMove={() => setActiveIndex(index)}
                    onClick={(event) => acceptOption(option, event)}
                  >
                    <GridFormulaAutocompleteOptionLabel>
                      {option.label}
                    </GridFormulaAutocompleteOptionLabel>
                    {(option.detail || option.signature || option.category) && (
                      <GridFormulaAutocompleteOptionDetail>
                        {option.detail || option.signature || option.category}
                      </GridFormulaAutocompleteOptionDetail>
                    )}
                  </GridFormulaAutocompleteOption>
                );
              })}
            </GridFormulaAutocompleteList>
          )}
        </GridFormulaAutocompletePanel>
      </GridFormulaAutocompletePopper>
    </React.Fragment>
  );
}

export { GridFormulaAutocomplete };
