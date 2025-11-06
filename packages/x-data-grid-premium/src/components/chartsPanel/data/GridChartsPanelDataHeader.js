"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridChartsPanelDataHeader = GridChartsPanelDataHeader;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var sidebar_1 = require("../../sidebar");
var GridChartsPanelDataSearch_1 = require("./GridChartsPanelDataSearch");
function GridChartsPanelDataHeader(props) {
    var searchValue = props.searchValue, onSearchValueChange = props.onSearchValueChange;
    return ((0, jsx_runtime_1.jsx)(sidebar_1.SidebarHeader, { children: (0, jsx_runtime_1.jsx)(GridChartsPanelDataSearch_1.GridChartsPanelDataSearch, { value: searchValue, onClear: function () { return onSearchValueChange(''); }, onChange: function (event) {
                return onSearchValueChange(event.target.value);
            } }) }));
}
