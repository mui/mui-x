import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../gridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../GridComponentProps';
import { composeClasses } from '../utils/material-ui-utils';

interface RowCountProps {
  rowCount: number;
  visibleRowCount: number;
}

type GridRowCountProps = React.HTMLAttributes<HTMLDivElement> & RowCountProps;

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['rowCount'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridRowCount = React.forwardRef<HTMLDivElement, GridRowCountProps>(function GridRowCount(
  props,
  ref,
) {
  const { className, rowCount, visibleRowCount, ...other } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  if (rowCount === 0) {
    return null;
  }

  const text =
    visibleRowCount < rowCount
      ? apiRef.current.getLocaleText('footerTotalVisibleRows')(visibleRowCount, rowCount)
      : rowCount.toLocaleString();

  return (
    <div ref={ref} className={clsx(classes.root, className)} {...other}>
      {apiRef.current.getLocaleText('footerTotalRows')} {text}
    </div>
  );
});

GridRowCount.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  rowCount: PropTypes.number.isRequired,
  visibleRowCount: PropTypes.number.isRequired,
} as any;

export { GridRowCount };
