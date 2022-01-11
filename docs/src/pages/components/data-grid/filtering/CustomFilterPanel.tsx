import * as React from 'react';
import { DataGridPro, GridLinkOperator, GridToolbar } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const initialState = {
  filter: {
    filterModel: {
      items: [
        {
          id: 1,
          columnField: 'desk',
          operatorValue: 'contains',
          value: 'D',
        },
        {
          id: 2,
          columnField: 'desk',
          operatorValue: 'contains',
          value: 'D',
        },
        {
          id: 3,
          columnField: 'quantity',
          operatorValue: '>',
          value: '0',
        },
      ],
    },
  },
};

export default function CustomFilterPanel() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
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
              '& .MuiDataGrid-filterForm': { p: 2 },
              '& .MuiDataGrid-filterForm:nth-child(even)': {
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#444' : '#ddd',
              },
              '& .MuiDataGrid-closeIconController': { display: 'none' },
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
