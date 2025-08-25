"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNullablePickerRangePositionContext = useNullablePickerRangePositionContext;
var React = require("react");
var usePickerRangePositionContext_1 = require("../../hooks/usePickerRangePositionContext");
/**
 * Returns information about the range position of the picker that wraps the current component.
 * If no picker wraps the current component, returns `null`.
 */
function useNullablePickerRangePositionContext() {
    return React.useContext(usePickerRangePositionContext_1.PickerRangePositionContext);
}
