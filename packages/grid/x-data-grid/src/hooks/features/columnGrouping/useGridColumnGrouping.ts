import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import {
  GridColumnGroupingModel,
  GridColumnNode,
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

type UnwrappedGroupingModel = { [key: string]: string[] };

// This is the recurrence function that help writing `unwrapGroupingColumnModel()`
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
            `MUI: columnGroupingModel contains duplicated field`,
            `column field ${key} occurrs two times in the grouping model:`,
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

  const rep: UnwrappedGroupingModel = {};

  columnGroupingModel.forEach((columnGroupNode) => {
    const unwrappedSubTree = recurrentUnwrapGroupingColumnModel(columnGroupNode, []);
    Object.entries(unwrappedSubTree).forEach(([key, value]) => {
      if (rep[key] !== undefined) {
        throw new Error(
          [
            `MUI: columnGroupingModel has duplicated field.`,
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
        'MUI: An element of the columnGroupingModel does not have either `field` or `groupId`',
      );
    }
    if (!children) {
      console.warn(`MUI: group groupId=${groupId} has no children. `);
    }
    const groupParam = { ...other, groupId };
    const subTreeLookup = createGroupLookup(children);
    if (subTreeLookup[groupId] !== undefined || groupLookup[groupId] !== undefined) {
      throw new Error(
        `MUI: The groupId ${groupId} is used multiple times in the columnGroupingModel`,
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
  // The effect do not track any value defined synchronously during the 1st render by hooks called after `useGridColumns`
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
