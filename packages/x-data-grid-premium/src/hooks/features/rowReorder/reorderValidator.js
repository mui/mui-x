"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rowGroupingReorderValidator = void 0;
var utils_1 = require("./utils");
var validationRules = [
    // ===== Basic invalid cases =====
    {
        name: 'same-position',
        applies: function (ctx) { return ctx.sourceRowIndex === ctx.targetRowIndex; },
        isInvalid: function () { return true; },
        message: 'Source and target are the same',
    },
    {
        name: 'adjacent-position',
        applies: function (ctx) { return utils_1.conditions.isAdjacentPosition(ctx); },
        isInvalid: function () { return true; },
        message: 'Source and target are adjacent',
    },
    {
        name: 'group-to-leaf',
        applies: utils_1.conditions.isGroupToLeaf,
        isInvalid: function () { return true; },
        message: 'Cannot drop group on leaf',
    },
    // ===== Group to Group Rules =====
    {
        name: 'group-to-group-above-leaf-belongs-to-source',
        applies: function (ctx) {
            return utils_1.conditions.isGroupToGroup(ctx) && utils_1.conditions.isDropAbove(ctx) && utils_1.conditions.prevIsLeaf(ctx);
        },
        isInvalid: utils_1.conditions.prevBelongsToSource,
        message: 'Previous leaf belongs to source group or its descendants',
    },
    {
        name: 'group-to-group-above-invalid-depth',
        applies: function (ctx) {
            return utils_1.conditions.isGroupToGroup(ctx) &&
                utils_1.conditions.isDropAbove(ctx) &&
                !utils_1.conditions.sameDepth(ctx) &&
                !(ctx.targetNode.depth < ctx.sourceNode.depth &&
                    (utils_1.conditions.prevIsLeaf(ctx) ||
                        (utils_1.conditions.prevIsGroup(ctx) && utils_1.conditions.prevDepthEqualsSource(ctx))));
        },
        isInvalid: function () { return true; },
        message: 'Invalid depth configuration for group above group',
    },
    {
        name: 'group-to-group-above-different-parent-depth',
        applies: function (ctx) {
            return utils_1.conditions.isGroupToGroup(ctx) &&
                utils_1.conditions.isDropAbove(ctx) &&
                utils_1.conditions.prevIsGroup(ctx) &&
                utils_1.conditions.prevDepthEqualsSource(ctx) &&
                utils_1.conditions.targetGroupExpanded(ctx);
        },
        isInvalid: function (ctx) { return ctx.prevNode.depth !== ctx.sourceNode.depth; },
        message: 'Cannot reorder groups with different depths',
    },
    {
        name: 'group-to-group-below-invalid-config',
        applies: function (ctx) { return utils_1.conditions.isGroupToGroup(ctx) && utils_1.conditions.isDropBelow(ctx); },
        isInvalid: function (ctx) {
            // Valid case 1: Same depth and target not expanded
            if (utils_1.conditions.sameDepth(ctx) && utils_1.conditions.targetGroupCollapsed(ctx)) {
                return false;
            }
            // Valid case 2: Target is parent level, expanded, with compatible first child
            if (utils_1.conditions.targetDepthIsSourceMinusOne(ctx) &&
                utils_1.conditions.targetGroupExpanded(ctx) &&
                utils_1.conditions.targetFirstChildIsGroupWithSourceDepth(ctx)) {
                return false;
            }
            return true;
        },
        message: 'Invalid group below group configuration',
    },
    // ===== Leaf to Leaf Rules =====
    {
        name: 'leaf-to-leaf-different-depth',
        applies: function (ctx) { return utils_1.conditions.isLeafToLeaf(ctx) && !utils_1.conditions.sameDepth(ctx); },
        isInvalid: function () { return true; },
        message: 'Leaves at different depths cannot be reordered',
    },
    {
        name: 'leaf-to-leaf-invalid-below',
        applies: function (ctx) {
            return utils_1.conditions.isLeafToLeaf(ctx) &&
                utils_1.conditions.sameDepth(ctx) &&
                !utils_1.conditions.sameParent(ctx) &&
                utils_1.conditions.isDropBelow(ctx);
        },
        isInvalid: function (ctx) {
            return !(utils_1.conditions.nextIsGroup(ctx) && ctx.sourceNode.depth > ctx.nextNode.depth) &&
                !utils_1.conditions.nextIsLeaf(ctx);
        },
        message: 'Invalid leaf below leaf configuration',
    },
    // ===== Leaf to Group Rules =====
    {
        name: 'leaf-to-group-above-no-prev-leaf',
        applies: function (ctx) { return utils_1.conditions.isLeafToGroup(ctx) && utils_1.conditions.isDropAbove(ctx); },
        isInvalid: function (ctx) { return !utils_1.conditions.hasPrevNode(ctx) || !utils_1.conditions.prevIsLeaf(ctx); },
        message: 'No valid previous leaf for leaf above group',
    },
    {
        name: 'leaf-to-group-above-depth-mismatch',
        applies: function (ctx) {
            return utils_1.conditions.isLeafToGroup(ctx) &&
                utils_1.conditions.isDropAbove(ctx) &&
                utils_1.conditions.prevIsLeaf(ctx) &&
                !(ctx.sourceNode.depth > ctx.targetNode.depth && ctx.targetNode.depth === 0);
        },
        isInvalid: function (ctx) { return ctx.prevNode.depth !== ctx.sourceNode.depth; },
        message: 'Previous node depth mismatch for leaf above group',
    },
    {
        name: 'leaf-to-group-below-collapsed',
        applies: function (ctx) { return utils_1.conditions.isLeafToGroup(ctx) && utils_1.conditions.isDropBelow(ctx); },
        isInvalid: utils_1.conditions.targetGroupCollapsed,
        message: 'Cannot drop below collapsed group',
    },
    {
        name: 'leaf-to-group-below-invalid-depth',
        applies: function (ctx) {
            return utils_1.conditions.isLeafToGroup(ctx) &&
                utils_1.conditions.isDropBelow(ctx) &&
                utils_1.conditions.targetGroupExpanded(ctx);
        },
        isInvalid: function (ctx) {
            // Valid case 1: Target is parent level
            if (ctx.sourceNode.depth > ctx.targetNode.depth &&
                ctx.targetNode.depth === ctx.sourceNode.depth - 1) {
                return false;
            }
            // Valid case 2: First child has same depth as source
            if (utils_1.conditions.targetFirstChildDepthEqualsSource(ctx)) {
                return false;
            }
            return true;
        },
        message: 'Invalid depth configuration for leaf below group',
    },
];
var RowReorderValidator = /** @class */ (function () {
    function RowReorderValidator(rules) {
        if (rules === void 0) { rules = validationRules; }
        this.rules = rules;
    }
    RowReorderValidator.prototype.addRule = function (rule) {
        this.rules.push(rule);
    };
    RowReorderValidator.prototype.removeRule = function (ruleName) {
        this.rules = this.rules.filter(function (r) { return r.name !== ruleName; });
    };
    RowReorderValidator.prototype.validate = function (context) {
        // Check all validation rules
        for (var _i = 0, _a = this.rules; _i < _a.length; _i++) {
            var rule = _a[_i];
            if (rule.applies(context) && rule.isInvalid(context)) {
                return false;
            }
        }
        return true;
    };
    return RowReorderValidator;
}());
exports.rowGroupingReorderValidator = new RowReorderValidator(validationRules);
