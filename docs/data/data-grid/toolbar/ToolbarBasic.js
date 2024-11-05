import * as React from 'react';
import { DataGridPro, GridToolbarV8 as GridToolbar } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

function Toolbar(props) {
  const { quickFilterProps } = props;

  return (
    <GridToolbar.Root>
      <GridToolbar.QuickFilter sx={{ mr: 'auto' }} {...quickFilterProps} />
      <GridToolbar.ColumnsItem />
      <GridToolbar.FilterItem />
      <GridToolbar.FilterChip />
      <GridToolbar.Separator />
      <GridToolbar.PrintItem />
      <GridToolbar.ExportItem printOptions={{ disableToolbarButton: true }} />
      <GridToolbar.Separator />
      <GridToolbar.DensityItem />
    </GridToolbar.Root>
  );
}

export default function ToolbarBasic() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro {...data} slots={{ toolbar: Toolbar }} />
    </div>
  );
}
