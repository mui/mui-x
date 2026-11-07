'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import useId from '@mui/utils/useId';
import composeClasses from '@mui/utils/composeClasses';
import {
  getDataGridUtilityClass,
  gridColumnLookupSelector,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import { vars } from '@mui/x-data-grid-pro/internals';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { gridComputedColumnsRevisionSelector } from '../../hooks/features/computedColumns/gridComputedColumnsSelectors';
import { getFormulaCompletionTokens } from '../../hooks/features/formula/engine';
import type { FormulaCompletionToken } from '../../hooks/features/formula/engine';
import { toFormulaFieldReference } from '../../hooks/features/formula/gridFormulaAutocomplete';
import { gridFormulaReferenceableFieldsSelector } from '../../hooks/features/formula/gridFormulaPositionContext';
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from '../collapsible';
import { FORMULA_FONT_FAMILY } from '../GridFormulaEditable';

export interface GridComputedColumnsPanelReferencePaneProps {
  /**
   * The field of the column being edited: never offered as a reference.
   */
  excludeField: string;
  a1Notation: boolean;
  /**
   * Called with the text to splice into the formula at the caret.
   * @param {string} text The reference or function call to insert.
   * @param {React.SyntheticEvent} event The click on the item.
   */
  onInsert: (text: string, event: React.SyntheticEvent) => void;
}

interface ReferenceItem {
  key: string;
  /**
   * The text spliced into the formula.
   */
  insertText: string;
  /**
   * The primary line (monospace: the token as it will appear in the formula).
   */
  label: string;
  /**
   * The secondary line (a column's header name, a function's description).
   */
  detail?: string;
  searchText: string;
}

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['computedColumnsPanelReference'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridComputedColumnsPanelReferenceSearch = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnsPanelReferenceSearch',
})<{ ownerState: OwnerState }>({
  padding: vars.spacing(1, 1, 0.5),
});

const GridComputedColumnsPanelReferenceLists = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnsPanelReferenceLists',
})<{ ownerState: OwnerState }>({
  maxHeight: 240,
  overflowY: 'auto',
  padding: vars.spacing(0, 0, 0.5),
});

const GridComputedColumnsPanelReferenceGroupTitle = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnsPanelReferenceGroupTitle',
})<{ ownerState: OwnerState }>({
  position: 'sticky',
  top: 0,
  padding: vars.spacing(0.75, 1.5, 0.25),
  font: vars.typography.font.small,
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.colors.foreground.muted,
  background: vars.colors.background.overlay,
});

const GridComputedColumnsPanelReferenceList = styled('ul', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnsPanelReferenceList',
})<{ ownerState: OwnerState }>({
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

const GridComputedColumnsPanelReferenceItem = styled('button', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnsPanelReferenceItem',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  alignItems: 'baseline',
  gap: vars.spacing(1),
  width: '100%',
  minWidth: 0,
  padding: vars.spacing(0.5, 1.5),
  border: 0,
  background: 'none',
  color: 'inherit',
  font: 'inherit',
  textAlign: 'start',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: vars.colors.interactive.hover,
  },
  '&:focus-visible': {
    outline: `2px solid ${vars.colors.interactive.selected}`,
    outlineOffset: -2,
  },
});

const GridComputedColumnsPanelReferenceItemLabel = styled('span', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnsPanelReferenceItemLabel',
})<{ ownerState: OwnerState }>({
  flexShrink: 0,
  maxWidth: '60%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontFamily: FORMULA_FONT_FAMILY,
  fontVariantLigatures: 'none',
});

const GridComputedColumnsPanelReferenceItemDetail = styled('span', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnsPanelReferenceItemDetail',
})<{ ownerState: OwnerState }>({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  font: vars.typography.font.small,
  color: vars.colors.foreground.muted,
});

const GridComputedColumnsPanelReferenceNoResults = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnsPanelReferenceNoResults',
})<{ ownerState: OwnerState }>({
  padding: vars.spacing(1, 1.5),
  font: vars.typography.font.small,
  color: vars.colors.foreground.muted,
});

function matches(item: ReferenceItem, query: string): boolean {
  return query === '' || item.searchText.includes(query);
}

/**
 * The "Insert" pane of the computed column editor: the columns of the same
 * row and the functions of the registry, searchable, each inserted into the
 * formula at the caret on click. Items `preventDefault` their `mousedown` so a
 * click never blurs the formula editable (the caret stays where it was).
 */
