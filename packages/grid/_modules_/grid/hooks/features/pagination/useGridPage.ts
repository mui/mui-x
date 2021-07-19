import * as React from 'react';
import { GridApiRef } from '../../../models';
import { useGridSelector, useGridState } from '../core';
import { useLogger } from '../../utils';
import { GRID_PAGE_CHANGE, GRID_PAGE_SIZE_CHANGE } from '../../../constants';
import { GridComponentProps } from '../../../GridComponentProps';
import { useGridApiEventHandler, useGridApiMethod } from '../../root';
import { GridPageApi } from '../../../models/api/gridPageApi';
import { GridPageSizeState } from './gridPaginationState';
import { visibleGridRowCountSelector } from '../filter';

const getPageCount = (rowCount: number, pageSize: GridPageSizeState): number => {
  if (pageSize > 0 && rowCount > 0) {
    return Math.ceil(rowCount / pageSize);
  }

  return 0;
};

export const useGridPage = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'page' | 'onPageChange' | 'rowCount'>,
) => {
  const logger = useLogger('useGridPage');
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const visibleRowCount = useGridSelector(apiRef, visibleGridRowCountSelector);

  const setPage = React.useCallback(
    (page: number) => {
      logger.debug(`Setting page to ${page}`);

      setGridState((oldState) => ({
        ...oldState,
        page: {
          ...oldState.page,
          currentPage: Math.min(page, oldState.page.pageCount - 1),
        },
      }));
      forceUpdate();
    },
    [setGridState, forceUpdate, logger],
  );

  React.useEffect(() => {
    apiRef.current.updateControlState({
      stateId: 'page',
      propModel: props.page,
      propOnChange: props.onPageChange,
      stateSelector: (state) => state.page.currentPage,
      onChangeCallback: (model) => {
        apiRef.current.publishEvent(GRID_PAGE_CHANGE, model);
      },
    });
  }, [apiRef, props.page, props.onPageChange]);

  React.useEffect(() => {
    setGridState((oldState) => {
      const rowCount = props.rowCount !== undefined ? props.rowCount : visibleRowCount;
      const pageCount = getPageCount(rowCount, oldState.pageSize);

      let currentPage: number;

      if (props.page != null) {
        if (pageCount) {
          currentPage = Math.min(props.page, pageCount - 1);
        } else {
          currentPage = props.page;
        }
      } else {
        currentPage = oldState.page.currentPage;
      }

      return {
        ...oldState,
        page: {
          ...oldState.page,
          currentPage,
          rowCount,
          pageCount,
        },
      };
    });
    forceUpdate();
  }, [setGridState, forceUpdate, visibleRowCount, props.rowCount, props.page, apiRef]);

  const handlePageSizeChange = React.useCallback(
    (pageSize: GridPageSizeState) => {
      setGridState((oldState) => {
        const pageCount = getPageCount(oldState.page.rowCount, pageSize);

        return {
          ...oldState,
          page: {
            ...oldState.page,
            pageCount,
            currentPage: Math.min(oldState.page.currentPage, pageCount - 1),
          },
        };
      });

      forceUpdate();
    },
    [setGridState, forceUpdate],
  );

  useGridApiEventHandler(apiRef, GRID_PAGE_SIZE_CHANGE, handlePageSizeChange);

  const pageApi: GridPageApi = {
    setPage,
  };

  useGridApiMethod(apiRef, pageApi, 'GridPageApi');
};
