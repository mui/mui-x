"use strict";
'use client';
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
exports.PiecewiseColorLegend = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var clsx_1 = require("clsx");
var ChartsLabel_1 = require("../ChartsLabel/ChartsLabel");
var ChartsLabelMark_1 = require("../ChartsLabel/ChartsLabelMark");
var consumeThemeProps_1 = require("../internals/consumeThemeProps");
var piecewiseColorLegendClasses_1 = require("./piecewiseColorLegendClasses");
var useAxis_1 = require("./useAxis");
var piecewiseColorDefaultLabelFormatter_1 = require("./piecewiseColorDefaultLabelFormatter");
var RootElement = (0, styles_1.styled)('ul', {
    name: 'MuiPiecewiseColorLegend',
    slot: 'Root',
})(function (_a) {
    var _b, _c, _d, _e, _f, _g;
    var theme = _a.theme, ownerState = _a.ownerState;
    var classes = piecewiseColorLegendClasses_1.piecewiseColorLegendClasses;
    return __assign(__assign({}, theme.typography.caption), (_b = { color: (theme.vars || theme).palette.text.primary, lineHeight: '100%', display: 'flex', flexDirection: ownerState.direction === 'vertical' ? 'column' : 'row', flexShrink: 0, gap: theme.spacing(0.5), listStyleType: 'none', paddingInlineStart: 0, marginBlock: theme.spacing(1), marginInline: theme.spacing(1), width: 'fit-content', gridArea: 'legend' }, _b["button.".concat(classes.item)] = {
        // Reset button styles
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: ownerState.onItemClick ? 'pointer' : 'unset',
        fontFamily: 'inherit',
        fontWeight: 'inherit',
        fontSize: 'inherit',
        letterSpacing: 'inherit',
        color: 'inherit',
    }, _b[".".concat(classes.item)] = {
        display: 'flex',
        gap: theme.spacing(0.5),
    }, _b["li :not(.".concat(classes.minLabel, ", .").concat(classes.maxLabel, ") .").concat(classes === null || classes === void 0 ? void 0 : classes.mark)] = {
        alignSelf: 'center',
    }, _b["&.".concat(classes.start)] = {
        alignItems: 'end',
    }, _b["&.".concat(classes.end)] = {
        alignItems: 'start',
    }, _b["&.".concat(classes.horizontal)] = (_c = {
            alignItems: 'center'
        },
        _c[".".concat(classes.item)] = {
            flexDirection: 'column',
        },
        _c["&.".concat(classes.inlineStart, ", &.").concat(classes.inlineEnd)] = (_d = {
                gap: theme.spacing(1.5),
                flexWrap: 'wrap'
            },
            _d[".".concat(classes.item)] = {
                flexDirection: 'row',
            },
            _d),
        _c["&.".concat(classes.start)] = {
            alignItems: 'end',
        },
        _c["&.".concat(classes.end)] = {
            alignItems: 'start',
        },
        _c[".".concat(classes.minLabel)] = {
            alignItems: 'end',
        },
        _c["&.".concat(classes.extremes)] = (_e = {},
            _e[".".concat(classes.minLabel, ", .").concat(classes.maxLabel)] = {
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'row',
            },
            _e),
        _c), _b["&.".concat(classes.vertical)] = (_f = {},
        _f[".".concat(classes.item)] = {
            flexDirection: 'row',
            alignItems: 'center',
        },
        _f["&.".concat(classes.start, ", &.").concat(classes.inlineStart)] = {
            alignItems: 'end',
        },
        _f["&.".concat(classes.end, ", &.").concat(classes.inlineEnd)] = {
            alignItems: 'start',
        },
        _f["&.".concat(classes.extremes)] = (_g = {
                alignItems: 'center'
            },
            _g[".".concat(classes.minLabel, ", .").concat(classes.maxLabel)] = {
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
            },
            _g),
        _f), _b));
});
var PiecewiseColorLegend = (0, consumeThemeProps_1.consumeThemeProps)('MuiPiecewiseColorLegend', {
    defaultProps: {
        direction: 'horizontal',
        labelPosition: 'extremes',
        labelFormatter: piecewiseColorDefaultLabelFormatter_1.piecewiseColorDefaultLabelFormatter,
    },
    classesResolver: piecewiseColorLegendClasses_1.useUtilityClasses,
}, function PiecewiseColorLegend(props, ref) {
    var direction = props.direction, classes = props.classes, className = props.className, markType = props.markType, labelPosition = props.labelPosition, axisDirection = props.axisDirection, axisId = props.axisId, labelFormatter = props.labelFormatter, onItemClick = props.onItemClick, other = __rest(props, ["direction", "classes", "className", "markType", "labelPosition", "axisDirection", "axisId", "labelFormatter", "onItemClick"]);
    var isVertical = direction === 'vertical';
    var isReverse = isVertical;
    var axisItem = (0, useAxis_1.useAxis)({ axisDirection: axisDirection, axisId: axisId });
    var colorMap = axisItem === null || axisItem === void 0 ? void 0 : axisItem.colorMap;
    if (!colorMap || !colorMap.type || colorMap.type !== 'piecewise') {
        return null;
    }
    var valueFormatter = function (v) {
        var _a, _b, _c;
        return (_c = (_b = (_a = axisItem).valueFormatter) === null || _b === void 0 ? void 0 : _b.call(_a, v, {
            location: 'legend',
        })) !== null && _c !== void 0 ? _c : v.toLocaleString();
    };
    var formattedLabels = colorMap.thresholds.map(valueFormatter);
    var startClass = isReverse ? classes === null || classes === void 0 ? void 0 : classes.maxLabel : classes === null || classes === void 0 ? void 0 : classes.minLabel;
    var endClass = isReverse ? classes === null || classes === void 0 ? void 0 : classes.minLabel : classes === null || classes === void 0 ? void 0 : classes.maxLabel;
    var colors = colorMap.colors.map(function (color, colorIndex) { return ({
        color: color,
        colorIndex: colorIndex,
    }); });
    var orderedColors = isReverse ? colors.reverse() : colors;
    var isStart = labelPosition === 'start';
    var isEnd = labelPosition === 'end';
    var isExtremes = labelPosition === 'extremes';
    var isInlineStart = labelPosition === 'inline-start';
    var isInlineEnd = labelPosition === 'inline-end';
    return ((0, jsx_runtime_1.jsx)(RootElement, __assign({ className: (0, clsx_1.default)(classes === null || classes === void 0 ? void 0 : classes.root, className), ref: ref }, other, { ownerState: props, children: orderedColors.map(function (_a, index) {
            var _b;
            var color = _a.color, colorIndex = _a.colorIndex;
            var isFirst = index === 0;
            var isLast = index === colorMap.colors.length - 1;
            var isFirstColor = colorIndex === 0;
            var isLastColor = colorIndex === colorMap.colors.length - 1;
            var data = __assign(__assign({ index: colorIndex, length: formattedLabels.length }, (isFirstColor
                ? { min: null, formattedMin: null }
                : {
                    min: colorMap.thresholds[colorIndex - 1],
                    formattedMin: formattedLabels[colorIndex - 1],
                })), (isLastColor
                ? { max: null, formattedMax: null }
                : {
                    max: colorMap.thresholds[colorIndex],
                    formattedMax: formattedLabels[colorIndex],
                }));
            var label = labelFormatter === null || labelFormatter === void 0 ? void 0 : labelFormatter(data);
            if (label === null || label === undefined) {
                return null;
            }
            var isTextBefore = isStart || (isExtremes && isFirst) || isInlineStart;
            var isTextAfter = isEnd || (isExtremes && isLast) || isInlineEnd;
            var clickObject = {
                type: 'piecewiseColor',
                color: color,
                label: label,
                minValue: data.min,
                maxValue: data.max,
            };
            var Element = onItemClick ? 'button' : 'div';
            return ((0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(Element, { role: onItemClick ? 'button' : undefined, type: onItemClick ? 'button' : undefined, onClick: 
                    // @ts-ignore onClick is only attached to a button
                    onItemClick ? function (event) { return onItemClick(event, clickObject, index); } : undefined, className: (0, clsx_1.default)(classes === null || classes === void 0 ? void 0 : classes.item, (_b = {},
                        _b["".concat(startClass)] = index === 0,
                        _b["".concat(endClass)] = index === orderedColors.length - 1,
                        _b)), children: [isTextBefore && (0, jsx_runtime_1.jsx)(ChartsLabel_1.ChartsLabel, { className: classes === null || classes === void 0 ? void 0 : classes.label, children: label }), (0, jsx_runtime_1.jsx)(ChartsLabelMark_1.ChartsLabelMark, { className: classes === null || classes === void 0 ? void 0 : classes.mark, type: markType, color: color }), isTextAfter && (0, jsx_runtime_1.jsx)(ChartsLabel_1.ChartsLabel, { className: classes === null || classes === void 0 ? void 0 : classes.label, children: label })] }) }, colorIndex));
        }) })));
});
exports.PiecewiseColorLegend = PiecewiseColorLegend;
PiecewiseColorLegend.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * The axis direction containing the color configuration to represent.
     * @default 'z'
     */
    axisDirection: prop_types_1.default.oneOf(['x', 'y', 'z']),
    /**
     * The id of the axis item with the color configuration to represent.
     * @default The first axis item.
     */
    axisId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    className: prop_types_1.default.string,
    /**
     * The direction of the legend layout.
     * @default 'horizontal'
     */
    direction: prop_types_1.default.oneOf(['horizontal', 'vertical']),
    /**
     * Format the legend labels.
     * @param {PiecewiseLabelFormatterParams} params The bound of the piece to format.
     * @returns {string|null} The displayed label, `''` to skip the label but show the color mark, or `null` to skip it entirely.
     */
    labelFormatter: prop_types_1.default.func,
    /**
     * Where to position the labels relative to the gradient.
     * @default 'extremes'
     */
    labelPosition: prop_types_1.default.oneOf(['start', 'end', 'extremes', 'inline-start', 'inline-end']),
    /**
     * The type of the mark.
     * @default 'square'
     */
    markType: prop_types_1.default.oneOf(['square', 'circle', 'line']),
    /**
     * Callback fired when a legend item is clicked.
     * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event The click event.
     * @param {PiecewiseColorLegendItemContext} legendItem The legend item data.
     * @param {number} index The index of the clicked legend item.
     */
    onItemClick: prop_types_1.default.func,
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
