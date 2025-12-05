import * as React from 'react';
import Rating from '@mui/material/Rating';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { randomRating, randomTraderName } from '@mui/x-data-grid-generator';

function renderRating(params: any) {
  return <Rating readOnly value={params.value} />;
}

function useData(length: number) {
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

    const columns = [
      { field: 'id', headerName: 'Brand ID' },
      { field: 'brand', headerName: 'Brand name' },
      { field: 'rep', headerName: 'Representative' },
      {
        field: 'rating',
        headerName: 'Rating',
        renderCell: renderRating,
        display: 'flex' as const,
      },
    ];

    return { rows, columns };
  }, [length]);
}

export default function ColumnAutosizingHeaderFilters() {
  const data = useData(100);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        density="compact"
        {...data}
        headerFilters
        autosizeOptions={{
          includeHeaderFilters: true,
        }}
      />
    </div>
  );
}
