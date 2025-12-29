import * as React from 'react';
import Rating from '@mui/material/Rating';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { randomRating, randomTraderName } from '@mui/x-data-grid-generator';

const columns = [
  { field: 'id', headerName: 'Brand ID' },
  { field: 'brand', headerName: 'Brand name' },
  { field: 'rep', headerName: 'Representative' },
  {
    field: 'rating',
    headerName: 'Rating',
    renderCell: renderRating,
    display: 'flex',
  },
];

function renderRating(params) {
  return <Rating readOnly value={params.value} />;
}

function useRows(length) {
  return React.useMemo(() => {
    const names = [
      'Nike',
      'Adidas',
      'Puma',
      'Reebok',
      'Fila',
      'Lululemon Athletica Clothing',
      'Varley',
    ];

    const rows = Array.from({ length }).map((_, id) => ({
      id,
      brand: names[id % names.length],
      rep: randomTraderName(),
      rating: randomRating(),
    }));

    return rows;
  }, [length]);
}

export default function ColumnAutosizingHeaderFilters() {
  const rows = useRows(100);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        density="compact"
        rows={rows}
        columns={columns}
        headerFilters
        autosizeOptions={{
          includeHeaderFilters: true,
        }}
      />
    </div>
  );
}
