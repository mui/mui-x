import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function ExportDefaultToolbar() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 4,
    visibleFields: VISIBLE_FIELDS,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        localeText={{ booleanCellTrueLabel: 'Yes', booleanCellFalseLabel: 'No' }}
        loading={loading}
        components={{ Toolbar: GridToolbar }}
      />
    </div>
  );
}
