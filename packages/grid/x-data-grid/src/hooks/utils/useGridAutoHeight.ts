import * as React from 'react';
import { GridApiCommon } from '@mui/x-data-grid-pro';
import { gridClasses } from '../../constants/gridClasses';

export const useGridAutoHeight = (
  apiRef: React.MutableRefObject<GridApiCommon>,
  maxHeight: number,
) => {
  const [autoHeight, setAutoHeight] = React.useState(true);
  const autoHeightRef = React.useRef<boolean>(true);
  autoHeightRef.current = autoHeight;

  React.useEffect(() => {
    return apiRef.current.subscribeEvent('virtualScrollerContentSizeChange', (params) => {
      if (!apiRef.current) {
        return;
      }
      const rootEl = apiRef.current.rootElementRef?.current;
      const virtualScrollerEl = rootEl?.querySelector<HTMLElement>(
        `.${gridClasses.virtualScroller}`,
      );
      if (!rootEl || !virtualScrollerEl) {
        return;
      }
      const topPinnedRowsHeight =
        virtualScrollerEl.querySelector<HTMLElement>(`:scope > .${gridClasses['pinnedRows--top']}`)
          ?.offsetHeight || 0;
      const bottomPinnedRowsHeight =
        virtualScrollerEl.querySelector<HTMLElement>(
          `:scope > .${gridClasses['pinnedRows--bottom']}`,
        )?.offsetHeight || 0;

      const headerAndFooterHeight = rootEl.offsetHeight - virtualScrollerEl.offsetHeight;
      const maxVirtualScrollerContentHeight =
        maxHeight - headerAndFooterHeight - topPinnedRowsHeight - bottomPinnedRowsHeight;
      if (params.height >= maxVirtualScrollerContentHeight) {
        setAutoHeight(false);
      } else {
        setAutoHeight(true);
      }
    });
  }, [apiRef, autoHeight, maxHeight]);

  return autoHeight;
};
