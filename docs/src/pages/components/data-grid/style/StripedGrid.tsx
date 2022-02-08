import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, GridRowProps, GridRow, gridClasses } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import clsx from 'clsx';

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: '#EEEEEE',
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity,
      ),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity,
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  },
}));

const CustomRow = (props: GridRowProps) => (
  <GridRow
    {...props}
    className={clsx(
      props.className,
      props.indexes.fromPageRows % 2 === 0 ? 'even' : undefined,
    )}
  />
);

export default function StripedGrid() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 200,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <StripedDataGrid loading={loading} {...data} components={{ Row: CustomRow }} />
    </div>
  );
}
