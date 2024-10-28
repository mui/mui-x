import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Skeleton from '@mui/material/Skeleton';
import {
  unstable_composeClasses as composeClasses,
  unstable_capitalize as capitalize,
} from '@mui/utils';
import { fastMemo } from '@mui/x-internals/fastMemo';
import { createRandomNumberGenerator } from '../../utils/utils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridColType } from '../../models';

const CIRCULAR_CONTENT_SIZE = '1.3em';

const CONTENT_HEIGHT = '1.2em';

const DEFAULT_CONTENT_WIDTH_RANGE = [40, 80] as const;

const CONTENT_WIDTH_RANGE_BY_TYPE: Partial<Record<GridColType, [number, number]>> = {
  number: [40, 60],
  string: [40, 80],
  date: [40, 60],
  dateTime: [60, 80],
  singleSelect: [40, 80],
} as const;

export interface GridSkeletonCellProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: GridColType;
  width?: number | string;
  height?: number | 'auto';
  field?: string;
  align?: string;
  /**
   * If `true`, the cell will not display the skeleton but still reserve the cell space.
   * @default false
   */
  empty?: boolean;
}

type OwnerState = Pick<GridSkeletonCellProps, 'align' | 'empty'> & {
  classes?: DataGridProcessedProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { align, classes, empty } = ownerState;

  const slots = {
    root: [
      'cell',
      'cellSkeleton',
      `cell--text${align ? capitalize(align) : 'Left'}`,
      empty && 'cellEmpty',
    ],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const randomNumberGenerator = createRandomNumberGenerator(12345);

function GridSkeletonCell(props: GridSkeletonCellProps) {
  const { field, type, align, width, height, empty = false, style, className, ...other } = props;
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes, align, empty };
  const classes = useUtilityClasses(ownerState);

  // Memo prevents the non-circular skeleton widths changing to random widths on every render
  const skeletonProps = React.useMemo(() => {
    const isCircularContent = type === 'boolean' || type === 'actions';

    if (isCircularContent) {
      return {
        variant: 'circular',
        width: CIRCULAR_CONTENT_SIZE,
        height: CIRCULAR_CONTENT_SIZE,
      } as const;
    }

    // The width of the skeleton is a random number between the min and max values
    // The min and max values are determined by the type of the column
    const [min, max] = type
      ? (CONTENT_WIDTH_RANGE_BY_TYPE[type] ?? DEFAULT_CONTENT_WIDTH_RANGE)
      : DEFAULT_CONTENT_WIDTH_RANGE;

    return {
      variant: 'text',
      width: `${Math.round(randomNumberGenerator(min, max))}%`,
      height: CONTENT_HEIGHT,
    } as const;
  }, [type]);

  return (
    <div
      data-field={field}
      className={clsx(classes.root, className)}
      style={{ height, maxWidth: width, minWidth: width, ...style }}
      {...other}
    >
      {!empty && <Skeleton {...skeletonProps} />}
    </div>
  );
}

GridSkeletonCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  align: PropTypes.string,
  /**
   * If `true`, the cell will not display the skeleton but still reserve the cell space.
   * @default false
   */
  empty: PropTypes.bool,
  field: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
  type: PropTypes.oneOf([
    'actions',
    'boolean',
    'custom',
    'date',
    'dateTime',
    'number',
    'singleSelect',
    'string',
  ]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
} as any;

const Memoized = fastMemo(GridSkeletonCell);

export { Memoized as GridSkeletonCell };
