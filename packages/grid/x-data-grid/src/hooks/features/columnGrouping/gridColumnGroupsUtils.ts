import {
  GridColumnGroupingModel,
  GridColumnNode,
  GridColumnGroup,
  isLeaf,
} from '../../../models/gridColumnGrouping';
import { GridColDef, GridStateColDef } from '../../../models/colDef';

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