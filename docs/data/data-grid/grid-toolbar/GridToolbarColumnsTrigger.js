import * as React from 'react';
import {
  DataGridPro,
  gridPreferencePanelStateSelector,
  GridPreferencePanelsValue,
  GridToolbarV8 as GridToolbar,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import useId from '@mui/utils/useId';
import { useDemoData } from '@mui/x-data-grid-generator';

function ColumnsPanelTrigger() {
  const columnButtonId = useId();
  const columnPanelId = useId();
  const apiRef = useGridApiContext();
  const preferencePanel = useGridSelector(apiRef, gridPreferencePanelStateSelector);

  const showColumns = () => {
    if (
      preferencePanel.open &&
      preferencePanel.openedPanelValue === GridPreferencePanelsValue.columns
    ) {
      apiRef.current.hidePreferences();
    } else {
      apiRef.current.showPreferences(
        GridPreferencePanelsValue.columns,
        columnPanelId,
        columnButtonId,
      );
    }
  };

  const isOpen = preferencePanel.open && preferencePanel.panelId === columnPanelId;

  return (
    <GridToolbar.ToggleButton
      value="columns"
      selected={isOpen}
      onChange={showColumns}
    >
      Columns
    </GridToolbar.ToggleButton>
  );
}

function Toolbar() {
  return (
    <GridToolbar.Root>
      <ColumnsPanelTrigger />
    </GridToolbar.Root>
  );
}

export default function GridToolbarColumnsTrigger() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro {...data} slots={{ toolbar: Toolbar }} />
    </div>
  );
}
