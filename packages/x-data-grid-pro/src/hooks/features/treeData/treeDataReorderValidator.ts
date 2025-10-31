import { gridExpandedSortedRowIndexLookupSelector, gridRowTreeSelector } from '@mui/x-data-grid';
import { RowReorderValidator, type ValidationRule } from '../rowReorder/reorderValidator';
import { commonReorderConditions as conditions } from '../rowReorder/commonReorderConditions';

const validationRules: ValidationRule[] = [
  {
    name: 'same-position',
    applies: (ctx) =>
      gridExpandedSortedRowIndexLookupSelector(ctx.apiRef)[ctx.sourceNode.id] ===
      gridExpandedSortedRowIndexLookupSelector(ctx.apiRef)[ctx.targetNode.id],
    isInvalid: () => true,
    message: 'Source and target are the same',
  },
  {
    name: 'adjacent-position',
    applies: (ctx) => conditions.isAdjacentPosition(ctx),
    isInvalid: () => true,
    message: 'Source and target are adjacent',
  },
  {
    name: 'group-to-leaf',
    applies: (ctx) => conditions.isGroupToLeaf(ctx) || conditions.isGroupToGroup(ctx),
    isInvalid: (ctx) => {
      let currentNode = ctx.targetNode;
      const rowTree = gridRowTreeSelector(ctx.apiRef);
      while (currentNode.parent) {
        currentNode = rowTree[currentNode.parent];
        if (currentNode.id === ctx.sourceNode.id) {
          return true;
        }
      }
      return false;
    },
    message: 'Cannot drop group on one of its descendents',
  },
  {
    name: 'group-to-group-above-leaf-belongs-to-source',
    applies: (ctx) =>
      conditions.isGroupToGroup(ctx) && conditions.isDropAbove(ctx) && conditions.prevIsLeaf(ctx),
    isInvalid: conditions.prevBelongsToSource,
    message: 'Previous leaf belongs to source group or its descendants',
  },
  {
    name: 'leaf-to-group-below-collapsed',
    applies: (ctx) => conditions.isLeafToGroup(ctx) && conditions.isDropBelow(ctx),
    isInvalid: conditions.targetGroupCollapsed,
    message: 'Cannot drop below collapsed group',
  },
];

export const treeDataReorderValidator = new RowReorderValidator(validationRules);
