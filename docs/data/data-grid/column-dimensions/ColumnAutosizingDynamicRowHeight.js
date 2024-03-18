import * as React from 'react';
import Button from '@mui/material/Button';
import { DataGrid, gridClasses, useGridApiRef } from '@mui/x-data-grid';
import { randomInt, randomArrayItem } from '@mui/x-data-grid-generator';

const lines = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Aliquam dapibus, lorem vel mattis aliquet, purus lorem tincidunt mauris, in blandit quam risus sed ipsum.',
  'Maecenas non felis venenatis, porta velit quis, consectetur elit.',
  'Vestibulum commodo et odio a laoreet.',
  'Nullam cursus tincidunt auctor.',
  'Sed feugiat venenatis nulla, sit amet dictum nulla convallis sit amet.',
  'Nulla venenatis justo non felis vulputate, eu mollis metus ornare.',
  'Nam ullamcorper ligula id consectetur auctor.',
  'Phasellus et ultrices dui.',
  'Fusce facilisis egestas massa, et eleifend magna imperdiet et.',
  'Pellentesque ac metus velit.',
  'Vestibulum in massa nibh.',
  'Vestibulum pulvinar aliquam turpis, ac faucibus risus varius a.',
];

const columns = [{ field: 'id' }, { field: 'bio', width: 400 }];

const rows = [];

for (let i = 0; i < 200; i += 1) {
  const bio = [];

  for (let j = 0; j < randomInt(1, 5); j += 1) {
    bio.push(randomArrayItem(lines));
  }

  rows.push({ id: i, bio: bio.join(' ') });
}

const autosizeOptions = {
  includeOutliers: true,
};

export default function ColumnAutosizingDynamicRowHeight() {
  const apiRef = useGridApiRef();

  return (
    <div style={{ width: '100%' }}>
      <Button onClick={() => apiRef.current.autosizeColumns(autosizeOptions)}>
        Autosize Columns
      </Button>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          getRowHeight={() => 'auto'}
          autosizeOptions={autosizeOptions}
          sx={{
            [`& .${gridClasses.cell}`]: {
              py: 0.5,
            },
          }}
        />
      </div>
    </div>
  );
}
