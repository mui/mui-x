'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { throttle } from '@mui/x-internals/throttle';
import debounce from '@mui/utils/debounce';
import {
  useGridEvent,
  gridSortModelSelector,
  gridFilterModelSelector,
  GridEventListener,
  GRID_ROOT_GROUP_ID,
  GridGroupNode,
  GridSkeletonRowNode,
  gridPaginationModelSelector,
  gridFilteredSortedRowIdsSelector,
  gridRowIdSelector,
  GridRowId,
  GridLeafNode,
  GridGetRowsResponse,
  GridDataSourceGroupNode,
  gridExpandedSortedRowIdsSelector,
  gridRowNodeSelector,
  gridRowSelector,
  useGridSelector,
} from '@mui/x-data-grid';
import {
  getVisibleRows,
  GridStrategyGroup,
  GridStrategyProcessor,
  useGridRegisterStrategyProcessor,
  runIf,
  DataSourceRowsUpdateStrategy,
} from '@mui/x-data-grid/internals';
import { GridGetRowsParamsPro as GridGetRowsParams } from '../dataSource/models';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { findSkeletonRowsSection } from '../lazyLoader/utils';
import { GRID_SKELETON_ROW_ROOT_ID } from '../lazyLoader/useGridLazyLoaderPreProcessors';

type AdjustRowParams = Partial<Omit<GridGetRowsParams, 'start' | 'end'>> & {
  start: GridGetRowsParams['start'];
  end: GridGetRowsParams['end'];
};

const INTERVAL_CACHE_INITIAL_STATE = {
  firstRowToRender: 0,
  lastRowToRender: 0,
};

const GRID_SKELETON_ROW_NESTED_ID = 'auto-generated-skeleton-row-nested';

const getSkeletonRowId = (index: number) => `${GRID_SKELETON_ROW_ROOT_ID}-${index}`;
const getSkeletonNestedRowId = (index: number, parentId: GridRowId) =>
  `${GRID_SKELETON_ROW_NESTED_ID}-${parentId}-${index}`;

/**
 * @requires useGridRows (state)
 * @requires useGridPagination (state)
 * @requires useGridScroll (method
 */
