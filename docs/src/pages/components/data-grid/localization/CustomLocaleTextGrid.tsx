import * as React from 'react';
import { DataGrid, GridHeader } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export default function CustomLocaleTextGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 4,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        components={{
          Header: GridHeader,
        }}
        localeText={{
          toolbarDensity: 'Size',
          toolbarDensityLabel: 'Size',
          toolbarDensityCompact: 'Small',
          toolbarDensityStandard: 'Medium',
          toolbarDensityComfortable: 'Large',
        }}
      />
    </div>
  );
}
