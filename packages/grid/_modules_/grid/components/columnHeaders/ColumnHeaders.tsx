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

    if (!apiRef) {
      throw new Error('Material-UI: ApiRef was not found in context.');
    }
    const lastRenderedColIndexes = React.useRef({
      first: renderCtx?.firstColIdx,
      last: renderCtx?.lastColIdx,
    });
    const [renderedCols, setRenderedCols] = React.useState(columns);

    React.useEffect(() => {
      if (renderCtx && renderCtx.firstColIdx != null && renderCtx.lastColIdx != null &&
        (lastRenderedColIndexes.current.first !== renderCtx.firstColIdx ||
          lastRenderedColIndexes.current.last !== renderCtx.lastColIdx)
      ) {
        setRenderedCols(columns.slice(renderCtx.firstColIdx, renderCtx.lastColIdx + 1));
        lastRenderedColIndexes.current = {
          first: renderCtx.firstColIdx,
          last: renderCtx.lastColIdx,
        };
      }
    }, [renderCtx, columns]);

    const handleDragOver = !disableColumnReorder
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
          <LeftEmptyCell width={renderCtx?.leftEmptyWidth} />
          <ColumnHeaderItemCollection columns={renderedCols} separatorProps={separatorProps} />
          <RightEmptyCell width={renderCtx?.rightEmptyWidth} />
        </div>
        <ScrollArea scrollDirection="right" />
      </React.Fragment>
    );
  },
);
