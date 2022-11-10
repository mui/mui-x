import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import {
  GridColumnGroupingModel,
  GridColumnNode,
  GridColumnGroup,
  isLeaf,
} from '../../../models/gridColumnGrouping';
import { gridColumnGroupsLookupSelector } from './gridColumnGroupsSelector';
import { gridColumnLookupSelector } from '../columns/gridColumnsSelector';
import { GridColumnGroupLookup } from './gridColumnGroupsInterfaces';
import { GridColumnGroupingApi } from '../../../models/api/gridColumnGroupingApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridStateColDef, GridColDef } from '../../../models/colDef';

export function hasGroupPath(
  lookupElement: GridColDef | GridStateColDef,
): lookupElement is GridStateColDef {
  return (<GridStateColDef>lookupElement).groupPath !== undefined;
}

type UnwrappedGroupingModel = { [key: GridColDef['field']]: GridColumnGroup['groupId'][] };

// This is the recurrence function that help writing `unwrapGroupingColumnModel()`
const recurrentUnwrapGroupingColumnModel = (
  columnGroupNode: GridColumnNode,
  parents: GridColumnGroup['groupId'][],
  unwrappedGroupingModelToComplet: UnwrappedGroupingModel,
): void => {
  if (isLeaf(columnGroupNode)) {
    if (unwrappedGroupingModelToComplet[columnGroupNode.field] !== undefined) {
      throw new Error(
        [
          `MUI: columnGroupingModel contains duplicated field`,
          `column field ${columnGroupNode.field} occurrs two times in the grouping model:`,
          `- ${unwrappedGroupingModelToComplet[columnGroupNode.field].join(' > ')}`,
          `- ${parents.join(' > ')}`,
        ].join('\n'),
      );
    }
    unwrappedGroupingModelToComplet[columnGroupNode.field] = parents;
    return;
  }

  const { groupId, children } = columnGroupNode;
  children.forEach((child) => {
    recurrentUnwrapGroupingColumnModel(
      child,
      [...parents, groupId],
      unwrappedGroupingModelToComplet,
    );
  });
};

/**
 * This is a function that provide for each column the array of its parents.
 * Parents are ordered from the root to the leaf.
 * @param columnGroupingModel The model such as provided in DataGrid props
 * @returns An object `{[field]: groupIds}` where `groupIds` is the parents of the column `field`
 */
export const unwrapGroupingColumnModel = (
  columnGroupingModel?: GridColumnGroupingModel,
): UnwrappedGroupingModel => {
  if (!columnGroupingModel) {
    return {};
  }

  const unwrappedSubTree: UnwrappedGroupingModel = {};
  columnGroupingModel.forEach((columnGroupNode) => {
    recurrentUnwrapGroupingColumnModel(columnGroupNode, [], unwrappedSubTree);
  });

  return unwrappedSubTree;
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
        'MUI: An element of the columnGroupingModel does not have either `field` or `groupId`.',
      );
    }
    if (!children) {
      console.warn(`MUI: group groupId=${groupId} has no children.`);
    }
    const groupParam = { ...other, groupId };
    const subTreeLookup = createGroupLookup(children);
    if (subTreeLookup[groupId] !== undefined || groupLookup[groupId] !== undefined) {
      throw new Error(
        `MUI: The groupId ${groupId} is used multiple times in the columnGroupingModel.`,
      );
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
  props: Pick<DataGridProcessedProps, 'columnGroupingModel' | 'experimentalFeatures'>,
) => {
  /**
   * API METHODS
   */
  const getColumnGroupPath = React.useCallback<
    GridColumnGroupingApi['unstable_getColumnGroupPath']
  >(
    (field) => {
      const columnLookup = gridColumnLookupSelector(apiRef);

      return columnLookup[field]?.groupPath ?? [];
    },
    [apiRef],
  );

  const getAllGroupDetails = React.useCallback<
    GridColumnGroupingApi['unstable_getAllGroupDetails']
  >(() => {
    const columnGroupLookup = gridColumnGroupsLookupSelector(apiRef);
    return columnGroupLookup;
  }, [apiRef]);

  const columnGroupingApi: GridColumnGroupingApi = {
    unstable_getColumnGroupPath: getColumnGroupPath,
    unstable_getAllGroupDetails: getAllGroupDetails,
  };

  useGridApiMethod(apiRef, columnGroupingApi, 'GridColumnGroupingApi');

  /**
   * EFFECTS
   */
  // The effect does not track any value defined synchronously during the 1st render by hooks called after `useGridColumns`
  // As a consequence, the state generated by the 1st run of this useEffect will always be equal to the initialization one
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!props.experimentalFeatures?.columnGrouping) {
      return;
    }
    const groupLookup = createGroupLookup(props.columnGroupingModel ?? []);
    apiRef.current.setState((state) => ({
      ...state,
      columnGrouping: { ...state.columnGrouping, lookup: groupLookup },
    }));
  }, [apiRef, props.columnGroupingModel, props.experimentalFeatures?.columnGrouping]);
};
