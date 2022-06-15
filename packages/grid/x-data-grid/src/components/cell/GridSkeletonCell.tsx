import * as React from 'react';
import { Skeleton, styled } from '@mui/material';

export interface GridSkeletonCellProps {
  width: number;
  contentWidth: number;
  field: string;
  align: string;
}

const SkeletonCell = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

function GridSkeletonCell(props: React.HTMLAttributes<HTMLDivElement> & GridSkeletonCellProps) {
  const { field, align, width, contentWidth, ...other } = props;

  return (
    <SkeletonCell sx={{ justifyContent: align, width }} {...other}>
      <Skeleton sx={{ mx: 1 }} width={`${contentWidth}%`} />
    </SkeletonCell>
  );
}

export { GridSkeletonCell };
