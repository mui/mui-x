import * as React from 'react';
import { styled, lighten, darken, alpha } from '@mui/material/styles';
import { DataGridPremium, dataGridClasses } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

const StyledDataGridPremium = styled(DataGridPremium)(({ theme }) => {
  const borderColor =
    theme.palette.mode === 'light'
      ? lighten(alpha(theme.palette.divider, 1), 0.88)
      : darken(alpha(theme.palette.divider, 1), 0.68);

  const selectedCellBorder = alpha(theme.palette.primary.main, 0.5);

  return {
    [`& .${dataGridClasses.cell}`]: {
      border: `1px solid transparent`,
      borderRight: `1px solid ${borderColor}`,
      borderBottom: `1px solid ${borderColor}`,
    },
    [`& .${dataGridClasses.cell}.Mui-selected`]: {
      borderColor: alpha(theme.palette.primary.main, 0.1),
    },
    [`& .${dataGridClasses.cell}.Mui-selected.${dataGridClasses['cell--rangeTop']}`]:
      {
        borderTopColor: selectedCellBorder,
      },
    [`& .${dataGridClasses.cell}.Mui-selected.${dataGridClasses['cell--rangeBottom']}`]:
      {
        borderBottomColor: selectedCellBorder,
      },
    [`& .${dataGridClasses.cell}.Mui-selected.${dataGridClasses['cell--rangeLeft']}`]:
      {
        borderLeftColor: selectedCellBorder,
      },
    [`& .${dataGridClasses.cell}.Mui-selected.${dataGridClasses['cell--rangeRight']}`]:
      {
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
