import * as React from 'react';
import PropTypes from 'prop-types';
import { ElementSize } from '../models';
import { getDataGridUtilityClass } from '../gridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { composeClasses } from '../utils/material-ui-utils';
import { GridComponentProps } from '../GridComponentProps';

type WithChildren = { children?: React.ReactNode };

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['renderingZone'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridRenderingZone = React.forwardRef<HTMLDivElement, ElementSize & WithChildren>(
  function GridRenderingZone(props, ref) {
    const { height, width, children } = props;
    const rootProps = useGridRootProps();
    const ownerState = { classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);
    return (
      <div
        ref={ref}
        className={classes.root}
        style={{
          maxHeight: height,
          width,
        }}
      >
        {children}
      </div>
    );
  },
);

GridRenderingZone.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The height of a container or HTMLElement.
   */
  height: PropTypes.number.isRequired,
  /**
   * The width of a container or HTMLElement.
   */
  width: PropTypes.number.isRequired,
} as any;

export { GridRenderingZone };
