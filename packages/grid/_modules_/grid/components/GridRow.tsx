import * as React from 'react';
import {
  GRID_ROW_DOUBLE_CLICK,
  GRID_ROW_CLICK,
  GRID_ROW_ENTER,
  GRID_ROW_LEAVE,
  GRID_ROW_OUT,
  GRID_ROW_OVER,
} from '../constants/eventsConstants';
import { GridRowId } from '../models';
import { GRID_ROW_CSS_CLASS } from '../constants/cssClassesConstants';
import { classnames, isFunction } from '../utils';
import { gridDensityRowHeightSelector } from '../hooks/features/density';
import { GridApiContext } from './GridApiContext';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { optionsSelector } from '../hooks/utils/optionsSelector';

export interface GridRowProps {
  id: GridRowId;
  selected: boolean;
  className: string;
  rowIndex: number;
  children: React.ReactNode;
}

export const GridRow = (props: GridRowProps) => {
  const { selected, id, className, rowIndex, children } = props;
  const ariaRowIndex = rowIndex + 2; // 1 for the header row and 1 as it's 1 based
  const apiRef = React.useContext(GridApiContext);
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const options = useGridSelector(apiRef, optionsSelector);

  const publish = React.useCallback(
    (eventName: string) => (event: React.MouseEvent) => {
      // Ignore portal
      if (!event.currentTarget.contains(event.target as HTMLElement)) {
        return;
      }

      apiRef!.current.publishEvent(eventName, apiRef?.current.getRowParams(id), event);
    },
    [apiRef, id],
  );

  const mouseEventsHandlers = React.useMemo(
    () => ({
      onClick: publish(GRID_ROW_CLICK),
      onDoubleClick: publish(GRID_ROW_DOUBLE_CLICK),
      onMouseOver: publish(GRID_ROW_OVER),
      onMouseOut: publish(GRID_ROW_OUT),
      onMouseEnter: publish(GRID_ROW_ENTER),
      onMouseLeave: publish(GRID_ROW_LEAVE),
    }),
    [publish],
  );

  const style = {
    maxHeight: rowHeight,
    minHeight: rowHeight,
  };

  const rowClassName =
    isFunction(options.getRowClassName) &&
    options.getRowClassName(apiRef!.current.getRowParams(id));
  const cssClasses = classnames(GRID_ROW_CSS_CLASS, className, rowClassName, {
    'Mui-selected': selected,
  });

  return (
    <div
      key={id}
      data-id={id}
      data-rowindex={rowIndex}
      role="row"
      className={cssClasses}
      aria-rowindex={ariaRowIndex}
      aria-selected={selected}
      style={style}
      {...mouseEventsHandlers}
    >
      {children}
    </div>
  );
};

GridRow.displayName = 'GridRow';
