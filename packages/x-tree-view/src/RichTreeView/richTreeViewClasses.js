"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.richTreeViewClasses = void 0;
exports.getRichTreeViewUtilityClass = getRichTreeViewUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getRichTreeViewUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiRichTreeView', slot);
}
exports.richTreeViewClasses = (0, generateUtilityClasses_1.default)('MuiRichTreeView', [
    'root',
    'item',
    'itemContent',
    'itemGroupTransition',
    'itemIconContainer',
    'itemLabel',
    'itemCheckbox',
    'itemLabelInput',
]);
