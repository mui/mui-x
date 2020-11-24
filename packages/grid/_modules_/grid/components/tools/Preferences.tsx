import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import { allColumnsSelector } from '../../hooks/features/columns/columnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import {
  preferencePanelStateSelector,
  viewportSizeStateSelector,
} from '../../hooks/features/preferencesPanel/preferencePanelSelector';
import { PreferencePanelsValue } from '../../hooks/features/preferencesPanel/preferencesPanelValue';
import { optionsSelector } from '../../hooks/utils/useOptionsProp';
import { ApiContext } from '../api-context';
import { ColumnsPanel } from './ColumnsPanel';
import { FilterPanel } from './FilterPanel';

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    minWidth: 300,
    display: 'flex',
    flexDirection: 'column',
  },
  tabsRoot: {
    flexShrink: 0,
  },
  tab: {
    minWidth: 50,
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flex: 1,
    '& .panelMainContainer': {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      flex: '1 1',
    },
    '& .panelFooter, .panelHeader': {
      padding: 8,
      display: 'inline-flex',
      flexFlow: 'wrap',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      flex: '0 1 50px',
    },
  },
}));

export const PreferencesPanel = () => {
  const classes = useStyles();
  const apiRef = React.useContext(ApiContext);
  const columns = useGridSelector(apiRef, allColumnsSelector);
  const options = useGridSelector(apiRef, optionsSelector);
  const preferencePanelState = useGridSelector(apiRef, preferencePanelStateSelector);
  const viewportSizes = useGridSelector(apiRef, viewportSizeStateSelector);

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
      placement={'bottom-start'}
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
          elevation={8}
        >
          <div className={classes.panel}>
            {!options.disableColumnSelector && isColumnsTabOpen && <ColumnsPanel />}
            {!options.disableColumnFilter && isFiltersTabOpen && <FilterPanel />}
          </div>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};
