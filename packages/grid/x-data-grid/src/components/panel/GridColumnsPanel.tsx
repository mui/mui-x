import * as React from 'react';
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
import { GridPanelWrapper } from './GridPanelWrapper';
import { GRID_EXPERIMENTAL_ENABLED } from '../../constants/envConstants';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';

type OwnerState = { classes: DataGridProcessedProps['classes'] };

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
})(() => ({
  padding: '8px 0px 8px 8px',
}));

const GridColumnsPanelRowRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnsPanelRow',
  overridesResolver: (props, styles) => styles.columnsPanelRow,
})(({ theme }) => ({
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

export function GridColumnsPanel() {
  const apiRef = useGridApiContext();
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const columns = useGridSelector(apiRef, gridColumnDefinitionsSelector);
  const columnVisibilityModel = useGridSelector(apiRef, gridColumnVisibilityModelSelector);
  const rootProps = useGridRootProps();
  const [searchValue, setSearchValue] = React.useState('');
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const toggleColumn = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { name: field } = event.target as HTMLInputElement;
    apiRef.current.setColumnVisibility(field, columnVisibilityModel[field] === false);
  };

  const toggleAllColumns = React.useCallback(
    (isVisible: boolean) => {
      // TODO v6: call `setColumnVisibilityModel` directly
      apiRef.current.updateColumns(
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

  const handleSearchValueChange = React.useCallback((event) => {
    setSearchValue(event.target.value);
  }, []);

  const currentColumns = React.useMemo(() => {
    if (!searchValue) {
      return columns;
    }
    const searchValueToCheck = searchValue.toLowerCase();
    return columns.filter(
      (column) =>
        (column.headerName || column.field).toLowerCase().indexOf(searchValueToCheck) > -1,
    );
  }, [columns, searchValue]);

  React.useEffect(() => {
    searchInputRef.current!.focus();
  }, []);

  return (
    <GridPanelWrapper>
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
        <GridColumnsPanelRoot className={classes.root}>
          {currentColumns.map((column) => (
            <GridColumnsPanelRowRoot className={classes.columnsPanelRow} key={column.field}>
              <FormControlLabel
                control={
                  <rootProps.components.BaseSwitch
                    disabled={column.hideable === false}
                    checked={columnVisibilityModel[column.field] !== false}
                    onClick={toggleColumn}
                    name={column.field}
                    color="primary"
                    size="small"
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
          color="primary"
          {...rootProps.componentsProps?.baseButton}
        >
          {apiRef.current.getLocaleText('columnsPanelHideAllButton')}
        </rootProps.components.BaseButton>
        <rootProps.components.BaseButton
          onClick={() => toggleAllColumns(true)}
          color="primary"
          {...rootProps.componentsProps?.baseButton}
        >
          {apiRef.current.getLocaleText('columnsPanelShowAllButton')}
        </rootProps.components.BaseButton>
      </GridPanelFooter>
    </GridPanelWrapper>
  );
}
