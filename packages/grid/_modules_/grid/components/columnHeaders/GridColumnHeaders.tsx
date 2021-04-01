import * as React from 'react';
import { visibleGridColumnsSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { GridState } from '../../hooks/features/core/gridState';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { renderStateSelector } from '../../hooks/features/virtualization/renderingStateSelector';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { GridApiContext } from '../GridApiContext';
import { GridEmptyCell } from '../cell/GridEmptyCell';
import { GridScrollArea } from '../GridScrollArea';
import { GridColumnHeadersItemCollection } from './GridColumnHeadersItemCollection';
import { gridDensityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';
import { gridColumnReorderDragColSelector } from '../../hooks/features/columnReorder/columnReorderSelector';
import { gridContainerSizesSelector } from '../../hooks/root/gridContainerSizesSelector';
import { GRID_COLUMN_REORDER_DRAG_OVER_HEADER } from '../../constants/eventsConstants';

export const gridScrollbarStateSelector = (state: GridState) => state.scrollBar;

export const GridColumnsHeader = React.forwardRef<HTMLDivElement, {}>(function GridColumnsHeader(
  props,
  ref,
) {
  const apiRef = React.useContext(GridApiContext);
  const columns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const { disableColumnReorder } = useGridSelector(apiRef, optionsSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);
  const renderCtx = useGridSelector(apiRef, renderStateSelector).renderContext;
  const { hasScrollX } = useGridSelector(apiRef, gridScrollbarStateSelector);
  const dragCol = useGridSelector(apiRef, gridColumnReorderDragColSelector);
  const wrapperCssClasses = `MuiDataGrid-colCellWrapper ${hasScrollX ? 'scroll' : ''}`;

  const renderedCols = React.useMemo(() => {
    if (renderCtx == null) {
      return [];
    }
    return columns.slice(renderCtx.firstColIdx, renderCtx.lastColIdx! + 1);
  }, [columns, renderCtx]);

  const handleDragOver =
    !disableColumnReorder && apiRef
      ? (event) =>
          apiRef.current.publishEvent(
            GRID_COLUMN_REORDER_DRAG_OVER_HEADER,
            apiRef.current.getColumnHeaderParams(dragCol),
            event,
          )
      : undefined;

  return (
    <React.Fragment>
      <GridScrollArea scrollDirection="left" />
      {/* Header row isn't interactive, cells are, event delegation */}
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
      <div
        ref={ref}
        className={wrapperCssClasses}
        aria-rowindex={1}
        role="row"
        style={{ minWidth: containerSizes?.totalSizes?.width }}
        onDragOver={handleDragOver}
      >
        <GridEmptyCell width={renderCtx?.leftEmptyWidth} height={headerHeight} />
        <GridColumnHeadersItemCollection columns={renderedCols} />
        <GridEmptyCell width={renderCtx?.rightEmptyWidth} height={headerHeight} />
      </div>
      <GridScrollArea scrollDirection="right" />
    </React.Fragment>
  );
});
