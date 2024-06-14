import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  unstable_useGridPivoting,
  Unstable_GridPivotModel as PivotModel,
  GridToolbar,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function GridPivotingMovies() {
  const apiRef = useGridApiRef();

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 1_000,
    editable: true,
  });

  const [pivotModel, setPivotModel] = React.useState<PivotModel>({
    rows: ['brokerName'],
    columns: [{ field: 'commodity', sort: 'asc' }],
    values: [{ field: 'quantity', aggFunc: 'sum' }],
  });

  const { isPivot, setIsPivot, props } = unstable_useGridPivoting({
    pivotModel,
    apiRef,
    // initialIsPivot: true,
  });

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 600, width: '100%' }}>
        <DataGridPremium
          rows={data.rows}
          columns={data.columns}
          {...props}
          apiRef={apiRef}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            pivotPanel: {
              pivotModel,
              initialColumns: data.columns,
              onPivotModelChange: setPivotModel,
              pivotMode: isPivot,
              onPivotModeChange: setIsPivot,
            },
          }}
        />
      </div>
    </div>
  );
}
