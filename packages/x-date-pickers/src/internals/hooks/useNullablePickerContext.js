"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNullablePickerContext = void 0;
var React = require("react");
var usePickerContext_1 = require("../../hooks/usePickerContext");
/**
 * Returns the context passed by the Picker wrapping the current component.
 * If the context is not found, returns `null`.
 */
var useNullablePickerContext = function () { return React.useContext(usePickerContext_1.PickerContext); };
exports.useNullablePickerContext = useNullablePickerContext;
