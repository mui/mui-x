import * as React from 'react';
import { GRID_PAGE_CHANGE, GRID_PAGE_SIZE_CHANGE } from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridPaginationApi } from '../../../models/api/gridPaginationApi';
import { useGridApiOptionHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { useGridState } from '../core/useGridState';
import { gridContainerSizesSelector } from '../../root/gridContainerSizesSelector';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { visibleGridRowCountSelector } from '../filter/gridFilterSelector';
import { GridPaginationState } from './gridPaginationState';
import {GridComponentProps} from "../../../GridComponentProps";

function applyConstraints(state: GridPaginationState, pageProp?: number): GridPaginationState {
  const pageCount =
    state.pageSize && state.rowCount > 0 ? Math.ceil(state.rowCount / state.pageSize!) : 1;

  return {
    ...state,
    pageCount,
    page: Math.min(pageCount - 1, pageProp !== undefined ? pageProp : state.page),
  };
}

export const useGridPagination = (apiRef: GridApiRef, props: Pick<GridComponentProps, 'page' | 'pageSize' | 'onPageChange' | 'onPageSizeChange'>): void => {
  const logger = useLogger('useGridPagination');

  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);
  const visibleRowCount = useGridSelector(apiRef, visibleGridRowCountSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);

  const setPage = React.useCallback(
    (page: number) => {
      logger.debug(`Setting page to ${page}`);

      setGridState((state) => ({
        ...state,
        pagination: applyConstraints(
          {
            ...state.pagination,
            page,
          },
          options.page,
        ),
      }));
      forceUpdate();
    },
    [apiRef, setGridState, forceUpdate, logger, options.page],
  );

  const setPageSize = React.useCallback(
    (pageSize: number) => {
      logger.debug(`Setting page size to ${pageSize}`);

      setGridState((state) => ({
        ...state,
        pagination: applyConstraints(
          {
            ...state.pagination,
            pageSize,
          },
          options.page,
        ),
      }));
      forceUpdate();
    },
    [apiRef, setGridState, forceUpdate, logger, options.page],
  );

  useGridApiOptionHandler(apiRef, GRID_PAGE_CHANGE, options.onPageChange);
  useGridApiOptionHandler(apiRef, GRID_PAGE_SIZE_CHANGE, options.onPageSizeChange);

  // React.useEffect(() => {
  //   setGridState((state) => ({
  //     ...state,
  //     pagination: applyConstraints(
  //       {
  //         ...state.pagination,
  //         paginationMode:
  //           options.paginationMode != null
  //             ? options.paginationMode
  //             : state.pagination.paginationMode,
  //         rowCount: options.rowCount !== undefined ? options.rowCount : visibleRowCount,
  //         pageSize:
  //           (options.autoPageSize ? containerSizes?.viewportPageSize : options.pageSize) ||
  //           state.pagination.pageSize,
  //       },
  //       options.page,
  //     ),
  //   }));
  //   forceUpdate();
  // }, [
  //   setGridState,
  //   forceUpdate,
  //   options.paginationMode,
  //   visibleRowCount,
  //   options.rowCount,
  //   options.autoPageSize,
  //   containerSizes?.viewportPageSize,
  //   options.pageSize,
  //   options.page,
  // ]);

    React.useEffect(() => {
        apiRef.current.updateControlState<number>({
            stateId: 'page',
            propModel: props.page,
            propOnChange: props.onPageChange,
            stateSelector: (state) => state.pagination.page,
            onChangeCallback: (model) => {
                apiRef.current.publishEvent(GRID_PAGE_CHANGE, model);
            },
        });
    }, [apiRef, props.page, props.onPageChange]);

    React.useEffect(() => {
        apiRef.current.updateControlState<number>({
            stateId: 'pageSize',
            propModel: props.pageSize,
            propOnChange: props.onPageSizeChange,
            stateSelector: (state) => state.pagination.pageSize,
            onChangeCallback: (model) => {
                apiRef.current.publishEvent(GRID_PAGE_SIZE_CHANGE, model);
            },
        });
    }, [apiRef, props.pageSize, props.onPageSizeChange]);

  const paginationApi: GridPaginationApi = {
    setPageSize,
    setPage,
  };

  useGridApiMethod(apiRef, paginationApi, 'GridPaginationApi');
};
