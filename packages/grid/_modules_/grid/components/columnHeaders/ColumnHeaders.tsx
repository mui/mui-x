import * as React from 'react';
import { visibleColumnsSelector } from '../../hooks/features/columns/columnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { RenderContextProps } from '../../models/renderContextProps';
import { ApiContext } from '../api-context';
import { LeftEmptyCell, RightEmptyCell } from '../cell';
import { OptionsContext } from '../options-context';
import { ScrollArea } from '../ScrollArea';
import { containerSizesSelector } from '../viewport';
import { ColumnHeaderItemCollection } from './ColumnHeadersItemCollection';
import { densityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';

export interface ColumnsHeaderProps {
  hasScrollX: boolean;
  separatorProps: React.HTMLAttributes<HTMLDivElement>;
  renderCtx: Partial<RenderContextProps> | null;
}

export const ColumnsHeader = React.forwardRef<HTMLDivElement, ColumnsHeaderProps>(
  function ColumnsHeader(props, ref) {
    const { hasScrollX, renderCtx, separatorProps } = props;
    const apiRef = React.useContext(ApiContext);
    const columns = useGridSelector(apiRef, visibleColumnsSelector);
    const wrapperCssClasses = `MuiDataGrid-colCellWrapper ${hasScrollX ? 'scroll' : ''}`;
    const { disableColumnReorder } = React.useContext(OptionsContext);
    const containerSizes = useGridSelector(apiRef, containerSizesSelector);
    const headerHeight = useGridSelector(apiRef, densityHeaderHeightSelector);

    const renderedCols = React.useMemo(() => {
      if (renderCtx == null) {
        return [];
      }
      return columns.slice(renderCtx.firstColIdx, renderCtx.lastColIdx! + 1);
    }, [columns, renderCtx]);

    const handleDragOver =
      !disableColumnReorder && apiRef
        ? (event) => apiRef.current.onColHeaderDragOver(event, ref as React.RefObject<HTMLElement>)
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
          style={{ minWidth: containerSizes?.totalSizes?.width }}
          onDragOver={handleDragOver}
        >
          <LeftEmptyCell width={renderCtx?.leftEmptyWidth} height={headerHeight} />
          <ColumnHeaderItemCollection columns={renderedCols} separatorProps={separatorProps} />
          <RightEmptyCell width={renderCtx?.rightEmptyWidth} height={headerHeight} />
        </div>
        <ScrollArea scrollDirection="right" />
      </React.Fragment>
    );
  },
);
