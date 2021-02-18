import * as React from 'react';
import { GridRowId } from '../models';
import { GRID_ROW_CSS_CLASS } from '../constants/cssClassesConstants';
import { classnames } from '../utils';
import { gridDensityRowHeightSelector } from '../hooks/features/density';
import { GridApiContext } from './GridApiContext';
import { useGridSelector } from '../hooks/features/core/useGridSelector';

export interface RowProps {
  id: GridRowId;
  selected: boolean;
  className: string;
  rowIndex: number;
}

export const GridRow: React.FC<RowProps> = ({ selected, id, className, rowIndex, children }) => {
  const ariaRowIndex = rowIndex + 2; // 1 for the header row and 1 as it's 1 based
  const apiRef = React.useContext(GridApiContext);
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);

  return (
    <div
      key={id}
      data-id={id}
      data-rowindex={rowIndex}
      role="row"
      className={classnames(GRID_ROW_CSS_CLASS, className, { 'Mui-selected': selected })}
      aria-rowindex={ariaRowIndex}
      aria-selected={selected}
      style={{
        maxHeight: rowHeight,
        minHeight: rowHeight,
      }}
    >
      {children}
    </div>
  );
};

GridRow.displayName = 'GridRow';
