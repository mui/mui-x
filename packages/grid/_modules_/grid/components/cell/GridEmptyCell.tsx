import * as React from 'react';
import PropTypes from 'prop-types';
import { gridClasses } from '../../gridClasses';

export interface GridEmptyCellProps {
  width?: number;
  height?: number;
}

function GridEmptyCellRaw({ width, height }: GridEmptyCellProps) {
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
      className={gridClasses.cell}
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
