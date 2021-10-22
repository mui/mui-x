import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Switch, { switchClasses } from '@mui/material/Switch';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { allGridColumnsSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridDragIcon } from '../icons/index';
import { GridPanelContent } from './GridPanelContent';
import { GridPanelFooter } from './GridPanelFooter';
import { GridPanelHeader } from './GridPanelHeader';
import { GridPanelWrapper } from './GridPanelWrapper';
import { GRID_EXPERIMENTAL_ENABLED } from '../../constants';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../../GridComponentProps';
import { getDataGridUtilityClass } from '../../gridClasses';

type OwnerState = { classes: GridComponentProps['classes'] };

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
})(() => ({
  padding: '8px 0px 8px 8px',
}));

const GridColumnsPanelRowRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnsPanelRow',
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '1px 8px 1px 7px',
  [`& .${switchClasses.root}`]: {
    marginRight: theme.spacing(0.5),
  },
}));

const StyledIconButton = styled(IconButton)({
  justifyContent: 'flex-end',
});

export function GridColumnsPanel() {
  const apiRef = useGridApiContext();
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const columns = useGridSelector(apiRef, allGridColumnsSelector);
  const rootProps = useGridRootProps();
  const [searchValue, setSearchValue] = React.useState('');
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const toggleColumn = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const { name } = event.target as HTMLInputElement;
      const column = apiRef.current.getColumn(name);
      apiRef.current.setColumnVisibility(name, !!column.hide);
    },
    [apiRef],
  );

  const toggleAllColumns = React.useCallback(
    (value: boolean) => {
      apiRef.current.updateColumns(
        columns.map((col) => {
          col.hide = value;
          return col;
        }),
      );
    },
    [apiRef, columns],
  );

  const showAllColumns = React.useCallback(() => toggleAllColumns(false), [toggleAllColumns]);
  const hideAllColumns = React.useCallback(() => toggleAllColumns(true), [toggleAllColumns]);

  const handleSearchValueChange = React.useCallback((event) => {
    setSearchValue(event.target.value);
  }, []);

  const currentColumns = React.useMemo(
    () =>
      !searchValue
        ? columns
        : columns.filter(
            (column) =>
              column.field.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
              (column.headerName &&
                column.headerName.toLowerCase().indexOf(searchValue.toLowerCase()) > -1),
          ),
    [columns, searchValue],
  );

  React.useEffect(() => {
    searchInputRef.current!.focus();
  }, []);

  return (
    <GridPanelWrapper>
      <GridPanelHeader>
        <TextField
          label={apiRef.current.getLocaleText('columnsPanelTextFieldLabel')}
          placeholder={apiRef.current.getLocaleText('columnsPanelTextFieldPlaceholder')}
          inputRef={searchInputRef}
          value={searchValue}
          onChange={handleSearchValueChange}
          variant="standard"
          fullWidth
        />
      </GridPanelHeader>
      <GridPanelContent>
        <GridColumnsPanelRoot className={classes.root}>
          {currentColumns.map((column) => (
            <GridColumnsPanelRowRoot className={classes.columnsPanelRow} key={column.field}>
              <FormControlLabel
                control={
                  <Switch
                    checked={!column.hide}
                    onClick={toggleColumn}
                    name={column.field}
                    color="primary"
                    size="small"
                  />
                }
                label={column.headerName || column.field}
              />
              {!rootProps.disableColumnReorder && GRID_EXPERIMENTAL_ENABLED && (
                <StyledIconButton
                  draggable
                  aria-label={apiRef.current.getLocaleText('columnsPanelDragIconLabel')}
                  title={apiRef.current.getLocaleText('columnsPanelDragIconLabel')}
                  size="small"
                  disabled
                >
                  <GridDragIcon />
                </StyledIconButton>
              )}
            </GridColumnsPanelRowRoot>
          ))}
        </GridColumnsPanelRoot>
      </GridPanelContent>
      <GridPanelFooter>
        <Button onClick={hideAllColumns} color="primary">
          {apiRef.current.getLocaleText('columnsPanelHideAllButton')}
        </Button>
        <Button onClick={showAllColumns} color="primary">
          {apiRef.current.getLocaleText('columnsPanelShowAllButton')}
        </Button>
      </GridPanelFooter>
    </GridPanelWrapper>
  );
}
