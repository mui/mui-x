import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/core';
import { getDataGridUtilityClass } from '../gridClasses';
import { ElementSize } from '../models';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../GridComponentProps';

interface GridStickyContainerProps extends ElementSize {
  children: React.ReactNode;
}

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['viewport'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridStickyContainer(props: GridStickyContainerProps) {
  const { height, width, children } = props;
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);
  return (
    <div
      className={classes.root}
      style={{
        minWidth: width,
        maxWidth: width,
        maxHeight: height,
      }}
    >
      {children}
    </div>
  );
}

GridStickyContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  /**
   * The height of a container or HTMLElement.
   */
  height: PropTypes.number.isRequired,
  /**
   * The width of a container or HTMLElement.
   */
  width: PropTypes.number.isRequired,
} as any;

export { GridStickyContainer };
