"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsItemTooltipContent = ChartsItemTooltipContent;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var Typography_1 = require("@mui/material/Typography");
var chartsTooltipClasses_1 = require("./chartsTooltipClasses");
var useItemTooltip_1 = require("./useItemTooltip");
var ChartsTooltipTable_1 = require("./ChartsTooltipTable");
var ChartsLabelMark_1 = require("../ChartsLabel/ChartsLabelMark");
var useStore_1 = require("../internals/store/useStore");
var useChartSeriesConfig_1 = require("../internals/plugins/corePlugins/useChartSeriesConfig");
function ChartsItemTooltipContent(props) {
    var propClasses = props.classes, sx = props.sx;
    var tooltipData = (0, useItemTooltip_1.useInternalItemTooltip)();
    var store = (0, useStore_1.useStore)();
    var seriesConfig = store.use(useChartSeriesConfig_1.selectorChartSeriesConfig);
    var classes = (0, chartsTooltipClasses_1.useUtilityClasses)(propClasses);
    if (!tooltipData) {
        return null;
    }
    var config = seriesConfig[tooltipData.identifier.type];
    var ItemTooltipContent = config && 'ItemTooltipContent' in config ? config.ItemTooltipContent : null;
    if ('values' in tooltipData) {
        var seriesLabel = tooltipData.label, color = tooltipData.color, markType = tooltipData.markType, markShape = tooltipData.markShape;
        var Content_1 = ItemTooltipContent !== null && ItemTooltipContent !== void 0 ? ItemTooltipContent : DefaultMultipleValueContent;
        return ((0, jsx_runtime_1.jsx)(ChartsTooltipTable_1.ChartsTooltipPaper, { sx: sx, className: classes.paper, children: (0, jsx_runtime_1.jsxs)(ChartsTooltipTable_1.ChartsTooltipTable, { className: classes.table, children: [(0, jsx_runtime_1.jsxs)(Typography_1.default, { component: "caption", children: [(0, jsx_runtime_1.jsx)("div", { className: classes.markContainer, children: (0, jsx_runtime_1.jsx)(ChartsLabelMark_1.ChartsLabelMark, { type: markType, markShape: markShape, color: color, className: classes.mark }) }), seriesLabel] }), (0, jsx_runtime_1.jsx)("tbody", { children: (0, jsx_runtime_1.jsx)(Content_1, { classes: propClasses, item: tooltipData }) })] }) }));
    }
    var Content = ItemTooltipContent !== null && ItemTooltipContent !== void 0 ? ItemTooltipContent : DefaultSingleValueContent;
    return ((0, jsx_runtime_1.jsx)(ChartsTooltipTable_1.ChartsTooltipPaper, { sx: sx, className: classes.paper, children: (0, jsx_runtime_1.jsx)(ChartsTooltipTable_1.ChartsTooltipTable, { className: classes.table, children: (0, jsx_runtime_1.jsx)("tbody", { children: (0, jsx_runtime_1.jsx)(Content, { classes: propClasses, item: 
                    /* TypeScript can't guarantee that the item's series type is the same as the Content's series type,
                     * so we need to cast */
                    tooltipData }) }) }) }));
}
function DefaultMultipleValueContent(_a) {
    var propClasses = _a.classes, item = _a.item;
    var classes = (0, chartsTooltipClasses_1.useUtilityClasses)(propClasses);
    return ((0, jsx_runtime_1.jsx)(React.Fragment, { children: item.values.map(function (value) { return ((0, jsx_runtime_1.jsxs)(ChartsTooltipTable_1.ChartsTooltipRow, { className: classes.row, children: [(0, jsx_runtime_1.jsx)(ChartsTooltipTable_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.labelCell, classes.cell), component: "th", children: value.label }), (0, jsx_runtime_1.jsx)(ChartsTooltipTable_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.valueCell, classes.cell), component: "td", children: value.formattedValue })] }, value.label)); }) }));
}
function DefaultSingleValueContent(_a) {
    var propClasses = _a.classes, item = _a.item;
    var color = item.color, label = item.label, formattedValue = item.formattedValue, markType = item.markType, markShape = item.markShape;
    var classes = (0, chartsTooltipClasses_1.useUtilityClasses)(propClasses);
    return ((0, jsx_runtime_1.jsxs)(ChartsTooltipTable_1.ChartsTooltipRow, { className: classes.row, children: [(0, jsx_runtime_1.jsxs)(ChartsTooltipTable_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.labelCell, classes.cell), component: "th", children: [(0, jsx_runtime_1.jsx)("div", { className: classes.markContainer, children: (0, jsx_runtime_1.jsx)(ChartsLabelMark_1.ChartsLabelMark, { type: markType, markShape: markShape, color: color, className: classes.mark }) }), label] }), (0, jsx_runtime_1.jsx)(ChartsTooltipTable_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.valueCell, classes.cell), component: "td", children: formattedValue })] }));
}
ChartsItemTooltipContent.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
