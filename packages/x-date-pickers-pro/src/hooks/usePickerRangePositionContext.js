"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickerRangePositionContext = void 0;
exports.usePickerRangePositionContext = usePickerRangePositionContext;
var React = require("react");
exports.PickerRangePositionContext = React.createContext(null);
/**
 * Returns information about the range position of the picker that wraps the current component.
 */
function usePickerRangePositionContext() {
    var value = React.useContext(exports.PickerRangePositionContext);
    if (value == null) {
        throw new Error([
            'MUI X: The `usePickerRangePositionContext` can only be called in components that are used inside a picker component',
        ].join('\n'));
    }
    return value;
}
