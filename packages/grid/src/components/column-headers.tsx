import React, { useContext, useRef } from 'react';
import { Columns } from '../models';
import { ColumnHeaderItem } from './column-header-item';
import { ApiContext } from './api-context';
import { useColumnResize } from '../hooks/features/useColumnResize';

export interface ColumnsHeaderProps {
  columns: Columns;
  hasScrollX: boolean;
  headerHeight: number;
  icons: { [key: string]: React.ReactElement };
}

export const ColumnsHeader = React.forwardRef<HTMLDivElement, ColumnsHeaderProps>(
  ({ columns, hasScrollX, icons, headerHeight }, colRef) => {
    const wrapperCssClasses = 'material-col-cell-wrapper ' + (hasScrollX ? 'scroll' : '');
    const api = useContext(ApiContext);
    const columnsRef = useRef<HTMLDivElement>(null);

    //TODO move this call in grid use ref...
    const onResizeColumn = useColumnResize(columnsRef, api, headerHeight);

    return (
      <div ref={columnsRef} key={'columns'} className={wrapperCssClasses}>
        {columns.map((c, idx) => (
          <ColumnHeaderItem
            key={c.field}
            column={c}
            icons={icons}
            colIndex={idx}
            headerHeight={headerHeight}
            onResizeColumn={onResizeColumn}
          />
        ))}
      </div>
    );
  },
);
ColumnsHeader.displayName = 'GridColumnsHeader';
