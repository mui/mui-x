import * as React from 'react';
import { visibleGridColumnsSelector } from '../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { gridDensityRowHeightSelector } from '../hooks/features/density/densitySelector';
import { visibleSortedGridRowsAsArraySelector } from '../hooks/features/filter/gridFilterSelector';
import { gridKeyboardCellSelector } from '../hooks/features/keyboard/gridKeyboardSelector';
import { gridSelectionStateSelector } from '../hooks/features/selection/gridSelectionSelector';
import { renderStateSelector } from '../hooks/features/virtualization/renderingStateSelector';
import { optionsSelector } from '../hooks/utils/optionsSelector';
import { GridApiContext } from './GridApiContext';
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

type ViewportType = React.ForwardRefExoticComponent<React.RefAttributes<HTMLDivElement>>;

export const GridViewport: ViewportType = React.forwardRef<HTMLDivElement, {}>(
  (props, renderingZoneRef) => {
    const apiRef = React.useContext(GridApiContext);

    const options = useGridSelector(apiRef, optionsSelector);
    const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);
    const viewportSizes = useGridSelector(apiRef, gridViewportSizesSelector);
    const scrollBarState = useGridSelector(apiRef, gridScrollBarSizeSelector);
    const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
    const renderState = useGridSelector(apiRef, renderStateSelector);
    const cellFocus = useGridSelector(apiRef, gridKeyboardCellSelector);
    const selectionState = useGridSelector(apiRef, gridSelectionStateSelector);
    const rows = useGridSelector(apiRef, visibleSortedGridRowsAsArraySelector);
    const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);

    const getRowsElements = () => {
      if (renderState.renderContext == null) {
        return null;
      }

      const renderedRows = rows.slice(
        renderState.renderContext.firstRowIdx,
        renderState.renderContext.lastRowIdx!,
      );
      return renderedRows.map(([id, row], idx) => (
        <GridRow
          className={
            (renderState.renderContext!.firstRowIdx! + idx) % 2 === 0 ? 'Mui-even' : 'Mui-odd'
          }
          key={id}
          id={id}
          selected={!!selectionState[id]}
          rowIndex={renderState.renderContext!.firstRowIdx! + idx}
        >
          <GridEmptyCell width={renderState.renderContext!.leftEmptyWidth} height={rowHeight} />
          <GridRowCells
            columns={visibleColumns}
            row={row}
            id={id}
            firstColIdx={renderState.renderContext!.firstColIdx!}
            lastColIdx={renderState.renderContext!.lastColIdx!}
            hasScroll={{ y: scrollBarState!.hasScrollY, x: scrollBarState.hasScrollX }}
            showCellRightBorder={!!options.showCellRightBorder}
            extendRowFullWidth={!options.disableExtendRowFullWidth}
            rowIndex={renderState.renderContext!.firstRowIdx! + idx}
            cellFocus={cellFocus}
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
GridViewport.displayName = 'GridViewport';
