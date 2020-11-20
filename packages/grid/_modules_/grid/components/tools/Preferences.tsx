import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import * as React from 'react';
import { allColumnsSelector } from '../../hooks/features/columns/columnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import {
  preferencePanelStateSelector,
  viewportSizeStateSelector,
} from '../../hooks/features/preferencesPanel/preferencePanelSelector';
import { PreferencePanelsValue } from '../../hooks/features/preferencesPanel/preferencesPanelValue';
import { useIcons } from '../../hooks/utils/useIcons';
import { optionsSelector } from '../../hooks/utils/useOptionsProp';
import { ApiContext } from '../api-context';
import { ColumnsPanel } from './ColumnsPanel';
import { FilterPanel } from './FilterPanel';

export const TabPanel: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const { children, ...rest } = props;

  return (
    <div role="tabpanel" {...rest}>
      {children}
    </div>
  );
};
const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    width: 600,
    minHeight: 200,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 5px 5px 0px #00000070',
  },
  tabsRoot: {
    flexShrink: 0,
  },
  tab: {
    minWidth: 50,
  },
  tabPanel: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flex: 1,
    '& .panelMainContainer': {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      flex: '1 1',
      paddingTop: 12,
      paddingLeft: 12,
    },
    '& .panelFooter': {
      padding: 12,
      display: 'inline-flex',
      flexFlow: 'wrap',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      flex: '0 1 50px',
    },
  },
}));
// TODO refactor tab to navigation with a showNav prop on the component
// TODO Extract Panel component?

export const PreferencesPanel = () => {
  const classes = useStyles();
  const apiRef = React.useContext(ApiContext);
  const columns = useGridSelector(apiRef, allColumnsSelector);
  const options = useGridSelector(apiRef, optionsSelector);
  const preferencePanelState = useGridSelector(apiRef, preferencePanelStateSelector);
  const viewportSizes = useGridSelector(apiRef, viewportSizeStateSelector);

  const icons = useIcons();
  const filterIconElement = React.createElement(icons.ColumnFiltering!, {});
  const columnsIconElement = React.createElement(icons.ColumnSelector!, {});

  const changeTab = React.useCallback(
    (event: React.ChangeEvent<{}>, newValue: PreferencePanelsValue) => {
      apiRef?.current.showPreferences(newValue);
    },
    [apiRef],
  );

  const hidePreferences = React.useCallback(() => {
    apiRef?.current.hidePreferences();
  }, [apiRef]);

  const isColumnsTabOpen = preferencePanelState.openedPanelValue === PreferencePanelsValue.columns;
  const isFiltersTabOpen = !preferencePanelState.openedPanelValue || !isColumnsTabOpen;

  let anchorEl;
  if (apiRef?.current && apiRef?.current.columnHeadersElementRef!.current) {
    anchorEl = apiRef?.current.columnHeadersElementRef!.current;
  }

  if (!anchorEl) {
    return null;
  }

  return (
    <Popper
      placement="bottom"
      open={columns.length > 0 && preferencePanelState.open}
      anchorEl={anchorEl}
      style={{ position: 'relative' }}
    >
      <ClickAwayListener onClickAway={hidePreferences}>
        <Paper
          square
          className={classes.paper}
          style={{
            maxHeight: viewportSizes.height,
            maxWidth: viewportSizes.width,
          }}
        >
          <Tabs
            value={preferencePanelState.openedPanelValue || PreferencePanelsValue.filters}
            className={classes.tabsRoot}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            scrollButtons="off"
            aria-label="scrollable prevent tabs example"
            onChange={changeTab}
          >
            {!options.disableColumnFilter && (
              <Tab
                value={PreferencePanelsValue.filters}
                icon={filterIconElement}
                fullWidth
                className={classes.tab}
                label={'Filters'}
              />
            )}
            {!options.disableColumnSelector && (
              <Tab
                value={PreferencePanelsValue.columns}
                icon={columnsIconElement}
                fullWidth
                className={classes.tab}
                label={'Columns'}
              />
            )}
          </Tabs>
          {!options.disableColumnSelector && isColumnsTabOpen && (
            <TabPanel className={classes.tabPanel}>
              <ColumnsPanel />
            </TabPanel>
          )}
          {!options.disableColumnFilter && isFiltersTabOpen && (
            <TabPanel className={classes.tabPanel}>
              <FilterPanel />
            </TabPanel>
          )}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};
