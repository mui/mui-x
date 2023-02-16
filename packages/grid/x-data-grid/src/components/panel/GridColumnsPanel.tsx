import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { switchClasses } from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import {
  gridColumnDefinitionsSelector,
  gridColumnVisibilityModelSelector,
} from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridDragIcon } from '../icons';
import { GridPanelContent } from './GridPanelContent';
import { GridPanelFooter } from './GridPanelFooter';
import { GridPanelHeader } from './GridPanelHeader';
import { GridPanelWrapper, GridPanelWrapperProps } from './GridPanelWrapper';
import { GRID_EXPERIMENTAL_ENABLED } from '../../constants/envConstants';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import type { GridStateColDef } from '../../models/colDef/gridColDef';
import { getDataGridUtilityClass } from '../../constants/gridClasses';

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['columnsPanel'],
    columnsPanelRow: ['columnsPanelRow'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridColumnsPanelRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnsPanel',
  overridesResolver: (props, styles) => styles.columnsPanel,
})<{ ownerState: OwnerState }>({
  padding: '8px 0px 8px 8px',
});

const GridColumnsPanelRowRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnsPanelRow',
  overridesResolver: (props, styles) => styles.columnsPanelRow,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '1px 8px 1px 7px',
  [`& .${switchClasses.root}`]: {
    marginRight: theme.spacing(0.5),
  },
}));

const GridIconButtonRoot = styled(IconButton)({
  justifyContent: 'flex-end',
});

export interface GridColumnsPanelProps extends GridPanelWrapperProps {
  /*
   * Changes how the options in the columns selector should be ordered.
   * If not specified, the order is derived from the `columns` prop.
   */
  sort?: 'asc' | 'desc';
  searchPredicate?: (column: GridStateColDef, searchValue: string) => boolean;
  /*
   * If `true`, the column search field will be focused automatically.
   * If `false`, the first column switch input will be focused automatically.
   * This helps to avoid input keyboard panel to popup automatically on touch devices.
   * @default true
   */
  autoFocusSearchField?: boolean;
}

const collator = new Intl.Collator();

const defaultSearchPredicate: NonNullable<GridColumnsPanelProps['searchPredicate']> = (
  column,
  searchValue,
) => {
  return (column.headerName || column.field).toLowerCase().indexOf(searchValue) > -1;
};

