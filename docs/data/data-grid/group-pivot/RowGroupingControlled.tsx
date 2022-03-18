import * as React from 'react';
import { DataGridPro, GridRowGroupingModel } from '@mui/x-data-grid-pro';
import { useMovieData } from '@mui/x-data-grid-generator';

const INITIAL_GROUPING_COLUMN_MODEL = ['company', 'director'];

export default function RowGroupingControlled() {
  const data = useMovieData();

  const [rowGroupingModel, setRowGroupingModel] =
    React.useState<GridRowGroupingModel>(INITIAL_GROUPING_COLUMN_MODEL);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        rowGroupingModel={rowGroupingModel}
        onRowGroupingModelChange={(model) => setRowGroupingModel(model)}
        experimentalFeatures={{
          rowGrouping: true,
        }}
      />
    </div>
  );
}
