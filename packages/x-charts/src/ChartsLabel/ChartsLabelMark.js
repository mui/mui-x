"use strict";
'use client';
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
exports.ChartsLabelMark = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var clsx_1 = require("clsx");
var labelMarkClasses_1 = require("./labelMarkClasses");
var consumeThemeProps_1 = require("../internals/consumeThemeProps");
var Root = (0, styles_1.styled)('div', {
    name: 'MuiChartsLabelMark',
    slot: 'Root',
})(function () {
    var _a, _b;
    return _a = {
            display: 'flex',
            width: 14,
            height: 14
        },
        _a["&.".concat(labelMarkClasses_1.labelMarkClasses.line)] = (_b = {
                width: 16,
                height: 'unset',
                alignItems: 'center'
            },
            _b[".".concat(labelMarkClasses_1.labelMarkClasses.mask)] = {
                height: 4,
                width: '100%',
                borderRadius: 1,
                overflow: 'hidden',
            },
            _b),
        _a["&.".concat(labelMarkClasses_1.labelMarkClasses.square)] = {
            height: 13,
            width: 13,
            borderRadius: 2,
            overflow: 'hidden',
        },
        _a["&.".concat(labelMarkClasses_1.labelMarkClasses.circle)] = {
            height: 15,
            width: 15,
        },
        _a.svg = {
            display: 'block',
        },
        _a["& .".concat(labelMarkClasses_1.labelMarkClasses.mask, " > *")] = {
            height: '100%',
            width: '100%',
        },
        _a["& .".concat(labelMarkClasses_1.labelMarkClasses.mask)] = {
            height: '100%',
            width: '100%',
        },
        _a;
});
/**
 * Generates the label mark for the tooltip and legend.
 * @ignore - internal component.
 */
var ChartsLabelMark = (0, consumeThemeProps_1.consumeThemeProps)('MuiChartsLabelMark', {
    defaultProps: { type: 'square' },
    classesResolver: labelMarkClasses_1.useUtilityClasses,
}, function ChartsLabelMark(props, ref) {
    var type = props.type, color = props.color, className = props.className, classes = props.classes, other = __rest(props, ["type", "color", "className", "classes"]);
    var Component = type;
    return (<Root className={(0, clsx_1.default)(classes === null || classes === void 0 ? void 0 : classes.root, className)} ownerState={props} aria-hidden="true" ref={ref} {...other}>
        <div className={classes === null || classes === void 0 ? void 0 : classes.mask}>
          {typeof Component === 'function' ? (<Component className={classes === null || classes === void 0 ? void 0 : classes.fill} color={color}/>) : (<svg viewBox="0 0 24 24" preserveAspectRatio={type === 'line' ? 'none' : undefined}>
              {type === 'circle' ? (<circle className={classes === null || classes === void 0 ? void 0 : classes.fill} r="12" cx="12" cy="12" fill={color}/>) : (<rect className={classes === null || classes === void 0 ? void 0 : classes.fill} width="24" height="24" fill={color}/>)}
            </svg>)}
        </div>
      </Root>);
});
exports.ChartsLabelMark = ChartsLabelMark;
ChartsLabelMark.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    /**
     * The color of the mark.
     */
    color: prop_types_1.default.string,
    /**
     * The type of the mark.
     * @default 'square'
     */
    type: prop_types_1.default.oneOf(['circle', 'line', 'square']),
};
