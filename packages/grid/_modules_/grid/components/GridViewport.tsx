import * as React from 'react';
import { visibleGridColumnsSelector } from '../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { gridDensityRowHeightSelector } from '../hooks/features/density/densitySelector';
import { visibleSortedGridRowsAsArraySelector } from '../hooks/features/filter/gridFilterSelector';
import {
  gridFocusCellSelector,
  gridTabIndexCellSelector,
} from '../hooks/features/focus/gridFocusStateSelector';
import { gridEditRowsStateSelector } from '../hooks/features/editRows/gridEditRowsSelector';
import { gridSelectionStateSelector } from '../hooks/features/selection/gridSelectionSelector';
import { gridRenderingSelector } from '../hooks/features/virtualization/renderingStateSelector';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridDataContainer } from './containers/GridDataContainer';
import { GridRenderingZone } from './GridRenderingZone';
import { GridStickyContainer } from './GridStickyContainer';
import {
  gridContainerSizesSelector,
  gridViewportSizesSelector,
  gridScrollBarSizeSelector,
} from '../hooks/features/container/gridContainerSizesSelector';
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
    const visibleSortedRowsAsArray = useGridSelector(apiRef, visibleSortedGridRowsAsArraySelector);
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

      const renderedRows = visibleSortedRowsAsArray.slice(
        renderState.renderContext.firstRowIdx,
        renderState.renderContext.lastRowIdx!,
      );

      const renderedColumns = visibleColumns.slice(
        renderState.renderContext.firstColIdx!,
        renderState.renderContext.lastColIdx! + 1,
      );

      return renderedRows.map(([id, row], idx) => (
        <rootProps.components.Row
          key={id}
          id={id}
          row={row}
          selected={selectionLookup[id] !== undefined}
          index={renderState.renderContext!.firstRowIdx! + idx}
          rowHeight={rowHeight}
          renderedColumns={renderedColumns}
          firstColumnToRender={renderState.renderContext!.firstColIdx!}
          cellFocus={cellFocus}
          cellTabIndex={cellTabIndex}
          editRowsModel={editRowsState}
          scrollBarState={scrollBarState}
          renderState={renderState}
          {...rootProps.componentsProps?.row}
        />
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
