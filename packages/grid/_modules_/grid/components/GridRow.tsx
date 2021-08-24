import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { GRID_CSS_CLASS_PREFIX } from '../constants/cssClassesConstants';
import { GridEvents } from '../constants/eventsConstants';
import { GridRowId } from '../models/gridRows';
import { GridEditModes, GridRowModes } from '../models/gridEditRowModel';
import { isFunction } from '../utils/utils';
import { gridDensityRowHeightSelector } from '../hooks/features/density';
import { useGridApiContext } from '../hooks/root/useGridApiContext';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { optionsSelector } from '../hooks/utils/optionsSelector';

export interface GridRowProps {
  id: GridRowId;
  selected: boolean;
  rowIndex: number;
  children: React.ReactNode;
}

function GridRow(props: GridRowProps) {
  const { selected, id, rowIndex, children } = props;
  const ariaRowIndex = rowIndex + 2; // 1 for the header row and 1 as it's 1 based
  const apiRef = useGridApiContext();
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const { classes, getRowClassName, editMode } = useGridSelector(apiRef, optionsSelector);

  const publish = React.useCallback(
    (eventName: string) => (event: React.MouseEvent) => {
      // Ignore portal
      // The target is not an element when triggered by a Select inside the cell
      // See https://github.com/mui-org/material-ui/issues/10534
      if (
        (event.target as any).nodeType === 1 &&
        !event.currentTarget.contains(event.target as Element)
      ) {
        return;
      }

      // The row might have been deleted
      if (!apiRef.current.getRow(id)) {
        return;
      }

      apiRef!.current.publishEvent(eventName, apiRef?.current.getRowParams(id), event);
    },
    [apiRef, id],
  );

  const mouseEventsHandlers = React.useMemo(
    () => ({
      onClick: publish(GridEvents.rowClick),
      onDoubleClick: publish(GridEvents.rowDoubleClick),
      onMouseOver: publish(GridEvents.rowOver),
      onMouseOut: publish(GridEvents.rowOut),
      onMouseEnter: publish(GridEvents.rowEnter),
      onMouseLeave: publish(GridEvents.rowLeave),
    }),
    [publish],
  );

  const style = {
    maxHeight: rowHeight,
    minHeight: rowHeight,
  };

  const rowClassName =
    isFunction(getRowClassName) && getRowClassName(apiRef!.current.getRowParams(id));
  const cssClasses = clsx(rowClassName, classes?.row, {
    'Mui-selected': selected,
    [`${GRID_CSS_CLASS_PREFIX}-row--editing`]: apiRef.current.getRowMode(id) === GridRowModes.Edit,
    [`${GRID_CSS_CLASS_PREFIX}-row--editable`]: editMode === GridEditModes.Row,
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
}

GridRow.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  rowIndex: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
} as any;

export { GridRow };
