import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import {
  Box,
  Chip,
  ChipProps,
  ClickAwayListener,
  Grid,
  Paper,
  Popper,
  Tab,
  Tabs,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import { useIcons } from '../hooks/utils/useIcons';
import { COLUMN_FILTER_BUTTON_CLICK, COLUMN_FILTER_CHANGED } from '../constants';
import { ApiContext } from './api-context';
import { ColDef, Columns } from '../models/colDef/colDef';
import { CheckCircleIcon, MenuIcon, SearchIcon, ViewWeekIcon } from './icons/index';

function TabPanel(props) {
  const { children } = props;

  return (
    <div role="tabpanel">
      <Box p={1}>{children}</Box>
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 300,
    '& .tab': {
      minWidth: 50,
    },
    '& .chip': {
      margin: 2,
    },
  },
}));

export interface ColumnFilterMenuProps {
  columns: Columns;
}

export const ColumnFilterMenu: React.FC<ColumnFilterMenuProps> = ({ columns }) => {
  const classes = useStyles();
  const apiRef = React.useContext(ApiContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState('');
  const [target, setTarget] = React.useState<HTMLElement | null>(null);
  const [colDef, setColDef] = React.useState<ColDef | null>(null);
  const icons = useIcons();
  const filterIconElement = React.createElement(icons.columnFiltering!, {});

  const hideTimeout = React.useRef<any>();
  const hidePopper = React.useCallback(() => {
    hideTimeout.current = setTimeout(() => setIsOpen(() => false), 50);
  }, []);

  const onColumnFilterClick = React.useCallback(
    ({ element, column }) => {
      setImmediate(() => clearTimeout(hideTimeout.current));
      setIsOpen((p) => {
        if (colDef == null || column.field !== colDef?.field) {
          setFilterValue('');
          return true;
        }
        return !p;
      });
      setTarget(element);
      setColDef(column);
    },
    [colDef],
  );

  const onFilterChange = React.useCallback((event) => {
    setFilterValue(event.target.value);
  }, []);

  const applyFilter = React.useCallback(
    (event: React.FormEvent) => {
      setFilterValue('');
      event.preventDefault();
      apiRef?.current.publishEvent(COLUMN_FILTER_CHANGED, {
        column: colDef,
        filterValues: [...(colDef?.filterValue || []), filterValue],
      });
    },
    [apiRef, colDef, filterValue],
  );

  const deleteFilter = React.useCallback(
    (event, value) => {
      const newFilterValue = colDef?.filterValue?.filter((v) => v !== value);
      apiRef?.current.publishEvent(COLUMN_FILTER_CHANGED, {
        column: colDef,
        filterValues: newFilterValue,
      });
    },
    [apiRef, colDef],
  );

  React.useEffect(() => {
    return apiRef?.current.subscribeEvent(COLUMN_FILTER_BUTTON_CLICK, onColumnFilterClick);
  }, [apiRef, onColumnFilterClick]);

  React.useEffect(() => {
    // If columns changed we want to use the latest version of our column
    setColDef((prevCol) => {
      if (prevCol != null) {
        const newCol = columns.find((col) => col.field === prevCol.field);
        return newCol || null;
      }
      return prevCol;
    });
  }, [columns]);

  return (
    <Popper placement="bottom" open={isOpen} anchorEl={target} disablePortal={false}>
      <ClickAwayListener onClickAway={hidePopper}>
        <Paper square className={classes.root}>
          <Tabs
            value={2}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            scrollButtons="off"
            aria-label="scrollable prevent tabs example"
          >
            <Tab value={1} icon={<MenuIcon />} fullWidth className="tab" />
            <Tab value={2} icon={filterIconElement} fullWidth className="tab" />
            <Tab value={3} icon={<ViewWeekIcon />} fullWidth className="tab" />
          </Tabs>
          <TabPanel value={2}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <form onSubmit={applyFilter}>
                  <TextField
                    label={`${colDef?.headerName || colDef?.field}`}
                    placeholder={'Filter value'}
                    value={filterValue}
                    onChange={onFilterChange}
                    size={'small'}
                  />
                  <IconButton
                    color="primary"
                    aria-label="Filter"
                    component="span"
                    onSubmit={applyFilter}
                  >
                    <SearchIcon />
                  </IconButton>
                </form>
              </div>
              <div
                style={{
                  paddingTop: 5,
                  display: 'inline-flex',
                  flexFlow: 'wrap',
                  alignItems: 'baseline',
                  justifyContent: 'space-evenly',
                }}
              >
                {colDef?.filterValue?.map((appliedFilter) => (
                  <ChipWithValue
                    key={appliedFilter}
                    icon={<CheckCircleIcon />}
                    label={appliedFilter}
                    value={appliedFilter}
                    onDelete={deleteFilter}
                    variant="outlined"
                    className={'chip'}
                  />
                ))}
              </div>
              {colDef?.filterValue?.length != null && colDef?.filterValue?.length > 1 && (
                <div style={{ display: 'inline-flex', justifyContent: 'center' }}>
                  <Typography component="div">
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item>And</Grid>
                      <Grid item>
                        <Switch
                          defaultChecked
                          color="default"
                          inputProps={{ 'aria-label': 'checkbox with default color' }}
                        />
                      </Grid>
                      <Grid item>Or</Grid>
                    </Grid>
                  </Typography>
                </div>
              )}
            </div>
          </TabPanel>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};

function ChipWithValue(
  props: Omit<ChipProps, 'onDelete'> & {
    value: string;
    onDelete: (event: any, value: string) => void;
  },
) {
  const { value, onDelete, ...chipProps } = props;

  const onDeleteCallback = React.useCallback(
    (event) => {
      if (onDelete) {
        return onDelete(event, value);
      }
      return null;
    },
    [onDelete, value],
  );

  return <Chip {...chipProps} onDelete={onDeleteCallback} />;
}
