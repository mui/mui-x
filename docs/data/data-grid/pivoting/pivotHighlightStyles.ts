import type { DataGridPremiumProps } from '@mui/x-data-grid-premium';

const getColors = (colorScheme: 'light' | 'dark') => {
  if (colorScheme === 'light') {
    return {
      rows: 'hsl(355, 98%, 97%)',
      columns: 'hsl(144, 72%, 95%)',
      values: 'hsl(210, 100%, 96%)',
    };
  }
  return {
    rows: 'hsl(355, 98%, 10%)',
    columns: 'hsl(144, 72%, 9%)',
    values: 'hsl(210, 100%, 11%)',
  };
};

export const pivotHeightlightStyles: DataGridPremiumProps['sx'] = (theme) => {
  const colors = getColors(theme.palette.mode);
  return {
    '& .MuiDataGrid-virtualScrollerContent .MuiDataGrid-cell[data-field="__row_group_by_columns_group__"]':
      {
        backgroundColor: colors.rows,
      },
    '& .MuiDataGrid-columnHeader[data-field="__row_group_by_columns_group__"]': {
      backgroundColor: colors.rows,
    },
    '& .MuiDataGrid-pivotPanelSections .MuiDataGrid-pivotPanelSection:nth-of-type(1)': {
      backgroundColor: colors.rows,
    },
    '& .MuiDataGrid-pivotPanelSections .MuiDataGrid-pivotPanelSection:nth-of-type(2)': {
      backgroundColor: colors.columns,
    },
    '& .MuiDataGrid-columnHeader.MuiDataGrid-columnHeader--filledGroup:not([data-field="__row_group_by_columns_group__"]):not(.MuiDataGrid-columnHeader--emptyGroup)':
      {
        backgroundColor: colors.columns,
      },
    '& .MuiDataGrid-pivotPanelSections .MuiDataGrid-pivotPanelSection:nth-of-type(3)': {
      backgroundColor: colors.values,
    },
    '& .MuiDataGrid-columnHeader:not([data-field="__row_group_by_columns_group__"]):not(.MuiDataGrid-columnHeader--filledGroup):not(.MuiDataGrid-columnHeader--emptyGroup)':
      {
        backgroundColor: colors.values,
      },
    '& .MuiDataGrid-virtualScrollerContent .MuiDataGrid-cell:not([data-field="__row_group_by_columns_group__"]):not(.MuiDataGrid-cellEmpty)':
      {
        backgroundColor: colors.values,
      },
  };
};
