"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.richTreeViewProClasses = void 0;
exports.getRichTreeViewProUtilityClass = getRichTreeViewProUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getRichTreeViewProUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiRichTreeViewPro', slot);
}
exports.richTreeViewProClasses = (0, generateUtilityClasses_1.default)('MuiRichTreeViewPro', [
    'root',
    'item',
    'itemContent',
    'itemGroupTransition',
    'itemIconContainer',
    'itemLabel',
    'itemCheckbox',
    'itemLabelInput',
    'itemDragAndDropOverlay',
    'itemErrorIcon',
    'itemLoadingIcon',
]);
