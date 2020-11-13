import { Box, ClickAwayListener, Paper, Popper, Tab, Tabs, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { PREVENT_HIDE_PREFERENCES } from '../../constants/eventsConstants';
import { useGridState } from '../../hooks/features/core/useGridState';
import { useApiEventHandler } from '../../hooks/root/useApiEventHandler';
import { useIcons } from '../../hooks/utils/useIcons';
import { findHeaderElementFromField } from '../../utils/domUtils';
import { ApiContext } from '../api-context';
import { ViewWeekIcon } from '../icons/index';
import { FilterPanel } from './filterPanel';

export interface PreferencePanelState {
  open: boolean;
  openedPanelValue?: PreferencePanelsValue;
  targetField?: string;
}

export enum PreferencePanelsValue {
  filters = 'filters',
  columns = 'columns',
}

export function TabPanel(props) {
  const { children } = props;

  return (
    <div
      role="tabpanel"
      style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}
    >
      {children}
    </div>
  );
}
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
    minHeight: 200,
    display: 'flex',
    flexDirection: 'column',
    '& .tab': {
      minWidth: 50,
    },
    '& .chip': {
      margin: 2,
    },
  },
}));
// const preferenceSelector = (state: GridState) => state.preferencePanel;

export const PreferencesPanel = () => {
  const classes = useStyles();
  const apiRef = React.useContext(ApiContext);

  const [gridState, setGridState, forceUpdate] = useGridState(apiRef!);
  const [target, setTarget] = React.useState<Element | null>(null);

	const icons = useIcons();
	const filterIconElement = React.createElement(icons.columnFiltering!, {});

  const hideTimeout = React.useRef<any>();
  const hidePreferences = React.useCallback(() => {
    setGridState((state) => ({ ...state, preferencePanel: { open: false } }));
    forceUpdate();
  }, [forceUpdate, setGridState]);

  const hidePreferencesDelayed = React.useCallback(() => {
    hideTimeout.current = setTimeout(() => hidePreferences(), 50);
  }, [hidePreferences]);
  // This is to prevent the preferences from closing when you open a select box, issue with MUI core V4 => Fixed in V5
  const dontHidePanel = React.useCallback(() => {
    setImmediate(() => clearTimeout(hideTimeout.current));
  }, []);

  useApiEventHandler(apiRef!, PREVENT_HIDE_PREFERENCES, dontHidePanel);

  const changeTab = React.useCallback(
    (event: React.ChangeEvent<{}>, newValue: PreferencePanelsValue) => {
      setGridState((state) => ({
        ...state,
        preferencePanel: { ...state.preferencePanel, open: true, openedPanelValue: newValue },
      }));
      forceUpdate();
    },
    [forceUpdate, setGridState],
  );

  const updateColumnTarget = React.useCallback(
    ({ open, targetField }: PreferencePanelState) => {
      if (targetField && open) {
        const headerCellEl = findHeaderElementFromField(
          apiRef!.current!.rootElementRef!.current!,
          targetField!,
        );
        setTarget(headerCellEl);
      }
    },
    [apiRef],
  )

  React.useEffect(() => {
    updateColumnTarget(gridState.preferencePanel);
  }, [gridState.preferencePanel, updateColumnTarget]);

  const isColumnsTabOpen =
    gridState.preferencePanel.openedPanelValue === PreferencePanelsValue.columns;
  const isFiltersTabOpen = !isColumnsTabOpen;

  return (
    <Popper
      placement="bottom"
      open={gridState.preferencePanel.open}
      anchorEl={target || apiRef?.current.rootElementRef!.current}
    >
      <ClickAwayListener onClickAway={hidePreferencesDelayed}>
        <Paper square className={classes.root} style={{maxHeight: gridState.viewportSizes.height, maxWidth: gridState.viewportSizes.width}}>
          <Tabs
            value={gridState.preferencePanel.openedPanelValue}
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
              className="tab"
              label={'Filters'}
            />
            <Tab
              value={PreferencePanelsValue.columns}
              icon={<ViewWeekIcon />}
              fullWidth
              className="tab"
              label={'Columns'}
            />
          </Tabs>
          {isColumnsTabOpen && (
            <TabPanel value={PreferencePanelsValue.columns}>Column Picker here</TabPanel>
          )}
          {isFiltersTabOpen && (
            <TabPanel value={PreferencePanelsValue.filters}>
              <FilterPanel />
            </TabPanel>
          )}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};
