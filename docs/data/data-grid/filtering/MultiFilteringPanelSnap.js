import * as React from 'react';
import { DataGridPro, GridLogicOperator, useGridApiRef } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

// This demo is used in visual regression tests to spot regressions in the filter panel
export default function MultiFilteringPanelSnap() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const apiRef = useGridApiRef();

  useEnhancedEffect(() => {
    apiRef.current.showFilterPanel();
  }, [apiRef]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        apiRef={apiRef}
        initialState={{
          ...data.initialState,
          filter: {
            filterModel: {
              items: [
                { id: 'name', field: 'name', operator: 'contains', value: 'Del' },
                { id: 'rating', field: 'rating', operator: '>=', value: 3 },
                { id: 'country', field: 'country', operator: 'is', value: 'LA' },
              ],
              logicOperator: GridLogicOperator.And,
            },
          },
        }}
      />
    </div>
  );
}
