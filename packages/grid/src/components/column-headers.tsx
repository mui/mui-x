import React, { useContext } from 'react';
import { ColDef, Columns } from '../models';
import { ColumnHeaderItem } from './column-header-item';
import { ApiContext } from './api-context';

export interface ColumnsHeaderProps {
  columns: Columns;
  hasScrollX: boolean;
  headerHeight: number;
  icons: { [key: string]: React.ReactElement };
  onResizeColumn: (col: ColDef) => void;
}
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

export const ColumnsHeader = React.forwardRef<HTMLDivElement, ColumnsHeaderProps>(
  ({ columns, hasScrollX, icons, headerHeight, onResizeColumn }, columnsHeaderRef) => {
    const wrapperCssClasses = 'material-col-cell-wrapper ' + (hasScrollX ? 'scroll' : '');
    const api = useContext(ApiContext);

    if (!api) {
      throw new Error('ApiRef not found in context');
    }

    return (
      <div ref={columnsHeaderRef} key={'columns'} className={wrapperCssClasses} aria-rowindex={1}>
        <ColumnHeaderItemCollection
          columns={columns}
          onResizeColumn={onResizeColumn}
          headerHeight={headerHeight}
          icons={icons}
        />
      </div>
    );
  },
);
ColumnsHeader.displayName = 'GridColumnsHeader';
