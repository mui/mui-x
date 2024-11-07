import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { unstable_useId as useId } from '@mui/material/utils';
import {
  gridPreferencePanelStateSelector,
  GridPreferencePanelsValue,
  GridToolbarV8 as GridToolbar,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import ViewColumn from '@mui/icons-material/ViewColumn';

export const ColumnsPanelTrigger = React.forwardRef(
  function ColumnsPanelTrigger(props, ref) {
    const buttonId = useId();
    const panelId = useId();
    const apiRef = useGridApiContext();
    const { open, openedPanelValue } = useGridSelector(
      apiRef,
      gridPreferencePanelStateSelector,
    );
    const isOpen = open && openedPanelValue === GridPreferencePanelsValue.columns;

    const toggleColumnsPanel = () => {
      if (isOpen) {
        apiRef.current.hidePreferences();
      } else {
        apiRef.current.showPreferences(
          GridPreferencePanelsValue.columns,
          panelId,
          buttonId,
        );
      }
    };

    return (
      <Tooltip title="Columns">
        <GridToolbar.Button
          ref={ref}
          id={buttonId}
          aria-haspopup="true"
          aria-expanded={isOpen ? 'true' : undefined}
          aria-controls={isOpen ? panelId : undefined}
          onClick={toggleColumnsPanel}
        >
          <ViewColumn fontSize="small" />
        </GridToolbar.Button>
      </Tooltip>
    );
  },
);
