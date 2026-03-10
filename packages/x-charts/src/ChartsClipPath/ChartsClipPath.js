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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsClipPath = ChartsClipPath;
var jsx_runtime_1 = require("react/jsx-runtime");
var prop_types_1 = require("prop-types");
var useDrawingArea_1 = require("../hooks/useDrawingArea");
/**
 * API:
 *
 * - [ChartsClipPath API](https://mui.com/x/api/charts/charts-clip-path/)
 */
function ChartsClipPath(props) {
    var id = props.id, offsetProps = props.offset;
    var _a = (0, useDrawingArea_1.useDrawingArea)(), left = _a.left, top = _a.top, width = _a.width, height = _a.height;
    var offset = __assign({ top: 0, right: 0, bottom: 0, left: 0 }, offsetProps);
    return ((0, jsx_runtime_1.jsx)("clipPath", { id: id, children: (0, jsx_runtime_1.jsx)("rect", { x: left - offset.left, y: top - offset.top, width: width + offset.left + offset.right, height: height + offset.top + offset.bottom }) }));
}
ChartsClipPath.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * The id of the clip path.
     */
    id: prop_types_1.default.string.isRequired,
    /**
     * Offset, in pixels, of the clip path rectangle from the drawing area.
     *
     * A positive value will move the rectangle outside the drawing area.
     */
    offset: prop_types_1.default.shape({
        bottom: prop_types_1.default.number,
        left: prop_types_1.default.number,
        right: prop_types_1.default.number,
        top: prop_types_1.default.number,
    }),
};
