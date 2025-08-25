"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePickerContext = exports.PickerContext = void 0;
var React = require("react");
exports.PickerContext = React.createContext(null);
/**
 * Returns the context passed by the Picker wrapping the current component.
 */
var usePickerContext = function () {
    var value = React.useContext(exports.PickerContext);
    if (value == null) {
        throw new Error('MUI X: The `usePickerContext` hook can only be called inside the context of a Picker component');
    }
    return value;
};
exports.usePickerContext = usePickerContext;
