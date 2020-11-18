import { ClickAwayListener, Paper, Popper, Tab, Tabs, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import {
  preferencePanelStateSelector,
  viewportSizeStateSelector,
} from '../../hooks/features/preferencesPanel/preferencePanelSelector';
import { PreferencePanelState } from '../../hooks/features/preferencesPanel/preferencePanelState';
import { PreferencePanelsValue } from '../../hooks/features/preferencesPanel/preferencesPanelValue';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { useIcons } from '../../hooks/utils/useIcons';
import { findHeaderElementFromField } from '../../utils/domUtils';
import { ApiContext } from '../api-context';
import { ViewWeekIcon } from '../icons/index';
import { FilterPanel } from './FilterPanel';

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
    width: 600,
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
// TODO refactor tab to navigation with a showNav prop on the component
// TODO Extract Panel component?

export const PreferencesPanel = () => {
  const classes = useStyles();
  const apiRef = React.useContext(ApiContext);

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
      if (targetField && open) {
        const headerCellEl = findHeaderElementFromField(
          apiRef!.current!.rootElementRef!.current!,
          targetField!,
        );
        setTarget(headerCellEl);
      }
    },
    [apiRef],
  );

  const hidePreferences = React.useCallback(() => {
    apiRef?.current.hidePreferences();
  }, [apiRef]);

  React.useEffect(() => {
    updateColumnTarget(preferencePanelState);
  }, [preferencePanelState, updateColumnTarget]);

  const isColumnsTabOpen = preferencePanelState.openedPanelValue === PreferencePanelsValue.columns;
  const isFiltersTabOpen = !isColumnsTabOpen;

  return (
    <Popper
      placement="bottom"
      open={preferencePanelState.open}
      anchorEl={target || apiRef?.current.rootElementRef!.current}
      style={{ position: 'relative' }}
    >
      <ClickAwayListener onClickAway={hidePreferences}>
        <Paper
          square
          className={classes.root}
          style={{
            maxHeight: viewportSizes.height,
            maxWidth: viewportSizes.width,
          }}
        >
          <Tabs
            value={preferencePanelState.openedPanelValue}
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
