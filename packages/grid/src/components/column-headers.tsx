import React, { forwardRef, memo, useContext, useEffect, useRef, useState } from 'react';
import { ColDef, Columns, RenderContextProps } from '../models';
import { ColumnHeaderItem } from './column-header-item';
import { ApiContext } from './api-context';
import { LeftEmptyCell, RightEmptyCell } from './cell';

export interface ColumnHeadersItemCollectionProps {
  columns: Columns;
  icons: { [key: string]: React.ReactElement }; //TODO move to context
  headerHeight: number;
  onResizeColumn: (col: ColDef) => void;
}
export const ColumnHeaderItemCollection: React.FC<ColumnHeadersItemCollectionProps> = React.memo(
  ({ icons, headerHeight, onResizeColumn, columns }) => {
    const items = columns.map((col, idx) => (
      <ColumnHeaderItem
        key={col.field}
        column={col}
        icons={icons}
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
  icons: { [key: string]: React.ReactElement };
  onResizeColumn: (col: ColDef) => void;
  renderCtx: Partial<RenderContextProps> | null;
}

export const ColumnsHeader = memo(
  forwardRef<HTMLDivElement, ColumnsHeaderProps>(
    ({ columns, hasScrollX, icons, headerHeight, onResizeColumn, renderCtx }, columnsHeaderRef) => {
      const wrapperCssClasses = 'material-col-cell-wrapper ' + (hasScrollX ? 'scroll' : '');
      const api = useContext(ApiContext);

      if (!api) {
        throw new Error('ApiRef not found in context');
      }
      const lastRenderedColIndexes = useRef({ first: renderCtx?.firstColIdx, last: renderCtx?.lastColIdx });
      const [renderedCols, setRenderedCols] = useState(columns);

      useEffect(() => {
        if (
          renderCtx &&
          renderCtx.firstColIdx != null &&
          renderCtx.lastColIdx != null &&
          (lastRenderedColIndexes.current.first !== renderCtx.firstColIdx ||
            lastRenderedColIndexes.current.last !== renderCtx.lastColIdx)
        ) {
          setRenderedCols(columns.slice(renderCtx.firstColIdx, renderCtx.lastColIdx + 1));
          lastRenderedColIndexes.current = { first: renderCtx.firstColIdx, last: renderCtx.lastColIdx };
        }
      }, [renderCtx]);

      useEffect(() => {
        if (renderCtx && renderCtx.firstColIdx != null && renderCtx.lastColIdx != null) {
          setRenderedCols(columns.slice(renderCtx.firstColIdx, renderCtx.lastColIdx + 1));
        }
      }, [columns]);

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
            icons={icons}
          />
          <RightEmptyCell key={'right-empty'} width={renderCtx?.rightEmptyWidth} />
        </div>
      );
    },
  ),
);
ColumnsHeader.displayName = 'GridColumnsHeader';
