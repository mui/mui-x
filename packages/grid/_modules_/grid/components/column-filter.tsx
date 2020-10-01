import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { useIcons } from '../hooks/utils/useIcons';
import {COLUMN_FILTER_BUTTON_CLICK, COLUMN_FILTER_CHANGED} from '../constants';
import { ApiContext } from './api-context';
import {ColDef, Columns} from '../models/colDef/colDef';
import {
  Box, Chip, ChipProps,
  ClickAwayListener,
  Paper,
  Popper,
  Tab,
  Tabs,
  TextField, Theme,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
import MenuIcon from '@material-ui/icons/Menu';
import {makeStyles} from "@material-ui/core/styles";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

function TabPanel(props) {
  const { children } = props;

  return (
    <div
      role="tabpanel"
    >
      <Box p={1}>
        {children}
      </Box>
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 300,
  '& .tab': {
    minWidth: 50
  },
    '& .chip': {
    margin: 2
  }
  },

}));

export interface ColumnFilterMenuProps {
  columns: Columns
}

export const ColumnFilterMenu: React.FC<ColumnFilterMenuProps> = ({columns} ) => {
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

  const applyFilter = React.useCallback((event: React.FormEvent) => {
    setFilterValue('');
    event.preventDefault();
    apiRef?.current.publishEvent(COLUMN_FILTER_CHANGED, {column: colDef, filterValues: [...(colDef?.filterValue || []), filterValue]});

  }, [apiRef, colDef, filterValue]);

  const deleteFilter = React.useCallback((event, value) => {
    const newFilterValue = colDef?.filterValue?.filter(v=> v!==value);
    apiRef?.current.publishEvent(COLUMN_FILTER_CHANGED, {column: colDef, filterValues: newFilterValue});

  }, [apiRef, colDef]);

  React.useEffect(() => {
    return apiRef?.current.subscribeEvent(COLUMN_FILTER_BUTTON_CLICK, onColumnFilterClick);
  }, [apiRef, onColumnFilterClick]);

  React.useEffect(() => {
    //If columns changed we want to use the latest version of our column
    setColDef(prevCol => {
      if(prevCol != null) {
        const newCol = columns.find(col=> col.field === prevCol.field);
        return newCol || null;
      }
      return prevCol;
    });
  },[columns]);

    return (
    <Popper
      placement="bottom"
      open={isOpen}
      anchorEl={target}
      disablePortal={false}
    >
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
            <Tab value={1} icon={<MenuIcon />}  fullWidth className="tab" />
            <Tab  value={2}  icon={filterIconElement} fullWidth className="tab" />
            <Tab   value={3} icon={<ViewWeekIcon />} fullWidth className="tab" />
          </Tabs>
          <TabPanel value={2} >
            <div style={{display: 'flex', flexDirection:'column'}}>
              <div style={{display: 'flex', justifyContent: 'center'}}>
              <form onSubmit={applyFilter} >
                <TextField
                  label={`${colDef?.headerName || colDef?.field}`}
                  placeholder={'Filter value'}
                  value={filterValue}
                  onChange={onFilterChange}
                  size={'small'}
                />
                <IconButton color="primary" aria-label="Filter" component="span" onSubmit={applyFilter}>
                  <Search />
                </IconButton>
              </form>
              </div>
              <div style={{paddingTop: 5, display: 'inline-flex',
                flexFlow: 'wrap',
                alignItems: 'baseline',
                justifyContent: 'space-evenly'}}>

                {colDef?.filterValue?.map(appliedFilter => (
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
            </div>
          </TabPanel>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};

function ChipWithValue (props: Omit<ChipProps, 'onDelete'> & {value: string, onDelete: (event: any, value: string)=> void} ) {
  const {value, onDelete, ...chipProps} = props;

  const onDeleteCallback = React.useCallback((event)=> {
    if(onDelete) {
      return onDelete(event, value)
    }
  }, [props]);

  return <Chip {...chipProps} onDelete={onDeleteCallback} />
}
