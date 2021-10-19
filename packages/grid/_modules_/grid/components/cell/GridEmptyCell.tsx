import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { getDataGridUtilityClass } from '../../gridClasses';
import { GridComponentProps } from '../../GridComponentProps';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export interface GridEmptyCellProps {
  width?: number;
  height?: number;
}

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['cell'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridEmptyCellRaw({ width, height }: GridEmptyCellProps) {
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  if (!width || !height) {
    return null;
  }

  return (
    <div
      style={{
        minWidth: width,
        maxWidth: width,
        lineHeight: `${height - 1}px`,
        minHeight: height,
        maxHeight: height,
      }}
      className={classes.root}
    />
  );
}

GridEmptyCellRaw.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  height: PropTypes.number,
  width: PropTypes.number,
} as any;

const GridEmptyCell = React.memo(GridEmptyCellRaw);

export { GridEmptyCell };
