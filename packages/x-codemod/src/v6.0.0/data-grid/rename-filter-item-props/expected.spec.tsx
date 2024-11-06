import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DataGridPremium, GridFilterModel } from '@mui/x-data-grid-premium';

const columns = [{ field: 'column' }];

const rows = [
  { id: 1, column: 'a', name: 'John', score: 100 },
  { id: 2, column: 'b', name: 'Steward', score: 200 },
  { id: 3, column: 'c', name: 'James', score: 300 },
];

// prettier-ignore
function App() {
  const [proFilterModel, setProFilterModel] = React.useState<GridFilterModel>({
    items: [
      {
        field: 'name',
        operator: 'startsWith',
        value: 'J',
      },
    ],
  });
  const premiumFilterModel = React.useRef<GridFilterModel>({
    items: [
      {
        field: 'score',
        operator: '>',
        value: 100,
      },
    ],
  });
  return (
    (<React.Fragment>
      <DataGrid
        columns={columns}
        rows={rows}
        initialState={{
          filter: {
            filterModel: {
              items: [
                {
                  field: 'column',
                  operator: 'contains',
                  value: 'a',
                },
              ],
            },
          },
        }}
        filterModel={{
          items: [
            {
              field: 'column',
              operator: 'contains',
              value: 'a',
            },
          ],
        }}
      />
      <DataGridPro
        columns={columns}
        rows={rows}
        filterModel={proFilterModel}
        onFilterModelChange={(model) => setProFilterModel(model)}
      />
      <DataGridPremium
        columns={columns}
        rows={rows}
        filterModel={premiumFilterModel.current}
        onFilterModelChange={(model) => {
          premiumFilterModel.current = model;
        }}
      />
    </React.Fragment>)
  );
}
