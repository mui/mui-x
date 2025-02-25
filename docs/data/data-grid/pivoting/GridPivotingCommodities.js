import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  unstable_useGridPivoting,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function GridPivotingCommodities() {
  const apiRef = useGridApiRef();

  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 1_000,
    editable: true,
  });

  const [pivotModel, setPivotModel] = React.useState({
    rows: [{ field: 'brokerName' }],
    columns: [{ field: 'commodity', sort: 'asc' }],
    values: [{ field: 'quantity', aggFunc: 'sum' }],
  });

  const [isPivotMode, setIsPivotMode] = React.useState(false);

  const pivotParams = unstable_useGridPivoting({
    apiRef,
    pivotModel,
    onPivotModelChange: setPivotModel,
    pivotMode: isPivotMode,
    onPivotModeChange: setIsPivotMode,
  });

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 600, width: '100%' }}>
        <DataGridPremium
          rows={data.rows}
          columns={data.columns}
          apiRef={apiRef}
          showToolbar
          pivotParams={pivotParams}
          loading={loading}
          columnGroupHeaderHeight={36}
        />
      </div>
    </div>
  );
}
