/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import { inputBaseClasses } from '@mui/material/InputBase';
import { TextFieldProps } from '../../models/gridBaseSlots';
import { vars } from '../../constants/cssVariables';
import {
  gridColumnDefinitionsSelector,
  gridColumnVisibilityModelSelector,
  gridInitialColumnVisibilityModelSelector,
} from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import type { GridColDef } from '../../models/colDef/gridColDef';
import type { GridSlotProps } from '../../models/gridSlotsComponentsProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { checkColumnVisibilityModelsSame, defaultSearchPredicate } from './utils';
import { NotRendered } from '../../utils/assert';
import { GridShadowScrollArea } from '../GridShadowScrollArea';
import {
  gridPivotActiveSelector,
  gridPivotInitialColumnsSelector,
} from '../../hooks/features/pivoting/gridPivotingSelectors';

export interface GridColumnsManagementProps {
  /*
   * Changes how the options in the columns selector should be ordered.
   * If not specified, the order is derived from the `columns` prop.
   */
  sort?: 'asc' | 'desc';
  searchPredicate?: (column: GridColDef, searchValue: string) => boolean;
  searchInputProps?: Partial<TextFieldProps>;
  /**
   * If `true`, the column search field will be focused automatically.
   * If `false`, the first column switch input will be focused automatically.
   * This helps to avoid input keyboard panel to popup automatically on touch devices.
   * @default true
   */
  autoFocusSearchField?: boolean;
  /**
   * If `true`, the `Show/Hide all` toggle checkbox will not be displayed.
   * @default false
   */
  disableShowHideToggle?: boolean;
  /**
   * If `true`, the `Reset` button will not be disabled
   * @default false
   */
  disableResetButton?: boolean;
  /**
   * Changes the behavior of the `Show/Hide All` toggle when the search field is used:
   * - `all`: Will toggle all columns.
   * - `filteredOnly`: Will only toggle columns that match the search criteria.
   * @default 'all'
   */
  toggleAllMode?: 'all' | 'filteredOnly';
  /**
   * Returns the list of togglable columns.
   * If used, only those columns will be displayed in the panel
   * which are passed as the return value of the function.
   * @param {GridColDef[]} columns The `ColDef` list of all columns.
   * @returns {GridColDef['field'][]} The list of togglable columns' field names.
   */
  getTogglableColumns?: (columns: GridColDef[]) => GridColDef['field'][];
}

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['columnsManagement'],
    header: ['columnsManagementHeader'],
    searchInput: ['columnsManagementSearchInput'],
    footer: ['columnsManagementFooter'],
    row: ['columnsManagementRow'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const collator = new Intl.Collator();

function GridColumnsManagement(props: GridColumnsManagementProps) {
  const apiRef = useGridApiContext();
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const initialColumnVisibilityModel = useGridSelector(
    apiRef,
    gridInitialColumnVisibilityModelSelector,
  );
  const columnVisibilityModel = useGridSelector(apiRef, gridColumnVisibilityModelSelector);
  const rootProps = useGridRootProps();
  const [searchValue, setSearchValue] = React.useState('');
  const classes = useUtilityClasses(rootProps);
  const columnDefinitions = useGridSelector(apiRef, gridColumnDefinitionsSelector);
  const pivotActive = useGridSelector(apiRef, gridPivotActiveSelector);
  const pivotInitialColumns = useGridSelector(apiRef, gridPivotInitialColumnsSelector);
  const columns = React.useMemo(
    () => (pivotActive ? Array.from(pivotInitialColumns.values()) : columnDefinitions),
    [pivotActive, pivotInitialColumns, columnDefinitions],
  );

  const {
    sort,
    searchPredicate = defaultSearchPredicate,
    autoFocusSearchField = true,
    disableShowHideToggle = false,
    disableResetButton = false,
    toggleAllMode = 'all',
    getTogglableColumns,
    searchInputProps,
  } = props;

  const isResetDisabled = React.useMemo(
    () => checkColumnVisibilityModelsSame(columnVisibilityModel, initialColumnVisibilityModel),
    [columnVisibilityModel, initialColumnVisibilityModel],
  );

  const sortedColumns = React.useMemo(() => {
    switch (sort) {
      case 'asc':
        return [...columns].sort((a, b) =>
          collator.compare(a.headerName || a.field, b.headerName || b.field),
        );

      case 'desc':
        return [...columns].sort(
          (a, b) => -collator.compare(a.headerName || a.field, b.headerName || b.field),
        );

      default:
        return columns;
    }
  }, [columns, sort]);

  const toggleColumn = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { name: field } = event.target as HTMLInputElement;
    apiRef.current.setColumnVisibility(field, columnVisibilityModel[field] === false);
  };

  const currentColumns = React.useMemo(() => {
    const togglableColumns = getTogglableColumns ? getTogglableColumns(sortedColumns) : null;

    const togglableSortedColumns = togglableColumns
      ? sortedColumns.filter(({ field }) => togglableColumns.includes(field))
      : sortedColumns;

    if (!searchValue) {
      return togglableSortedColumns;
    }

    return togglableSortedColumns.filter((column) =>
      searchPredicate(column, searchValue.toLowerCase()),
    );
  }, [sortedColumns, searchValue, searchPredicate, getTogglableColumns]);

  const toggleAllColumns = React.useCallback(
    (isVisible: boolean) => {
      const currentModel = gridColumnVisibilityModelSelector(apiRef);
      const newModel = { ...currentModel };
      const togglableColumns = getTogglableColumns ? getTogglableColumns(columns) : null;

      (toggleAllMode === 'filteredOnly' ? currentColumns : columns).forEach((col) => {
        if (col.hideable && (togglableColumns == null || togglableColumns.includes(col.field))) {
          if (isVisible) {
            // delete the key from the model instead of setting it to `true`
            delete newModel[col.field];
          } else {
            newModel[col.field] = false;
          }
        }
      });

      return apiRef.current.setColumnVisibilityModel(newModel);
    },
    [apiRef, columns, getTogglableColumns, toggleAllMode, currentColumns],
  );

  const handleSearchValueChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    },
    [],
  );

  const hideableColumns = React.useMemo(
    () => currentColumns.filter((col) => col.hideable),
    [currentColumns],
  );

  const allHideableColumnsVisible = React.useMemo(
    () =>
      hideableColumns.every(
        (column) =>
          columnVisibilityModel[column.field] == null ||
          columnVisibilityModel[column.field] !== false,
      ),
    [columnVisibilityModel, hideableColumns],
  );

  const allHideableColumnsHidden = React.useMemo(
    () => hideableColumns.every((column) => columnVisibilityModel[column.field] === false),
    [columnVisibilityModel, hideableColumns],
  );

  const firstSwitchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (autoFocusSearchField) {
      searchInputRef.current?.focus();
    } else if (firstSwitchRef.current && typeof firstSwitchRef.current.focus === 'function') {
      firstSwitchRef.current.focus();
    }
  }, [autoFocusSearchField]);

  let firstHideableColumnFound = false;
  const isFirstHideableColumn = (column: GridColDef) => {
    if (firstHideableColumnFound === false && column.hideable !== false) {
      firstHideableColumnFound = true;
      return true;
    }
    return false;
  };
  const handleSearchReset = React.useCallback(() => {
    setSearchValue('');
    searchInputRef.current?.focus();
  }, []);

  return (
    <React.Fragment>
      <GridColumnsManagementHeader className={classes.header} ownerState={rootProps}>
        <SearchInput
          as={rootProps.slots.baseTextField}
          ownerState={rootProps}
          placeholder={apiRef.current.getLocaleText('columnsManagementSearchTitle')}
          inputRef={searchInputRef}
          className={classes.searchInput}
          value={searchValue}
          onChange={handleSearchValueChange}
          size="small"
          type="search"
          slotProps={{
            input: {
              startAdornment: <rootProps.slots.quickFilterIcon fontSize="small" />,
              endAdornment: (
                <rootProps.slots.baseIconButton
                  size="small"
                  aria-label={apiRef.current.getLocaleText('columnsManagementDeleteIconLabel')}
                  style={
                    searchValue
                      ? {
                          visibility: 'visible',
                        }
                      : {
                          visibility: 'hidden',
                        }
                  }
                  tabIndex={-1}
                  onClick={handleSearchReset}
                  edge="end"
                  {...rootProps.slotProps?.baseIconButton}
                >
                  <rootProps.slots.quickFilterClearIcon fontSize="small" />
                </rootProps.slots.baseIconButton>
              ),
            },
            htmlInput: {
              'aria-label': apiRef.current.getLocaleText('columnsManagementSearchTitle'),
            },
          }}
          autoComplete="off"
          fullWidth
          {...rootProps.slotProps?.baseTextField}
          {...searchInputProps}
        />
      </GridColumnsManagementHeader>
      <GridColumnsManagementScrollArea ownerState={rootProps}>
        <GridColumnsManagementBody className={classes.root} ownerState={rootProps}>
          {currentColumns.map((column) => (
            <rootProps.slots.baseCheckbox
              key={column.field}
              className={classes.row}
              disabled={column.hideable === false || pivotActive}
              checked={columnVisibilityModel[column.field] !== false}
              onClick={toggleColumn}
              name={column.field}
              inputRef={isFirstHideableColumn(column) ? firstSwitchRef : undefined}
              label={column.headerName || column.field}
              density="compact"
              fullWidth
              {...rootProps.slotProps?.baseCheckbox}
            />
          ))}
          {currentColumns.length === 0 && (
            <GridColumnsManagementEmptyText ownerState={rootProps}>
              {apiRef.current.getLocaleText('columnsManagementNoColumns')}
            </GridColumnsManagementEmptyText>
          )}
        </GridColumnsManagementBody>
      </GridColumnsManagementScrollArea>
      {!disableShowHideToggle || !disableResetButton ? (
        <GridColumnsManagementFooter ownerState={rootProps} className={classes.footer}>
          {!disableShowHideToggle ? (
            <rootProps.slots.baseCheckbox
              disabled={hideableColumns.length === 0 || pivotActive}
              checked={allHideableColumnsVisible}
              indeterminate={!allHideableColumnsVisible && !allHideableColumnsHidden}
              onClick={() => toggleAllColumns(!allHideableColumnsVisible)}
              name={apiRef.current.getLocaleText('columnsManagementShowHideAllText')}
              label={apiRef.current.getLocaleText('columnsManagementShowHideAllText')}
              density="compact"
              {...rootProps.slotProps?.baseCheckbox}
            />
          ) : (
            <span />
          )}

          {!disableResetButton ? (
            <rootProps.slots.baseButton
              onClick={() => apiRef.current.setColumnVisibilityModel(initialColumnVisibilityModel)}
              disabled={isResetDisabled || pivotActive}
              {...rootProps.slotProps?.baseButton}
            >
              {apiRef.current.getLocaleText('columnsManagementReset')}
            </rootProps.slots.baseButton>
          ) : null}
        </GridColumnsManagementFooter>
      ) : null}
    </React.Fragment>
  );
}

