import * as React from 'react';
import { createSelector } from 'reselect';
import { GridState } from '../hooks/features/core/gridState';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { InternalRowsState } from '../hooks/features/rows/rowsReducer';
import { rowsSelector, sortedRowsSelector } from '../hooks/features/rows/rowsSelector';
import { optionsSelector } from '../hooks/utils/useOptionsProp';
import { Columns, GridOptions, RenderContextProps, RowModel } from '../models';
import { useLogger } from '../hooks/utils/useLogger';
import { ApiContext } from './api-context';
import { RenderingZone } from './rendering-zone';
import { LeftEmptyCell, RightEmptyCell } from './cell';
import { Row } from './row';
import { RowCells } from './row-cells';
import { StickyContainer } from './sticky-container';
import { RenderContext } from './render-context';

export interface ViewportProps {
  visibleColumns: Columns;
}

type ViewportType = React.ForwardRefExoticComponent<
  ViewportProps & React.RefAttributes<HTMLDivElement>
>;

export const Viewport: ViewportType = React.forwardRef<HTMLDivElement, ViewportProps>(
  ({ visibleColumns }, renderingZoneRef) => {
    const logger = useLogger('Viewport');
    const renderCtx = React.useContext(RenderContext) as RenderContextProps;
    const apiRef = React.useContext(ApiContext);
    const rows = useGridSelector(apiRef, sortedRowsSelector);
    const options = useGridSelector(apiRef, optionsSelector);

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
            columns={visibleColumns}
            row={r}
            firstColIdx={renderCtx.firstColIdx}
            lastColIdx={renderCtx.lastColIdx}
            hasScroll={{ y: renderCtx.hasScrollY, x: renderCtx.hasScrollX }}
            scrollSize={renderCtx.scrollBarSize}
            showCellRightBorder={!!options.showCellRightBorder}
            extendRowFullWidth={!options.disableExtendRowFullWidth}
            rowIndex={renderCtx.firstRowIdx + idx}
            domIndex={idx}
          />
          <RightEmptyCell width={renderCtx.rightEmptyWidth} />
        </Row>
      ));
    };

    logger.debug('Rendering ViewPort');
    return (
      <StickyContainer {...renderCtx.viewportSize}>
        <RenderingZone ref={renderingZoneRef} {...renderCtx.renderingZone}>
          {getRowsElements()}
        </RenderingZone>
      </StickyContainer>
    );
  },
);
Viewport.displayName = 'Viewport';
