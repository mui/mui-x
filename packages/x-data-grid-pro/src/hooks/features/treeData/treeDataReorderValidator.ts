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
    name: 'over-position',
    applies: (ctx) => ctx.dropPosition === 'over',
    isInvalid: (ctx) => ctx.targetNode.type !== 'leaf',
    message: 'Cannot drop over a non leaf node',
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
  {
    name: 'drop-on-leaf-descendant-check',
    applies: (ctx) =>
      ctx.dropPosition === 'over' &&
      ctx.targetNode.type === 'leaf' &&
      ctx.sourceNode.type === 'group',
    isInvalid: (ctx) => {
      // Prevent dropping a group over one of its own descendant leaves
      let currentNode = ctx.targetNode;
      while (currentNode.parent) {
        currentNode = ctx.rowTree[currentNode.parent];
        if (currentNode.id === ctx.sourceNode.id) {
          return true;
        }
      }
      return false;
    },
    message: 'Cannot drop group over one of its descendant leaves',
  },
];

export const treeDataReorderValidator = new RowReorderValidator(validationRules);
