import * as React from 'react';
import PropTypes from 'prop-types';
import { gridClasses } from '../gridClasses';
import { ElementSize } from '../models';

interface GridStickyContainerProps extends ElementSize {
  children: React.ReactNode;
}

function GridStickyContainer(props: GridStickyContainerProps) {
  const { height, width, children } = props;
  return (
    <div
      className={gridClasses.viewport}
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
