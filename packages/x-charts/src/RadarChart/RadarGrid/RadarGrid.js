"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadarGrid = RadarGrid;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var useRadarGridData_1 = require("./useRadarGridData");
var SharpRadarGrid_1 = require("./SharpRadarGrid");
var CircularRadarGrid_1 = require("./CircularRadarGrid");
var SharpRadarStripes_1 = require("./SharpRadarStripes");
var CircularRadarStripes_1 = require("./CircularRadarStripes");
var radarGridClasses_1 = require("./radarGridClasses");
function RadarGrid(props) {
    var theme = (0, styles_1.useTheme)();
    var _a = props.divisions, divisions = _a === void 0 ? 5 : _a, _b = props.shape, shape = _b === void 0 ? 'sharp' : _b, _c = props.stripeColor, stripeColor = _c === void 0 ? function (index) {
        return index % 2 === 1 ? (theme.vars || theme).palette.text.secondary : 'none';
    } : _c;
    var gridData = (0, useRadarGridData_1.useRadarGridData)();
    var classes = (0, radarGridClasses_1.useUtilityClasses)(props.classes);
    if (gridData === null) {
        return null;
    }
    var center = gridData.center, corners = gridData.corners, radius = gridData.radius;
    return shape === 'sharp' ? ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [stripeColor && ((0, jsx_runtime_1.jsx)(SharpRadarStripes_1.SharpRadarStripes, { divisions: divisions, corners: corners, center: center, radius: radius, stripeColor: stripeColor, classes: classes })), (0, jsx_runtime_1.jsx)(SharpRadarGrid_1.SharpRadarGrid, { divisions: divisions, corners: corners, center: center, radius: radius, strokeColor: (theme.vars || theme).palette.text.primary, classes: classes })] })) : ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [stripeColor && ((0, jsx_runtime_1.jsx)(CircularRadarStripes_1.CircularRadarStripes, { divisions: divisions, corners: corners, center: center, radius: radius, stripeColor: stripeColor, classes: classes })), (0, jsx_runtime_1.jsx)(CircularRadarGrid_1.CircularRadarGrid, { divisions: divisions, corners: corners, center: center, radius: radius, strokeColor: (theme.vars || theme).palette.text.primary, classes: classes })] }));
}
RadarGrid.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    /**
     * The number of divisions in the radar grid.
     * @default 5
     */
    divisions: prop_types_1.default.number,
    /**
     * The grid shape.
     * @default 'sharp'
     */
    shape: prop_types_1.default.oneOf(['circular', 'sharp']),
    /**
     * Get stripe fill color. Set it to `null` to remove stripes
     * @param {number} index The index of the stripe band.
     * @returns {string} The color to fill the stripe.
     * @default (index) => index % 2 === 1 ? (theme.vars || theme).palette.text.secondary : 'none'
     */
    stripeColor: prop_types_1.default.func,
};
