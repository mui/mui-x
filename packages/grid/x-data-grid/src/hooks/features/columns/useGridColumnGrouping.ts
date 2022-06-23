import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import {
  GridColumnGroupingModel,
  GridColumnNode,
  isLeaf,
} from '../../../models/gridColumnGrouping';
import { gridColumnGroupsLookupSelector, gridColumnLookupSelector } from './gridColumnsSelector';
import { GridColumnGroupLookup } from './gridColumnsInterfaces';
import { GridColumnGroupingApi } from '../../../models/api/gridColumnGroupingApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { isDeepEqual } from '../../../utils/utils';
import { GridStateColDef, GridColDef } from '../../../models/colDef';

export function hasGroupPath(
  lookupElement: GridColDef | GridStateColDef,
): lookupElement is GridStateColDef {
  return (<GridStateColDef>lookupElement).groupPath !== undefined;
}

type UnwrappedGroupingModel = { [key: string]: string[] };

const recurrentUnwrapGroupingColumnModel = (
  columnGroupNode: GridColumnNode,
  parents: any,
): UnwrappedGroupingModel => {
  if (isLeaf(columnGroupNode)) {
    return { [columnGroupNode.field]: parents };
  }
  const rep: UnwrappedGroupingModel = {};
  const { groupId, children } = columnGroupNode;
  children.forEach((child) => {
    const unwrappedSubTree = recurrentUnwrapGroupingColumnModel(child, [...parents, groupId]);
    Object.entries(unwrappedSubTree).forEach(([key, value]) => {
      if (rep[key] !== undefined) {
        throw new Error(
          [
            `MUI DataGrid - column grouping: duplicated field`,
            `column field ${key} occurres two times in the grouping model:`,
            `- ${rep[key].join(' > ')}`,
            `- ${value.join(' > ')}`,
          ].join('\n'),
        );
      }
      rep[key] = value;
    });
  });
  return rep;
};

export const unwrapGroupingColumnModel = (
  columnGroupingModel?: GridColumnGroupingModel,
): UnwrappedGroupingModel => {
  if (!columnGroupingModel) {
    return {};
  }

  const rep: UnwrappedGroupingModel = {};

  columnGroupingModel.forEach((columnGroupNode) => {
    const unwrappedSubTree = recurrentUnwrapGroupingColumnModel(columnGroupNode, []);
    Object.entries(unwrappedSubTree).forEach(([key, value]) => {
      if (rep[key] !== undefined) {
        throw new Error(
          [
            `MUI DataGrid - column grouping: duplicated field`,
            `column field ${key} occurres two times in the grouping model:`,
            `- ${rep[key].join(' > ')}`,
            `- ${value.join(' > ')}`,
          ].join('\n'),
        );
      }
      rep[key] = value;
    });
  });

  return rep;
};

const createGroupLookup = (columnGroupingModel: GridColumnNode[]): GridColumnGroupLookup => {
  let groupLookup: GridColumnGroupLookup = {};

  columnGroupingModel.forEach((node) => {
    if (isLeaf(node)) {
      return;
    }
    const { groupId, children, ...other } = node;
    if (!groupId) {
      throw new Error(
        'MUI-DataGrid: an element of the columnGroupingModel does not have either `field` or `groupId`',
      );
    }
    if (!children) {
      console.warn(`MUI-DataGrid: group groupId=${groupId} has no children. `);
    }
    const groupParam = { ...other, groupId };
    const subTreeLookup = createGroupLookup(children);
    if (subTreeLookup[groupId] !== undefined || groupLookup[groupId] !== undefined) {
      throw new Error(`The groupId ${groupId} is used multiple times`);
    }
    groupLookup = { ...groupLookup, ...subTreeLookup, [groupId]: groupParam };
  });

  return { ...groupLookup };
};
export const columnGroupsStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'columnGroupingModel'>
> = (state, props) => {
  const groupLookup = createGroupLookup(props.columnGroupingModel ?? []);
  return {
    ...state,
    columnGrouping: { lookup: groupLookup, groupCollapsedModel: {} },
  };
};

/**
 * @requires useGridColumns (method, event)
 * @requires useGridParamsApi (method)
 */
export const useGridColumnGrouping = (
  apiRef: React.MutableRefObject<GridApiCommunity>,
  props: Pick<DataGridProcessedProps, 'columnGroupingModel'>,
) => {
  /**
   * API METHODS
   */
  const getColumnGroupPath = React.useCallback<GridColumnGroupingApi['getColumnGroupPath']>(
    (field) => {
      const columnLookup = gridColumnLookupSelector(apiRef);

      return columnLookup[field]?.groupPath ?? [];
    },
    [apiRef],
  );

  const getAllGroupDetails = React.useCallback<GridColumnGroupingApi['getAllGroupDetails']>(() => {
    const columnGroupLookup = gridColumnGroupsLookupSelector(apiRef);
    return columnGroupLookup;
  }, [apiRef]);

  const getGroupDetails = React.useCallback<GridColumnGroupingApi['getGroupDetails']>(
    (groupId) => {
      const columnGroupLookup = gridColumnGroupsLookupSelector(apiRef);

      return columnGroupLookup[groupId] ?? null;
    },
    [apiRef],
  );

  const columnGroupingApi: GridColumnGroupingApi = {
    getColumnGroupPath,
    getGroupDetails,
    getAllGroupDetails,
  };

  useGridApiMethod(apiRef, columnGroupingApi, 'GridColumnGroupingApi');

  /**
   * Processors
   * */
  const addHeaderGroups = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      if (!props.columnGroupingModel) {
        return columnsState;
      }
      const unwrappedGroupingModel = unwrapGroupingColumnModel(props.columnGroupingModel);
      if (Object.keys(unwrappedGroupingModel).length === 0) {
        return columnsState;
      }

      columnsState.all.forEach((field) => {
        const newGroupPath = unwrappedGroupingModel[field] ?? [];

        const lookupElement = columnsState.lookup[field];
        if (hasGroupPath(lookupElement) && isDeepEqual(newGroupPath, lookupElement?.groupPath)) {
          // Avoid modifying the pointer to allow shadow comparison in https://github.com/mui/mui-x/blob/f90afbf10a1264ee8b453d7549dd7cdd6110a4ed/packages/grid/x-data-grid/src/hooks/features/columns/gridColumnsUtils.ts#L446:L453
          return;
        }
        columnsState.lookup[field] = {
          ...columnsState.lookup[field],
          groupPath: unwrappedGroupingModel[field] ?? [],
        };
      });
      return columnsState;
    },
    [props.columnGroupingModel],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', addHeaderGroups);

  /**
   * EFFECTS
   */
  // The effect do not track any value defined synchronously during the 1st render by hooks called after `useGridColumns`
  // As a consequence, the state generated by the 1st run of this useEffect will always be equal to the initialization one
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const groupLookup = createGroupLookup(props.columnGroupingModel ?? []);
    apiRef.current.setState((state) => ({
      ...state,
      columnGrouping: { ...state.columnGrouping, lookup: groupLookup },
    }));
  }, [apiRef, props.columnGroupingModel]);
};
