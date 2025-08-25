"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpansionTrigger = void 0;
var getExpansionTrigger = function (_a) {
    var isItemEditable = _a.isItemEditable, expansionTrigger = _a.expansionTrigger;
    if (expansionTrigger) {
        return expansionTrigger;
    }
    if (isItemEditable) {
        return 'iconContainer';
    }
    return 'content';
};
exports.getExpansionTrigger = getExpansionTrigger;
