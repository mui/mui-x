import * as React from 'react';
import { DataGrid, GridRowHeightParams } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function VariableRowHeightGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        getRowHeight={({ model }: GridRowHeightParams) => {
          if (
            model.commodity.includes('Oats') ||
            model.commodity.includes('Milk') ||
            model.commodity.includes('Soybean') ||
            model.commodity.includes('Rice')
          ) {
            return 100;
          }

          return null;
        }}
      />
    </div>
  );
}
