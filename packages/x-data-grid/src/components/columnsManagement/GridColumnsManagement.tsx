/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '../../utils/styled';
import {
  gridColumnDefinitionsSelector,
  gridColumnVisibilityModelSelector,
} from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import type { GridColDef } from '../../models/colDef/gridColDef';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useLazyRef } from '../../hooks/utils/useLazyRef';
import { checkColumnVisibilityModelsSame, defaultSearchPredicate } from './utils';

export interface GridColumnsManagementProps {
  /*
   * Changes how the options in the columns selector should be ordered.
   * If not specified, the order is derived from the `columns` prop.
   */
  sort?: 'asc' | 'desc';
  searchPredicate?: (column: GridColDef, searchValue: string) => boolean;
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
    footer: ['columnsManagementFooter'],
    row: ['columnsManagementRow'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const collator = new Intl.Collator();

function GridColumnsManagement(props: GridColumnsManagementProps) {
  const apiRef = useGridApiContext();
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const columns = useGridSelector(apiRef, gridColumnDefinitionsSelector);
  const initialColumnVisibilityModel = useLazyRef(() =>
    gridColumnVisibilityModelSelector(apiRef),
  ).current;
  const columnVisibilityModel = useGridSelector(apiRef, gridColumnVisibilityModelSelector);
  const rootProps = useGridRootProps();
  const [searchValue, setSearchValue] = React.useState('');
  const classes = useUtilityClasses(rootProps);

  const {
    sort,
    searchPredicate = defaultSearchPredicate,
    autoFocusSearchField = true,
    disableShowHideToggle = false,
    disableResetButton = false,
    toggleAllMode = 'all',
    getTogglableColumns,
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
      searchInputRef.current!.focus();
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

  return (
    <React.Fragment>
      <GridColumnsManagementHeader className={classes.header} ownerState={rootProps}>
        <rootProps.slots.baseTextField
          placeholder={apiRef.current.getLocaleText('columnsManagementSearchTitle')}
          inputRef={searchInputRef}
          value={searchValue}
          onChange={handleSearchValueChange}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <rootProps.slots.baseInputAdornment position="start">
                <rootProps.slots.quickFilterIcon />
              </rootProps.slots.baseInputAdornment>
            ),
            sx: { pl: 1.5 },
          }}
          fullWidth
          {...rootProps.slotProps?.baseTextField}
        />
      </GridColumnsManagementHeader>
      <GridColumnsManagementBody className={classes.root} ownerState={rootProps}>
        {currentColumns.map((column) => (
          <FormControlLabel
            key={column.field}
            className={classes.row}
            control={
              <rootProps.slots.baseCheckbox
                disabled={column.hideable === false}
                checked={columnVisibilityModel[column.field] !== false}
                onClick={toggleColumn}
                name={column.field}
                sx={{ p: 0.5 }}
                inputRef={isFirstHideableColumn(column) ? firstSwitchRef : undefined}
                {...rootProps.slotProps?.baseCheckbox}
              />
            }
            label={column.headerName || column.field}
          />
        ))}
        {currentColumns.length === 0 && (
          <GridColumnsManagementEmptyText ownerState={rootProps}>
            {apiRef.current.getLocaleText('columnsManagementNoColumns')}
          </GridColumnsManagementEmptyText>
        )}
      </GridColumnsManagementBody>
      {(!disableShowHideToggle || !disableResetButton) && currentColumns.length > 0 ? (
        <GridColumnsManagementFooter ownerState={rootProps} className={classes.footer}>
          {!disableShowHideToggle ? (
            <FormControlLabel
              control={
                <rootProps.slots.baseCheckbox
                  disabled={hideableColumns.length === 0}
                  checked={allHideableColumnsVisible}
                  indeterminate={!allHideableColumnsVisible && !allHideableColumnsHidden}
                  onClick={() => toggleAllColumns(!allHideableColumnsVisible)}
                  name={apiRef.current.getLocaleText('columnsManagementShowHideAllText')}
                  sx={{ p: 0.5 }}
                  {...rootProps.slotProps?.baseCheckbox}
                />
              }
              label={apiRef.current.getLocaleText('columnsManagementShowHideAllText')}
            />
          ) : (
            <span />
          )}

          {!disableResetButton ? (
            <rootProps.slots.baseButton
              onClick={() => apiRef.current.setColumnVisibilityModel(initialColumnVisibilityModel)}
              disabled={isResetDisabled}
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
  overridesResolver: (props, styles) => styles.columnsManagement,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  padding: theme.spacing(0, 3, 1.5),
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  flex: '1 1',
  maxHeight: 400,
  alignItems: 'flex-start',
}));

const GridColumnsManagementHeader = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnsManagementHeader',
  overridesResolver: (props, styles) => styles.columnsManagementHeader,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
}));

const GridColumnsManagementFooter = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnsManagementFooter',
  overridesResolver: (props, styles) => styles.columnsManagementFooter,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  padding: theme.spacing(0.5, 1, 0.5, 3),
  display: 'flex',
  justifyContent: 'space-between',
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const GridColumnsManagementEmptyText = styled('div')<{ ownerState: OwnerState }>(({ theme }) => ({
  padding: theme.spacing(0.5, 0),
  color: theme.palette.grey[500],
}));

export { GridColumnsManagement };
