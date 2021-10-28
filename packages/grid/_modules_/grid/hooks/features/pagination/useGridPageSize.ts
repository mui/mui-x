import * as React from 'react';
import { GridApiRef } from '../../../models';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridPageSizeApi } from '../../../models/api/gridPageSizeApi';
import { GridEvents } from '../../../constants/eventsConstants';
import {
  useGridLogger,
  useGridApiMethod,
  useGridState,
  useGridApiEventHandler,
  useGridSelector,
} from '../../utils';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { gridPageSizeSelector } from './gridPaginationSelector';
import { gridDensityRowHeightSelector } from '../density';

/**
 * @requires useGridControlState (method)
 * @requires useGridDimensions (method)
 * @requires useGridFilter (state)
 */
export const useGridPageSize = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'pageSize' | 'onPageSizeChange' | 'autoPageSize'>,
) => {
  const logger = useGridLogger(apiRef, 'useGridPageSize');
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);

  useGridStateInit(apiRef, (state) => ({
    ...state,
    pagination: { pageSize: props.pageSize ?? 100 },
  }));
  const [, setGridState, forceUpdate] = useGridState(apiRef);

  apiRef.current.unsafe_updateControlState({
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

  const handleUpdateAutoPageSize = React.useCallback(() => {
    if (!props.autoPageSize) {
      return;
    }

    const height = apiRef.current.getDimensions().window.height;
    const pageSize = Math.floor(height / rowHeight);
    apiRef.current.setPageSize(pageSize);
  }, [apiRef, rowHeight, props.autoPageSize]);

  useGridApiEventHandler(apiRef, GridEvents.debouncedResize, handleUpdateAutoPageSize);

  React.useEffect(() => {
    handleUpdateAutoPageSize();
  }, [handleUpdateAutoPageSize]);
};