GridColumnsManagement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * If `true`, the column search field will be focused automatically.
   * If `false`, the first column switch input will be focused automatically.
   * This helps to avoid input keyboard panel to popup automatically on touch devices.
   * @default true
   */
  autoFocusSearchField: PropTypes.bool,
  /**
   * If `true`, the `Reset` button will not be disabled
   * @default false
   */
  disableResetButton: PropTypes.bool,
  /**
   * If `true`, the `Show/Hide all` toggle checkbox will not be displayed.
   * @default false
   */
  disableShowHideToggle: PropTypes.bool,
  /**
   * Returns the list of togglable columns.
   * If used, only those columns will be displayed in the panel
   * which are passed as the return value of the function.
   * @param {GridColDef[]} columns The `ColDef` list of all columns.
   * @returns {GridColDef['field'][]} The list of togglable columns' field names.
   */
  getTogglableColumns: PropTypes.func,
  searchInputProps: PropTypes.shape({
    autoComplete: PropTypes.string,
    autoFocus: PropTypes.bool,
    className: PropTypes.string,
    color: PropTypes.oneOf(['error', 'primary']),
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    fullWidth: PropTypes.bool,
    helperText: PropTypes.string,
    id: PropTypes.string,
    inputRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({
        current: PropTypes.object,
      }),
    ]),
    label: PropTypes.node,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    placeholder: PropTypes.string,
    role: PropTypes.string,
    size: PropTypes.oneOf(['medium', 'small']),
    slotProps: PropTypes.object,
    style: PropTypes.object,
    tabIndex: PropTypes.number,
    type: PropTypes.oneOfType([
      PropTypes.oneOf([
        'button',
        'checkbox',
        'color',
        'date',
        'datetime-local',
        'email',
        'file',
        'hidden',
        'image',
        'month',
        'number',
        'password',
        'radio',
        'range',
        'reset',
        'search',
        'submit',
        'tel',
        'text',
        'time',
        'url',
        'week',
      ]),
      PropTypes.object,
    ]),
    value: PropTypes.string,
  }),
  searchPredicate: PropTypes.func,
  sort: PropTypes.oneOf(['asc', 'desc']),
  /**
   * Changes the behavior of the `Show/Hide All` toggle when the search field is used:
   * - `all`: Will toggle all columns.
   * - `filteredOnly`: Will only toggle columns that match the search criteria.
   * @default 'all'
   */
  toggleAllMode: PropTypes.oneOf(['all', 'filteredOnly']),
} as any;

