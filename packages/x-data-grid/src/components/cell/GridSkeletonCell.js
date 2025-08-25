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
exports.GridSkeletonCell = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var composeClasses_1 = require("@mui/utils/composeClasses");
var capitalize_1 = require("@mui/utils/capitalize");
var fastMemo_1 = require("@mui/x-internals/fastMemo");
var utils_1 = require("../../utils/utils");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var gridClasses_1 = require("../../constants/gridClasses");
var CIRCULAR_CONTENT_SIZE = '1.3em';
var CONTENT_HEIGHT = '1.2em';
var DEFAULT_CONTENT_WIDTH_RANGE = [40, 80];
var CONTENT_WIDTH_RANGE_BY_TYPE = {
    number: [40, 60],
    string: [40, 80],
    date: [40, 60],
    dateTime: [60, 80],
    singleSelect: [40, 80],
};
var useUtilityClasses = function (ownerState) {
    var align = ownerState.align, classes = ownerState.classes, empty = ownerState.empty;
    var slots = {
        root: [
            'cell',
            'cellSkeleton',
            "cell--text".concat(align ? (0, capitalize_1.default)(align) : 'Left'),
            empty && 'cellEmpty',
        ],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var randomNumberGenerator = (0, utils_1.createRandomNumberGenerator)(12345);
function GridSkeletonCell(props) {
    var field = props.field, type = props.type, align = props.align, width = props.width, height = props.height, _a = props.empty, empty = _a === void 0 ? false : _a, style = props.style, className = props.className, other = __rest(props, ["field", "type", "align", "width", "height", "empty", "style", "className"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var ownerState = { classes: rootProps.classes, align: align, empty: empty };
    var classes = useUtilityClasses(ownerState);
    // Memo prevents the non-circular skeleton widths changing to random widths on every render
    var skeletonProps = React.useMemo(function () {
        var _a;
        var isCircularContent = type === 'boolean' || type === 'actions';
        if (isCircularContent) {
            return {
                variant: 'circular',
                width: CIRCULAR_CONTENT_SIZE,
                height: CIRCULAR_CONTENT_SIZE,
            };
        }
        // The width of the skeleton is a random number between the min and max values
        // The min and max values are determined by the type of the column
        var _b = type
            ? ((_a = CONTENT_WIDTH_RANGE_BY_TYPE[type]) !== null && _a !== void 0 ? _a : DEFAULT_CONTENT_WIDTH_RANGE)
            : DEFAULT_CONTENT_WIDTH_RANGE, min = _b[0], max = _b[1];
        return {
            variant: 'text',
            width: "".concat(Math.round(randomNumberGenerator(min, max)), "%"),
            height: CONTENT_HEIGHT,
        };
    }, [type]);
    return (<div data-field={field} className={(0, clsx_1.default)(classes.root, className)} style={__assign({ height: height, maxWidth: width, minWidth: width }, style)} {...other}>
      {!empty && <rootProps.slots.baseSkeleton {...skeletonProps}/>}
    </div>);
}
GridSkeletonCell.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    align: prop_types_1.default.string,
    /**
     * If `true`, the cell will not display the skeleton but still reserve the cell space.
     * @default false
     */
    empty: prop_types_1.default.bool,
    field: prop_types_1.default.string,
    height: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.number]),
    type: prop_types_1.default.oneOf([
        'actions',
        'boolean',
        'custom',
        'date',
        'dateTime',
        'number',
        'singleSelect',
        'string',
    ]),
    width: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
};
var Memoized = (0, fastMemo_1.fastMemo)(GridSkeletonCell);
exports.GridSkeletonCell = Memoized;
