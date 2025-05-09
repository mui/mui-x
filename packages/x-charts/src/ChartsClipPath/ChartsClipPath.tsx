'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useDrawingArea } from '../hooks/useDrawingArea';

export type ChartsClipPathProps = {
  /**
   * The id of the clip path.
   */
  id: string;

  /**
   * Offset, in pixels, of the clip path rectangle from the drawing area.
   *
   * A positive value will move the rectangle outside the drawing area.
   */
  offset?: { top?: number; right?: number; bottom?: number; left?: number };
};

/**
 * API:
 *
 * - [ChartsClipPath API](https://mui.com/x/api/charts/charts-clip-path/)
 */
function ChartsClipPath(props: ChartsClipPathProps) {
  const { id, offset: offsetProps } = props;
  const { left, top, width, height } = useDrawingArea();

  const offset = { top: 0, right: 0, bottom: 0, left: 0, ...offsetProps };
  return (
    <clipPath id={id}>
      <rect
        x={left - offset.left}
        y={top - offset.top}
        width={width + offset.left + offset.right}
        height={height + offset.top + offset.bottom}
      />
    </clipPath>
  );
}

ChartsClipPath.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The id of the clip path.
   */
  id: PropTypes.string.isRequired,
  /**
   * Offset, in pixels, of the clip path rectangle from the drawing area.
   *
   * A positive value will move the rectangle outside the drawing area.
   */
  offset: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
  }),
} as any;

export { ChartsClipPath };
