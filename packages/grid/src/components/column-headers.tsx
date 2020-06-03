import React, { forwardRef, memo, useContext, useEffect, useRef, useState } from 'react';
import { ColDef, Columns, RenderContextProps } from '../models';
import { ColumnHeaderItem } from './column-header-item';
import { ApiContext } from './api-context';
import { LeftEmptyCell, RightEmptyCell } from './cell';

export interface ColumnHeadersItemCollectionProps {
  columns: Columns;
  headerHeight: number;
  onResizeColumn?: (col: ColDef) => void;
}
export const ColumnHeaderItemCollection: React.FC<ColumnHeadersItemCollectionProps> = React.memo(
  ({ headerHeight, onResizeColumn, columns }) => {
    const items = columns.map((col, idx) => (
      <ColumnHeaderItem
        key={col.field}
        column={col}
        colIndex={idx}
        headerHeight={headerHeight}
        onResizeColumn={onResizeColumn}
      />
    ));

    return <>{items}</>;
  },
);
ColumnHeaderItemCollection.displayName = 'ColumnHeaderItemCollection';

export interface ColumnsHeaderProps {
  columns: Columns;
  hasScrollX: boolean;
  headerHeight: number;
  onResizeColumn?: (col: ColDef) => void;
  renderCtx: Partial<RenderContextProps> | null;
}

export const ColumnsHeader = memo(
  forwardRef<HTMLDivElement, ColumnsHeaderProps>(
    ({ columns, hasScrollX, headerHeight, onResizeColumn, renderCtx }, columnsHeaderRef) => {
      const wrapperCssClasses = 'material-col-cell-wrapper ' + (hasScrollX ? 'scroll' : '');
      const api = useContext(ApiContext);

      if (!api) {
        throw new Error('ApiRef not found in context');
      }
      const lastRenderedColIndexes = useRef({ first: renderCtx?.firstColIdx, last: renderCtx?.lastColIdx });
      const [renderedCols, setRenderedCols] = useState(columns);

      useEffect(() => {
        if (renderCtx && renderCtx.firstColIdx != null && renderCtx.lastColIdx != null) {
          setRenderedCols(columns.slice(renderCtx.firstColIdx, renderCtx.lastColIdx + 1));

          if (
            lastRenderedColIndexes.current.first !== renderCtx.firstColIdx ||
            lastRenderedColIndexes.current.last !== renderCtx.lastColIdx
          ) {
            lastRenderedColIndexes.current = { first: renderCtx.firstColIdx, last: renderCtx.lastColIdx };
          }
        }
      }, [renderCtx, columns]);

      return (
        <div
          ref={columnsHeaderRef}
          key={'columns'}
          className={wrapperCssClasses}
          aria-rowindex={1}
          style={{ minWidth: renderCtx?.totalSizes?.width }}
        >
          <LeftEmptyCell key={'left-empty'} width={renderCtx?.leftEmptyWidth} />
          <ColumnHeaderItemCollection
            columns={renderedCols}
            onResizeColumn={onResizeColumn}
            headerHeight={headerHeight}
          />
          <RightEmptyCell key={'right-empty'} width={renderCtx?.rightEmptyWidth} />
        </div>
      );
    },
  ),
);
ColumnsHeader.displayName = 'GridColumnsHeader';
