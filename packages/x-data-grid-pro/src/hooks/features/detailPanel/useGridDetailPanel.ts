import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import {
  GridEventListener,
  GridRowId,
  useGridSelector,
  useGridApiEventHandler,
  useGridApiMethod,
  GridCellParams,
  gridDataRowIdsSelector,
} from '@mui/x-data-grid';
import {
  useGridRegisterPipeProcessor,
  GridPipeProcessor,
  GridStateInitializer,
} from '@mui/x-data-grid/internals';
import { GridApiPro, GridPrivateApiPro } from '../../../models/gridApiPro';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD } from './gridDetailPanelToggleColDef';
import {
  gridDetailPanelExpandedRowIdsSelector,
  gridDetailPanelExpandedRowsContentCacheSelector,
  gridDetailPanelRawHeightCacheSelector,
} from './gridDetailPanelSelector';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import {
  GridDetailPanelApi,
  GridDetailPanelPrivateApi,
  GridDetailPanelState,
} from './gridDetailPanelInterface';

const emptySet = new Set();

export const detailPanelStateInitializer: GridStateInitializer<
  Pick<DataGridProProcessedProps, 'initialState' | 'detailPanelExpandedRowIds'>
> = (state, props) => {
  return {
    ...state,
    detailPanel: {
      heightCache: {},
      expandedRowIds:
        props.detailPanelExpandedRowIds ??
        props.initialState?.detailPanel?.expandedRowIds ??
        emptySet,
    },
  };
};

function cacheContentAndHeight(
  apiRef: RefObject<GridApiPro>,
  getDetailPanelContent: DataGridProProcessedProps['getDetailPanelContent'],
  getDetailPanelHeight: DataGridProProcessedProps['getDetailPanelHeight'],
  previousHeightCache: GridDetailPanelState['heightCache'],
) {
  if (typeof getDetailPanelContent !== 'function') {
    return {};
  }

  // TODO change to lazy approach using a Proxy
  // only call getDetailPanelContent when asked for an id
  const rowIds = gridDataRowIdsSelector(apiRef);

  const contentCache: Record<GridRowId, ReturnType<typeof getDetailPanelContent>> = {};
  const heightCache: GridDetailPanelState['heightCache'] = {};

  for (let i = 0; i < rowIds.length; i += 1) {
    const id = rowIds[i];
    const params = apiRef.current.getRowParams(id);
    const content = getDetailPanelContent(params);
    contentCache[id] = content;

    if (content == null) {
      continue;
    }
    const height = getDetailPanelHeight(params);
    const autoHeight = height === 'auto';
    heightCache[id] = { autoHeight, height: autoHeight ? previousHeightCache[id]?.height : height };
  }

  return { contentCache, heightCache };
}

