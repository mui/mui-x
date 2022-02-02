import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { DataGridProProcessedProps } from '../../../models/props/DataGridProProps';
import {
  GRID_TREE_DATA_GROUPING_COL_DEF,
  GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES,
} from './gridTreeDataGroupColDef';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridEventListener, GridEvents } from '../../../models/events';
import {
  GridColDef,
  GridGroupingColDefOverride,
  GridGroupingColDefOverrideParams,
} from '../../../models';
import { isSpaceKey } from '../../../utils/keyboardUtils';
import { useFirstRender } from '../../utils/useFirstRender';
import { buildRowTree, BuildRowTreeGroupingCriteria } from '../../../utils/tree/buildRowTree';
import { GridRowGroupingPreProcessing } from '../../core/rowGroupsPerProcessing';
import { gridFilteredDescendantCountLookupSelector } from '../filter';
import { GridPreProcessor, useGridRegisterPreProcessor } from '../../core/preProcessing';
import { GridFilteringMethod } from '../filter/gridFilterState';
import { gridRowIdsSelector, gridRowTreeSelector } from '../rows';
import { useGridRegisterFilteringMethod } from '../filter/useGridRegisterFilteringMethod';
import { useGridRegisterSortingMethod } from '../sorting/useGridRegisterSortingMethod';
import { GridSortingMethod } from '../sorting/gridSortingState';
import { sortRowTree } from '../../../utils/tree/sortRowTree';
import { filterRowTreeFromTreeData } from './gridTreeDataUtils';
import { GridTreeDataGroupingCell } from '../../../components';

const TREE_DATA_GROUPING_NAME = 'tree-data';

/**
 * Only available in DataGridPro
 * @requires useGridPreProcessing (method)
 * @requires useGridRowGroupsPreProcessing (method)
 */
