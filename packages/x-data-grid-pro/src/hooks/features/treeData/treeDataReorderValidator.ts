import { RowReorderValidator, type ValidationRule } from '../rowReorder/reorderValidator';
import { commonReorderConditions as conditions } from '../rowReorder/commonReorderConditions';

const validationRules: ValidationRule[] = [
  {
    name: 'same-position',
    applies: (ctx) => ctx.sourceRowIndex === ctx.targetRowIndex,
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
    applies: conditions.isGroupToLeaf,
    isInvalid: (ctx) => {
      // check if the target is a descendent of the source
      // 1. Direct child case
      if (ctx.targetNode.parent === ctx.sourceNode.id) {
        return true;
      }
      // 2. Nested child
      let currentNode = ctx.targetNode;
      while (currentNode.parent) {
        currentNode = ctx.rowTree[currentNode.parent];
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
