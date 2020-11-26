import * as React from 'react';
import { CellIndexCoordinates, Columns, GridOptions, RenderContextProps, RowModel } from '../models';
import { LeftEmptyCell, RightEmptyCell } from './Cell';
import { Row } from './Row';
import { RowCells } from './RowCells';

export const RowElements: React.FC<{
  row: RowModel;
  domIndex: number;
  renderContext: RenderContextProps;
  options: GridOptions;
  columns: Columns;
  cellFocus: CellIndexCoordinates | null;
  hasScroll: { y: boolean; x: boolean };
  selected: boolean;
  rowHeight: number
}> = React.memo(({
  row,
  domIndex,
  renderContext,
  options,
  columns,
  cellFocus,
  hasScroll,
  selected,
  rowHeight,
}) => {
  return (
    <Row
      className={
        (renderContext.firstRowIdx + domIndex) % 2 === 0 ? 'Mui-even' : 'Mui-odd'
      }
      id={row.id}
      selected={selected}
      rowIndex={renderContext.firstRowIdx + domIndex}
    >
      <LeftEmptyCell width={renderContext.leftEmptyWidth} height={rowHeight} />
      <RowCells
        columns={columns}
        row={row}
        firstColIdx={renderContext.firstColIdx}
        lastColIdx={renderContext.lastColIdx}
        hasScroll={hasScroll}
        scrollSize={options.scrollbarSize}
        showCellRightBorder={!!options.showCellRightBorder}
        extendRowFullWidth={!options.disableExtendRowFullWidth}
        rowIndex={renderContext.firstRowIdx + domIndex}
        cellFocus={cellFocus}
        domIndex={domIndex}
      />
      <RightEmptyCell width={renderContext.rightEmptyWidth} height={rowHeight} />
    </Row>
  )
});
RowElements.displayName = 'RowElements';
