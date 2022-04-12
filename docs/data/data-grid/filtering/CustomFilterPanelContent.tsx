import * as React from 'react';
import { DataGridPro, GridLinkOperator, GridToolbar } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import type { Theme } from '@mui/material/styles';

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

export default function CustomFilterPanelContent() {
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
            // Force usage of "And" operator
            linkOperators: [GridLinkOperator.And],
            // Display columns by ascending alphabetical order
            columnsSort: 'asc',
            filterFormProps: {
              // Customize inputs by passing props
              linkOperatorInputProps: {
                variant: 'outlined',
                size: 'small',
              },
              columnInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              operatorInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              deleteIconProps: {
                sx: {
                  '& .MuiSvgIcon-root': { color: '#d32f2f' },
                },
              },
            },
            sx: {
              // Customize inputs using css selectors
              '& .MuiDataGrid-filterForm': { p: 2 },
              '& .MuiDataGrid-filterForm:nth-child(even)': {
                backgroundColor: (theme: Theme) =>
                  theme.palette.mode === 'dark' ? '#444' : '#f5f5f5',
              },
              '& .MuiDataGrid-filterFormLinkOperatorInput': { mr: 2 },
              '& .MuiDataGrid-filterFormColumnInput': { mr: 2, width: 150 },
              '& .MuiDataGrid-filterFormOperatorInput': { mr: 2 },
              '& .MuiDataGrid-filterFormValueInput': { width: 200 },
            },
          },
        }}
        initialState={initialState}
      />
    </div>
  );
}
