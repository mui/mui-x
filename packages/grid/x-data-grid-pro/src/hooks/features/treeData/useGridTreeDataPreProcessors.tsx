import * as React from 'react';
import {
  gridRowIdsSelector,
  gridRowTreeSelector,
  useFirstRender,
  GridColDef,
} from '@mui/x-data-grid';
import {
  GridPreProcessor,
  GridStrategyProcessor,
  useGridRegisterPreProcessor,
  useGridRegisterStrategyProcessor,
} from '@mui/x-data-grid/internals';
import {
  GRID_TREE_DATA_GROUPING_COL_DEF,
  GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES,
} from './gridTreeDataGroupColDef';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { filterRowTreeFromTreeData, TREE_DATA_STRATEGY } from './gridTreeDataUtils';
import { GridApiPro } from '../../../models/gridApiPro';
import {
  GridGroupingColDefOverride,
  GridGroupingColDefOverrideParams,
} from '../../../models/gridGroupingColDefOverride';
import { GridTreeDataGroupingCell } from '../../../components';
import { buildRowTree, BuildRowTreeGroupingCriteria } from '../../../utils/tree/buildRowTree';
import { sortRowTree } from '../../../utils/tree/sortRowTree';

export const useGridTreeDataPreProcessors = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    | 'treeData'
    | 'groupingColDef'
    | 'getTreeDataPath'
    | 'disableChildrenSorting'
    | 'disableChildrenFiltering'
    | 'defaultGroupingExpansionDepth'
    | 'isGroupExpandedByDefault'
  >,
) => {
  const setStrategyAvailability = React.useCallback(() => {
    apiRef.current.unstable_setStrategyAvailability(
      'rowTree',
      TREE_DATA_STRATEGY,
      props.treeData ? () => true : () => false,
    );
  }, [apiRef, props.treeData]);

  const getGroupingColDef = React.useCallback(() => {
    const groupingColDefProp = props.groupingColDef;

    let colDefOverride: GridGroupingColDefOverride | null | undefined;
    if (typeof groupingColDefProp === 'function') {
      const params: GridGroupingColDefOverrideParams = {
        groupingName: TREE_DATA_STRATEGY,
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

  const createRowTree = React.useCallback<GridStrategyProcessor<'rowTreeCreation'>>(
    (params) => {
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
        groupingName: TREE_DATA_STRATEGY,
        onDuplicatePath: (firstId, secondId, path) => {
          throw new Error(
            [
              'MUI: The path returned by `getTreeDataPath` should be unique.',
              `The rows with id #${firstId} and #${secondId} have the same.`,
              `Path: ${JSON.stringify(path.map((step) => step.key))}.`,
            ].join('\n'),
          );
        },
      });
    },
    [props.getTreeDataPath, props.defaultGroupingExpansionDepth, props.isGroupExpandedByDefault],
  );

  const filterRows = React.useCallback<GridStrategyProcessor<'filtering'>>(
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

  const sortRows = React.useCallback<GridStrategyProcessor<'sorting'>>(
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
  useGridRegisterStrategyProcessor(apiRef, TREE_DATA_STRATEGY, 'rowTreeCreation', createRowTree);
  useGridRegisterStrategyProcessor(apiRef, TREE_DATA_STRATEGY, 'filtering', filterRows);
  useGridRegisterStrategyProcessor(apiRef, TREE_DATA_STRATEGY, 'sorting', sortRows);

  /**
   * 1ST RENDER
   */
  useFirstRender(() => {
    setStrategyAvailability();
  });

  /**
   * EFFECTS
   */
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (!isFirstRender.current) {
      setStrategyAvailability();
    } else {
      isFirstRender.current = false;
    }
  }, [setStrategyAvailability]);
};