export const useGridTreeData = (
  apiRef: GridApiRef,
  props: Pick<
    DataGridProProcessedProps,
    | 'treeData'
    | 'getTreeDataPath'
    | 'groupingColDef'
    | 'defaultGroupingExpansionDepth'
    | 'isGroupExpandedByDefault'
    | 'disableChildrenFiltering'
    | 'disableChildrenSorting'
  >,
) => {
  /**
   * ROW GROUPING
   */
  const updateRowGrouping = React.useCallback(() => {
    if (!props.treeData) {
      return apiRef.current.unstable_registerRowGroupsBuilder('treeData', null);
    }

    const groupRows: GridRowGroupingPreProcessing = (params) => {
      if (!props.getTreeDataPath) {
        throw new Error('MUI: No getTreeDataPath given.');
      }

      const rows = params.ids
        .map((rowId) => ({
          id: rowId,
          path: props.getTreeDataPath!(params.idRowsLookup[rowId]).map(
            (key): BuildRowTreeGroupingCriteria => ({ key, field: null }),
          ),
        }))
        .sort((a, b) => a.path.length - b.path.length);

      return buildRowTree({
        rows,
        ...params,
        defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
        isGroupExpandedByDefault: props.isGroupExpandedByDefault,
        groupingName: TREE_DATA_GROUPING_NAME,
      });
    };

    return apiRef.current.unstable_registerRowGroupsBuilder('treeData', groupRows);
  }, [
    apiRef,
    props.getTreeDataPath,
    props.treeData,
    props.defaultGroupingExpansionDepth,
    props.isGroupExpandedByDefault,
  ]);

  useFirstRender(() => {
    updateRowGrouping();
  });

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    updateRowGrouping();
  }, [updateRowGrouping]);

  /**
   * PRE-PROCESSING
   */
  const getGroupingColDef = React.useCallback((): GridColDef => {
    const groupingColDefProp = props.groupingColDef;

    let colDefOverride: GridGroupingColDefOverride | null | undefined;
    if (typeof groupingColDefProp === 'function') {
      const params: GridGroupingColDefOverrideParams = {
        groupingName: TREE_DATA_GROUPING_NAME,
        fields: [],
      };

      colDefOverride = groupingColDefProp(params);
    } else {
      colDefOverride = groupingColDefProp;
    }

    const { hideDescendantCount, ...colDefOverrideProperties } = colDefOverride ?? {};

    const commonProperties: Omit<GridColDef, 'field' | 'editable'> = {
      ...GRID_TREE_DATA_GROUPING_COL_DEF,
      renderCell: (params) => (
        <GridTreeDataGroupingCell {...params} hideDescendantCount={hideDescendantCount} />
      ),
      headerName: apiRef.current.getLocaleText('treeDataGroupingHeaderName'),
    };

    return {
      ...commonProperties,
      ...colDefOverrideProperties,
      ...GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES,
    };
  }, [apiRef, props.groupingColDef]);

  const updateGroupingColumn = React.useCallback<GridPreProcessor<'hydrateColumns'>>(
    (columnsState) => {
      const groupingColDefField = GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES.field;

      const shouldHaveGroupingColumn = props.treeData;
      const prevGroupingColumn = columnsState.lookup[groupingColDefField];

      if (shouldHaveGroupingColumn) {
        const newGroupingColumn = getGroupingColDef();
        if (prevGroupingColumn) {
          newGroupingColumn.width = prevGroupingColumn.width;
          newGroupingColumn.flex = prevGroupingColumn.flex;
        }
        columnsState.lookup[groupingColDefField] = newGroupingColumn;
        if (prevGroupingColumn == null) {
          const index = columnsState.all[0] === '__check__' ? 1 : 0;
          columnsState.all = [
            ...columnsState.all.slice(0, index),
            groupingColDefField,
            ...columnsState.all.slice(index),
          ];
        }
      } else if (!shouldHaveGroupingColumn && prevGroupingColumn) {
        delete columnsState.lookup[groupingColDefField];
        columnsState.all = columnsState.all.filter((field) => field !== groupingColDefField);
      }

      return columnsState;
    },
    [props.treeData, getGroupingColDef],
  );

  const filteringMethod = React.useCallback<GridFilteringMethod>(
    (params) => {
      const rowTree = gridRowTreeSelector(apiRef);

      return filterRowTreeFromTreeData({
        rowTree,
        isRowMatchingFilters: params.isRowMatchingFilters,
        disableChildrenFiltering: props.disableChildrenFiltering,
      });
    },
    [apiRef, props.disableChildrenFiltering],
  );

  const sortingMethod = React.useCallback<GridSortingMethod>(
    (params) => {
      const rowTree = gridRowTreeSelector(apiRef);
      const rowIds = gridRowIdsSelector(apiRef);

      return sortRowTree({
        rowTree,
        rowIds,
        sortRowList: params.sortRowList,
        disableChildrenSorting: props.disableChildrenSorting,
      });
    },
    [apiRef, props.disableChildrenSorting],
  );

  useGridRegisterPreProcessor(apiRef, 'hydrateColumns', updateGroupingColumn);
  useGridRegisterFilteringMethod(apiRef, TREE_DATA_GROUPING_NAME, filteringMethod);
  useGridRegisterSortingMethod(apiRef, TREE_DATA_GROUPING_NAME, sortingMethod);

  /**
   * EVENTS
   */
  const handleCellKeyDown = React.useCallback<GridEventListener<GridEvents.cellKeyDown>>(
    (params, event) => {
      const cellParams = apiRef.current.getCellParams(params.id, params.field);
      if (cellParams.colDef.type === 'treeDataGroup' && isSpaceKey(event.key) && !event.shiftKey) {
        event.stopPropagation();
        event.preventDefault();

        const filteredDescendantCount =
          gridFilteredDescendantCountLookupSelector(apiRef)[params.id] ?? 0;

        if (filteredDescendantCount === 0) {
          return;
        }

        apiRef.current.setRowChildrenExpansion(params.id, !params.rowNode.childrenExpanded);
      }
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);
};
