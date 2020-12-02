import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { viewportSizeStateSelector } from '../../hooks/features/preferencesPanel/preferencePanelSelector';
import { ApiContext } from '../api-context';

const useStyles = makeStyles(
  (theme: Theme) => ({
    paper: {
      backgroundColor: theme.palette.background.paper,
      minWidth: 300,
      display: 'flex',
      flexDirection: 'column',
    },
    panel: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flex: 1,
      '& .MuiDataGridPanel-container': {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        flex: '1 1',
      },
      '& .MuiDataGridPanel-footer, .MuiDataGridPanel-header': {
        padding: 8,
        display: 'inline-flex',
        justifyContent: 'space-between',
      },
    },
  }),
  { name: 'MuiDataGridPanel' },
);

export interface PanelProps {
  children?: React.ReactNode;
  open: boolean;
}

export function Panel(props: PanelProps) {
  const { children, open } = props;
  const classes = useStyles();
  const apiRef = React.useContext(ApiContext);
  const viewportSizes = useGridSelector(apiRef, viewportSizeStateSelector);

  const hidePreferences = React.useCallback(() => {
    apiRef?.current.hidePreferences();
  }, [apiRef]);

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
      open={open}
      anchorEl={anchorEl}
      style={{ position: 'relative', zIndex: 100 }}
    >
      <ClickAwayListener onClickAway={hidePreferences}>
        <Paper
          className={classes.paper}
          style={{
            maxHeight: viewportSizes.height > 600 ? 600 : viewportSizes.height,
            maxWidth: viewportSizes.width,
          }}
          elevation={8}
        >
          <div className={classes.panel}>{children}</div>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}
