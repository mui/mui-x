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
import FilterListIcon from '@mui/icons-material/FilterList';
import useId from '@mui/utils/useId';

function FilterPanelTrigger() {
  const filterButtonId = useId();
  const filterPanelId = useId();
  const apiRef = useGridApiContext();
  const { open, openedPanelValue } = useGridSelector(
    apiRef,
    gridPreferencePanelStateSelector,
  );
  const isOpen = open && openedPanelValue === GridPreferencePanelsValue.filters;

  const toggleFilters = () => {
    if (isOpen) {
      apiRef.current.hidePreferences();
    } else {
      apiRef.current.showPreferences(
        GridPreferencePanelsValue.filters,
        filterPanelId,
        filterButtonId,
      );
    }
  };

  return (
    <GridToolbar.ToggleButton
      value="filters"
      selected={isOpen}
      onChange={toggleFilters}
    >
      <FilterListIcon fontSize="small" />
      Filters
    </GridToolbar.ToggleButton>
  );
}

function Toolbar() {
  return (
    <GridToolbar.Root>
      <FilterPanelTrigger />
    </GridToolbar.Root>
  );
}

export default function GridToolbarFilterPanelTrigger() {
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
