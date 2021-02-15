import * as React from 'react';
import { visibleColumnsSelector } from '../hooks/features/columns/columnsSelector';
import { GridState } from '../hooks/features/core/gridState';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { densityRowHeightSelector } from '../hooks/features/density/densitySelector';
import { visibleSortedRowsSelector } from '../hooks/features/filter/filterSelector';
import { keyboardCellSelector } from '../hooks/features/keyboard/keyboardSelector';
import { selectionStateSelector } from '../hooks/features/selection/selectionSelector';
import { renderStateSelector } from '../hooks/features/virtualization/renderingStateSelector';
import { optionsSelector } from '../hooks/utils/optionsSelector';
import { ApiContext } from './api-context';
import { LeftEmptyCell, RightEmptyCell } from './Cell';
import { GridDataContainer } from './containers/GridDataContainer';
import { RenderingZone } from './RenderingZone';
import { Row } from './Row';
import { RowCells } from './RowCells';
import { StickyContainer } from './StickyContainer';

type ViewportType = React.ForwardRefExoticComponent<React.RefAttributes<HTMLDivElement>>;

export const containerSizesSelector = (state: GridState) => state.containerSizes;
export const viewportSizesSelector = (state: GridState) => state.viewportSizes;
export const scrollBarSizeSelector = (state: GridState) => state.scrollBar;

export const Viewport: ViewportType = React.forwardRef<HTMLDivElement, {}>(
  (props, renderingZoneRef) => {
    const apiRef = React.useContext(ApiContext);

    const options = useGridSelector(apiRef, optionsSelector);
    const containerSizes = useGridSelector(apiRef, containerSizesSelector);
    const viewportSizes = useGridSelector(apiRef, viewportSizesSelector);
    const scrollBarState = useGridSelector(apiRef, scrollBarSizeSelector);
    const visibleColumns = useGridSelector(apiRef, visibleColumnsSelector);
    const renderState = useGridSelector(apiRef, renderStateSelector);
    const cellFocus = useGridSelector(apiRef, keyboardCellSelector);
    const selectionState = useGridSelector(apiRef, selectionStateSelector);
    const rows = useGridSelector(apiRef, visibleSortedRowsSelector);
    const rowHeight = useGridSelector(apiRef, densityRowHeightSelector);

    const getRowsElements = () => {
      if (renderState.renderContext == null) {
        return null;
      }

      const renderedRows = rows.slice(
        renderState.renderContext.firstRowIdx,
        renderState.renderContext.lastRowIdx!,
      );
      return renderedRows.map((r, idx) => (
        <Row
          className={
            (renderState.renderContext!.firstRowIdx! + idx) % 2 === 0 ? 'Mui-even' : 'Mui-odd'
          }
          key={r.id}
          id={r.id}
          selected={!!selectionState[r.id]}
          rowIndex={renderState.renderContext!.firstRowIdx! + idx}
        >
          <LeftEmptyCell width={renderState.renderContext!.leftEmptyWidth} height={rowHeight} />
          <RowCells
            columns={visibleColumns}
            row={r}
            firstColIdx={renderState.renderContext!.firstColIdx!}
            lastColIdx={renderState.renderContext!.lastColIdx!}
            hasScroll={{ y: scrollBarState!.hasScrollY, x: scrollBarState.hasScrollX }}
            scrollSize={options.scrollbarSize!}
            showCellRightBorder={!!options.showCellRightBorder}
            extendRowFullWidth={!options.disableExtendRowFullWidth}
            rowIndex={renderState.renderContext!.firstRowIdx! + idx}
            cellFocus={cellFocus}
            domIndex={idx}
          />
          <RightEmptyCell width={renderState.renderContext!.rightEmptyWidth} height={rowHeight} />
        </Row>
      ));
    };

    return (
      <GridDataContainer>
        <StickyContainer {...viewportSizes}>
          <RenderingZone
            ref={renderingZoneRef}
            {...(containerSizes?.renderingZone || { width: 0, height: 0 })}
          >
            {getRowsElements()}
          </RenderingZone>
        </StickyContainer>
      </GridDataContainer>
    );
  },
);
Viewport.displayName = 'Viewport';
