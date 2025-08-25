"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickerFieldPrivateContext = void 0;
exports.useNullableFieldPrivateContext = useNullableFieldPrivateContext;
var React = require("react");
exports.PickerFieldPrivateContext = React.createContext(null);
function useNullableFieldPrivateContext() {
    return React.useContext(exports.PickerFieldPrivateContext);
}
