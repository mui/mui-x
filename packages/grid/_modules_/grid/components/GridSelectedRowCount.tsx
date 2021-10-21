import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../gridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../GridComponentProps';

interface SelectedRowCountProps {
  selectedRowCount: number;
}

type GridSelectedRowCountProps = React.HTMLAttributes<HTMLDivElement> & SelectedRowCountProps;

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['selectedRowCount'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridSelectedRowCount = React.forwardRef<HTMLDivElement, GridSelectedRowCountProps>(
  function GridSelectedRowCount(props, ref) {
    const { className, selectedRowCount, ...other } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const ownerState = { classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);
    const rowSelectedText = apiRef.current.getLocaleText('footerRowSelected')(selectedRowCount);

    return (
      <div ref={ref} className={clsx(classes.root, className)} {...other}>
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