function GridColumnsPanel(props: GridColumnsPanelProps) {
  const apiRef = useGridApiContext();
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const columns = useGridSelector(apiRef, gridColumnDefinitionsSelector);
  const columnVisibilityModel = useGridSelector(apiRef, gridColumnVisibilityModelSelector);
  const rootProps = useGridRootProps();
  const [searchValue, setSearchValue] = React.useState('');
  const classes = useUtilityClasses(rootProps);

  const {
    sort,
    searchPredicate = defaultSearchPredicate,
    autoFocusSearchField = true,
    ...other
  } = props;

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

  const toggleAllColumns = React.useCallback(
    (isVisible: boolean) => {
      if (apiRef.current.unstable_caches.columns.isUsingColumnVisibilityModel) {
        const currentModel = gridColumnVisibilityModelSelector(apiRef);
        const newModel = { ...currentModel };

        columns.forEach((col) => {
          if (col.hideable) {
            if (isVisible) {
              // delete the key from the model instead of setting it to `true`
              delete newModel[col.field];
            } else {
              newModel[col.field] = false;
            }
          }
        });

        return apiRef.current.setColumnVisibilityModel(newModel);
      }

      // TODO v6: Remove
      return apiRef.current.updateColumns(
        columns.map((col) => {
          if (col.hideable !== false) {
            return { field: col.field, hide: !isVisible };
          }

          return col;
        }),
      );
    },
    [apiRef, columns],
  );

  const handleSearchValueChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    },
    [],
  );

  const currentColumns = React.useMemo(() => {
    if (!searchValue) {
      return sortedColumns;
    }
    const searchValueToCheck = searchValue.toLowerCase();
    return sortedColumns.filter((column) => searchPredicate(column, searchValueToCheck));
  }, [sortedColumns, searchValue, searchPredicate]);

  const firstSwitchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (autoFocusSearchField) {
      searchInputRef.current!.focus();
    } else if (firstSwitchRef.current && typeof firstSwitchRef.current.focus === 'function') {
      firstSwitchRef.current.focus();
    }
  }, [autoFocusSearchField]);

  let firstHideableColumnFound = false;
  const isFirstHideableColumn = (column: GridStateColDef) => {
    if (firstHideableColumnFound === false && column.hideable !== false) {
      firstHideableColumnFound = true;
      return true;
    }
    return false;
  };

  return (
    <GridPanelWrapper {...other}>
      <GridPanelHeader>
        <rootProps.components.BaseTextField
          label={apiRef.current.getLocaleText('columnsPanelTextFieldLabel')}
          placeholder={apiRef.current.getLocaleText('columnsPanelTextFieldPlaceholder')}
          inputRef={searchInputRef}
          value={searchValue}
          onChange={handleSearchValueChange}
          variant="standard"
          fullWidth
          {...rootProps.componentsProps?.baseTextField}
        />
      </GridPanelHeader>
      <GridPanelContent>
        <GridColumnsPanelRoot className={classes.root} ownerState={rootProps}>
          {currentColumns.map((column) => (
            <GridColumnsPanelRowRoot
              className={classes.columnsPanelRow}
              ownerState={rootProps}
              key={column.field}
            >
              <FormControlLabel
                control={
                  <rootProps.components.BaseSwitch
                    disabled={column.hideable === false}
                    checked={columnVisibilityModel[column.field] !== false}
                    onClick={toggleColumn}
                    name={column.field}
                    size="small"
                    inputRef={isFirstHideableColumn(column) ? firstSwitchRef : undefined}
                    {...rootProps.componentsProps?.baseSwitch}
                  />
                }
                label={column.headerName || column.field}
              />
              {!rootProps.disableColumnReorder && GRID_EXPERIMENTAL_ENABLED && (
                <GridIconButtonRoot
                  draggable
                  aria-label={apiRef.current.getLocaleText('columnsPanelDragIconLabel')}
                  title={apiRef.current.getLocaleText('columnsPanelDragIconLabel')}
                  size="small"
                  disabled
                >
                  <GridDragIcon />
                </GridIconButtonRoot>
              )}
            </GridColumnsPanelRowRoot>
          ))}
        </GridColumnsPanelRoot>
      </GridPanelContent>
      <GridPanelFooter>
        <rootProps.components.BaseButton
          onClick={() => toggleAllColumns(false)}
          {...rootProps.componentsProps?.baseButton}
        >
          {apiRef.current.getLocaleText('columnsPanelHideAllButton')}
        </rootProps.components.BaseButton>
        <rootProps.components.BaseButton
          onClick={() => toggleAllColumns(true)}
          {...rootProps.componentsProps?.baseButton}
        >
          {apiRef.current.getLocaleText('columnsPanelShowAllButton')}
        </rootProps.components.BaseButton>
      </GridPanelFooter>
    </GridPanelWrapper>
  );
}

GridColumnsPanel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  autoFocusSearchField: PropTypes.bool,
  searchPredicate: PropTypes.func,
  slotProps: PropTypes.shape({
    TrapFocus: PropTypes.shape({
      children: PropTypes.element.isRequired,
      disableAutoFocus: PropTypes.bool,
      disableEnforceFocus: PropTypes.bool,
      disableRestoreFocus: PropTypes.bool,
      getTabbable: PropTypes.func,
      isEnabled: PropTypes.func,
      open: PropTypes.bool.isRequired,
    }),
  }),
  sort: PropTypes.oneOf(['asc', 'desc']),
} as any;

export { GridColumnsPanel };
