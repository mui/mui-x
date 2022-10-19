import {
  GridColumnGroupingModel,
  GridColumnNode,
  GridColumnGroup,
  isLeaf,
} from '../../../models/gridColumnGrouping';
import { GridColDef } from '../../../models/colDef';
import { isDeepEqual } from '../../../utils/utils';
import { GridGroupingStructure } from './gridColumnGroupsInterfaces';

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

export const getColumnGroupsHeaderStructure = (
  orderedColumns: string[],
  unwrappedGroupingModel: UnwrappedGroupingModel,
) => {
  const getParents = (field: string) => unwrappedGroupingModel[field] ?? [];

  const groupingHeaderStructure: GridGroupingStructure[][] = [];
  const maxDepth = Math.max(...orderedColumns.map((field) => getParents(field).length));

  const haveSameParents = (field1: string, field2: string, depth: number) =>
    isDeepEqual(getParents(field1).slice(0, depth + 1), getParents(field2).slice(0, depth + 1));

  for (let depth = 0; depth < maxDepth; depth += 1) {
    const depthStructure = orderedColumns.reduce((structure, newField) => {
      const groupId = getParents(newField)[depth] ?? null;
      if (structure.length === 0) {
        return [
          {
            columnFields: [newField],
            groupId,
          },
        ];
      }

      const lastGroup = structure[structure.length - 1];
      const prevField = lastGroup.columnFields[lastGroup.columnFields.length - 1];
      const prevGroupId = lastGroup.groupId;

      if (prevGroupId !== groupId || !haveSameParents(prevField, newField, depth)) {
        // It's a new group
        return [
          ...structure,
          {
            columnFields: [newField],
            groupId,
          },
        ];
      }

      // It extends the previous group
      return [
        ...structure.slice(0, structure.length - 1),
        {
          columnFields: [...lastGroup.columnFields, newField],
          groupId,
        },
      ];
    }, [] as GridGroupingStructure[]);
    groupingHeaderStructure.push(depthStructure);
  }

  return groupingHeaderStructure;
};
