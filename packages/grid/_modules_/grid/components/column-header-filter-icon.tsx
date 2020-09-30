import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { useIcons } from '../hooks/utils/useIcons';
import { COLUMN_FILTER_BUTTON_CLICK } from '../constants';
import { ApiContext } from './api-context';
import { ColDef } from '../models/colDef/colDef';
import {
  Box,
  ClickAwayListener,
  Paper,
  Popper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
// import { makeStyles } from '@material-ui/core/styles';

export interface ColumnHeaderFilterIconProps {
  column: ColDef;
}

export const ColumnHeaderFilterIcon: React.FC<ColumnHeaderFilterIconProps> = React.memo(
  ({ column }) => {
    const icons = useIcons();
    const icon = React.createElement(icons.columnFiltering!, {});
    const apiRef = React.useContext(ApiContext);

    const filterClick = React.useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        apiRef!.current.publishEvent(COLUMN_FILTER_BUTTON_CLICK, {
          element: event.currentTarget,
          column,
        });
      },
      [apiRef, column],
    );

    return (
      <div className={'MuiDataGrid-iconFilter'}>
        <IconButton aria-label="Sort" size="small" onClick={filterClick}>
          {icon}
        </IconButton>
      </div>
    );
  },
);
ColumnHeaderFilterIcon.displayName = 'ColumnHeaderFilterIcon';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     maxWidth: 400,
//     overflow: 'auto',
//   },
//   popper: {
//     zIndex: 1,
//     '&[x-placement*="bottom"] $arrow': {
//       top: 0,
//       left: 0,
//       marginTop: '-0.9em',
//       width: '3em',
//       height: '1em',
//       '&::before': {
//         borderWidth: '0 1em 1em 1em',
//         borderColor: `transparent transparent ${theme.palette.background.paper} transparent`,
//       },
//     },
//     '&[x-placement*="top"] $arrow': {
//       bottom: 0,
//       left: 0,
//       marginBottom: '-0.9em',
//       width: '3em',
//       height: '1em',
//       '&::before': {
//         borderWidth: '1em 1em 0 1em',
//         borderColor: `${theme.palette.background.paper} transparent transparent transparent`,
//       },
//     },
//     '&[x-placement*="right"] $arrow': {
//       left: 0,
//       marginLeft: '-0.9em',
//       height: '3em',
//       width: '1em',
//       '&::before': {
//         borderWidth: '1em 1em 1em 0',
//         borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
//       },
//     },
//     '&[x-placement*="left"] $arrow': {
//       right: 0,
//       marginRight: '-0.9em',
//       height: '3em',
//       width: '1em',
//       '&::before': {
//         borderWidth: '1em 0 1em 1em',
//         borderColor: `transparent transparent transparent ${theme.palette.background.paper}`,
//       },
//     },
//   },
//   arrow: {
//     position: 'absolute',
//     fontSize: 7,
//     width: '3em',
//     height: '3em',
//     '&::before': {
//       content: '""',
//       margin: 'auto',
//       display: 'block',
//       width: 0,
//       height: 0,
//       borderStyle: 'solid',
//     },
//   },
// }));

export const ColumnFilterMenu: React.FC = () => {
  // const classes = useStyles();
  const apiRef = React.useContext(ApiContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState('');
  const [target, setTarget] = React.useState<HTMLElement | null>(null);
  const [colDef, setColumn] = React.useState<ColDef | null>(null);
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
      setColumn(column);
    },
    [colDef],
  );

  const onFilterChange = React.useCallback((event) => {
    setFilterValue(event.target.value);
  }, []);

  React.useEffect(() => {
    return apiRef?.current.subscribeEvent(COLUMN_FILTER_BUTTON_CLICK, onColumnFilterClick);
  }, [apiRef, onColumnFilterClick]);

  // const [arrowRef, setArrowRef] = React.useState<any>(null);
  return (
    <Popper
      placement="bottom"
      open={isOpen}
      anchorEl={target}
      disablePortal={false}
      modifiers={{
        flip: {
          enabled: true,
        },
        preventOverflow: {
          enabled: true,
          boundariesElement: 'scrollParent',
        },
        // arrow: {
        //   enabled: true,
        //   element: arrowRef,
        // },
      }}
    >
      {/*<span className={classes.arrow} ref={setArrowRef} />*/}

      <ClickAwayListener onClickAway={hidePopper}>
        <Paper square>

          <Tabs
            value={0}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            scrollButtons="off"
            aria-label="scrollable prevent tabs example"
          >
            <Tab icon={filterIconElement} />
            <Tab icon={<ViewWeekIcon />} disabled />
          </Tabs>
          <TabPanel value={0} index={0}>
            <div>
              <TextField
                id="standard-basic"
                label={`${colDef?.headerName || colDef?.field}`}
                placeholder={'Filter value'}
                value={filterValue}
                onChange={onFilterChange}
              />
              <IconButton color="primary" aria-label="Filter" component="span">
                <Search />
              </IconButton>
            </div>
          </TabPanel>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};
