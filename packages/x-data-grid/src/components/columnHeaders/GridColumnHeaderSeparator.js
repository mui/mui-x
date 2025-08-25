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
exports.GridColumnHeaderSeparatorSides = exports.GridColumnHeaderSeparator = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var capitalize_1 = require("@mui/utils/capitalize");
var gridClasses_1 = require("../../constants/gridClasses");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var GridColumnHeaderSeparatorSides;
(function (GridColumnHeaderSeparatorSides) {
    GridColumnHeaderSeparatorSides["Left"] = "left";
    GridColumnHeaderSeparatorSides["Right"] = "right";
})(GridColumnHeaderSeparatorSides || (exports.GridColumnHeaderSeparatorSides = GridColumnHeaderSeparatorSides = {}));
var useUtilityClasses = function (ownerState) {
    var resizable = ownerState.resizable, resizing = ownerState.resizing, classes = ownerState.classes, side = ownerState.side;
    var slots = {
        root: [
            'columnSeparator',
            resizable && 'columnSeparator--resizable',
            resizing && 'columnSeparator--resizing',
            side && "columnSeparator--side".concat((0, capitalize_1.default)(side)),
        ],
        icon: ['iconSeparator'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
function GridColumnHeaderSeparatorRaw(props) {
    var resizable = props.resizable, resizing = props.resizing, height = props.height, _a = props.side, side = _a === void 0 ? GridColumnHeaderSeparatorSides.Right : _a, other = __rest(props, ["resizable", "resizing", "height", "side"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var ownerState = __assign(__assign({}, props), { side: side, classes: rootProps.classes });
    var classes = useUtilityClasses(ownerState);
    var stopClick = React.useCallback(function (event) {
        event.preventDefault();
        event.stopPropagation();
    }, []);
    return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div className={classes.root} style={{ minHeight: height }} {...other} onClick={stopClick}>
      <rootProps.slots.columnResizeIcon className={classes.icon}/>
    </div>);
}
var GridColumnHeaderSeparator = React.memo(GridColumnHeaderSeparatorRaw);
exports.GridColumnHeaderSeparator = GridColumnHeaderSeparator;
GridColumnHeaderSeparatorRaw.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    height: prop_types_1.default.number.isRequired,
    resizable: prop_types_1.default.bool.isRequired,
    resizing: prop_types_1.default.bool.isRequired,
    side: prop_types_1.default.oneOf(['left', 'right']),
};
