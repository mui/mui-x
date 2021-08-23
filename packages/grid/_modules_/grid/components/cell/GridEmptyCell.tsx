import * as React from 'react';
import { gridClasses } from '../../gridClasses';

export interface GridEmptyCellProps {
  width?: number;
  height?: number;
}

export const GridEmptyCell = React.memo(function GridEmptyCell({
  width,
  height,
}: GridEmptyCellProps) {
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
});
