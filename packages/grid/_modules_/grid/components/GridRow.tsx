import * as React from 'react';
import {
  GRID_DOUBLE_ROW_CLICK,
  GRID_ROW_CLICK,
  GRID_ROW_ENTER,
  GRID_ROW_LEAVE,
  GRID_ROW_OUT,
  GRID_ROW_OVER,
} from '../constants/eventsConstants';
import { GridRowId } from '../models';
import { GRID_ROW_CSS_CLASS } from '../constants/cssClassesConstants';
import { buildGridRowParams, classnames } from '../utils';
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

  const handleClick = React.useCallback(
    (event: React.MouseEvent) => {
      const params = apiRef?.current.getRowParams(id)!;
      apiRef?.current.publishEvent(GRID_ROW_CLICK, params, event);
    },
    [apiRef, id],
  );
  const handleDoubleClick = React.useCallback(
    (event: React.MouseEvent) => {
      const params = apiRef?.current.getRowParams(id)!;
      apiRef?.current.publishEvent(GRID_DOUBLE_ROW_CLICK, params, event);
    },
    [apiRef, id],
  );
  const handleMouseOver = React.useCallback(
    (event: React.MouseEvent) => {
      const params = apiRef?.current.getRowParams(id)!;
      apiRef?.current.publishEvent(GRID_ROW_OVER, params, event);
    },
    [apiRef, id],
  );

  const handleMouseOut = React.useCallback(
    (event: React.MouseEvent) => {
      const params = apiRef?.current.getRowParams(id)!;
      apiRef?.current.publishEvent(GRID_ROW_OUT, params, event);
    },
    [apiRef, id],
  );

  const handleMouseEnter = React.useCallback(
    (event: React.MouseEvent) => {
      const params = apiRef?.current.getRowParams(id)!;
      apiRef?.current.publishEvent(GRID_ROW_ENTER, params, event);
    },
    [apiRef, id],
  );

  const handleMouseLeave = React.useCallback(
    (event: React.MouseEvent) => {
      const params = apiRef?.current.getRowParams(id)!;
      apiRef?.current.publishEvent(GRID_ROW_LEAVE, params, event);
    },
    [apiRef, id],
  );

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
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

GridRow.displayName = 'GridRow';
