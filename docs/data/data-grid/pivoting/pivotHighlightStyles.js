const colors = {
  rows: 'rgba(255, 200, 196, 0.5)',
  columns: 'rgba(232, 201, 250, 0.5)',
  values: 'rgba(208, 233, 255, 0.5)',
};

export const pivotHeightlightStyles = {
  '& .MuiDataGrid-virtualScrollerContent .MuiDataGrid-cell[data-field="__row_group_by_columns_group__"]':
    {
      backgroundColor: colors.rows,
    },
  '& .MuiDataGrid-columnHeader[data-field="__row_group_by_columns_group__"]': {
    backgroundColor: colors.rows,
  },
  '& .MuiDataGrid-pivotPanelSections .MuiDataGrid-pivotPanelSection:nth-of-type(1)':
    {
      backgroundColor: colors.rows,
    },
  '& .MuiDataGrid-pivotPanelSections .MuiDataGrid-pivotPanelSection:nth-of-type(2)':
    {
      backgroundColor: colors.columns,
    },
  '& .MuiDataGrid-columnHeader.MuiDataGrid-columnHeader--filledGroup:not([data-field="__row_group_by_columns_group__"]):not(.MuiDataGrid-columnHeader--emptyGroup)':
    {
      backgroundColor: colors.columns,
    },
  '& .MuiDataGrid-pivotPanelSections .MuiDataGrid-pivotPanelSection:nth-of-type(3)':
    {
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
