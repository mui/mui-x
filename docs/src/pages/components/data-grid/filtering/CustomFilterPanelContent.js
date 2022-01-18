import * as React from 'react';
import { DataGridPro, GridLinkOperator, GridToolbar } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

const initialState = {
  filter: {
    filterModel: {
      items: [
        {
          id: 1,
          columnField: 'name',
          operatorValue: 'contains',
          value: 'D',
        },
        {
          id: 2,
          columnField: 'name',
          operatorValue: 'contains',
          value: 'D',
        },
        {
          id: 3,
          columnField: 'rating',
          operatorValue: '>',
          value: '0',
        },
      ],
    },
  },
};

export default function CustomFilterPanel() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        components={{
          Toolbar: GridToolbar,
          // Use custom FilterPanel only for deep modification
          // FilterPanel: MyCustomFilterPanel,
        }}
        componentsProps={{
          filterPanel: {
            linkOperators: [GridLinkOperator.And],
            columnsSort: 'asc',
            sx: {
              '& .MuiDataGrid-filterPanelFilterForm': { p: 2 },
              '& .MuiDataGrid-filterPanelFilterForm:nth-child(even)': {
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#444' : '#ddd',
              },
              '& .MuiDataGrid-filterPanelDeleteIcon': { display: 'none' },
              '& .MuiDataGrid-linkOperatorController': { mr: 2 },
              '& .MuiDataGrid-columnController': { mr: 2, width: 200 },
              '& .MuiDataGrid-operatorController': { mr: 5 },
              '& .MuiDataGrid-valueController': { width: 400 },
            },
          },
        }}
        initialState={initialState}
      />
    </div>
  );
}
