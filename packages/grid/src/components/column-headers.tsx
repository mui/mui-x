import React, { useContext, useEffect, useRef, useState } from 'react';
import { ColDef, Columns } from '../models';
import { HEADER_CELL_CSS_CLASS } from '../constants/cssClassesConstants';
import { Tooltip } from '@material-ui/core';
import { isArray, isOverflown } from '../utils';
import { ApiContext } from './api-context';
import Badge from '@material-ui/core/Badge';

export interface ColumnsHeaderProps {
  columns: Columns;
  hasScrollX: boolean;
  headerHeight: number;
  icons: { [key: string]: React.ReactElement };
}

interface ColumnHeaderItemProps {
  column: ColDef;
  headerHeight: number;
  icons: { [key: string]: React.ReactElement };
  colIndex: number;
}

export const ColumnHeaderTitle = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  const { label, className, ...rest } = props;
  return (
    <div ref={ref} className={'title ' + className} {...rest}>
      {label}
    </div>
  );
});
ColumnHeaderTitle.displayName = 'ColumnHeaderTitle';

//Can't use React.memo here until we refactor useColumns
export const ColumnHeaderItem = ({ column, icons, colIndex, headerHeight }: ColumnHeaderItemProps) => {
  const sortIconElement =
    !column.hideSortIcons && column.sortDirection ? (
      <span className={'sort-icon'}>
        {column.sortIndex != null && (
          <Badge badgeContent={column.sortIndex} color="default">
            {icons[column.sortDirection]}
          </Badge>
        )}
        {column.sortIndex == null && icons[column.sortDirection]}
      </span>
    ) : null;
  const titleRef = useRef<HTMLDivElement>(null);
  const [tooltipText, setTooltip] = useState('');
  const api = useContext(ApiContext);

  let cssClass = HEADER_CELL_CSS_CLASS;
  if (column.headerClass != null) {
    cssClass += isArray(column.headerClass) ? column.headerClass.join(' ') : ' ' + column.headerClass;
  }
  cssClass += !column.headerAlign || column.headerAlign === 'left' ? '' : ` ${column.headerAlign}`;
  cssClass += column.sortable ? ' sortable' : '';

  let headerComponent: React.ReactElement | null = null;
  if (column.headerComponent) {
    headerComponent = column.headerComponent({ api: api!.current!, colDef: column, colIndex });
  }

  useEffect(() => {
    if (!column.description && titleRef && titleRef.current) {
      const isOver = isOverflown(titleRef.current);
      if (isOver) {
        setTooltip(column.headerName || column.field);
      }
    }
  }, [titleRef]);

  return (
    <div
      className={cssClass}
      key={column.field}
      data-field={column.field}
      style={{ width: column.width, minWidth: column.width, maxWidth: column.width, maxHeight: headerHeight }}
    >
      {headerComponent || (
        <Tooltip title={column.description || tooltipText} innerRef={titleRef}>
          <ColumnHeaderTitle label={column.headerName || column.field} />
        </Tooltip>
      )}
      {sortIconElement}
    </div>
  );
};
ColumnHeaderItem.displayName = 'ColumnHeaderItem';

export const ColumnsHeader = React.forwardRef<HTMLDivElement, ColumnsHeaderProps>(
  ({ columns, hasScrollX, icons, headerHeight }, colRef) => {
    const wrapperCssClasses = 'material-col-cell-wrapper ' + (hasScrollX ? 'scroll' : '');
    return (
      <div className={wrapperCssClasses} key={'columns'}>
        {columns.map((c, idx) => (
          <ColumnHeaderItem key={c.field} column={c} icons={icons} colIndex={idx} headerHeight={headerHeight} />
        ))}
      </div>
    );
  },
);
ColumnsHeader.displayName = 'GridColumnsHeader';