export const useGridDataSourceNestedLazyLoader = (
  privateApiRef: RefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'dataSource' | 'lazyLoading' | 'lazyLoadingRequestThrottleMs' | 'treeData'
  >,
): void => {
  const isNestedLazyLoadingEnabled = useGridSelector(privateApiRef, () =>
    props.treeData
      ? true
      : ((
          privateApiRef.current.unstable_applyPipeProcessors(
            'getRowsParams',
            {},
          ) as Partial<GridGetRowsParams> & { groupFields: string[] }
        )?.groupFields?.length ?? 0) > 0,
  );
  const setStrategyAvailability = React.useCallback(() => {
    privateApiRef.current.setStrategyAvailability(
      GridStrategyGroup.DataSource,
      DataSourceRowsUpdateStrategy.LazyLoadedGroupedData,
      // TODO: Accommodate row grouping
      props.dataSource && props.lazyLoading && isNestedLazyLoadingEnabled
        ? () => true
        : () => false,
    );
  }, [privateApiRef, props.lazyLoading, props.dataSource, isNestedLazyLoadingEnabled]);

  const [isStrategyActive, setIsStrategyActive] = React.useState(false);
  const renderedRowsIntervalCache = React.useRef(INTERVAL_CACHE_INITIAL_STATE);
  const rowsStale = React.useRef<boolean>(false);
  const draggedRowId = React.useRef<GridRowId | null>(null);

  const fetchRows = React.useCallback(
    (params: Partial<GridGetRowsParams>) => {
      privateApiRef.current.dataSource.fetchRows(GRID_ROOT_GROUP_ID, params);
    },
    [privateApiRef],
  );

  const debouncedFetchRows = React.useMemo(() => debounce(fetchRows, 0), [fetchRows]);

  // Adjust the render context range to fit the pagination model's page size
  // First row index should be decreased to the start of the page, end row index should be increased to the end of the page
  const adjustRowParams = React.useCallback(
    (params: AdjustRowParams) => {
      if (typeof params.start !== 'number') {
        return params;
      }

      const paginationModel = gridPaginationModelSelector(privateApiRef);

      return {
        ...params,
        start: params.start - (params.start % paginationModel.pageSize),
        end: params.end + paginationModel.pageSize - (params.end % paginationModel.pageSize) - 1,
      };
    },
    [privateApiRef],
  );

  const getChildrenCount = props.dataSource?.getChildrenCount;
  const getGroupKey = props.dataSource?.getGroupKey;

  const addRootSkeletonRows = React.useCallback(() => {
    const tree = { ...privateApiRef.current.state.rows.tree };
    const rootGroup = tree[GRID_ROOT_GROUP_ID] as GridGroupNode;
    const rootGroupChildren = [...rootGroup.children];

    const pageRowCount = privateApiRef.current.state.pagination.rowCount;
    const rootChildrenCount = rootGroupChildren.length;

    if (rootChildrenCount === 0) {
      return;
    }

    let hasChanged = false;

    // Nested Lazy loading only support VIEWPORT loading trigger, no need for a specific check
    for (let i = 0; i < pageRowCount - rootChildrenCount; i += 1) {
      const skeletonId = getSkeletonRowId(i + rootChildrenCount);
      rootGroupChildren.push(skeletonId);

      const skeletonRowNode: GridSkeletonRowNode = {
        type: 'skeletonRow',
        id: skeletonId,
        parent: GRID_ROOT_GROUP_ID,
        depth: 0,
      };

      tree[skeletonId] = skeletonRowNode;
      hasChanged = true;
    }

    if (!hasChanged) {
      return;
    }

    tree[GRID_ROOT_GROUP_ID] = { ...rootGroup, children: rootGroupChildren };

    privateApiRef.current.setState(
      (state) => ({
        ...state,
        rows: {
          ...state.rows,
          tree,
        },
      }),
      'addSkeletonRows',
    );
    privateApiRef.current.publishEvent('rowsSet');
  }, [privateApiRef]);

  const cleanUpParentNodeAndGenerateSkeletonRows = React.useCallback(
    (parentId: GridRowId) => {
      const dataRowIdToModelLookup = { ...privateApiRef.current.state.rows.dataRowIdToModelLookup };
      const tree = { ...privateApiRef.current.state.rows.tree };

      const deletedIds = new Set<GridRowId>();

      const rowNode = gridRowNodeSelector(privateApiRef, parentId);
      if (!rowNode || rowNode.type !== 'group' || rowNode.children.length === 0) {
        return;
      }

      // Remove current descendants from the tree
      const traverse = (nodeId: GridRowId) => {
        const node = gridRowNodeSelector(privateApiRef, nodeId);
        if (!node) {
          return;
        }

        // Recursively traverse children first (depth-first)
        if (node.type === 'group' && node.children.length > 0) {
          node.children.forEach(traverse);
        }
        if (deletedIds.has(nodeId)) {
          return;
        }
        deletedIds.add(nodeId);
        delete dataRowIdToModelLookup[nodeId];
        delete tree[nodeId];
      };

      rowNode.children.forEach(traverse);

      // Add skeleton rows for the children
      const rowModel = gridRowSelector(privateApiRef, parentId);
      if (!rowModel) {
        return;
      }
      const childrenCount = getChildrenCount?.(rowModel) ?? 0;
      if (childrenCount <= 0) {
        return;
      }

      const newChildren = [];

      for (let i = 0; i < childrenCount; i += 1) {
        const skeletonId = getSkeletonNestedRowId(i, parentId);
        if (tree[skeletonId]) {
          newChildren.push(skeletonId);
          continue;
        }
        tree[skeletonId] = {
          type: 'skeletonRow',
          id: skeletonId,
          parent: parentId,
          depth: rowNode.depth + 1,
        };
        newChildren.push(skeletonId);
      }

      tree[parentId] = {
        ...rowNode,
        children: newChildren,
      } as GridGroupNode;

      privateApiRef.current.setState((state) => ({
        ...state,
        rows: {
          ...state.rows,
          tree,
          dataRowIdToModelLookup,
          dataRowIds: state.rows.dataRowIds.filter((id) => !deletedIds.has(id)),
        },
      }));
      privateApiRef.current.publishEvent('rowsSet');
    },
    [privateApiRef, getChildrenCount],
  );

  const replaceNestedRows = React.useCallback(
    (
      startIndex: number,
      response: GridGetRowsResponse,
      parentId: GridRowId = GRID_ROOT_GROUP_ID,
    ) => {
      if (response.rows.length === 0) {
        return;
      }

      const tree = { ...privateApiRef.current.state.rows.tree };
      const dataRowIdToModelLookup = { ...privateApiRef.current.state.rows.dataRowIdToModelLookup };
      const targetGroup = tree[parentId] as GridGroupNode;
      const targetGroupChildren = [...targetGroup.children];
      const targetGroupChildrenFromPath = { ...targetGroup.childrenFromPath };
      const seenIds = new Set<GridRowId>();

      if (!getGroupKey) {
        throw new Error('MUI X: No `getGroupKey` method provided with the dataSource.');
      }

      if (!getChildrenCount) {
        throw new Error('MUI X: No `getChildrenCount` method provided with the dataSource.');
      }

      // Calculate parent depth (-1 for root, so children at root level have depth 0)
      const parentDepth = parentId === GRID_ROOT_GROUP_ID ? -1 : targetGroup.depth;
      const parentPath: string[] =
        parentId === GRID_ROOT_GROUP_ID
          ? []
          : ((tree[parentId] as GridDataSourceGroupNode).path ?? []);

      for (let i = 0; i < response.rows.length; i += 1) {
        const rowModel = response.rows[i];
        const childrenCount = getChildrenCount(rowModel);
        if (childrenCount === -1) {
          throw new Error(
            'MUI X: Nested lazy loading does not support unknown children count for now.\nIf this is a use-case that you are interested in, please open an issue: https://github.com/mui/mui-x/issues/new?template=2.feature.yml',
          );
        }
        const rowId = gridRowIdSelector(privateApiRef, rowModel);
        const [removedRowId] = targetGroupChildren.splice(startIndex + i, 1, rowId);

        if (!seenIds.has(removedRowId)) {
          delete dataRowIdToModelLookup[removedRowId];
          delete tree[removedRowId];
        }

        let rowTreeNodeConfig: GridLeafNode | GridDataSourceGroupNode;

        const groupingKey = getGroupKey(rowModel);
        if (childrenCount === 0) {
          rowTreeNodeConfig = {
            id: rowId,
            depth: parentDepth + 1,
            parent: parentId,
            type: 'leaf',
            groupingKey,
          };
        } else {
          const children = [];
          for (let j = 0; j < childrenCount; j += 1) {
            const skeletonId = getSkeletonNestedRowId(j, rowId);
            children.push(skeletonId);

            const skeletonRowNode: GridSkeletonRowNode = {
              type: 'skeletonRow',
              id: skeletonId,
              parent: rowId,
              depth: parentDepth + 2,
            };

            tree[skeletonId] = skeletonRowNode;
          }
          rowTreeNodeConfig = {
            id: rowId,
            depth: parentDepth + 1,
            parent: parentId,
            type: 'group',
            groupingKey,
            path: [...parentPath, groupingKey] as unknown as string[],
            children,
            isAutoGenerated: false,
            // TODO: Add proper value when implementing row grouping version
            groupingField: null,
            serverChildrenCount: childrenCount,
            childrenFromPath: {},
          };
        }
        dataRowIdToModelLookup[rowId] = rowModel;
        tree[rowId] = rowTreeNodeConfig;

        // Update parent's childrenFromPath lookup
        const groupingFieldName =
          (rowTreeNodeConfig as GridDataSourceGroupNode).groupingField ?? '__no_field__';
        const groupingKeyName = rowTreeNodeConfig.groupingKey ?? '__no_key__';
        if (!targetGroupChildrenFromPath[groupingFieldName]) {
          targetGroupChildrenFromPath[groupingFieldName] = {};
        }
        targetGroupChildrenFromPath[groupingFieldName][groupingKeyName.toString()] = rowId;

        seenIds.add(rowId);
      }

      tree[parentId] = {
        ...targetGroup,
        children:
          parentId === GRID_ROOT_GROUP_ID
            ? targetGroupChildren.filter((childId) => tree[childId]?.type !== 'skeletonRow')
            : targetGroupChildren,
        childrenFromPath: targetGroupChildrenFromPath,
      };

      // Removes potential remaining skeleton rows from the dataRowIds.
      const dataRowIds = targetGroupChildren.filter(
        (childId) => tree[childId]?.type !== 'skeletonRow',
      );

      privateApiRef.current.caches.rows.dataRowIdToModelLookup = dataRowIdToModelLookup;

      privateApiRef.current.setState((state) => ({
        ...state,
        rows: {
          ...state.rows,
          dataRowIdToModelLookup,
          dataRowIds,
          tree: { ...tree },
          totalRowCount: response.rowCount === undefined ? -1 : response.rowCount,
        },
      }));
      privateApiRef.current.publishEvent('rowsSet');
    },
    [privateApiRef, getGroupKey, getChildrenCount],
  );

  const removeDuplicateRows = React.useCallback(
    (rows: GridGetRowsResponse['rows']) => {
      const tree = { ...privateApiRef.current.state.rows.tree };
      const dataRowIdToModelLookup = { ...privateApiRef.current.state.rows.dataRowIdToModelLookup };
      const rootGroup = tree[GRID_ROOT_GROUP_ID] as GridGroupNode;
      const rootGroupChildren = [...rootGroup.children];

      let duplicateRowCount = 0;
      rows.forEach((row) => {
        const rowId = gridRowIdSelector(privateApiRef, row);
        if (tree[rowId] || dataRowIdToModelLookup[rowId]) {
          const index = rootGroupChildren.indexOf(rowId);
          if (index !== -1) {
            const skeletonId = getSkeletonRowId(index);
            rootGroupChildren[index] = skeletonId;
            tree[skeletonId] = {
              type: 'skeletonRow',
              id: skeletonId,
              parent: GRID_ROOT_GROUP_ID,
              depth: 0,
            };
          }
          delete tree[rowId];
          delete dataRowIdToModelLookup[rowId];
          duplicateRowCount += 1;
        }
      });

      if (duplicateRowCount > 0) {
        tree[GRID_ROOT_GROUP_ID] = { ...rootGroup, children: rootGroupChildren };
        privateApiRef.current.setState((state) => ({
          ...state,
          rows: {
            ...state.rows,
            tree,
            dataRowIdToModelLookup,
          },
        }));
      }
    },
    [privateApiRef],
  );

  const handleDataUpdate = React.useCallback<GridStrategyProcessor<'dataSourceRootRowsUpdate'>>(
    (params) => {
      if ('error' in params) {
        return;
      }

      const { response, fetchParams } = params;
      const pageRowCount = privateApiRef.current.state.pagination.rowCount;
      if (
        (fetchParams as GridGetRowsParams).groupKeys?.length === 0 &&
        (response.rowCount !== undefined || pageRowCount === undefined)
      ) {
        privateApiRef.current.setRowCount(response.rowCount === undefined ? -1 : response.rowCount);
      }

      // scroll to the top if the rows are stale and the new request is for the first page
      if (rowsStale.current && params.fetchParams.start === 0) {
        privateApiRef.current.scroll({ top: 0 });
        // the rows can safely be replaced. skeleton rows will be added later
        privateApiRef.current.setRows(response.rows);
      } else {
        const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(privateApiRef);

        const startingIndex =
          typeof fetchParams.start === 'string'
            ? Math.max(filteredSortedRowIds.indexOf(fetchParams.start), 0)
            : fetchParams.start;

        removeDuplicateRows(response.rows);
        replaceNestedRows(startingIndex, response);
      }

      rowsStale.current = false;

      addRootSkeletonRows();
      privateApiRef.current.setLoading(false);
      privateApiRef.current.unstable_applyPipeProcessors(
        'processDataSourceRows',
        { params: params.fetchParams, response },
        false,
      );
      privateApiRef.current.requestPipeProcessorsApplication('hydrateRows');
    },
    [privateApiRef, addRootSkeletonRows, replaceNestedRows, removeDuplicateRows],
  );

  const handleNestedDataUpdate = React.useCallback<
    GridStrategyProcessor<'dataSourceNestedRowsUpdate'>
  >(
    (params) => {
      if ('error' in params) {
        return;
      }
      const { parentId, fetchParams, response } = params;

      removeDuplicateRows(response.rows);

      // Get the relative start index from fetchParams
      const startIndex = typeof fetchParams.start === 'number' ? fetchParams.start : 0;
      replaceNestedRows(startIndex, response, parentId);
    },
    [replaceNestedRows, removeDuplicateRows],
  );

  const handleRowCountChange = React.useCallback(
    (newRowCount: number) => {
      if (rowsStale.current) {
        return;
      }

      // Show error if unknown row-count
      if (newRowCount <= 0) {
        throw new Error(
          'MUI X: Row count is unknown. Please provide a valid row count for lazy loading to work.',
        );
      }

      addRootSkeletonRows();
      privateApiRef.current.requestPipeProcessorsApplication('hydrateRows');
    },
    [privateApiRef, addRootSkeletonRows],
  );

  const findSkeletonSectionAndFetchRows = React.useCallback(
    (firstRowIndex: number, lastRowIndex: number) => {
      const sortModel = gridSortModelSelector(privateApiRef);
      const filterModel = gridFilterModelSelector(privateApiRef);
      const currentVisibleRows = getVisibleRows(privateApiRef);

      const skeletonRowsSection = findSkeletonRowsSection({
        apiRef: privateApiRef,
        visibleRows: currentVisibleRows.rows,
        range: {
          firstRowIndex,
          lastRowIndex,
        },
      });

      if (!skeletonRowsSection) {
        return;
      }

      const expandedSortedRowIds = gridExpandedSortedRowIdsSelector(privateApiRef);
      const skeletonNodesGroupedByParents = new Map<GridRowId, GridRowId[]>();

      // Group skeleton rows by their parent
      for (
        let i = skeletonRowsSection.firstRowIndex;
        i <= skeletonRowsSection.lastRowIndex;
        i += 1
      ) {
        const rowId = expandedSortedRowIds[i];
        const rowNode = gridRowNodeSelector(privateApiRef, rowId);
        if (rowNode?.type === 'skeletonRow' && rowNode.parent != null) {
          if (!skeletonNodesGroupedByParents.has(rowNode.parent)) {
            skeletonNodesGroupedByParents.set(rowNode.parent, []);
          }
          skeletonNodesGroupedByParents.get(rowNode.parent)!.push(rowId);
        }
      }

      // Process each parent group separately
      skeletonNodesGroupedByParents.forEach((skeletonIds, parentId) => {
        const parentNode = gridRowNodeSelector(privateApiRef, parentId) as GridGroupNode;
        if (!parentNode) {
          return;
        }
        const parentChildren = parentNode.children;

        // Find the first and last skeleton row indexes relative to parent
        const firstSkeletonIdx = parentChildren.indexOf(skeletonIds[0]);
        const lastSkeletonIdx = parentChildren.indexOf(skeletonIds[skeletonIds.length - 1]);

        if (firstSkeletonIdx === -1 || lastSkeletonIdx === -1) {
          return;
        }

        if (parentId === GRID_ROOT_GROUP_ID) {
          debouncedFetchRows(
            adjustRowParams({
              start: firstSkeletonIdx,
              end: lastSkeletonIdx,
              sortModel,
              filterModel,
              groupKeys: [],
            }),
          );
        } else {
          privateApiRef.current.dataSource.fetchRows(
            parentId,
            adjustRowParams({
              start: firstSkeletonIdx,
              end: lastSkeletonIdx,
            }),
          );
        }
      });
    },
    [privateApiRef, debouncedFetchRows, adjustRowParams],
  );

  const handleRenderedRowsIntervalChange = React.useCallback<
    GridEventListener<'renderedRowsIntervalChange'>
  >(
    (params) => {
      if (rowsStale.current) {
        return;
      }

      if (
        renderedRowsIntervalCache.current.firstRowToRender === params.firstRowIndex &&
        renderedRowsIntervalCache.current.lastRowToRender === params.lastRowIndex
      ) {
        return;
      }

      findSkeletonSectionAndFetchRows(params.firstRowIndex, params.lastRowIndex);

      renderedRowsIntervalCache.current = {
        firstRowToRender: params.firstRowIndex,
        lastRowToRender: params.lastRowIndex,
      };
    },
    [findSkeletonSectionAndFetchRows],
  );

  const handleRowExpansionChange = React.useCallback<GridEventListener<'rowExpansionChange'>>(
    (node) => {
      if (node.childrenExpanded) {
        findSkeletonSectionAndFetchRows(
          renderedRowsIntervalCache.current.firstRowToRender,
          renderedRowsIntervalCache.current.lastRowToRender,
        );
        return;
      }
      cleanUpParentNodeAndGenerateSkeletonRows(node.id);
    },
    [findSkeletonSectionAndFetchRows, cleanUpParentNodeAndGenerateSkeletonRows],
  );

  const throttledHandleRenderedRowsIntervalChange = React.useMemo(
    () => throttle(handleRenderedRowsIntervalChange, props.lazyLoadingRequestThrottleMs),
    [props.lazyLoadingRequestThrottleMs, handleRenderedRowsIntervalChange],
  );

  React.useEffect(() => {
    return () => {
      throttledHandleRenderedRowsIntervalChange.clear();
    };
  }, [throttledHandleRenderedRowsIntervalChange]);

  const handleGridSortModelChange = React.useCallback<GridEventListener<'sortModelChange'>>(
    (newSortModel) => {
      rowsStale.current = true;
      throttledHandleRenderedRowsIntervalChange.clear();
      const paginationModel = gridPaginationModelSelector(privateApiRef);
      const filterModel = gridFilterModelSelector(privateApiRef);

      const getRowsParams: GridGetRowsParams = {
        start: 0,
        end: paginationModel.pageSize - 1,
        sortModel: newSortModel,
        filterModel,
      };

      privateApiRef.current.setLoading(true);
      debouncedFetchRows(getRowsParams);
    },
    [privateApiRef, debouncedFetchRows, throttledHandleRenderedRowsIntervalChange],
  );

  const handleGridFilterModelChange = React.useCallback<GridEventListener<'filterModelChange'>>(
    (newFilterModel) => {
      rowsStale.current = true;
      throttledHandleRenderedRowsIntervalChange.clear();

      const paginationModel = gridPaginationModelSelector(privateApiRef);
      const sortModel = gridSortModelSelector(privateApiRef);
      const getRowsParams: GridGetRowsParams = {
        start: 0,
        end: paginationModel.pageSize - 1,
        sortModel,
        filterModel: newFilterModel,
      };

      privateApiRef.current.setLoading(true);
      debouncedFetchRows(getRowsParams);
    },
    [privateApiRef, debouncedFetchRows, throttledHandleRenderedRowsIntervalChange],
  );

  const handleDragStart = React.useCallback<GridEventListener<'rowDragStart'>>((row) => {
    draggedRowId.current = row.id;
  }, []);

  const handleDragEnd = React.useCallback<GridEventListener<'rowDragEnd'>>(() => {
    draggedRowId.current = null;
  }, []);

  const handleStrategyActivityChange = React.useCallback<
    GridEventListener<'strategyAvailabilityChange'>
  >(() => {
    setIsStrategyActive(
      privateApiRef.current.getActiveStrategy(GridStrategyGroup.DataSource) ===
        DataSourceRowsUpdateStrategy.LazyLoadedGroupedData,
    );
  }, [privateApiRef]);

  useGridRegisterStrategyProcessor(
    privateApiRef,
    DataSourceRowsUpdateStrategy.LazyLoadedGroupedData,
    'dataSourceRootRowsUpdate',
    handleDataUpdate,
  );

  useGridRegisterStrategyProcessor(
    privateApiRef,
    DataSourceRowsUpdateStrategy.LazyLoadedGroupedData,
    'dataSourceNestedRowsUpdate',
    handleNestedDataUpdate,
  );

  useGridEvent(privateApiRef, 'strategyAvailabilityChange', handleStrategyActivityChange);

  useGridEvent(privateApiRef, 'rowCountChange', runIf(isStrategyActive, handleRowCountChange));
  useGridEvent(
    privateApiRef,
    'rowExpansionChange',
    runIf(isStrategyActive, handleRowExpansionChange),
  );
  useGridEvent(
    privateApiRef,
    'renderedRowsIntervalChange',
    runIf(isStrategyActive, throttledHandleRenderedRowsIntervalChange),
  );
  useGridEvent(
    privateApiRef,
    'sortModelChange',
    runIf(isStrategyActive, handleGridSortModelChange),
  );
  useGridEvent(
    privateApiRef,
    'filterModelChange',
    runIf(isStrategyActive, handleGridFilterModelChange),
  );
  useGridEvent(privateApiRef, 'rowDragStart', runIf(isStrategyActive, handleDragStart));
  useGridEvent(privateApiRef, 'rowDragEnd', runIf(isStrategyActive, handleDragEnd));

  React.useEffect(() => {
    setStrategyAvailability();
  }, [setStrategyAvailability]);
};
