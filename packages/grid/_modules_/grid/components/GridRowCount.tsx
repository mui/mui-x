import * as React from 'react';
import clsx from 'clsx';
import { GridApiContext } from './GridApiContext';

interface RowCountProps {
  rowCount: number;
}

type GridRowCountProps = React.HTMLAttributes<HTMLDivElement> & RowCountProps;

export const GridRowCount = React.forwardRef<HTMLDivElement, GridRowCountProps>(
  function GridRowCount(props, ref) {
    const { className, rowCount, ...other } = props;
    const apiRef = React.useContext(GridApiContext);

    if (rowCount === 0) {
      return null;
    }

    return (
      <div ref={ref} className={clsx('MuiDataGrid-rowCount', className)} {...other}>
        {`${apiRef!.current.getLocaleText('footerTotalRows')} ${rowCount.toLocaleString()}`}
      </div>
    );
  },
);
