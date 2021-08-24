import * as React from 'react';
import PropTypes from 'prop-types';
import { ElementSize } from '../models';
import { gridClasses } from '../gridClasses';

type WithChildren = { children?: React.ReactNode };

const GridRenderingZone = React.forwardRef<HTMLDivElement, ElementSize & WithChildren>(
  function GridRenderingZone(props, ref) {
    const { height, width, children } = props;
    return (
      <div
        ref={ref}
        className={gridClasses.renderingZone}
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
