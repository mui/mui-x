"use strict";
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
exports.GridRoot = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var useForkRef_1 = require("@mui/utils/useForkRef");
var capitalize_1 = require("@mui/utils/capitalize");
var composeClasses_1 = require("@mui/utils/composeClasses");
var fastMemo_1 = require("@mui/x-internals/fastMemo");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var GridRootStyles_1 = require("./GridRootStyles");
var context_1 = require("../../utils/css/context");
var useGridSelector_1 = require("../../hooks/utils/useGridSelector");
var useGridPrivateApiContext_1 = require("../../hooks/utils/useGridPrivateApiContext");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var gridClasses_1 = require("../../constants/gridClasses");
var densitySelector_1 = require("../../hooks/features/density/densitySelector");
var useIsSSR_1 = require("../../hooks/utils/useIsSSR");
var GridHeader_1 = require("../GridHeader");
var base_1 = require("../base");
var useUtilityClasses = function (ownerState, density) {
    var autoHeight = ownerState.autoHeight, classes = ownerState.classes, showCellVerticalBorder = ownerState.showCellVerticalBorder;
    var slots = {
        root: [
            'root',
            autoHeight && 'autoHeight',
            "root--density".concat((0, capitalize_1.default)(density)),
            ownerState.slots.toolbar === null && 'root--noToolbar',
            'withBorderColor',
            showCellVerticalBorder && 'withVerticalBorder',
        ],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var GridRoot = (0, forwardRef_1.forwardRef)(function GridRoot(props, ref) {
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var className = props.className, children = props.children, sidePanel = props.sidePanel, other = __rest(props, ["className", "children", "sidePanel"]);
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var density = (0, useGridSelector_1.useGridSelector)(apiRef, densitySelector_1.gridDensitySelector);
    var rootElementRef = apiRef.current.rootElementRef;
    var rootMountCallback = React.useCallback(function (node) {
        if (node === null) {
            return;
        }
        apiRef.current.publishEvent('rootMount', node);
    }, [apiRef]);
    var handleRef = (0, useForkRef_1.default)(rootElementRef, ref, rootMountCallback);
    var ownerState = rootProps;
    var classes = useUtilityClasses(ownerState, density);
    var cssVariables = (0, context_1.useCSSVariablesContext)();
    var isSSR = (0, useIsSSR_1.useIsSSR)();
    if (isSSR) {
        return null;
    }
    return (<GridRootStyles_1.GridRootStyles className={(0, clsx_1.default)(classes.root, className, cssVariables.className, sidePanel && gridClasses_1.gridClasses.withSidePanel)} ownerState={ownerState} {...other} ref={handleRef}>
      <div className={gridClasses_1.gridClasses.mainContent} role="presentation">
        <GridHeader_1.GridHeader />
        <base_1.GridBody>{children}</base_1.GridBody>
        <base_1.GridFooterPlaceholder />
      </div>
      {sidePanel}
      {cssVariables.tag}
    </GridRootStyles_1.GridRootStyles>);
});
GridRoot.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    sidePanel: prop_types_1.default.node,
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
var MemoizedGridRoot = (0, fastMemo_1.fastMemo)(GridRoot);
exports.GridRoot = MemoizedGridRoot;
