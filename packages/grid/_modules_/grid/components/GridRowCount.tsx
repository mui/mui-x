import * as React from 'react';
import clsx from 'clsx';
import { useGridApiContext } from '../hooks/root/useGridApiContext';
import { gridClasses } from '../gridClasses';

interface RowCountProps {
  rowCount: number;
  visibleRowCount: number;
}

type GridRowCountProps = React.HTMLAttributes<HTMLDivElement> & RowCountProps;

export const GridRowCount = React.forwardRef<HTMLDivElement, GridRowCountProps>(
  function GridRowCount(props, ref) {
    const { className, rowCount, visibleRowCount, ...other } = props;
    const apiRef = useGridApiContext();

    if (rowCount === 0) {
      return null;
    }

    const text =
      visibleRowCount < rowCount
        ? apiRef.current.getLocaleText('footerTotalVisibleRows')(visibleRowCount, rowCount)
        : rowCount.toLocaleString();

    return (
      <div ref={ref} className={clsx(gridClasses.rowCount, className)} {...other}>
        {apiRef.current.getLocaleText('footerTotalRows')} {text}
      </div>
    );
  },
);
