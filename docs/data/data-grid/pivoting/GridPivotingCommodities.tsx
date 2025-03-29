import * as React from 'react';
import {
  DataGridPremium,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  GridPinnedColumnFields,
  GridPivotModel,
  DataGridPremiumProps,
  GridInitialState,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

const pivotModel: GridPivotModel = {
  rows: [{ field: 'commodity' }],
  columns: [{ field: 'maturityDate-year', sort: 'asc' }, { field: 'status' }],
  values: [
    { field: 'quantity', aggFunc: 'sum' },
    { field: 'filledQuantity', aggFunc: 'avg' },
    { field: 'totalPrice', aggFunc: 'avg' },
  ],
};

const initialState: GridInitialState = {
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

  const [pivotActive, setPivotActive] = React.useState(false);

  const pinnedColumns = React.useMemo<GridPinnedColumnFields | undefined>(() => {
    if (pivotActive) {
      return {
        left: [GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD],
      };
    }
    return undefined;
  }, [pivotActive]);

  const pivotingColDef = React.useMemo<
    DataGridPremiumProps['pivotingColDef']
  >(() => {
    return (originalColumnField) => {
      if (originalColumnField === 'quantity') {
        return { width: 80 };
      }
      return undefined;
    };
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 560, width: '100%' }}>
        <DataGridPremium
          rows={data.rows}
          columns={data.columns}
          showToolbar
          pivotActive={pivotActive}
          onPivotActiveChange={setPivotActive}
          initialState={initialState}
          loading={loading}
          columnGroupHeaderHeight={36}
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
