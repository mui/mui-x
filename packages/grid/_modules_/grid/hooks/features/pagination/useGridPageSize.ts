import * as React from 'react';
import { ElementSize, GridApiRef } from '../../../models';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridPageSizeApi } from '../../../models/api/gridPageSizeApi';
import { GridEvents } from '../../../constants/eventsConstants';
import { useGridLogger, useGridApiMethod, useGridState, useGridApiEventHandler } from '../../utils';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { gridPageSizeSelector } from './gridPaginationSelector';
import { gridDensityRowHeightSelector } from '../density';

/**
 * @requires useGridControlState (method)
 * @requires useGridDimensions (event) - can be after
 * @requires useGridFilter (state)
 */
export const useGridPageSize = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'pageSize' | 'onPageSizeChange' | 'autoPageSize'>,
) => {
  const logger = useGridLogger(apiRef, 'useGridPageSize');

  useGridStateInit(apiRef, (state) => ({
    ...state,
    pagination: { pageSize: props.pageSize ?? (props.autoPageSize ? 0 : 100) },
  }));
  const [, setGridState, forceUpdate] = useGridState(apiRef);

  apiRef.current.unstable_updateControlState({
    stateId: 'pageSize',
    propModel: props.pageSize,
    propOnChange: props.onPageSizeChange,
    stateSelector: gridPageSizeSelector,
    changeEvent: GridEvents.pageSizeChange,
  });

  const setPageSize = React.useCallback(
    (pageSize: number) => {
      if (pageSize === gridPageSizeSelector(apiRef.current.state)) {
        return;
      }

      logger.debug(`Setting page size to ${pageSize}`);

      setGridState((state) => ({
        ...state,
        pagination: {
          ...state.pagination,
          pageSize,
        },
      }));
      forceUpdate();
    },
    [apiRef, setGridState, forceUpdate, logger],
  );

  React.useEffect(() => {
    if (props.pageSize != null && !props.autoPageSize) {
      apiRef.current.setPageSize(props.pageSize);
    }
  }, [apiRef, props.autoPageSize, props.pageSize]);

  const pageSizeApi: GridPageSizeApi = {
    setPageSize,
  };

  useGridApiMethod(apiRef, pageSizeApi, 'GridPageSizeApi');

  const prevInnerHeight = React.useRef<number | null>(null);
  const handleUpdateAutoPageSize = React.useCallback(
    (viewportInnerSize: ElementSize) => {
      if (!props.autoPageSize || prevInnerHeight.current === viewportInnerSize.height) {
        return;
      }

      prevInnerHeight.current = viewportInnerSize.height;
      const rowHeight = gridDensityRowHeightSelector(apiRef.current.state);
      const maximumPageSizeWithoutScrollBar = Math.floor(viewportInnerSize.height / rowHeight);
      apiRef.current.setPageSize(maximumPageSizeWithoutScrollBar);
    },
    [apiRef, props.autoPageSize],
  );

  useGridApiEventHandler(apiRef, GridEvents.viewportInnerSizeChange, handleUpdateAutoPageSize);
};
