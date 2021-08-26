import * as React from 'react';
import clsx from 'clsx';
import { useGridApiContext } from '../hooks/root/useGridApiContext';
import { gridClasses } from '../gridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

interface SelectedRowCountProps {
  selectedRowCount: number;
}

type GridSelectedRowCountProps = React.HTMLAttributes<HTMLDivElement> & SelectedRowCountProps;

export const GridSelectedRowCount = React.forwardRef<HTMLDivElement, GridSelectedRowCountProps>(
  function GridSelectedRowCount(props, ref) {
    const { className, selectedRowCount, ...other } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const rowSelectedText = apiRef.current.getLocaleText('footerRowSelected')(selectedRowCount);

    return (
      <div
        ref={ref}
        className={clsx(
          gridClasses.selectedRowCount,
          rootProps.classes?.selectedRowCount,
          className,
        )}
        {...other}
      >
        {rowSelectedText}
      </div>
    );
  },
);
