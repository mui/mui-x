import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useGridApiContext } from '../hooks/root/useGridApiContext';
import { gridClasses } from '../gridClasses';

interface SelectedRowCountProps {
  selectedRowCount: number;
}

type GridSelectedRowCountProps = React.HTMLAttributes<HTMLDivElement> & SelectedRowCountProps;

const GridSelectedRowCount = React.forwardRef<HTMLDivElement, GridSelectedRowCountProps>(
  function GridSelectedRowCount(props, ref) {
    const { className, selectedRowCount, ...other } = props;
    const apiRef = useGridApiContext();
    const rowSelectedText = apiRef!.current.getLocaleText('footerRowSelected')(selectedRowCount);

    return (
      <div ref={ref} className={clsx(gridClasses.selectedRowCount, className)} {...other}>
        {rowSelectedText}
      </div>
    );
  },
);

GridSelectedRowCount.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  selectedRowCount: PropTypes.number.isRequired,
} as any;

export { GridSelectedRowCount };
