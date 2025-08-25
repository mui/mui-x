"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.treeItemClasses = void 0;
exports.getTreeItemUtilityClass = getTreeItemUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getTreeItemUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiTreeItem', slot);
}
exports.treeItemClasses = (0, generateUtilityClasses_1.default)('MuiTreeItem', [
    'root',
    'content',
    'groupTransition',
    'iconContainer',
    'label',
    'checkbox',
    'labelInput',
    'dragAndDropOverlay',
    'errorIcon',
    'loadingIcon',
    // State classes, will be replaced by data-attrs in the next major
    'expanded',
    'selected',
    'focused',
    'disabled',
    'editable',
    'editing',
]);
