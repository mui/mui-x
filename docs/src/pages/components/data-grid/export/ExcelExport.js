import * as React from 'react';
import {
  DataGridPro,
  GridToolbarContainer,
  GridToolbarExport,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function ExcelExport() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 4,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        components={{
          Toolbar: CustomToolbar,
        }}
        experimentalFeatures={{ excelExport: true }}
      />
    </div>
  );
}