export const useGridDetailPanel = (
  apiRef: RefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    | 'getDetailPanelContent'
    | 'getDetailPanelHeight'
    | 'detailPanelExpandedRowIds'
    | 'onDetailPanelExpandedRowIdsChange'
  >,
): void => {
  const expandedRowIds = useGridSelector(apiRef, gridDetailPanelExpandedRowIdsSelector);
  const contentCache = useGridSelector(apiRef, gridDetailPanelExpandedRowsContentCacheSelector);

  const handleCellClick = React.useCallback<GridEventListener<'cellClick'>>(
    (params: GridCellParams, event: React.MouseEvent) => {
      if (params.field !== GRID_DETAIL_PANEL_TOGGLE_FIELD || props.getDetailPanelContent == null) {
        return;
      }

      const content = contentCache[params.id];
      if (!React.isValidElement(content)) {
        return;
      }

      // Ignore if the user didn't click specifically in the "i" button
      if (event.target === event.currentTarget) {
        return;
      }

      apiRef.current.toggleDetailPanel(params.id);
    },
    [apiRef, contentCache, props.getDetailPanelContent],
  );

  const handleCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      if (props.getDetailPanelContent == null) {
        return;
      }

      if (params.field === GRID_DETAIL_PANEL_TOGGLE_FIELD && event.key === ' ') {
        apiRef.current.toggleDetailPanel(params.id);
      }
    },
    [apiRef, props.getDetailPanelContent],
  );

  useGridApiEventHandler(apiRef, 'cellClick', handleCellClick);
  useGridApiEventHandler(apiRef, 'cellKeyDown', handleCellKeyDown);

  apiRef.current.registerControlState({
    stateId: 'detailPanels',
    propModel: props.detailPanelExpandedRowIds,
    propOnChange: props.onDetailPanelExpandedRowIdsChange,
    stateSelector: gridDetailPanelExpandedRowIdsSelector,
    changeEvent: 'detailPanelsExpandedRowIdsChange',
  });

  const toggleDetailPanel = React.useCallback<GridDetailPanelApi['toggleDetailPanel']>(
    (id: GridRowId) => {
      if (props.getDetailPanelContent == null) {
        return;
      }

      const content = contentCache[id];
      if (!React.isValidElement(content)) {
        return;
      }

      const ids = apiRef.current.getExpandedDetailPanels();
      const newIds = new Set(ids);
      if (ids.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      apiRef.current.setExpandedDetailPanels(newIds);
    },
    [apiRef, contentCache, props.getDetailPanelContent],
  );

  const getExpandedDetailPanels = React.useCallback<GridDetailPanelApi['getExpandedDetailPanels']>(
    () => gridDetailPanelExpandedRowIdsSelector(apiRef),
    [apiRef],
  );

  const setExpandedDetailPanels = React.useCallback<GridDetailPanelApi['setExpandedDetailPanels']>(
    (ids) => {
      apiRef.current.setState((state) => {
        return {
          ...state,
          detailPanel: {
            ...state.detailPanel,
            expandedRowIds: ids,
          },
        };
      });
    },
    [apiRef],
  );

  const storeDetailPanelHeight = React.useCallback<
    GridDetailPanelPrivateApi['storeDetailPanelHeight']
  >(
    (id, height) => {
      const heightCache = gridDetailPanelRawHeightCacheSelector(apiRef);

      if (!heightCache[id] || heightCache[id].height === height) {
        return;
      }

      apiRef.current.setState((state) => {
        return {
          ...state,
          detailPanel: {
            ...state.detailPanel,
            heightCache: { ...heightCache, [id]: { ...heightCache[id], height } },
          },
        };
      });

      apiRef.current.requestPipeProcessorsApplication('rowHeight');
    },
    [apiRef],
  );

  const detailPanelPubicApi: GridDetailPanelApi = {
    toggleDetailPanel,
    getExpandedDetailPanels,
    setExpandedDetailPanels,
  };

  const detailPanelPrivateApi: GridDetailPanelPrivateApi = {
    storeDetailPanelHeight,
  };

  useGridApiMethod(apiRef, detailPanelPubicApi, 'public');
  useGridApiMethod(apiRef, detailPanelPrivateApi, 'private');

  React.useEffect(() => {
    if (props.detailPanelExpandedRowIds) {
      const currentModel = gridDetailPanelExpandedRowIdsSelector(apiRef);
      if (currentModel !== props.detailPanelExpandedRowIds) {
        apiRef.current.setExpandedDetailPanels(props.detailPanelExpandedRowIds);
      }
    }
  }, [apiRef, props.detailPanelExpandedRowIds]);

  const updateCaches = React.useCallback(() => {
    if (!props.getDetailPanelContent) {
      return;
    }
    apiRef.current.setState((state) => {
      return {
        ...state,
        detailPanel: {
          ...state.detailPanel,
          ...cacheContentAndHeight(
            apiRef,
            props.getDetailPanelContent,
            props.getDetailPanelHeight,
            state.detailPanel.heightCache,
          ),
        },
      };
    });
  }, [apiRef, props.getDetailPanelContent, props.getDetailPanelHeight]);

  useGridApiEventHandler(apiRef, 'sortedRowsSet', updateCaches);

  const previousGetDetailPanelContentProp =
    React.useRef<DataGridProProcessedProps['getDetailPanelContent']>(undefined);
  const previousGetDetailPanelHeightProp =
    React.useRef<DataGridProProcessedProps['getDetailPanelHeight']>(undefined);

  const updateCachesIfNeeded = React.useCallback(() => {
    if (
      props.getDetailPanelContent === previousGetDetailPanelContentProp.current &&
      props.getDetailPanelHeight === previousGetDetailPanelHeightProp.current
    ) {
      return;
    }

    apiRef.current.setState((state) => {
      return {
        ...state,
        detailPanel: {
          ...state.detailPanel,
          ...cacheContentAndHeight(
            apiRef,
            props.getDetailPanelContent,
            props.getDetailPanelHeight,
            state.detailPanel.heightCache,
          ),
        },
      };
    });

    previousGetDetailPanelContentProp.current = props.getDetailPanelContent;
    previousGetDetailPanelHeightProp.current = props.getDetailPanelHeight;
  }, [apiRef, props.getDetailPanelContent, props.getDetailPanelHeight]);

  const addDetailHeight = React.useCallback<GridPipeProcessor<'rowHeight'>>(
    (initialValue, row) => {
      if (!expandedRowIds || expandedRowIds.size === 0 || !expandedRowIds.has(row.id)) {
        initialValue.detail = 0;
        return initialValue;
      }

      updateCachesIfNeeded();

      const heightCache = gridDetailPanelRawHeightCacheSelector(apiRef);

      initialValue.detail = heightCache[row.id].height ?? 0; // Fallback to zero because the cache might not be ready yet (for example page was changed)
      return initialValue;
    },
    [apiRef, expandedRowIds, updateCachesIfNeeded],
  );

  const enabled = props.getDetailPanelContent !== undefined;
  useGridRegisterPipeProcessor(apiRef, 'rowHeight', addDetailHeight, enabled);

  const isFirstRender = React.useRef(true);
  if (isFirstRender.current) {
    updateCachesIfNeeded();
  }
  React.useEffect(() => {
    if (!isFirstRender.current) {
      updateCachesIfNeeded();
    }
    isFirstRender.current = false;
  }, [apiRef, updateCachesIfNeeded]);
};
