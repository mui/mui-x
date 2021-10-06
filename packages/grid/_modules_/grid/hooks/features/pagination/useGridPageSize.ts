import * as React from 'react';
import { GridApiRef } from '../../../models';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridPageSizeApi } from '../../../models/api/gridPageSizeApi';
import { GridEvents } from '../../../constants/eventsConstants';
import { useGridLogger, useGridApiMethod, useGridSelector, useGridState } from '../../utils';
import { visibleGridRowCountSelector } from '../filter';
import { gridContainerSizesSelector } from '../container/gridContainerSizesSelector';

/**
 * @requires useGridControlState (method)
 * @requires useGridContainerProps (state)
 * @requires useGridFilter (state)
 */
export const useGridPageSize = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'pageSize' | 'onPageSizeChange' | 'autoPageSize'>,
) => {
  const logger = useGridLogger(apiRef, 'useGridPageSize');
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const visibleRowCount = useGridSelector(apiRef, visibleGridRowCountSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);

  const setPageSize = React.useCallback(
    (pageSize: number) => {
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
    [setGridState, forceUpdate, logger],
  );

  React.useEffect(() => {
    apiRef.current.updateControlState({
      stateId: 'pageSize',
      propModel: props.pageSize,
      propOnChange: props.onPageSizeChange,
      stateSelector: (state) => state.pagination.pageSize,
      changeEvent: GridEvents.pageSizeChange,
    });
  }, [apiRef, props.pageSize, props.onPageSizeChange]);

  React.useEffect(() => {
    const autoPageSize = containerSizes?.viewportPageSize;
    const prevPageSize = apiRef.current.state.pagination.pageSize;

    let pageSize = prevPageSize;

    if (props.pageSize != null) {
      pageSize = props.pageSize;
    } else if (props.autoPageSize) {
      pageSize = autoPageSize ?? 0;
    }

    if (pageSize !== prevPageSize) {
      if (props.autoPageSize) {
        apiRef.current.publishEvent(GridEvents.pageSizeChange, autoPageSize);
      }

      setGridState((state) => ({
        ...state,
        pagination: {
          ...state.pagination,
          pageSize,
        },
      }));
      forceUpdate();
    }
  }, [
    apiRef,
    setGridState,
    forceUpdate,
    visibleRowCount,
    props.autoPageSize,
    props.pageSize,
    containerSizes?.viewportPageSize,
  ]);

  const pageSizeApi: GridPageSizeApi = {
    setPageSize,
  };

  useGridApiMethod(apiRef, pageSizeApi, 'GridPageSizeApi');
};
