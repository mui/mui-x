import * as React from 'react';
import {
  DataGrid,
  gridPreferencePanelStateSelector,
  GridPreferencePanelsValue,
  GridToolbarV8 as GridToolbar,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import useId from '@mui/utils/useId';

function ColumnsPanelTrigger() {
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
    <GridToolbar.Button
      id={buttonId}
      aria-haspopup="true"
      aria-expanded={isOpen ? 'true' : undefined}
      aria-controls={isOpen ? panelId : undefined}
      onClick={toggleColumnsPanel}
    >
      <ViewColumnIcon fontSize="small" />
      Columns
    </GridToolbar.Button>
  );
}

function Toolbar() {
  return (
    <GridToolbar.Root>
      <ColumnsPanelTrigger />
    </GridToolbar.Root>
  );
}

export default function GridToolbarColumnsPanelTrigger() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} slots={{ toolbar: Toolbar }} />
    </div>
  );
}
