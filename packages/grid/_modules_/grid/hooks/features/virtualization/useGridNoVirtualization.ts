import * as React from 'react';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridNativeEventListener } from '../../utils/useGridNativeEventListener';
import { useGridScrollFn } from '../../utils/useGridScrollFn';
import { visibleGridColumnsSelector } from '../columns/gridColumnsSelector';
import { useGridSelector, useGridState } from '../../utils';
import { gridPaginationSelector } from '../pagination/gridPaginationSelector';
import { gridContainerSizesSelector } from '../container/gridContainerSizesSelector';

/**
 * @requires useGridPage (state)
 * @requires useGridPageSize (state)
 * @requires useGridColumns (state)
 * @requires useGridContainerProps (state)
 */
export const useGridNoVirtualization = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'disableVirtualization' | 'pagination' | 'paginationMode'>,
): void => {
  const windowRef = apiRef.current.windowRef;
  const columnsHeaderRef = apiRef.current.columnHeadersElementRef;
  const renderingZoneRef = apiRef.current.renderingZoneRef;
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const [scrollTo] = useGridScrollFn(apiRef, renderingZoneRef!, columnsHeaderRef!);
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);

  const syncState = React.useCallback(() => {
    if (!containerSizes || !windowRef?.current) {
      return;
    }

    let firstRowIdx = 0;
    const { page, pageSize } = paginationState;
    if (props.pagination && props.paginationMode === 'client') {
      firstRowIdx = pageSize * page;
    }
    const lastRowIdx = firstRowIdx + containerSizes.virtualRowsCount;
    const lastColIdx = visibleColumns.length > 0 ? visibleColumns.length - 1 : 0;
    const renderContext = { firstRowIdx, lastRowIdx, firstColIdx: 0, lastColIdx };

    const scrollParams = {
      top: windowRef.current!.scrollTop,
      left: windowRef.current!.scrollLeft,
    };

    setGridState((state) => ({
      ...state,
      rendering: {
        ...state.rendering,
        virtualPage: 0,
        renderContext,
        realScroll: scrollParams,
        renderingZoneScroll: scrollParams,
      },
    }));
    forceUpdate();
  }, [
    containerSizes,
    paginationState,
    props.pagination,
    props.paginationMode,
    setGridState,
    forceUpdate,
    visibleColumns.length,
    windowRef,
  ]);

  React.useEffect(() => {
    if (!props.disableVirtualization) {
      return;
    }
    syncState();
  }, [props.disableVirtualization, syncState]);

  const handleScroll = React.useCallback(() => {
    if (!props.disableVirtualization || !windowRef?.current) {
      return;
    }
    const { scrollLeft, scrollTop } = windowRef.current;
    scrollTo({ top: scrollTop, left: scrollLeft });
    syncState();
  }, [props.disableVirtualization, scrollTo, windowRef, syncState]);

  useGridNativeEventListener(apiRef, windowRef!, 'scroll', handleScroll, { passive: true });
};
