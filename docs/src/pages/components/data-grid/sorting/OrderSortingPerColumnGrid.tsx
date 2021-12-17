import * as React from 'react';
import {
  GridRowsProp,
  DataGrid,
} from '@mui/x-data-grid';
import { randomQuantity } from '@mui/x-data-grid-generator';

const rows: GridRowsProp = [
  {
    id: 1,
    platform: 'win-x86',
    downloads: randomQuantity(),
  },
  {
    id: 2,
    platform: 'win-x64',
    downloads: randomQuantity(),
  },
  {
    id: 3,
    platform: 'win-arm',
    downloads: randomQuantity(),
  },
  {
    id: 4,
    platform: 'win-arm64',
    downloads: randomQuantity(),
  },
  {
    id: 5,
    platform: 'linux-x64',
    downloads: randomQuantity(),
  },
  {
    id: 6,
    platform: 'linux-arm',
    downloads: randomQuantity(),
  },
  {
    id: 7,
    platform: 'linux-arm64',
    downloads: randomQuantity(),
  },
  {
    id: 8,
    platform: 'osx-x64',
    downloads: randomQuantity(),
  },
];

export default function OrderSortingPerColumnGrid() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={[
          { field: 'platform', width: 200 },
          { field: 'downloads', width: 200, type: 'number', sortingOrder: ['desc', 'asc', null] },
        ]}
        sortingOrder={['asc', 'desc', null]}
      />
    </div>
  );
}
