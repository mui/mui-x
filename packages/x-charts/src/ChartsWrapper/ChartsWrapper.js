"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsWrapper = ChartsWrapper;
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var createStyled_1 = require("@mui/system/createStyled");
var useChartRootRef_1 = require("../hooks/useChartRootRef");
var useStore_1 = require("../internals/store/useStore");
var useSelector_1 = require("../internals/store/useSelector");
var useChartDimensions_1 = require("../internals/plugins/corePlugins/useChartDimensions");
var getDirection = function (direction, position) {
    if (direction === 'vertical') {
        if ((position === null || position === void 0 ? void 0 : position.horizontal) === 'start') {
            return 'row';
        }
        return 'row-reverse';
    }
    if ((position === null || position === void 0 ? void 0 : position.vertical) === 'bottom') {
        return 'column-reverse';
    }
    return 'column';
};
var getAlign = function (direction, position) {
    if (direction === 'vertical') {
        if ((position === null || position === void 0 ? void 0 : position.vertical) === 'top') {
            return 'flex-start';
        }
        if ((position === null || position === void 0 ? void 0 : position.vertical) === 'bottom') {
            return 'flex-end';
        }
    }
    if (direction === 'horizontal') {
        if ((position === null || position === void 0 ? void 0 : position.horizontal) === 'start') {
            return 'flex-start';
        }
        if ((position === null || position === void 0 ? void 0 : position.horizontal) === 'end') {
            return 'flex-end';
        }
    }
    return 'center';
};
var Root = (0, styles_1.styled)('div', {
    name: 'MuiChartsWrapper',
    slot: 'Root',
    shouldForwardProp: function (prop) { return (0, createStyled_1.shouldForwardProp)(prop) && prop !== 'extendVertically'; },
})(function (_a) {
    var ownerState = _a.ownerState;
    return ({
        display: 'flex',
        flexDirection: getDirection(ownerState.legendDirection, ownerState.legendPosition),
        flex: 1,
        justifyContent: 'center',
        alignItems: getAlign(ownerState.legendDirection, ownerState.legendPosition),
        variants: [
            {
                props: { extendVertically: true },
                style: {
                    height: '100%',
                },
            },
        ],
    });
});
/**
 * Wrapper for the charts components.
 * Its main purpose is to position the HTML legend in the correct place.
 */
function ChartsWrapper(props) {
    var children = props.children, sx = props.sx, extendVertically = props.extendVertically;
    var chartRootRef = (0, useChartRootRef_1.useChartRootRef)();
    var store = (0, useStore_1.useStore)();
    var propsHeight = (0, useSelector_1.useSelector)(store, useChartDimensions_1.selectorChartPropsSize).height;
    return (<Root ref={chartRootRef} ownerState={props} sx={sx} extendVertically={extendVertically !== null && extendVertically !== void 0 ? extendVertically : propsHeight === undefined}>
      {children}
    </Root>);
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
