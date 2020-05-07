import { ColDef } from '../models/colDef';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Badge from '@material-ui/core/Badge';
import { ApiContext } from './api-context';
import { HEADER_CELL_CSS_CLASS } from '../constants/cssClassesConstants';
import { isArray, isOverflown } from '../utils';
import { Tooltip } from '@material-ui/core';
import SeparatorIcon from '@material-ui/icons/Remove';

interface ColumnHeaderItemProps {
  column: ColDef;
  headerHeight: number;
  icons: { [key: string]: React.ReactElement };
  colIndex: number;
  onResizeColumn: (c: any) => void;
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
//TODO cleanup this component and split in smaller one;
export const ColumnHeaderItem = React.memo(
  ({ column, icons, colIndex, headerHeight, onResizeColumn }: ColumnHeaderItemProps) => {
    //TODO move that in its own component
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

    const handleOnMouseDown = e => {
      onResizeColumn(column);
    };

    const width = column.width;
    return (
      <div
        className={cssClass}
        key={column.field}
        data-field={column.field}
        style={{ width: width, minWidth: width, maxWidth: width, maxHeight: headerHeight }}
      >
        {headerComponent || (
          <Tooltip title={column.description || tooltipText} innerRef={titleRef}>
            <ColumnHeaderTitle label={column.headerName || column.field} />
          </Tooltip>
        )}
        {sortIconElement}
        <div className={'column-separator'} >
          <SeparatorIcon
            fontSize={'default'}
            className={'icon separator ' + (column.resizable ? 'resizable' : '')}
            {...(column.resizable ? { onMouseDown: handleOnMouseDown } : {})}
          />
        </div>
      </div>
    );
  },
);
ColumnHeaderItem.displayName = 'ColumnHeaderItem';
