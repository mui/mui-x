import * as React from 'react';
import { DataGridPremium, GridRowGroupingModel } from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

export default function RowGroupingControlled() {
  const data = useMovieData();

  const [rowGroupingModel, setRowGroupingModel] =
    React.useState<GridRowGroupingModel>(['company', 'director']);

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
