import * as React from 'react';
import {
  gridClasses,
  GridEvents,
  GridRenderCellParams,
  GridRowEventLookup,
  gridRowTreeDepthSelector,
  gridSortModelSelector,
  useGridApiContext,
  useGridRootProps,
  useGridSelector,
} from '@mui/x-data-grid';
import { DataGridProProcessedProps } from '../models/dataGridProProps';

const GridRowReorderCell = (params: GridRenderCellParams) => {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const treeDepth = useGridSelector(apiRef, gridRowTreeDepthSelector);

  // TODO: remove sortModel and treeDepth checks once row reorder is compatible
  const isDraggable =
    !!(rootProps as DataGridProProcessedProps).rowReordering &&
    !sortModel.length &&
    treeDepth === 1;

  const publish = React.useCallback(
    (
        eventName: keyof GridRowEventLookup,
        propHandler?: React.MouseEventHandler<HTMLDivElement> | undefined,
      ): React.MouseEventHandler<HTMLDivElement> =>
      (event) => {
        // Ignore portal
        // The target is not an element when triggered by a Select inside the cell
        // See https://github.com/mui/material-ui/issues/10534
        if (
          (event.target as any).nodeType === 1 &&
          !event.currentTarget.contains(event.target as Element)
        ) {
          return;
        }

        // The row might have been deleted
        if (!apiRef.current.getRow(params.row.id)) {
          return;
        }

        apiRef.current.publishEvent(eventName, apiRef.current.getRowParams(params.row.id), event);

        if (propHandler) {
          propHandler(event);
        }
      },
    [apiRef, params.row.id],
  );

  const draggableEventHandlers = {
    onDragStart: publish(GridEvents.rowDragStart),
    onDragOver: publish(GridEvents.rowDragOver),
    onDragEnd: publish(GridEvents.rowDragEnd),
  };

  return (
    <div className={gridClasses.actionsCell} draggable={isDraggable} {...draggableEventHandlers}>
      <rootProps.components.RowReorderIcon />

      <div className={gridClasses.rowDraggableContainer}>{params.row.id}</div>
    </div>
  );
};

export { GridRowReorderCell };

export const renderRowReorderCell = (params: GridRenderCellParams) => (
  <GridRowReorderCell {...params} />
);
