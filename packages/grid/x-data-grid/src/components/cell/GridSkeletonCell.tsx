import * as React from 'react';
import PropTypes from 'prop-types';
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

GridSkeletonCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  align: PropTypes.string.isRequired,
  contentWidth: PropTypes.number.isRequired,
  field: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
} as any;

export { GridSkeletonCell };
