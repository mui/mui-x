"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSankeyIsFaded = createSankeyIsFaded;
var createIsHighlighted_1 = require("./createIsHighlighted");
var DEFAULT_FADE = 'none';
function alwaysFalse() {
    return false;
}
function createSankeyIsFaded(highlightScope, highlightedItem) {
    var _a, _b, _c, _d;
    if (!highlightedItem) {
        return alwaysFalse;
    }
    var nodeFade = (_b = (_a = highlightScope === null || highlightScope === void 0 ? void 0 : highlightScope.nodes) === null || _a === void 0 ? void 0 : _a.fade) !== null && _b !== void 0 ? _b : DEFAULT_FADE;
    var linkFade = (_d = (_c = highlightScope === null || highlightScope === void 0 ? void 0 : highlightScope.links) === null || _c === void 0 ? void 0 : _c.fade) !== null && _d !== void 0 ? _d : DEFAULT_FADE;
    var isHighlighted = (0, createIsHighlighted_1.createSankeyIsHighlighted)(highlightScope, highlightedItem);
    return function isFaded(item) {
        if (!item || item.type !== 'sankey') {
            return false;
        }
        if (isHighlighted(item)) {
            return false;
        }
        var fadeMode = highlightedItem.subType === 'node' ? nodeFade : linkFade;
        return fadeMode === 'global';
    };
}
