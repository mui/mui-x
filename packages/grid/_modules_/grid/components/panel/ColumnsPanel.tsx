import * as React from 'react';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { allColumnsSelector } from '../../hooks/features/columns/columnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../hooks/utils/useOptionsProp';
import { ApiContext } from '../api-context';
import { DragIcon } from '../icons/index';

const useStyles = makeStyles(
  {
    columnsListContainer: {
      paddingTop: 8,
      paddingLeft: 12,
    },
    column: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '2px 4px',
    },
    switch: {
      marginRight: 4,
    },
    dragIconRoot: {
      justifyContent: 'flex-end',
    },
  },
  { name: 'MuiDataGridColumnsPanel' },
);

export function ColumnsPanel() {
  const classes = useStyles();
  const apiRef = React.useContext(ApiContext);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const columns = useGridSelector(apiRef, allColumnsSelector);
  const { disableColumnReorder } = useGridSelector(apiRef, optionsSelector);
  const [searchValue, setSearchValue] = React.useState('');

  const toggleColumn = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const { name } = event.target as HTMLInputElement;
      apiRef!.current.toggleColumn(name);
    },
    [apiRef],
  );

  const toggleAllColumns = React.useCallback(
    (value: boolean) => {
      apiRef!.current.updateColumns(
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

  const onSearchColumnValueChange = React.useCallback((event) => {
    setSearchValue(event.target.value.toLowerCase());
  }, []);

  const currentColumns = React.useMemo(
    () =>
      !searchValue
        ? columns
        : columns.filter(
            (column) =>
              column.field.toLowerCase().indexOf(searchValue) > -1 ||
              (column.headerName && column.headerName.toLowerCase().indexOf(searchValue) > -1),
          ),
    [columns, searchValue],
  );

  React.useEffect(() => {
    searchInputRef.current!.focus();
  }, []);

  return (
    <React.Fragment>
      <div className="MuiDataGridPanel-header">
        <TextField
          label="Find column"
          placeholder="Column Title"
          inputRef={searchInputRef}
          value={searchValue}
          onChange={onSearchColumnValueChange}
          type="text"
          fullWidth
        />
      </div>
      <div className="MuiDataGridPanel-container">
        <div className={classes.columnsListContainer}>
          {currentColumns.map((column) => (
            <div key={column.field} className={classes.column}>
              <FormControlLabel
                control={
                  <Switch
                    className={classes.switch}
                    checked={!column.hide}
                    onClick={toggleColumn}
                    name={column.field}
                    color="primary"
                    size="small"
                  />
                }
                label={column.headerName || column.field}
              />
              {!disableColumnReorder && (
                <FormControl draggable className={classes.dragIconRoot}>
                  <IconButton
                    aria-label="Drag to reorder column"
                    title="Reorder Column"
                    size="small"
                    disabled
                  >
                    <DragIcon />
                  </IconButton>
                </FormControl>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="MuiDataGridPanel-footer">
        <Button onClick={hideAllColumns} color="primary">
          Hide All
        </Button>
        <Button onClick={showAllColumns} color="primary">
          Show All
        </Button>
      </div>
    </React.Fragment>
  );
}
