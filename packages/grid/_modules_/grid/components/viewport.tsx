import * as React from 'react';
import { columnsSelector } from '../hooks/features/columns/columnsSelector';
import { GridState } from '../hooks/features/core/gridState';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { keyboardCellSelector } from '../hooks/features/keyboard/keyboardSelector';
import { sortedRowsSelector } from '../hooks/features/sorting/sortingSelector';
import { useLogger } from '../hooks/utils/useLogger';
import { optionsSelector } from '../hooks/utils/useOptionsProp';
import { RenderContextProps } from '../models/renderContextProps';
import { ApiContext } from './api-context';
import { LeftEmptyCell, RightEmptyCell } from './cell';
import { RenderContext } from './render-context';
import { RenderingZone } from './rendering-zone';
import { Row } from './row';
import { RowCells } from './row-cells';
import { StickyContainer } from './sticky-container';

type ViewportType = React.ForwardRefExoticComponent<React.RefAttributes<HTMLDivElement>>;

export const containerSizesSelector = (state: GridState) => state.containerSizes;

export const Viewport: ViewportType = React.forwardRef<HTMLDivElement, {}>(
  (props, renderingZoneRef) => {
    const logger = useLogger('Viewport');
    const renderCtx = React.useContext(RenderContext) as RenderContextProps;
    const apiRef = React.useContext(ApiContext);
    const rows = useGridSelector(apiRef, sortedRowsSelector);
    const options = useGridSelector(apiRef, optionsSelector);
    const containerSizes = useGridSelector(apiRef, containerSizesSelector);
    const columns = useGridSelector(apiRef, columnsSelector);
    const cellFocus = useGridSelector(apiRef, keyboardCellSelector);

    const getRowsElements = () => {
      const renderedRows = rows.slice(renderCtx.firstRowIdx, renderCtx.lastRowIdx!);
      return renderedRows.map((r, idx) => (
        <Row
          className={(renderCtx.firstRowIdx! + idx) % 2 === 0 ? 'Mui-even' : 'Mui-odd'}
          key={r.id}
          id={r.id}
          selected={r.selected}
          rowIndex={renderCtx.firstRowIdx + idx}
        >
          <LeftEmptyCell width={renderCtx.leftEmptyWidth} />
          <RowCells
            columns={columns.visible}
            row={r}
            firstColIdx={renderCtx.firstColIdx}
            lastColIdx={renderCtx.lastColIdx}
            hasScroll={{ y: containerSizes!.hasScrollY, x: containerSizes!.hasScrollX }}
            scrollSize={containerSizes!.scrollBarSize}
            showCellRightBorder={!!options.showCellRightBorder}
            extendRowFullWidth={!options.disableExtendRowFullWidth}
            rowIndex={renderCtx.firstRowIdx + idx}
            cellFocus={cellFocus}
            domIndex={idx}
          />
          <RightEmptyCell width={renderCtx.rightEmptyWidth} />
        </Row>
      ));
    };

    logger.debug('Rendering ViewPort');
    return (
      <StickyContainer {...containerSizes!.viewportSize}>
        <RenderingZone ref={renderingZoneRef} {...containerSizes!.renderingZone}>
          {getRowsElements()}
        </RenderingZone>
      </StickyContainer>
    );
  },
);
Viewport.displayName = 'Viewport';
