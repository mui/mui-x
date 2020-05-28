import React, { RefAttributes, useContext } from 'react';
import { Columns, GridOptions, RenderContextProps, RowModel } from '../models';
import { useLogger } from '../hooks/utils/useLogger';
import { RenderingZone } from './rendering-zone';
import { LeftEmptyCell, RightEmptyCell } from './cell';
import { Row } from './row';
import { RowCells } from './row-cells';
import { StickyContainer } from './sticky-container';
import { RenderContext } from './render-context';

export interface ViewportProps {
  rows: RowModel[];
  visibleColumns: Columns;
  options: GridOptions;
  children?: React.ReactNode;
}

type ViewportType = React.ForwardRefExoticComponent<ViewportProps & RefAttributes<HTMLDivElement>>;
export const Viewport: ViewportType = React.forwardRef<HTMLDivElement, ViewportProps>(
  ({ options, rows, visibleColumns, children }, renderingZoneRef) => {
    const logger = useLogger('Viewport');
    const renderCtx = useContext(RenderContext) as RenderContextProps;

    const getRowsElements = () => {
      const renderedRows = rows.slice(renderCtx.firstRowIdx, renderCtx.lastRowIdx! + 1);
      return renderedRows.map((r, idx) => (
        <Row
          className={(renderCtx.firstRowIdx! + idx) % 2 === 0 ? 'even' : 'odd'}
          key={r.id}
          id={r.id}
          selected={r.selected}
          rowIndex={renderCtx.firstRowIdx + idx}
        >
          <LeftEmptyCell key={'left-empty'} width={renderCtx.leftEmptyWidth} />
          <RowCells
            columns={visibleColumns}
            row={r}
            firstColIdx={renderCtx.firstColIdx}
            lastColIdx={renderCtx.lastColIdx}
            hasScroll={{ y: renderCtx.hasScrollY, x: renderCtx.hasScrollX }}
            scrollSize={renderCtx.scrollBarSize}
            showCellRightBorder={options.showCellRightBorder}
            extendRowFullWidth={options.extendRowFullWidth}
            rowIndex={renderCtx.firstRowIdx + idx}
            domIndex={idx}
          />
          <RightEmptyCell key={'right-empty'} width={renderCtx.rightEmptyWidth} />
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
