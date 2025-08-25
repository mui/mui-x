"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleTreeViewClasses = void 0;
exports.getSimpleTreeViewUtilityClass = getSimpleTreeViewUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getSimpleTreeViewUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiSimpleTreeView', slot);
}
exports.simpleTreeViewClasses = (0, generateUtilityClasses_1.default)('MuiSimpleTreeView', [
    'root',
    'item',
    'itemContent',
    'itemGroupTransition',
    'itemIconContainer',
    'itemLabel',
    'itemCheckbox',
]);
