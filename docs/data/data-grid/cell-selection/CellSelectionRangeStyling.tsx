import * as React from 'react';
import { styled, lighten, darken, alpha } from '@mui/material/styles';
import { DataGridPremium, gridClasses } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

const StyledDataGridPremium = styled(DataGridPremium)(({ theme }) => {
  const lightBorderColor = lighten(alpha(theme.palette.divider, 1), 0.88);
  const darkBorderColor = darken(alpha(theme.palette.divider, 1), 0.68);

  const selectedCellBorder = alpha(theme.palette.primary.main, 0.5);

  return {
    [`& .${gridClasses.cell}`]: {
      border: `1px solid transparent`,
      borderRight: `1px solid ${lightBorderColor}`,
      borderBottom: `1px solid ${lightBorderColor}`,
      ...theme.applyStyles('dark', {
        borderRightColor: `${darkBorderColor}`,
        borderBottomColor: `${darkBorderColor}`,
      }),
    },
    [`& .${gridClasses.cell}.Mui-selected`]: {
      borderColor: alpha(theme.palette.primary.main, 0.1),
    },
    [`& .${gridClasses.cell}.Mui-selected.${gridClasses['cell--rangeTop']}`]: {
      borderTopColor: selectedCellBorder,
    },
    [`& .${gridClasses.cell}.Mui-selected.${gridClasses['cell--rangeBottom']}`]: {
      borderBottomColor: selectedCellBorder,
    },
    [`& .${gridClasses.cell}.Mui-selected.${gridClasses['cell--rangeLeft']}`]: {
      borderLeftColor: selectedCellBorder,
    },
    [`& .${gridClasses.cell}.Mui-selected.${gridClasses['cell--rangeRight']}`]: {
      borderRightColor: selectedCellBorder,
    },
  };
});

export default function CellSelectionRangeStyling() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <StyledDataGridPremium rowSelection={false} cellSelection {...data} />
    </div>
  );
}
