import * as React from 'react';
import clsx from 'clsx';
import { useGridApiContext } from '../hooks/root/useGridApiContext';

interface SelectedRowCountProps {
  selectedRowCount: number;
}

type GridSelectedRowCountProps = React.HTMLAttributes<HTMLDivElement> & SelectedRowCountProps;

export const GridSelectedRowCount = React.forwardRef<HTMLDivElement, GridSelectedRowCountProps>(
  function GridSelectedRowCount(props, ref) {
    const { className, selectedRowCount, ...other } = props;
    const apiRef = useGridApiContext();
    const rowSelectedText = apiRef!.current.getLocaleText('footerRowSelected')(selectedRowCount);

    return (
      <div ref={ref} className={clsx('MuiDataGrid-selectedRowCount', className)} {...other}>
        {rowSelectedText}
      </div>
    );
  },
);