function GridComputedColumnsPanelReferencePane(props: GridComputedColumnsPanelReferencePaneProps) {
  const { excludeField, a1Notation, onInsert } = props;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const id = useId();
  const [query, setQuery] = React.useState('');

  const referenceableFields = useGridSelector(apiRef, gridFormulaReferenceableFieldsSelector);
  const columnLookup = useGridSelector(apiRef, gridColumnLookupSelector);

  const columnItems = React.useMemo<ReferenceItem[]>(
    () =>
      referenceableFields
        .filter((field) => field !== excludeField)
        .map((field) => {
          const headerName = columnLookup[field]?.headerName ?? field;
          const reference = toFormulaFieldReference(field, a1Notation);
          return {
            key: field,
            insertText: reference,
            label: reference,
            detail: headerName === field ? undefined : headerName,
            searchText: `${field} ${headerName}`.toLowerCase(),
          };
        }),
    [referenceableFields, columnLookup, excludeField, a1Notation],
  );

  // The formula feature rebuilds the registry in an effect, after the render that
  // brought the new `formulaFunctions` prop: the prop is not the signal. The
  // revision is — it is bumped once the registry was actually rebuilt.
  const revision = useGridSelector(apiRef, gridComputedColumnsRevisionSelector);
  const functionItems = React.useMemo<ReferenceItem[]>(
    () =>
      getFormulaCompletionTokens(apiRef.current.caches.formula?.registry)
        .filter((token: FormulaCompletionToken) => token.kind === 'function')
        .map((token) => ({
          key: token.label,
          insertText: `${token.insertText}(`,
          label: token.signature ?? `${token.label}()`,
          detail: token.description,
          searchText:
            `${token.label} ${token.signature ?? ''} ${token.description ?? ''}`.toLowerCase(),
        })),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the registry is read through the cache
    [apiRef, revision],
  );

  const normalizedQuery = query.trim().toLowerCase();
  const visibleColumns = columnItems.filter((item) => matches(item, normalizedQuery));
  const visibleFunctions = functionItems.filter((item) => matches(item, normalizedQuery));

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Escape clears the search first; with nothing to clear it reaches the
    // editor (Cancel).
    if (event.key === 'Escape' && query !== '') {
      event.stopPropagation();
      setQuery('');
    }
  };

  const preventBlur = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const getLocaleText = apiRef.current.getLocaleText;

  const renderGroup = (title: string, items: ReferenceItem[], groupId: string) => {
    if (items.length === 0) {
      return null;
    }
    return (
      <React.Fragment>
        <GridComputedColumnsPanelReferenceGroupTitle ownerState={rootProps} id={groupId}>
          {title}
        </GridComputedColumnsPanelReferenceGroupTitle>
        <GridComputedColumnsPanelReferenceList ownerState={rootProps} aria-labelledby={groupId}>
          {items.map((item) => (
            <li key={item.key}>
              <GridComputedColumnsPanelReferenceItem
                ownerState={rootProps}
                type="button"
                title={item.detail}
                onMouseDown={preventBlur}
                onClick={(event) => onInsert(item.insertText, event)}
              >
                <GridComputedColumnsPanelReferenceItemLabel ownerState={rootProps}>
                  {item.label}
                </GridComputedColumnsPanelReferenceItemLabel>
                {item.detail !== undefined && (
                  <GridComputedColumnsPanelReferenceItemDetail ownerState={rootProps}>
                    {item.detail}
                  </GridComputedColumnsPanelReferenceItemDetail>
                )}
              </GridComputedColumnsPanelReferenceItem>
            </li>
          ))}
        </GridComputedColumnsPanelReferenceList>
      </React.Fragment>
    );
  };

  return (
    <Collapsible className={classes.root}>
      <CollapsibleTrigger>{getLocaleText('computedColumnReferenceTitle')}</CollapsibleTrigger>
      <CollapsiblePanel>
        <GridComputedColumnsPanelReferenceSearch ownerState={rootProps}>
          <rootProps.slots.baseTextField
            size="small"
            aria-label={getLocaleText('computedColumnReferenceSearchPlaceholder')}
            placeholder={getLocaleText('computedColumnReferenceSearchPlaceholder')}
            onKeyDown={handleSearchKeyDown}
            fullWidth
            slotProps={{
              input: {
                startAdornment: <rootProps.slots.pivotSearchIcon fontSize="small" />,
                endAdornment: query ? (
                  <rootProps.slots.baseIconButton
                    edge="end"
                    size="small"
                    onClick={() => setQuery('')}
                    aria-label={getLocaleText('pivotSearchControlClear')}
                  >
                    <rootProps.slots.pivotSearchClearIcon fontSize="small" />
                  </rootProps.slots.baseIconButton>
                ) : null,
              },
              htmlInput: { role: 'searchbox' },
            }}
            {...rootProps.slotProps?.baseTextField}
            value={query}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
          />
        </GridComputedColumnsPanelReferenceSearch>
        <GridComputedColumnsPanelReferenceLists ownerState={rootProps}>
          {renderGroup(
            getLocaleText('computedColumnReferenceColumns'),
            visibleColumns,
            `${id}-columns`,
          )}
          {renderGroup(
            getLocaleText('computedColumnReferenceFunctions'),
            visibleFunctions,
            `${id}-functions`,
          )}
          {visibleColumns.length === 0 && visibleFunctions.length === 0 && (
            <GridComputedColumnsPanelReferenceNoResults ownerState={rootProps} role="status">
              {getLocaleText('computedColumnReferenceNoResults')}
            </GridComputedColumnsPanelReferenceNoResults>
          )}
        </GridComputedColumnsPanelReferenceLists>
      </CollapsiblePanel>
    </Collapsible>
  );
}

export { GridComputedColumnsPanelReferencePane };
