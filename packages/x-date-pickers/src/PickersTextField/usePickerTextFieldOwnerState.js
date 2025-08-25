"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePickerTextFieldOwnerState = exports.PickerTextFieldOwnerStateContext = void 0;
var React = require("react");
exports.PickerTextFieldOwnerStateContext = React.createContext(null);
var usePickerTextFieldOwnerState = function () {
    var value = React.useContext(exports.PickerTextFieldOwnerStateContext);
    if (value == null) {
        throw new Error([
            'MUI X: The `usePickerTextFieldOwnerState` can only be called in components that are used inside a PickerTextField component',
        ].join('\n'));
    }
    return value;
};
exports.usePickerTextFieldOwnerState = usePickerTextFieldOwnerState;
