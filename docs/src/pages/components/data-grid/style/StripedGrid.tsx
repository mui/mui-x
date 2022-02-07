import * as React from 'react';
import { styled } from '@mui/material/styles';
import { DataGrid, GridRowProps, GridRow, gridClasses } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import clsx from 'clsx';

const StripedDataGrid = styled(DataGrid)({
  [`& .${gridClasses.row}.odd`]: {
    backgroundColor: '#EEEEEE',
    '&:hover, &.Mui-hovered': {
      backgroundColor: '#DDDDDD',
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  },
});

const CustomRow = (props: GridRowProps) => (
  <GridRow
    {...props}
    className={clsx(
      props.className,
      props.indexes.pageRows % 2 === 1 ? 'odd' : undefined,
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
