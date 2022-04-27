import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const COLUMNS = [
  { field: 'title', headerName: 'Title', width: 200, groupable: false },
  {
    field: 'gross',
    headerName: 'Gross',
    type: 'number',
    width: 150,
    groupable: false,
    valueFormatter: ({ value }) => {
      if (!value || typeof value !== 'number') {
        return value;
      }
      return `${value.toLocaleString()}$`;
    },
  },
];

export default function AggregationControlled() {
  const data = useMovieData();

  const [aggregationModel, setAggregationModel] = React.useState({
    gross: 'sum',
  });

  return (
    <div style={{ height: 318, width: '100%' }}>
      <DataGridPremium
        // The following prop is here to avoid scroll in the demo while we don't have pinned rows
        rows={data.rows.slice(0, 3)}
        columns={COLUMNS}
        aggregationModel={aggregationModel}
        onAggregationModelChange={(newModel) => setAggregationModel(newModel)}
      />
    </div>
  );
}
