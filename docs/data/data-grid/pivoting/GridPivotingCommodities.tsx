import * as React from 'react';
import { DataGridPremium, GridPivotModel } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function GridPivotingCommodities() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 1_000,
    editable: true,
  });

  const [pivotModel, setPivotModel] = React.useState<GridPivotModel>({
    rows: [{ field: 'brokerName' }],
    columns: [{ field: 'commodity', sort: 'asc' }],
    values: [{ field: 'quantity', aggFunc: 'sum' }],
  });

  const [isPivotMode, setIsPivotMode] = React.useState(false);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 560, width: '100%' }}>
        <DataGridPremium
          rows={data.rows}
          columns={data.columns}
          showToolbar
          pivotModel={pivotModel}
          onPivotModelChange={setPivotModel}
          pivotEnabled={isPivotMode}
          onPivotEnabledChange={setIsPivotMode}
          loading={loading}
          columnGroupHeaderHeight={36}
          experimentalFeatures={{ pivoting: true }}
          slotProps={{
            toolbar: {
              showQuickFilter: false,
            },
          }}
        />
      </div>
    </div>
  );
}
