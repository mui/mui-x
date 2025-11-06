"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridColumnHeaders = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var internals_1 = require("@mui/x-data-grid/internals");
var useGridColumnHeaders_1 = require("../hooks/features/columnHeaders/useGridColumnHeaders");
var Filler = (0, styles_1.styled)('div')({
    flex: 1,
    backgroundColor: internals_1.vars.header.background.base,
});
var GridColumnHeaders = (0, forwardRef_1.forwardRef)(function GridColumnHeaders(props, ref) {
    var style = props.style, className = props.className, visibleColumns = props.visibleColumns, sortColumnLookup = props.sortColumnLookup, filterColumnLookup = props.filterColumnLookup, columnHeaderTabIndexState = props.columnHeaderTabIndexState, columnGroupHeaderTabIndexState = props.columnGroupHeaderTabIndexState, columnHeaderFocus = props.columnHeaderFocus, columnGroupHeaderFocus = props.columnGroupHeaderFocus, headerGroupingMaxDepth = props.headerGroupingMaxDepth, columnMenuState = props.columnMenuState, columnVisibility = props.columnVisibility, columnGroupsHeaderStructure = props.columnGroupsHeaderStructure, hasOtherElementInTabSequence = props.hasOtherElementInTabSequence, other = __rest(props, ["style", "className", "visibleColumns", "sortColumnLookup", "filterColumnLookup", "columnHeaderTabIndexState", "columnGroupHeaderTabIndexState", "columnHeaderFocus", "columnGroupHeaderFocus", "headerGroupingMaxDepth", "columnMenuState", "columnVisibility", "columnGroupsHeaderStructure", "hasOtherElementInTabSequence"]);
    var _a = (0, useGridColumnHeaders_1.useGridColumnHeadersPro)({
        visibleColumns: visibleColumns,
        sortColumnLookup: sortColumnLookup,
        filterColumnLookup: filterColumnLookup,
        columnHeaderTabIndexState: columnHeaderTabIndexState,
        hasOtherElementInTabSequence: hasOtherElementInTabSequence,
        columnGroupHeaderTabIndexState: columnGroupHeaderTabIndexState,
        columnHeaderFocus: columnHeaderFocus,
        columnGroupHeaderFocus: columnGroupHeaderFocus,
        headerGroupingMaxDepth: headerGroupingMaxDepth,
        columnMenuState: columnMenuState,
        columnVisibility: columnVisibility,
        columnGroupsHeaderStructure: columnGroupsHeaderStructure,
    }), getInnerProps = _a.getInnerProps, getColumnHeadersRow = _a.getColumnHeadersRow, getColumnFiltersRow = _a.getColumnFiltersRow, getColumnGroupHeadersRows = _a.getColumnGroupHeadersRows;
    return ((0, jsx_runtime_1.jsxs)(internals_1.GridBaseColumnHeaders, __assign({ className: className }, other, getInnerProps(), { ref: ref, children: [getColumnGroupHeadersRows(), getColumnHeadersRow(), getColumnFiltersRow(), (0, jsx_runtime_1.jsx)(Filler, {})] })));
});
exports.GridColumnHeaders = GridColumnHeaders;
GridColumnHeaders.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    columnGroupHeaderFocus: prop_types_1.default.shape({
        depth: prop_types_1.default.number.isRequired,
        field: prop_types_1.default.string.isRequired,
    }),
    columnGroupHeaderTabIndexState: prop_types_1.default.shape({
        depth: prop_types_1.default.number.isRequired,
        field: prop_types_1.default.string.isRequired,
    }),
    columnGroupsHeaderStructure: prop_types_1.default.arrayOf(prop_types_1.default.arrayOf(prop_types_1.default.shape({
        columnFields: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
        groupId: prop_types_1.default.string,
    }))).isRequired,
    columnHeaderFocus: prop_types_1.default.shape({
        field: prop_types_1.default.string.isRequired,
    }),
    columnHeaderTabIndexState: prop_types_1.default.shape({
        field: prop_types_1.default.string.isRequired,
    }),
    columnMenuState: prop_types_1.default.shape({
        field: prop_types_1.default.string,
        open: prop_types_1.default.bool.isRequired,
    }).isRequired,
    columnVisibility: prop_types_1.default.object.isRequired,
    filterColumnLookup: prop_types_1.default.object.isRequired,
    hasOtherElementInTabSequence: prop_types_1.default.bool.isRequired,
    headerGroupingMaxDepth: prop_types_1.default.number.isRequired,
    sortColumnLookup: prop_types_1.default.object.isRequired,
    visibleColumns: prop_types_1.default.arrayOf(prop_types_1.default.object).isRequired,
};
