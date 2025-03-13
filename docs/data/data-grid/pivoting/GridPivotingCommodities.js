import * as React from 'react';
import {
  DataGridPremium,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

const pivotModel = {
  rows: [{ field: 'commodity' }],
  columns: [{ field: 'maturityDate-year', sort: 'asc' }, { field: 'status' }],
  values: [
    { field: 'quantity', aggFunc: 'sum' },
    { field: 'filledQuantity', aggFunc: 'avg' },
    { field: 'totalPrice', aggFunc: 'avg' },
  ],
};

const initialState = {
  pivoting: {
    model: pivotModel,
    panelOpen: true,
  },
};

export default function GridPivotingCommodities() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 1_000,
    editable: true,
  });

  const [pivotEnabled, setPivotEnabled] = React.useState(false);

  const pinnedColumns = React.useMemo(() => {
    if (pivotEnabled) {
      return {
        left: [GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD],
      };
    }
    return undefined;
  }, [pivotEnabled]);

  const pivotingColDef = React.useCallback((originalColumnField) => {
    if (originalColumnField === 'quantity') {
      return { width: 80 };
    }
    return undefined;
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 560, width: '100%' }}>
        <DataGridPremium
          rows={data.rows}
          columns={data.columns}
          showToolbar
          pivotEnabled={pivotEnabled}
          onPivotEnabledChange={setPivotEnabled}
          initialState={initialState}
          loading={loading}
          columnGroupHeaderHeight={36}
          experimentalFeatures={{ pivoting: true }}
          pinnedColumns={pinnedColumns}
          pivotingColDef={pivotingColDef}
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