const GridColumnsManagementBody = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnsManagement',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  flexDirection: 'column',
  padding: vars.spacing(0.5, 1.5),
});

const GridColumnsManagementScrollArea = styled(GridShadowScrollArea, {
  name: 'MuiDataGrid',
  slot: 'ColumnsManagementScrollArea',
})<{ ownerState: OwnerState }>({
  maxHeight: 400,
});

const GridColumnsManagementHeader = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnsManagementHeader',
})<{ ownerState: OwnerState }>({
  padding: vars.spacing(1.5, 2),
  borderBottom: `1px solid ${vars.colors.border.base}`,
});

const SearchInput = styled(NotRendered<GridSlotProps['baseTextField']>, {
  name: 'MuiDataGrid',
  slot: 'ColumnsManagementSearchInput',
})<{ ownerState: OwnerState }>({
  [`& .${inputBaseClasses.input}::-webkit-search-decoration,
      & .${inputBaseClasses.input}::-webkit-search-cancel-button,
      & .${inputBaseClasses.input}::-webkit-search-results-button,
      & .${inputBaseClasses.input}::-webkit-search-results-decoration`]: {
    /* clears the 'X' icon from Chrome */
    display: 'none',
  },
});

const GridColumnsManagementFooter = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnsManagementFooter',
})<{ ownerState: OwnerState }>({
  padding: vars.spacing(1, 1, 1, 1.5),
  display: 'flex',
  justifyContent: 'space-between',
  borderTop: `1px solid ${vars.colors.border.base}`,
});

const GridColumnsManagementEmptyText = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnsManagementEmptyText',
})<{ ownerState: OwnerState }>({
  padding: vars.spacing(1, 0),
  alignSelf: 'center',
  font: vars.typography.font.body,
});

export { GridColumnsManagement };
