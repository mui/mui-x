"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTimeGridColumnPlaceholder = useTimeGridColumnPlaceholder;
var TimeGridColumnPlaceholderContext_1 = require("../column/TimeGridColumnPlaceholderContext");
function useTimeGridColumnPlaceholder() {
    return (0, TimeGridColumnPlaceholderContext_1.useTimeGridColumnPlaceholderContext)().placeholder;
}
