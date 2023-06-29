import * as React from 'react';
import PropTypes from 'prop-types';
import { DrawingContext } from '../context/DrawingProvider';

export type ChartsClipPathProps = {
  id: string;
  offset?: { top?: number; right?: number; bottom?: number; left?: number };
};

function ChartsClipPath(props: ChartsClipPathProps) {
  const { id, offset: offsetProps } = props;
  const { left, top, width, height } = React.useContext(DrawingContext);

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
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  id: PropTypes.string.isRequired,
  offset: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
  }),
} as any;

export { ChartsClipPath };
