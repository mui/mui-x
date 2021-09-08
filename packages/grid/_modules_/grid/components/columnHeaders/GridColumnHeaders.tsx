import * as React from 'react';
import clsx from 'clsx';
import { visibleGridColumnsSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { GridState } from '../../hooks/features/core/gridState';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { useGridProSelector } from '../../hooks/features/core/useGridProSelector';
import { gridRenderingSelector } from '../../hooks/features/virtualization/renderingStateSelector';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { GridEmptyCell } from '../cell/GridEmptyCell';
import { GridScrollArea } from '../GridScrollArea';
import { GridColumnHeadersItemCollection } from './GridColumnHeadersItemCollection';
import { gridDensityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';
import { gridColumnReorderDragColSelector } from '../../hooks/features/columnReorder/columnReorderSelector';
import { gridContainerSizesSelector } from '../../hooks/root/gridContainerSizesSelector';
import { getDataGridUtilityClass } from '../../gridClasses';
import { composeClasses } from '../../utils/material-ui-utils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../../GridComponentProps';

export const gridScrollbarStateSelector = (state: GridState) => state.scrollBar;

type OwnerState = {
  classes?: GridComponentProps['classes'];
  dragCol: string | undefined;
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
  const apiRef = useGridApiContext();
  const columns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);
  const renderCtx = useGridSelector(apiRef, gridRenderingSelector).renderContext;
  const { hasScrollX } = useGridSelector(apiRef, gridScrollbarStateSelector);
  const dragCol = useGridProSelector(apiRef, gridColumnReorderDragColSelector);
  const rootProps = useGridRootProps();

  const ownerState = { ...props, dragCol, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const renderedCols = React.useMemo(() => {
    if (renderCtx == null) {
      return [];
    }
    return columns.slice(renderCtx.firstColIdx, renderCtx.lastColIdx! + 1);
  }, [columns, renderCtx]);

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
        <GridColumnHeadersItemCollection columns={renderedCols} />
        <GridEmptyCell width={renderCtx?.rightEmptyWidth} height={headerHeight} />
      </div>
      <GridScrollArea scrollDirection="right" />
    </React.Fragment>
  );
});
