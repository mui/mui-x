"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsWatermark = ChartsWatermark;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var ReactDOM = require("react-dom");
var internals_1 = require("@mui/x-license/internals");
var hooks_1 = require("../hooks");
function ChartsWatermark(props) {
    var layerContainerRef = (0, hooks_1.useChartsLayerContainerRef)();
    if (!layerContainerRef.current) {
        return (0, jsx_runtime_1.jsx)(internals_1.Watermark, { packageInfo: props.packageInfo });
    }
    return ReactDOM.createPortal((0, jsx_runtime_1.jsx)(internals_1.Watermark, { packageInfo: props.packageInfo }), layerContainerRef.current);
}
