import {
  commonReorderConditions as conditions,
  RowReorderValidator,
  type ValidationRule,
} from '@mui/x-data-grid-pro/internals';

const validationRules: ValidationRule[] = [
  // ===== Basic invalid cases =====
  {
    name: 'same-position',
    applies: (ctx) => ctx.sourceNode.id === ctx.targetNode.id,
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
    isInvalid: () => true,
    message: 'Cannot drop group on leaf',
  },

  // ===== Group to Group Rules =====
  {
    name: 'group-to-group-above-leaf-belongs-to-source',
    applies: (ctx) =>
      conditions.isGroupToGroup(ctx) && conditions.isDropAbove(ctx) && conditions.prevIsLeaf(ctx),
    isInvalid: conditions.prevBelongsToSource,
    message: 'Previous leaf belongs to source group or its descendants',
  },

  {
    name: 'group-to-group-above-invalid-depth',
    applies: (ctx) =>
      conditions.isGroupToGroup(ctx) &&
      conditions.isDropAbove(ctx) &&
      !conditions.sameDepth(ctx) &&
      !(
        ctx.targetNode.depth < ctx.sourceNode.depth &&
        (conditions.prevIsLeaf(ctx) ||
          (conditions.prevIsGroup(ctx) && conditions.prevDepthEqualsSource(ctx)))
      ),
    isInvalid: () => true,
    message: 'Invalid depth configuration for group above group',
  },

  {
    name: 'group-to-group-above-different-parent-depth',
    applies: (ctx) =>
      conditions.isGroupToGroup(ctx) &&
      conditions.isDropAbove(ctx) &&
      conditions.prevIsGroup(ctx) &&
      conditions.prevDepthEqualsSource(ctx) &&
      conditions.targetGroupExpanded(ctx),
    isInvalid: (ctx) => ctx.prevNode!.depth !== ctx.sourceNode.depth,
    message: 'Cannot reorder groups with different depths',
  },

  {
    name: 'group-to-group-below-invalid-config',
    applies: (ctx) => conditions.isGroupToGroup(ctx) && conditions.isDropBelow(ctx),
    isInvalid: (ctx) => {
      // Valid case 1: Same depth and target not expanded
      if (conditions.sameDepth(ctx) && conditions.targetGroupCollapsed(ctx)) {
        return false;
      }
      // Valid case 2: Target is parent level, expanded, with compatible first child
      if (
        conditions.targetDepthIsSourceMinusOne(ctx) &&
        conditions.targetGroupExpanded(ctx) &&
        conditions.targetFirstChildIsGroupWithSourceDepth(ctx)
      ) {
        return false;
      }
      return true;
    },
    message: 'Invalid group below group configuration',
  },

  // ===== Leaf to Leaf Rules =====
  {
    name: 'leaf-to-leaf-different-depth',
    applies: (ctx) => conditions.isLeafToLeaf(ctx) && !conditions.sameDepth(ctx),
    isInvalid: () => true,
    message: 'Leaves at different depths cannot be reordered',
  },

  {
    name: 'leaf-to-leaf-invalid-below',
    applies: (ctx) =>
      conditions.isLeafToLeaf(ctx) &&
      conditions.sameDepth(ctx) &&
      !conditions.sameParent(ctx) &&
      conditions.isDropBelow(ctx),
    isInvalid: (ctx) =>
      !(conditions.nextIsGroup(ctx) && ctx.sourceNode.depth > ctx.nextNode!.depth) &&
      !conditions.nextIsLeaf(ctx),
    message: 'Invalid leaf below leaf configuration',
  },

  // ===== Leaf to Group Rules =====
  {
    name: 'leaf-to-group-above-no-prev-leaf',
    applies: (ctx) => conditions.isLeafToGroup(ctx) && conditions.isDropAbove(ctx),
    isInvalid: (ctx) => !conditions.hasPrevNode(ctx) || !conditions.prevIsLeaf(ctx),
    message: 'No valid previous leaf for leaf above group',
  },

  {
    name: 'leaf-to-group-above-depth-mismatch',
    applies: (ctx) =>
      conditions.isLeafToGroup(ctx) &&
      conditions.isDropAbove(ctx) &&
      conditions.prevIsLeaf(ctx) &&
      !(ctx.sourceNode.depth > ctx.targetNode.depth && ctx.targetNode.depth === 0),
    isInvalid: (ctx) => ctx.prevNode!.depth !== ctx.sourceNode.depth,
    message: 'Previous node depth mismatch for leaf above group',
  },

  {
    name: 'leaf-to-group-below-collapsed',
    applies: (ctx) => conditions.isLeafToGroup(ctx) && conditions.isDropBelow(ctx),
    isInvalid: conditions.targetGroupCollapsed,
    message: 'Cannot drop below collapsed group',
  },

  {
    name: 'leaf-to-group-below-invalid-depth',
    applies: (ctx) =>
      conditions.isLeafToGroup(ctx) &&
      conditions.isDropBelow(ctx) &&
      conditions.targetGroupExpanded(ctx),
    isInvalid: (ctx) => {
      // Valid case 1: Target is parent level
      if (
        ctx.sourceNode.depth > ctx.targetNode.depth &&
        ctx.targetNode.depth === ctx.sourceNode.depth - 1
      ) {
        return false;
      }
      // Valid case 2: First child has same depth as source
      if (conditions.targetFirstChildDepthEqualsSource(ctx)) {
        return false;
      }
      return true;
    },
    message: 'Invalid depth configuration for leaf below group',
  },
];

export const rowGroupingReorderValidator = new RowReorderValidator(validationRules);
