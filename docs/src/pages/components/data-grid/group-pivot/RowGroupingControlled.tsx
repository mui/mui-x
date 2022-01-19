import * as React from 'react';
import {
  DataGridPro,
  GridRowGroupingModel,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { useMovieData } from '@mui/x-data-grid-generator';

const INITIAL_GROUPING_COLUMN_MODEL = ['company', 'director'];

export default function RowGroupingControlled() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const [rowGroupingModel, setRowGroupingModel] =
    React.useState<GridRowGroupingModel>(INITIAL_GROUPING_COLUMN_MODEL);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        apiRef={apiRef}
        rowGroupingModel={rowGroupingModel}
        onRowGroupingModelChange={(model) => setRowGroupingModel(model)}
        experimentalFeatures={{
          rowGrouping: true,
        }}
      />
    </div>
  );
}
