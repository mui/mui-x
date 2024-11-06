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
  const columnButtonId = useId();
  const columnPanelId = useId();
  const apiRef = useGridApiContext();
  const { open, openedPanelValue } = useGridSelector(
    apiRef,
    gridPreferencePanelStateSelector,
  );
  const isOpen = open && openedPanelValue === GridPreferencePanelsValue.columns;

  const toggleColumns = () => {
    if (isOpen) {
      apiRef.current.hidePreferences();
    } else {
      apiRef.current.showPreferences(
        GridPreferencePanelsValue.columns,
        columnPanelId,
        columnButtonId,
      );
    }
  };

  return (
    <GridToolbar.ToggleButton
      value="columns"
      selected={isOpen}
      onChange={toggleColumns}
    >
      <ViewColumnIcon fontSize="small" />
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
