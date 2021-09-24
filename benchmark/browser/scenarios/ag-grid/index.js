import * as React from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const ROWS = 100000;
const COLUMNS = 10000;

const columns = [];
const rows = [];

for (let columnIdx = 0; columnIdx < COLUMNS; columnIdx += 1) {
  columns.push({
    field: `col-${columnIdx}`,
    valueGetter: (row) => `${row.data.id} ${columnIdx}`,
  });
}

for (let rowIdx = 0; rowIdx < ROWS; rowIdx += 1) {
  rows.push({ id: rowIdx });
}

export default function AgGrid() {
  return (
    <div className="ag-theme-alpine" style={{ height: 'calc(100vh - 16px)', width: '100%' }}>
      <AgGridReact rowData={rows} rowHeight={32}>
        {columns.map((column) => (
          <AgGridColumn
            key={column.field}
            field={column.field}
            width={100}
            valueGetter={column.valueGetter}
          />
        ))}
      </AgGridReact>
    </div>
  );
}
