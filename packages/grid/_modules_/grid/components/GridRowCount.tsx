import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useGridApiContext } from '../hooks/root/useGridApiContext';
import { gridClasses } from '../gridClasses';

interface RowCountProps {
  rowCount: number;
  visibleRowCount: number;
}

type GridRowCountProps = React.HTMLAttributes<HTMLDivElement> & RowCountProps;

const GridRowCount = React.forwardRef<HTMLDivElement, GridRowCountProps>(function GridRowCount(
  props,
  ref,
) {
  const { className, rowCount, visibleRowCount, ...other } = props;
  const apiRef = useGridApiContext();

  if (rowCount === 0) {
    return null;
  }

  const text =
    visibleRowCount < rowCount
      ? apiRef!.current.getLocaleText('footerTotalVisibleRows')(visibleRowCount, rowCount)
      : rowCount.toLocaleString();

  return (
    <div ref={ref} className={clsx(gridClasses.rowCount, className)} {...other}>
      {apiRef!.current.getLocaleText('footerTotalRows')} {text}
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
