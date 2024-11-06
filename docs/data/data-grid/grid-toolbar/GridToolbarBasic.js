import * as React from 'react';
import { DataGrid, GridToolbarV8 as GridToolbar } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function Toolbar(props) {
  const { quickFilterProps, filterButtonRef, columnsButtonRef } = props;

  return (
    <GridToolbar.Root>
      <GridToolbar.QuickFilter sx={{ mr: 'auto' }} {...quickFilterProps} />
      <GridToolbar.ColumnsItem ref={columnsButtonRef} />
      <GridToolbar.FilterItem ref={filterButtonRef} />
      <GridToolbar.Separator />
      <GridToolbar.PrintItem />
      <GridToolbar.ExportItem printOptions={{ disableToolbarButton: true }} />
    </GridToolbar.Root>
  );
}

export default function GridToolbarBasic() {
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
