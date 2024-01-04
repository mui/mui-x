import * as React from 'react';
import {
  DataGrid,
  GridRenderCellParams,
  GridToolbar,
  GridColDef,
} from '@mui/x-data-grid';
import Link from '@mui/material/Link';
import {
  randomInt,
  randomUserName,
  randomArrayItem,
} from '@mui/x-data-grid-generator';

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

function ExpandableCell({ value }: GridRenderCellParams) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div>
      {expanded ? value : value.slice(0, 200)}&nbsp;
      {value.length > 200 && (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <Link
          type="button"
          component="button"
          sx={{ fontSize: 'inherit' }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'view less' : 'view more'}
        </Link>
      )}
    </div>
  );
}

const columns: GridColDef[] = [
  { field: 'id' },
  { field: 'username' },
  { field: 'age', type: 'number' },
  {
    field: 'bio',
    width: 400,
    renderCell: (params: GridRenderCellParams) => <ExpandableCell {...params} />,
  },
];

const rows: object[] = [];

for (let i = 0; i < 10; i += 1) {
  const bio = [];

  for (let j = 0; j < randomInt(3, 8); j += 1) {
    bio.push(randomArrayItem(lines));
  }

  rows.push({
    id: i,
    username: randomUserName(),
    age: randomInt(10, 80),
    bio: bio.join(' '),
  });
}

export default function ExpandableCells() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getEstimatedRowHeight={() => 100}
        getRowHeight={() => 'auto'}
        slots={{ toolbar: GridToolbar }}
        sx={{
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
            py: 1,
          },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
            py: '15px',
          },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
            py: '22px',
          },
        }}
      />
    </div>
  );
}
