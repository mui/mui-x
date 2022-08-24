import * as React from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@mui/material/Skeleton';
import { capitalize } from '@mui/material/utils';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

export interface GridSkeletonCellProps {
  width: number;
  contentWidth: number;
  field: string;
  align: string;
}

type OwnerState = Pick<GridSkeletonCellProps, 'align'> & {
  classes?: DataGridProcessedProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { align, classes } = ownerState;

  const slots = {
    root: ['cell', 'cellSkeleton', `cell--text${capitalize(align)}`],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridSkeletonCell(props: React.HTMLAttributes<HTMLDivElement> & GridSkeletonCellProps) {
  const { field, align, width, contentWidth, ...other } = props;
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes, align };
  const classes = useUtilityClasses(ownerState);

  return (
    <div className={classes.root} style={{ width }} {...other}>
      <Skeleton width={`${contentWidth}%`} />
    </div>
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
