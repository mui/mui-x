import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import {
  GridColumnGroupingModel,
  GridColumnNode,
  GridColumnGroup,
  isLeaf,
} from '../../../models/gridColumnGrouping';
import { GridColDef } from '../../../models/colDef';
import { GridGroupingStructure } from './gridColumnGroupsInterfaces';

type UnwrappedGroupingModel = { [key: GridColDef['field']]: GridColumnGroup['groupId'][] };

// This is the recurrence function that help writing `unwrapGroupingColumnModel()`
const recurrentUnwrapGroupingColumnModel = (
  columnGroupNode: GridColumnNode,
  parents: GridColumnGroup['groupId'][],
  unwrappedGroupingModelToComplete: UnwrappedGroupingModel,
): void => {
  if (isLeaf(columnGroupNode)) {
    if (unwrappedGroupingModelToComplete[columnGroupNode.field] !== undefined) {
      throw new Error(
        [
          `MUI X: columnGroupingModel contains duplicated field`,
          `column field ${columnGroupNode.field} occurs two times in the grouping model:`,
          `- ${unwrappedGroupingModelToComplete[columnGroupNode.field].join(' > ')}`,
          `- ${parents.join(' > ')}`,
        ].join('\n'),
      );
    }
    unwrappedGroupingModelToComplete[columnGroupNode.field] = parents;
    return;
  }

  const { groupId, children } = columnGroupNode;
  children.forEach((child) => {
    recurrentUnwrapGroupingColumnModel(
      child,
      [...parents, groupId],
      unwrappedGroupingModelToComplete,
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

export const getColumnGroupsHeaderStructure = (
  orderedColumns: string[],
  unwrappedGroupingModel: UnwrappedGroupingModel,
  pinnedFields: { right?: string[]; left?: string[] },
) => {
  const getParents = (field: string) => unwrappedGroupingModel[field] ?? [];

  const groupingHeaderStructure: GridGroupingStructure[][] = [];
  const maxDepth = Math.max(...orderedColumns.map((field) => getParents(field).length));

  const haveSameParents = (field1: string, field2: string, depth: number) =>
    isDeepEqual(getParents(field1).slice(0, depth + 1), getParents(field2).slice(0, depth + 1));

  const haveDifferentContainers = (field1: string, field2: string) => {
    if (
      pinnedFields?.left &&
      pinnedFields.left.includes(field1) &&
      !pinnedFields.left.includes(field2)
    ) {
      return true;
    }
    if (
      pinnedFields?.right &&
      !pinnedFields.right.includes(field1) &&
      pinnedFields.right.includes(field2)
    ) {
      return true;
    }
    return false;
  };

  for (let depth = 0; depth < maxDepth; depth += 1) {
    const depthStructure: GridGroupingStructure[] = [];

    for (let i = 0; i < orderedColumns.length; i += 1) {
      const newField = orderedColumns[i];
      const groupId = getParents(newField)[depth] ?? null;

      if (depthStructure.length === 0) {
        depthStructure.push({
          columnFields: [newField],
          groupId,
        });
        continue;
      }

      const lastGroup = depthStructure[depthStructure.length - 1];
      const prevField = lastGroup.columnFields[lastGroup.columnFields.length - 1];
      const prevGroupId = lastGroup.groupId;

      if (
        prevGroupId !== groupId ||
        !haveSameParents(prevField, newField, depth) ||
        // Fix for https://github.com/mui/mui-x/issues/7041
        haveDifferentContainers(prevField, newField)
      ) {
        // It's a new group
        depthStructure.push({
          columnFields: [newField],
          groupId,
        });
      } else {
        // Extend the previous group
        lastGroup.columnFields.push(newField);
      }
    }
    groupingHeaderStructure.push(depthStructure);
  }

  return groupingHeaderStructure;
};
