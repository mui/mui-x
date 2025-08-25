"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePickerPrivateContext = void 0;
var React = require("react");
var PickerProvider_1 = require("../components/PickerProvider");
/**
 * Returns the private context passed by the Picker wrapping the current component.
 */
var usePickerPrivateContext = function () { return React.useContext(PickerProvider_1.PickerPrivateContext); };
exports.usePickerPrivateContext = usePickerPrivateContext;
