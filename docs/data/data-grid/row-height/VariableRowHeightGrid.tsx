import * as React from 'react';
import {
  DataGrid,
  GridRowHeightParams,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridColDef,
} from '@mui/x-data-grid';
import { randomInt, randomUserName } from '@mui/x-data-grid-generator';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
}

let idCounter = 0;
const createRandomRow = () => {
  idCounter += 1;
  return { id: idCounter, username: randomUserName(), age: randomInt(10, 80) };
};

const columns: GridColDef[] = [
  { field: 'id' },
  { field: 'username', width: 150 },
  { field: 'age', width: 80, type: 'number' },
];

const rows = [
  createRandomRow(),
  createRandomRow(),
  createRandomRow(),
  createRandomRow(),
  createRandomRow(),
];

export default function VariableRowHeightGrid() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowHeight={({ id, densityFactor }: GridRowHeightParams) => {
          if ((id as number) % 2 === 0) {
            return 100 * densityFactor;
          }

          return null;
        }}
        slots={{
          toolbar: CustomToolbar,
        }}
      />
    </div>
  );
}
