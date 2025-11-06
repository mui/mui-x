"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridChartsPanelData = GridChartsPanelData;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var GridChartsPanelDataBody_1 = require("./GridChartsPanelDataBody");
var GridChartsPanelDataHeader_1 = require("./GridChartsPanelDataHeader");
function GridChartsPanelData() {
    var _a = React.useState(''), searchValue = _a[0], setSearchValue = _a[1];
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(GridChartsPanelDataHeader_1.GridChartsPanelDataHeader, { searchValue: searchValue, onSearchValueChange: setSearchValue }), (0, jsx_runtime_1.jsx)(GridChartsPanelDataBody_1.GridChartsPanelDataBody, { searchValue: searchValue })] }));
}
