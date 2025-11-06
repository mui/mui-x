"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridPivotPanel = GridPivotPanel;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var GridPivotPanelHeader_1 = require("./GridPivotPanelHeader");
var GridPivotPanelBody_1 = require("./GridPivotPanelBody");
function GridPivotPanel() {
    var _a = React.useState(''), searchValue = _a[0], setSearchValue = _a[1];
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(GridPivotPanelHeader_1.GridPivotPanelHeader, { searchValue: searchValue, onSearchValueChange: setSearchValue }), (0, jsx_runtime_1.jsx)(GridPivotPanelBody_1.GridPivotPanelBody, { searchValue: searchValue })] }));
}
