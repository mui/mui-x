import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'website'];

export default function HeaderFilteringInlineClearDataGridPro() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
    visibleFields: VISIBLE_FIELDS,
  });

  const columns = React.useMemo(() => {
    return data.columns.map((col) => ({
      ...col,
      minWidth: 200,
    }));
  }, [data.columns]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        columns={columns}
        loading={loading}
        initialState={{
          ...data.initialState,
          filter: {
            filterModel: {
              items: [
                { field: 'name', operator: 'contains', value: 'a' },
                { field: 'website', operator: 'contains', value: 'http://' },
                { field: 'rating', operator: '>', value: 2 },
              ],
            },
          },
        }}
        headerFilters
        slotProps={{
          headerFilterCell: {
            showClearIcon: true,
          },
        }}
      />
    </div>
  );
}
