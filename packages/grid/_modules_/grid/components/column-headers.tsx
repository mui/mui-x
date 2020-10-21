import * as React from 'react';
import { Columns, RenderContextProps } from '../models';
import { ColDef } from '../models/colDef';
import { ColumnHeaderItem } from './column-header-item';
import { ApiContext } from './api-context';
import { LeftEmptyCell, RightEmptyCell } from './cell';
import { OptionsContext } from './options-context';
import { ScrollArea } from './ScrollArea';
import { CursorCoordinates } from '../hooks';

export interface ColumnHeadersItemCollectionProps {
  columns: Columns;
  onColumnDragEnter?: (event: Event) => void;
  onColumnDragOver?: (col: ColDef, pos: CursorCoordinates) => void;
  onColumnDragStart?: (col: ColDef, htmlEL: HTMLElement) => void;
  separatorProps: React.HTMLAttributes<HTMLDivElement>;
}

export const ColumnHeaderItemCollection = React.memo(function ColumnHeaderItemCollection(
  props: ColumnHeadersItemCollectionProps,
) {
  const { separatorProps, onColumnDragStart, onColumnDragEnter, onColumnDragOver, columns } = props;
  const items = columns.map((col, idx) => (
    <ColumnHeaderItem
      key={col.field}
      column={col}
      colIndex={idx}
      separatorProps={separatorProps}
      onColumnDragStart={onColumnDragStart}
      onColumnDragEnter={onColumnDragEnter}
      onColumnDragOver={onColumnDragOver}
    />
  ));

  return <React.Fragment>{items}</React.Fragment>;
});

export interface ColumnsHeaderProps {
  columns: Columns;
  hasScrollX: boolean;
  separatorProps: React.HTMLAttributes<HTMLDivElement>;
  onColumnHeaderDragOver?: (event: Event) => void;
  onColumnDragOver?: (col: ColDef, pos: CursorCoordinates) => void;
  onColumnDragStart?: (col: ColDef, htmlEl: HTMLElement) => void;
  onColumnDragEnter?: (event: Event) => void;
  renderCtx: Partial<RenderContextProps> | null;
}

export const ColumnsHeader = React.memo(
  React.forwardRef<HTMLDivElement, ColumnsHeaderProps>((props, ref) => {
    const {
      columns,
      hasScrollX,
      onColumnDragEnter,
      onColumnDragOver,
      onColumnDragStart,
      onColumnHeaderDragOver,
      renderCtx,
      separatorProps,
    } = props;
    const wrapperCssClasses = `MuiDataGrid-colCellWrapper ${hasScrollX ? 'scroll' : ''}`;
    const api = React.useContext(ApiContext);
    const { disableColumnReorder } = React.useContext(OptionsContext);

    if (!api) {
      throw new Error('Material-UI: ApiRef was not found in context.');
    }
    const lastRenderedColIndexes = React.useRef({
      first: renderCtx?.firstColIdx,
      last: renderCtx?.lastColIdx,
    });
    const [renderedCols, setRenderedCols] = React.useState(columns);

    React.useEffect(() => {
      if (renderCtx && renderCtx.firstColIdx != null && renderCtx.lastColIdx != null) {
        setRenderedCols(columns.slice(renderCtx.firstColIdx, renderCtx.lastColIdx + 1));

        if (
          lastRenderedColIndexes.current.first !== renderCtx.firstColIdx ||
          lastRenderedColIndexes.current.last !== renderCtx.lastColIdx
        ) {
          lastRenderedColIndexes.current = {
            first: renderCtx.firstColIdx,
            last: renderCtx.lastColIdx,
          };
        }
      }
    }, [renderCtx, columns]);

    const handleDragOver =
      onColumnHeaderDragOver && !disableColumnReorder
        ? (event) => onColumnHeaderDragOver(event)
        : undefined;

    return (
      <React.Fragment>
        <ScrollArea scrollDirection="left" />
        {/* Header row isn't interactive, cells are, event delegation */}
        {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
        <div
          ref={ref}
          className={wrapperCssClasses}
          aria-rowindex={1}
          role="row"
          style={{ minWidth: renderCtx?.totalSizes?.width }}
          onDragOver={handleDragOver}
        >
          <LeftEmptyCell width={renderCtx?.leftEmptyWidth} />
          <ColumnHeaderItemCollection
            columns={renderedCols}
            onColumnDragStart={onColumnDragStart}
            onColumnDragOver={onColumnDragOver}
            onColumnDragEnter={onColumnDragEnter}
            separatorProps={separatorProps}
          />
          <RightEmptyCell width={renderCtx?.rightEmptyWidth} />
        </div>
        <ScrollArea scrollDirection="right" />
      </React.Fragment>
    );
  }),
);
ColumnsHeader.displayName = 'GridColumnsHeader';
