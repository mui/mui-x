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
import { PreferencePanelState } from '../../hooks/features/preferencesPanel/preferencePanelState';
import { PreferencePanelsValue } from '../../hooks/features/preferencesPanel/preferencesPanelValue';
import { useIcons } from '../../hooks/utils/useIcons';
import { findHeaderElementFromField } from '../../utils/domUtils';
import { ApiContext } from '../api-context';
import { ViewWeekIcon } from '../icons/index';
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
  },
  // },
}));
// TODO refactor tab to navigation with a showNav prop on the component
// TODO Extract Panel component?

export const PreferencesPanel = () => {
  const classes = useStyles();
  const apiRef = React.useContext(ApiContext);
  const columns = useGridSelector(apiRef, allColumnsSelector);
  const preferencePanelState = useGridSelector(apiRef, preferencePanelStateSelector);
  const viewportSizes = useGridSelector(apiRef, viewportSizeStateSelector);
  const [target, setTarget] = React.useState<Element | null>(null);

  const icons = useIcons();
  const filterIconElement = React.createElement(icons.ColumnFiltering!, {});

  const changeTab = React.useCallback(
    (event: React.ChangeEvent<{}>, newValue: PreferencePanelsValue) => {
      apiRef?.current.showPreferences(newValue);
    },
    [apiRef],
  );

  const updateColumnTarget = React.useCallback(
    ({ open, targetField }: PreferencePanelState) => {
      if (open && columns.length > 0) {
        const headerCellEl = findHeaderElementFromField(
          apiRef!.current!.rootElementRef!.current!,
          targetField || columns[0].field,
        );
        setTarget(headerCellEl);
      }
    },
    [apiRef, columns],
  );

  const hidePreferences = React.useCallback(() => {
    apiRef?.current.hidePreferences();
  }, [apiRef]);

  React.useEffect(() => {
    if(columns.length > 0) {
      updateColumnTarget(preferencePanelState);
    }
  }, [preferencePanelState, updateColumnTarget, columns]);

  const isColumnsTabOpen = preferencePanelState.openedPanelValue === PreferencePanelsValue.columns;
  const isFiltersTabOpen = !preferencePanelState.openedPanelValue || !isColumnsTabOpen;

  return (
    <Popper
      placement="bottom"
      open={columns.length > 0 && preferencePanelState.open}
      anchorEl={target || apiRef?.current.rootElementRef!.current}
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
            <Tab
              value={PreferencePanelsValue.filters}
              icon={filterIconElement}
              fullWidth
              className={classes.tab}
              label={'Filters'}
            />
            <Tab
              value={PreferencePanelsValue.columns}
              icon={<ViewWeekIcon />}
              fullWidth
              className={classes.tab}
              label={'Columns'}
            />
          </Tabs>
          {isColumnsTabOpen && (
            <TabPanel className={classes.tabPanel}>
              <ColumnsPanel />
            </TabPanel>
          )}
          {isFiltersTabOpen && (
            <TabPanel className={classes.tabPanel}>
              <FilterPanel />
            </TabPanel>
          )}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};
