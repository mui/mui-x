import * as React from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@mui/material/Skeleton';
import {
  unstable_composeClasses as composeClasses,
  unstable_capitalize as capitalize,
} from '@mui/utils';
import { fastMemo } from '../../utils/fastMemo';
import { randomNumberBetween } from '../../utils/utils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

const randomWidth = randomNumberBetween(10000, 20, 80);

export interface GridSkeletonCellProps {
  width: number;
  height: number | 'auto';
  field: string;
  align: string;
}

type OwnerState = Pick<GridSkeletonCellProps, 'align'> & {
  classes?: DataGridProcessedProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { align, classes } = ownerState;

  const slots = {
    root: ['cell', 'cellSkeleton', `cell--text${capitalize(align)}`, 'withBorderColor'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridSkeletonCell(props: React.HTMLAttributes<HTMLDivElement> & GridSkeletonCellProps) {
  const { field, align, width, height, ...other } = props;
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes, align };
  const classes = useUtilityClasses(ownerState);
  const contentWidth = Math.round(randomWidth());

  return (
    <div className={classes.root} style={{ height, maxWidth: width, minWidth: width }} {...other}>
      <Skeleton width={`${contentWidth}%`} height={25} />
    </div>
  );
}

GridSkeletonCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  align: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]).isRequired,
  width: PropTypes.number.isRequired,
} as any;

const Memoized = fastMemo(GridSkeletonCell);

export { Memoized as GridSkeletonCell };
