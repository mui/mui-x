import * as React from 'react';
import { DataGridPremium, GridColDef } from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';
import Rating from '@mui/material/Rating';

const COLUMNS: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 200, groupable: false },
  {
    field: 'imdbRating',
    headerName: 'Rating',
    type: 'number',
    width: 180,
    availableAggregationFunctions: ['min', 'max', 'avg', 'size'],
    display: 'flex',
    // Imdb rating is on a scale from 0 to 10, the MUI rating component is on a scale from 0 to 5
    renderCell: (params) => {
      if (params.aggregation && !params.aggregation.hasCellUnit) {
        return params.formattedValue;
      }

      return (
        <Rating
          name={params.row.title}
          value={params.value / 2}
          readOnly
          precision={0.5}
        />
      );
    },
  },
];

export default function AggregationRenderCell() {
  const data = useMovieData();

  // We take movies with the highest and lowest rating to have a visual difference
  const rows = React.useMemo(() => {
    return [...data.rows].sort((a, b) => b.imdbRating - a.imdbRating);
  }, [data.rows]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={COLUMNS}
        initialState={{
          aggregation: {
            model: {
              imdbRating: 'avg',
            },
          },
        }}
      />
    </div>
  );
}
