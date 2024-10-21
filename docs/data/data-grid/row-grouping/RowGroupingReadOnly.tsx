import * as React from 'react';
import { DataGridPremium, GridRowGroupingModel } from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

export default function RowGroupingReadOnly() {
  const data = useMovieData();

  const columns = React.useMemo(
    () =>
      data.columns.map((c) => ({
        ...c,
        groupable: c.field !== 'company',
      })),
    [data.columns],
  );

  const [rowGroupingModel, setRowGroupingModel] =
    React.useState<GridRowGroupingModel>(['company', 'director']);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        columns={columns}
        rowGroupingModel={rowGroupingModel}
        onRowGroupingModelChange={(model) => setRowGroupingModel(model)}
      />
    </div>
  );
}
