import * as React from 'react';
import {
  DataGrid,
  GridFilterPanelTrigger,
  GridToolbarV8 as GridToolbar,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import FilterListIcon from '@mui/icons-material/FilterList';

function Toolbar() {
  return (
    <GridToolbar.Root>
      <GridFilterPanelTrigger render={<GridToolbar.Button />}>
        <FilterListIcon fontSize="small" />
        Filters
      </GridFilterPanelTrigger>
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
