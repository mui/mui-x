import * as React from 'react';
import { visibleColumnsSelector } from '../../hooks/features/columns/columnsSelector';
import { GridState } from '../../hooks/features/core/gridState';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { renderStateSelector } from '../../hooks/features/virtualization/renderingStateSelector';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { ApiContext } from '../api-context';
import { LeftEmptyCell, RightEmptyCell } from '../Cell';
import { ScrollArea } from '../ScrollArea';
import { containerSizesSelector } from '../Viewport';
import { ColumnHeadersItemCollection } from './ColumnHeadersItemCollection';
import { densityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';

export const scrollbarStateSelector = (state: GridState) => state.scrollBar;

export const ColumnsHeader = React.forwardRef<HTMLDivElement, {}>(function ColumnsHeader(
  props,
  ref,
) {
  const apiRef = React.useContext(ApiContext);
  const columns = useGridSelector(apiRef, visibleColumnsSelector);
  const { disableColumnReorder } = useGridSelector(apiRef, optionsSelector);
  const containerSizes = useGridSelector(apiRef, containerSizesSelector);
  const headerHeight = useGridSelector(apiRef, densityHeaderHeightSelector);
  const renderCtx = useGridSelector(apiRef, renderStateSelector).renderContext;
  const { hasScrollX } = useGridSelector(apiRef, scrollbarStateSelector);
  const wrapperCssClasses = `MuiDataGrid-colCellWrapper ${hasScrollX ? 'scroll' : ''}`;

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
      {/* Header row isn't interactive, cells are, event delegation */}
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
      <div
        ref={ref}

      >
        <ColumnHeadersItemCollection columns={renderedCols} />
      </div>
    </React.Fragment>
  );
});
