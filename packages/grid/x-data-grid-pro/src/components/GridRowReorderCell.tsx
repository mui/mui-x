import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import {
  GridEvents,
  GridRenderCellParams,
  GridRowEventLookup,
  gridRowTreeDepthSelector,
  gridSortModelSelector,
  useGridApiContext,
  useGridSelector,
  getDataGridUtilityClass,
} from '@mui/x-data-grid';
import { DataGridProProcessedProps } from '../models/dataGridProProps';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

type OwnerState = {
  classes?: DataGridProProcessedProps['classes'];
  isDraggable: boolean;
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { isDraggable, classes } = ownerState;

  const slots = {
    root: ['rowReorderCell', isDraggable && 'rowReorderCell--draggable'],
    container: ['rowDraggableContainer'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridRowReorderCell = (params: GridRenderCellParams) => {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const treeDepth = useGridSelector(apiRef, gridRowTreeDepthSelector);
  // eslint-disable-next-line no-underscore-dangle
  const cellValue = params.row.__reorder__ || params.row.id;

  // TODO: remove sortModel and treeDepth checks once row reorder is compatible
  const isDraggable =
    !!(rootProps as DataGridProProcessedProps).rowReordering &&
    !sortModel.length &&
    treeDepth === 1;

  const ownerState = { isDraggable, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

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
    <div className={classes.root} draggable={isDraggable} {...draggableEventHandlers}>
      <rootProps.components.RowReorderIcon />
      <div className={classes.container}>{cellValue}</div>
    </div>
  );
};

export { GridRowReorderCell };

export const renderRowReorderCell = (params: GridRenderCellParams) => (
  <GridRowReorderCell {...params} />
);
