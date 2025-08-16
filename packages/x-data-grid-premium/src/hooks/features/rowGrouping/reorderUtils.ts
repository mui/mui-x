import { GridRowId, GridTreeNode, GridGroupNode } from '@mui/x-data-grid'; // Adjust import as needed

type DropPosition = 'above' | 'below';
type DragDirection = 'up' | 'down';

export interface ReorderContext {
  sourceNode: GridTreeNode;
  targetNode: GridTreeNode;
  prevNode: GridTreeNode | null;
  nextNode: GridTreeNode | null;
  rowTree: Record<GridRowId, GridTreeNode>;
  dropPosition: DropPosition;
  dragDirection: DragDirection;
  targetRowIndex: number;
  sourceRowIndex: number;
  expandedSortedRowIndexLookup: Record<GridRowId, number>;
}

interface ValidationRule {
  name: string;
  applies: (ctx: ReorderContext) => boolean;
  isInvalid: (ctx: ReorderContext) => boolean;
  message?: string;
}

const conditions = {
  // Node type checks
  isGroupToGroup: (ctx: ReorderContext) =>
    ctx.sourceNode.type === 'group' && ctx.targetNode.type === 'group',

  isLeafToLeaf: (ctx: ReorderContext) =>
    ctx.sourceNode.type === 'leaf' && ctx.targetNode.type === 'leaf',

  isLeafToGroup: (ctx: ReorderContext) =>
    ctx.sourceNode.type === 'leaf' && ctx.targetNode.type === 'group',

  isGroupToLeaf: (ctx: ReorderContext) =>
    ctx.sourceNode.type === 'group' && ctx.targetNode.type === 'leaf',

  // Drop position checks
  isDropAbove: (ctx: ReorderContext) => ctx.dropPosition === 'above',
  isDropBelow: (ctx: ReorderContext) => ctx.dropPosition === 'below',

  // Depth checks
  sameDepth: (ctx: ReorderContext) => ctx.sourceNode.depth === ctx.targetNode.depth,

  sourceDepthGreater: (ctx: ReorderContext) => ctx.sourceNode.depth > ctx.targetNode.depth,

  targetDepthIsSourceMinusOne: (ctx: ReorderContext) =>
    ctx.targetNode.depth === ctx.sourceNode.depth - 1,

  // Parent checks
  sameParent: (ctx: ReorderContext) => ctx.sourceNode.parent === ctx.targetNode.parent,

  // Node state checks
  targetGroupExpanded: (ctx: ReorderContext) =>
    (ctx.targetNode.type === 'group' && (ctx.targetNode as GridGroupNode).childrenExpanded) ??
    false,

  targetGroupCollapsed: (ctx: ReorderContext) =>
    ctx.targetNode.type === 'group' && !(ctx.targetNode as GridGroupNode).childrenExpanded,

  // Previous/Next node checks
  hasPrevNode: (ctx: ReorderContext) => ctx.prevNode !== null,
  hasNextNode: (ctx: ReorderContext) => ctx.nextNode !== null,

  prevIsLeaf: (ctx: ReorderContext) => ctx.prevNode?.type === 'leaf',
  prevIsGroup: (ctx: ReorderContext) => ctx.prevNode?.type === 'group',
  nextIsLeaf: (ctx: ReorderContext) => ctx.nextNode?.type === 'leaf',
  nextIsGroup: (ctx: ReorderContext) => ctx.nextNode?.type === 'group',

  prevDepthEquals: (ctx: ReorderContext, depth: number) => ctx.prevNode?.depth === depth,

  prevDepthEqualsSource: (ctx: ReorderContext) => ctx.prevNode?.depth === ctx.sourceNode.depth,

  // Complex checks
  prevBelongsToSource: (ctx: ReorderContext) => {
    if (!ctx.prevNode) {
      return false;
    }
    // Check if prevNode.parent OR any of its ancestors === sourceNode.id
    let currentId = ctx.prevNode.parent;
    while (currentId) {
      if (currentId === ctx.sourceNode.id) {
        return true;
      }
      const node = ctx.rowTree[currentId];
      if (!node) {
        break;
      }
      currentId = node.parent;
    }
    return false;
  },

  // Position checks
  isAdjacentPosition: (ctx: ReorderContext) => {
    const { sourceRowIndex, targetRowIndex, dropPosition } = ctx;
    return (
      (dropPosition === 'above' && targetRowIndex === sourceRowIndex + 1) ||
      (dropPosition === 'below' && targetRowIndex === sourceRowIndex - 1)
    );
  },

  // First child check
  targetFirstChildIsGroupWithSourceDepth: (ctx: ReorderContext) => {
    if (ctx.targetNode.type !== 'group') {
      return false;
    }
    const targetGroup = ctx.targetNode as GridGroupNode;
    const firstChild = targetGroup.children?.[0] ? ctx.rowTree[targetGroup.children[0]] : null;
    return firstChild?.type === 'group' && firstChild.depth === ctx.sourceNode.depth;
  },

  targetFirstChildDepthEqualsSource: (ctx: ReorderContext) => {
    if (ctx.targetNode.type !== 'group') {
      return false;
    }
    const targetGroup = ctx.targetNode as GridGroupNode;
    const firstChild = targetGroup.children?.[0] ? ctx.rowTree[targetGroup.children[0]] : null;
    return firstChild ? firstChild.depth === ctx.sourceNode.depth : false;
  },
};

const validationRules: ValidationRule[] = [
  // ===== Basic invalid cases =====
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
    name: 'group-to-group-above-different-parent',
    applies: (ctx) =>
      conditions.isGroupToGroup(ctx) &&
      conditions.isDropAbove(ctx) &&
      conditions.prevIsGroup(ctx) &&
      conditions.prevDepthEqualsSource(ctx) &&
      conditions.targetGroupExpanded(ctx),
    isInvalid: (ctx) => ctx.prevNode!.parent !== ctx.sourceNode.parent,
    message: 'Cannot reorder groups with different parents',
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

class RowReorderValidator {
  private rules: ValidationRule[];

  private debugMode: boolean;

  constructor(rules: ValidationRule[] = validationRules, debugMode = false) {
    this.rules = rules;
    this.debugMode = debugMode;
  }

  addRule(rule: ValidationRule): void {
    this.rules.push(rule);
  }

  removeRule(ruleName: string): void {
    this.rules = this.rules.filter((r) => r.name !== ruleName);
  }

  validate(context: ReorderContext): boolean {
    // Check all validation rules
    for (const rule of this.rules) {
      if (rule.applies(context)) {
        if (rule.isInvalid(context)) {
          if (this.debugMode) {
            // eslint-disable-next-line no-console
            console.log(`Validation failed - Rule: ${rule.name}`, rule.message);
          }
          return false;
        }
      }
    }

    return true;
  }
}

export const rowGroupingReorderValidator = new RowReorderValidator(
  validationRules,
  process.env.NODE_ENV === 'development',
);
