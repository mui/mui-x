import * as React from 'react';
import { ColDef, Columns, RenderContextProps } from '../models';
import { ColumnHeaderItem } from './column-header-item';
import { ApiContext } from './api-context';
import { LeftEmptyCell, RightEmptyCell } from './cell';

export interface ColumnHeadersItemCollectionProps {
  columns: Columns;
  onResizeColumn?: (col: ColDef) => void;
}
export const ColumnHeaderItemCollection: React.FC<ColumnHeadersItemCollectionProps> = React.memo(
  ({ onResizeColumn, columns }) => {
    const items = columns.map((col, idx) => (
      <ColumnHeaderItem
        key={col.field}
        column={col}
        colIndex={idx}
        onResizeColumn={onResizeColumn}
      />
    ));

    return <React.Fragment>{items}</React.Fragment>;
  },
);
ColumnHeaderItemCollection.displayName = 'ColumnHeaderItemCollection';

export interface ColumnsHeaderProps {
  columns: Columns;
  hasScrollX: boolean;
  onResizeColumn?: (col: ColDef) => void;
  renderCtx: Partial<RenderContextProps> | null;
}

export const ColumnsHeader = React.memo(
  React.forwardRef<HTMLDivElement, ColumnsHeaderProps>(
    ({ columns, hasScrollX, onResizeColumn, renderCtx }, columnsHeaderRef) => {
      const wrapperCssClasses = `MuiDataGrid-colCellWrapper ${hasScrollX ? 'scroll' : ''}`;
      const api = React.useContext(ApiContext);

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

      return (
        <div
          ref={columnsHeaderRef}
          key="columns"
          className={wrapperCssClasses}
          aria-rowindex={1}
          role="row"
          style={{ minWidth: renderCtx?.totalSizes?.width }}
        >
          <LeftEmptyCell key="left-empty" width={renderCtx?.leftEmptyWidth} />
          <ColumnHeaderItemCollection columns={renderedCols} onResizeColumn={onResizeColumn} />
          <RightEmptyCell key="right-empty" width={renderCtx?.rightEmptyWidth} />
        </div>
      );
    },
  ),
);
ColumnsHeader.displayName = 'GridColumnsHeader';
