import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import GridList from '@material-ui/core/GridList';
import ListItem from '@material-ui/core/ListItem';
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { allColumnsSelector } from '../../hooks/features/columns/columnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { PREVENT_HIDE_PREFERENCES } from '../../constants/index';
import { ApiContext } from '../api-context';

const useStyles = makeStyles(() => ({
  gridListRoot: {
    maxWidth: '100%',
  },
}));

export const ColumnsPanel: React.FC<{}> = () => {
  const classes = useStyles();

  const apiRef = React.useContext(ApiContext);
  const columns = useGridSelector(apiRef, allColumnsSelector);

  const dontHidePreferences = React.useCallback(
    (event: React.ChangeEvent<{}>) => {
      apiRef!.current.publishEvent(PREVENT_HIDE_PREFERENCES, {});
      event.preventDefault();
    },
    [apiRef],
  );

  const toggleColumn = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dontHidePreferences(event);
      apiRef!.current.toggleColumn(event.target.name, !event.target.checked);
    },
    [apiRef, dontHidePreferences],
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

  return (
    <React.Fragment>
      <div className="panelMainContainer">
        <GridList cellHeight={'auto'} className={classes.gridListRoot}>
          {columns.map((column) => (
            <ListItem key={column.field}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!column.hide}
                    onChange={toggleColumn}
                    name={column.field}
                    color="primary"
                  />
                }
                label={column.headerName || column.field}
              />
            </ListItem>
          ))}
        </GridList>
      </div>
      <div className="panelFooter">
        <Button onClick={hideAllColumns} color="primary">
          Hide All
        </Button>
        <Button onClick={showAllColumns} color="primary">
          Show All
        </Button>
      </div>
    </React.Fragment>
  );
};
