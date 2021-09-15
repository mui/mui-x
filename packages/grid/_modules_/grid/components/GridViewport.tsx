import * as React from 'react';
import { visibleGridColumnsSelector } from '../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { gridDensityRowHeightSelector } from '../hooks/features/density/densitySelector';
import { gridSortedVisibleRowsFlatSelector } from '../hooks/features/filter/gridFilterSelector';
import {
  gridFocusCellSelector,
  gridTabIndexCellSelector,
} from '../hooks/features/focus/gridFocusStateSelector';
import { gridEditRowsStateSelector } from '../hooks/features/rows/gridEditRowsSelector';
import { gridSelectionStateSelector } from '../hooks/features/selection/gridSelectionSelector';
import { gridRenderingSelector } from '../hooks/features/virtualization/renderingStateSelector';
import { useGridApiContext } from '../hooks/root/useGridApiContext';
import { GridDataContainer } from './containers/GridDataContainer';
import { GridEmptyCell } from './cell/GridEmptyCell';
import { GridRenderingZone } from './GridRenderingZone';
import { GridRow } from './GridRow';
import { GridRowCells } from './cell/GridRowCells';
import { GridStickyContainer } from './GridStickyContainer';
import {
  gridContainerSizesSelector,
  gridViewportSizesSelector,
  gridScrollBarSizeSelector,
} from '../hooks/root/gridContainerSizesSelector';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

type ViewportType = React.ForwardRefExoticComponent<React.RefAttributes<HTMLDivElement>>;

export const GridViewport: ViewportType = React.forwardRef<HTMLDivElement, {}>(
  function GridViewport(props, renderingZoneRef) {
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);
    const viewportSizes = useGridSelector(apiRef, gridViewportSizesSelector);
    const scrollBarState = useGridSelector(apiRef, gridScrollBarSizeSelector);
    const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
    const renderState = useGridSelector(apiRef, gridRenderingSelector);
    const cellFocus = useGridSelector(apiRef, gridFocusCellSelector);
    const cellTabIndex = useGridSelector(apiRef, gridTabIndexCellSelector);
    const selection = useGridSelector(apiRef, gridSelectionStateSelector);
    const visibleSortedRows = useGridSelector(apiRef, gridSortedVisibleRowsFlatSelector);
    const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
    const editRowsState = useGridSelector(apiRef, gridEditRowsStateSelector);

    const filteredSelection = React.useMemo(
      () =>
        typeof rootProps.isRowSelectable === 'function'
          ? selection.filter((id) => rootProps.isRowSelectable!(apiRef.current.getRowParams(id)))
          : selection,
      [apiRef, rootProps.isRowSelectable, selection],
    );

    const selectionLookup = React.useMemo(
      () =>
        filteredSelection.reduce((lookup, rowId) => {
          lookup[rowId] = rowId;
          return lookup;
        }, {}),
      [filteredSelection],
    );

    const getRowsElements = () => {
      if (renderState.renderContext == null) {
        return null;
      }

      const renderedRows = visibleSortedRows.slice(
        renderState.renderContext.firstRowIdx,
        renderState.renderContext.lastRowIdx!,
      );

      // TODO: Add tree children
      return renderedRows.map((row, idx) => (
        <GridRow
          key={row.id}
          id={row.id}
          selected={selectionLookup[row.id] !== undefined}
          rowIndex={renderState.renderContext!.firstRowIdx! + idx}
        >
          <GridEmptyCell width={renderState.renderContext!.leftEmptyWidth} height={rowHeight} />
          <GridRowCells
            columns={visibleColumns}
            row={row.node}
            id={row.id}
            height={rowHeight}
            firstColIdx={renderState.renderContext!.firstColIdx!}
            lastColIdx={renderState.renderContext!.lastColIdx!}
            hasScrollX={scrollBarState.hasScrollX}
            hasScrollY={scrollBarState.hasScrollY}
            showCellRightBorder={rootProps.showCellRightBorder}
            extendRowFullWidth={!rootProps.disableExtendRowFullWidth}
            rowIndex={renderState.renderContext!.firstRowIdx! + idx}
            cellFocus={cellFocus}
            cellTabIndex={cellTabIndex}
            isSelected={selectionLookup[row.id] !== undefined}
            editRowState={editRowsState[row.id]}
            getCellClassName={rootProps.getCellClassName}
          />
          <GridEmptyCell width={renderState.renderContext!.rightEmptyWidth} height={rowHeight} />
        </GridRow>
      ));
    };

    return (
      <GridDataContainer>
        <GridStickyContainer {...viewportSizes}>
          <GridRenderingZone
            ref={renderingZoneRef}
            {...(containerSizes?.renderingZone || { width: 0, height: 0 })}
          >
            {getRowsElements()}
          </GridRenderingZone>
        </GridStickyContainer>
      </GridDataContainer>
    );
  },
);
