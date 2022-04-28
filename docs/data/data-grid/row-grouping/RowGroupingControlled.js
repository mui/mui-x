import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const INITIAL_GROUPING_COLUMN_MODEL = ['company', 'director'];

export default function RowGroupingControlled() {
  const data = useMovieData();

  const [rowGroupingModel, setRowGroupingModel] = React.useState(
    INITIAL_GROUPING_COLUMN_MODEL,
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        rowGroupingModel={rowGroupingModel}
        onRowGroupingModelChange={(model) => setRowGroupingModel(model)}
      />
    </div>
  );
}
