"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidValueContext = void 0;
exports.useIsValidValue = useIsValidValue;
var React = require("react");
exports.IsValidValueContext = React.createContext(function () { return true; });
/**
 * Returns a function to check if a value is valid according to the validation props passed to the parent Picker.
 */
function useIsValidValue() {
    return React.useContext(exports.IsValidValueContext);
}
