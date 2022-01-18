import * as React from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
}

export default function VariableRowHeightGrid() {
  const isRowIndexOdd = React.useRef(false);
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        getRowHeight={() => {
          isRowIndexOdd.current = !isRowIndexOdd.current;

          if (isRowIndexOdd.current) {
            return 100;
          }

          return null;
        }}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </div>
  );
}
