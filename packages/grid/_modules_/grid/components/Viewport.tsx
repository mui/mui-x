import * as React from 'react';
import { visibleColumnsSelector } from '../hooks/features/columns/columnsSelector';
import { GridState } from '../hooks/features/core/gridState';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { densityRowHeightSelector } from '../hooks/features/density/densitySelector';
import { visibleSortedRowsSelector } from '../hooks/features/filter/filterSelector';
import { keyboardCellSelector } from '../hooks/features/keyboard/keyboardSelector';
import { selectionStateSelector } from '../hooks/features/selection/selectionSelector';
import { renderStateSelector } from '../hooks/features/virtualization/renderingStateSelector';
import { useLogger } from '../hooks/utils/useLogger';
import { optionsSelector } from '../hooks/utils/useOptionsProp';
import { ApiContext } from './api-context';
import { RenderingZone } from './RenderingZone';
import { StickyContainer } from './StickyContainer';
import { RowElements } from './RowElements';
import { RenderContextProps } from '../models';

type ViewportType = React.ForwardRefExoticComponent<React.RefAttributes<HTMLDivElement>>;

export const containerSizesSelector = (state: GridState) => state.containerSizes;
export const viewportSizesSelector = (state: GridState) => state.viewportSizes;
export const scrollBarSizeSelector = (state: GridState) => state.scrollBar;

export const Viewport: ViewportType = React.forwardRef<HTMLDivElement, {}>(
  (props, renderingZoneRef) => {
    const logger = useLogger('Viewport');
    const apiRef = React.useContext(ApiContext);

    const options = useGridSelector(apiRef, optionsSelector);
    const containerSizes = useGridSelector(apiRef, containerSizesSelector);
    const viewportSizes = useGridSelector(apiRef, viewportSizesSelector);
    const scrollBarState = useGridSelector(apiRef, scrollBarSizeSelector);
    const visibleColumns = useGridSelector(apiRef, visibleColumnsSelector);
    const renderState = useGridSelector(apiRef, renderStateSelector);
    const hasScroll = React.useMemo(() => ({ y: scrollBarState!.hasScrollY, x: scrollBarState.hasScrollX }), [scrollBarState])
    const cellFocus = useGridSelector(apiRef, keyboardCellSelector);
    const selectionState = useGridSelector(apiRef, selectionStateSelector);
    const rows = useGridSelector(apiRef, visibleSortedRowsSelector);
    const rowHeight = useGridSelector(apiRef, densityRowHeightSelector);

    const getRowsElements = () => {
      if (renderState.renderContext == null) {
        return null;
      }
      const renderContext = renderState.renderContext as RenderContextProps

      const renderedRows = rows.slice(
        renderContext.firstRowIdx,
        renderContext.lastRowIdx,
      );
      return renderedRows.map((r, idx) => (
        <RowElements
          key={r.id}
          row={r}
          domIndex={idx}
          renderContext={renderContext}
          options={options}
          columns={visibleColumns}
          cellFocus={cellFocus}
          hasScroll={hasScroll}
          selected={!!selectionState[r.id]}
          rowHeight={rowHeight}
        />
      ));
    };

    logger.debug('Rendering ViewPort');
    return (
      <StickyContainer {...viewportSizes}>
        <RenderingZone
          ref={renderingZoneRef}
          {...(containerSizes?.renderingZone || { width: 0, height: 0 })}
        >
          {getRowsElements()}
        </RenderingZone>
      </StickyContainer>
    );
  },
);
Viewport.displayName = 'Viewport';
