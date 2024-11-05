import * as React from 'react';
import {
  DataGridPro,
  GridToolbarProps,
  GridToolbarV8 as GridToolbar,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

function Toolbar(props: GridToolbarProps) {
  const { quickFilterProps, filterButtonRef, columnsButtonRef } = props;

  return (
    <GridToolbar.Root>
      <GridToolbar.QuickFilter sx={{ mr: 'auto' }} {...quickFilterProps} />
      <GridToolbar.ColumnsItem ref={columnsButtonRef} />
      <GridToolbar.FilterItem ref={filterButtonRef} />
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
