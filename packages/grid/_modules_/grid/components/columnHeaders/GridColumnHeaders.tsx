import * as React from 'react';
import clsx from 'clsx';
import { visibleGridColumnsSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { GridState } from '../../models/gridState';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridRenderingSelector } from '../../hooks/features/virtualization/renderingStateSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridEmptyCell } from '../cell/GridEmptyCell';
import { GridScrollArea } from '../GridScrollArea';
import { GridColumnHeadersItemCollection } from './GridColumnHeadersItemCollection';
import { gridDensityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';
import { gridContainerSizesSelector } from '../../hooks/features/container/gridContainerSizesSelector';
import { getDataGridUtilityClass } from '../../gridClasses';
import { composeClasses } from '../../utils/material-ui-utils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../../GridComponentProps';
import { useGridApiEventHandler } from '../../hooks/utils/useGridApiEventHandler';
import { GridEvents } from '../../constants/eventsConstants';
import { GridColumnHeaderParams } from '../../models/params/gridColumnHeaderParams';

export const gridScrollbarStateSelector = (state: GridState) => state.scrollBar;

type OwnerState = {
  classes?: GridComponentProps['classes'];
  dragCol: string;
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { dragCol, classes } = ownerState;

  const slots = {
    wrapper: ['columnHeaderWrapper', dragCol && 'columnHeaderDropZone'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export const GridColumnsHeader = React.forwardRef<HTMLDivElement, {}>(function GridColumnsHeader(
  props,
  ref,
) {
  const [dragCol, setDragCol] = React.useState('');
  const [resizeCol, setResizeCol] = React.useState('');

  const apiRef = useGridApiContext();
  const columns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);
  const renderCtx = useGridSelector(apiRef, gridRenderingSelector).renderContext;
  const { hasScrollX } = useGridSelector(apiRef, gridScrollbarStateSelector);
  const rootProps = useGridRootProps();

  const ownerState = { dragCol, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const renderedCols = React.useMemo(() => {
    if (renderCtx == null) {
      return [];
    }
    return columns.slice(renderCtx.firstColIdx, renderCtx.lastColIdx! + 1);
  }, [columns, renderCtx]);

  const handleColumnResizeStart = React.useCallback(
    (params: { field: string }) => setResizeCol(params.field),
    [],
  );
  const handleColumnResizeStop = React.useCallback(() => setResizeCol(''), []);
  const handleColumnReorderStart = React.useCallback(
    (params: GridColumnHeaderParams) => setDragCol(params.field),
    [],
  );
  const handleColumnReorderStop = React.useCallback(() => setDragCol(''), []);

  useGridApiEventHandler(apiRef, GridEvents.columnResizeStart, handleColumnResizeStart);
  useGridApiEventHandler(apiRef, GridEvents.columnResizeStop, handleColumnResizeStop);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderDragStart, handleColumnReorderStart);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderDragEnd, handleColumnReorderStop);

  return (
    <React.Fragment>
      <GridScrollArea scrollDirection="left" />
      <div
        ref={ref}
        className={clsx(classes.wrapper, hasScrollX && 'scroll')}
        aria-rowindex={1}
        role="row"
        style={{ minWidth: containerSizes?.totalSizes?.width }}
      >
        <GridEmptyCell width={renderCtx?.leftEmptyWidth} height={headerHeight} />
        <GridColumnHeadersItemCollection
          columns={renderedCols}
          dragCol={dragCol}
          resizeCol={resizeCol}
        />
        <GridEmptyCell width={renderCtx?.rightEmptyWidth} height={headerHeight} />
      </div>
      <GridScrollArea scrollDirection="right" />
    </React.Fragment>
  );
});
