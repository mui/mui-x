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
            filterFormProps: {
              columnInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { justifyContent: 'flex-end' },
              },
              operatorInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { justifyContent: 'flex-end' },
              },
              valueInputProps: {
                required: true,
              },
            },
            sx: {
              '& .MuiDataGrid-filterPanelFilterForm': { p: 2 },
              '& .MuiDataGrid-filterPanelFilterForm:nth-child(even)': {
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#444' : '#ddd',
              },
              '& .MuiDataGrid-filterPanelDeleteIcon': { display: 'none' },
              '& .MuiDataGrid-filterPanelLinkOperatorInput': { mr: 2 },
              '& .MuiDataGrid-filterPanelColumnInput': { mr: 2, width: 200 },
              '& .MuiDataGrid-filterPanelOperatorInput': { mr: 5 },
              '& .MuiDataGrid-filterPanelValueInput': { width: 300 },
            },
          },
        }}
        initialState={initialState}
      />
    </div>
  );
}
