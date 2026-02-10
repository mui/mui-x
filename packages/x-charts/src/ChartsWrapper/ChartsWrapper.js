"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsWrapper = ChartsWrapper;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var createStyled_1 = require("@mui/system/createStyled");
var useChartRootRef_1 = require("../hooks/useChartRootRef");
var useStore_1 = require("../internals/store/useStore");
var useChartDimensions_1 = require("../internals/plugins/corePlugins/useChartDimensions");
var Toolbar_1 = require("../Toolbar");
var getJustifyItems = function (position) {
    if ((position === null || position === void 0 ? void 0 : position.horizontal) === 'start') {
        return 'start';
    }
    if ((position === null || position === void 0 ? void 0 : position.horizontal) === 'end') {
        return 'end';
    }
    return 'center';
};
var getAlignItems = function (position) {
    if ((position === null || position === void 0 ? void 0 : position.vertical) === 'top') {
        return 'flex-start';
    }
    if ((position === null || position === void 0 ? void 0 : position.vertical) === 'bottom') {
        return 'flex-end';
    }
    return 'center';
};
var getGridTemplateAreas = function (hideLegend, direction, position) {
    if (hideLegend) {
        return "\"chart\"";
    }
    if (direction === 'vertical') {
        if ((position === null || position === void 0 ? void 0 : position.horizontal) === 'start') {
            return "\"legend chart\"";
        }
        return "\"chart legend\"";
    }
    if ((position === null || position === void 0 ? void 0 : position.vertical) === 'bottom') {
        return "\"chart\"\n            \"legend\"";
    }
    return "\"legend\"\n          \"chart\"";
};
var getTemplateColumns = function (hideLegend, direction, horizontalPosition, width) {
    if (hideLegend === void 0) { hideLegend = false; }
    if (direction === void 0) { direction = 'horizontal'; }
    if (horizontalPosition === void 0) { horizontalPosition = 'end'; }
    if (width === void 0) { width = undefined; }
    var drawingAreaColumn = width ? 'auto' : '1fr';
    if (direction === 'horizontal') {
        return drawingAreaColumn;
    }
    if (hideLegend) {
        return drawingAreaColumn;
    }
    return horizontalPosition === 'start' ? "auto ".concat(drawingAreaColumn) : "".concat(drawingAreaColumn, " auto");
};
var getTemplateRows = function (hideLegend, direction, verticalPosition) {
    if (hideLegend === void 0) { hideLegend = false; }
    if (direction === void 0) { direction = 'horizontal'; }
    if (verticalPosition === void 0) { verticalPosition = 'top'; }
    var drawingAreaRow = '1fr';
    if (direction === 'vertical') {
        return drawingAreaRow;
    }
    if (hideLegend) {
        return drawingAreaRow;
    }
    return verticalPosition === 'bottom' ? "".concat(drawingAreaRow, " auto") : "auto ".concat(drawingAreaRow);
};
var Root = (0, styles_1.styled)('div', {
    name: 'MuiChartsWrapper',
    slot: 'Root',
    shouldForwardProp: function (prop) {
        return (0, createStyled_1.shouldForwardProp)(prop) && prop !== 'extendVertically' && prop !== 'width';
    },
})(function (_a) {
    var _b;
    var _c, _d;
    var ownerState = _a.ownerState, width = _a.width;
    var gridTemplateColumns = getTemplateColumns(ownerState.hideLegend, ownerState.legendDirection, (_c = ownerState.legendPosition) === null || _c === void 0 ? void 0 : _c.horizontal, width);
    var gridTemplateRows = getTemplateRows(ownerState.hideLegend, ownerState.legendDirection, (_d = ownerState.legendPosition) === null || _d === void 0 ? void 0 : _d.vertical);
    var gridTemplateAreas = getGridTemplateAreas(ownerState.hideLegend, ownerState.legendDirection, ownerState.legendPosition);
    return _b = {
            variants: [
                {
                    props: { extendVertically: true },
                    style: {
                        height: '100%',
                        minHeight: 0,
                    },
                },
            ],
            flex: 1,
            display: 'grid',
            gridTemplateColumns: gridTemplateColumns,
            gridTemplateRows: gridTemplateRows,
            gridTemplateAreas: gridTemplateAreas
        },
        _b["&:has(.".concat(Toolbar_1.chartsToolbarClasses.root, ")")] = {
            // Add a row for toolbar if there is one.
            gridTemplateRows: "auto ".concat(gridTemplateRows),
            gridTemplateAreas: "\"".concat(gridTemplateColumns
                .split(' ')
                .map(function () { return 'toolbar'; })
                .join(' '), "\"\n        ").concat(gridTemplateAreas),
        },
        _b["& .".concat(Toolbar_1.chartsToolbarClasses.root)] = {
            gridArea: 'toolbar',
            justifySelf: 'center',
        },
        _b.justifyContent = 'safe center',
        _b.justifyItems = getJustifyItems(ownerState.legendPosition),
        _b.alignItems = getAlignItems(ownerState.legendPosition),
        _b;
});
/**
 * Wrapper for the charts components.
 * Its main purpose is to position the HTML legend in the correct place.
 */
function ChartsWrapper(props) {
    var children = props.children, sx = props.sx, extendVertically = props.extendVertically;
    var chartRootRef = (0, useChartRootRef_1.useChartRootRef)();
    var store = (0, useStore_1.useStore)();
    var propsWidth = store.use(useChartDimensions_1.selectorChartPropsWidth);
    var propsHeight = store.use(useChartDimensions_1.selectorChartPropsHeight);
    return ((0, jsx_runtime_1.jsx)(Root, { ref: chartRootRef, ownerState: props, sx: sx, extendVertically: extendVertically !== null && extendVertically !== void 0 ? extendVertically : propsHeight === undefined, width: propsWidth, children: children }));
}
ChartsWrapper.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    children: prop_types_1.default.node,
    /**
     * If `true`, the chart wrapper set `height: 100%`.
     * @default `false` if the `height` prop is set. And `true` otherwise.
     */
    extendVertically: prop_types_1.default.bool,
    /**
     * If `true`, the legend is not rendered.
     * @default false
     */
    hideLegend: prop_types_1.default.bool,
    /**
     * The direction of the legend.
     * @default 'horizontal'
     */
    legendDirection: prop_types_1.default.oneOf(['horizontal', 'vertical']),
    /**
     * The position of the legend.
     * @default { horizontal: 'center', vertical: 'bottom' }
     */
    legendPosition: prop_types_1.default.shape({
        horizontal: prop_types_1.default.oneOf(['center', 'end', 'start']),
        vertical: prop_types_1.default.oneOf(['bottom', 'middle', 'top']),
    }),
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
