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
exports.GridToolbarQuickFilter = GridToolbarQuickFilter;
var React = require("react");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var system_1 = require("@mui/system");
var clsx_1 = require("clsx");
var constants_1 = require("../../constants");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var quickFilter_1 = require("../quickFilter");
var toolbarV8_1 = require("../toolbarV8");
var cssVariables_1 = require("../../constants/cssVariables");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['toolbarQuickFilter'],
        trigger: ['toolbarQuickFilterTrigger'],
        control: ['toolbarQuickFilterControl'],
    };
    return (0, composeClasses_1.default)(slots, constants_1.getDataGridUtilityClass, classes);
};
var GridQuickFilterRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ToolbarQuickFilter',
})({
    display: 'grid',
    alignItems: 'center',
});
var GridQuickFilterTrigger = (0, system_1.styled)(toolbarV8_1.ToolbarButton, {
    name: 'MuiDataGrid',
    slot: 'ToolbarQuickFilterTrigger',
})(function (_a) {
    var ownerState = _a.ownerState;
    return ({
        gridArea: '1 / 1',
        width: 'min-content',
        height: 'min-content',
        zIndex: 1,
        opacity: ownerState.expanded ? 0 : 1,
        pointerEvents: ownerState.expanded ? 'none' : 'auto',
        transition: cssVariables_1.vars.transition(['opacity']),
    });
});
// TODO: Use NotRendered from /utils/assert
// Currently causes react-docgen to fail
var GridQuickFilterTextField = (0, system_1.styled)(function (_props) {
    throw new Error('Failed assertion: should not be rendered');
}, {
    name: 'MuiDataGrid',
    slot: 'ToolbarQuickFilterControl',
})(function (_a) {
    var ownerState = _a.ownerState;
    return ({
        gridArea: '1 / 1',
        overflowX: 'clip',
        width: ownerState.expanded ? 260 : 'var(--trigger-width)',
        opacity: ownerState.expanded ? 1 : 0,
        transition: cssVariables_1.vars.transition(['width', 'opacity']),
    });
});
/**
 * @deprecated Use the {@link https://mui.com/x/react-data-grid/components/quick-filter/ Quick Filter} component instead. This component will be removed in a future major release.
 */
function GridToolbarQuickFilter(props) {
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var ownerState = {
        classes: rootProps.classes,
        expanded: false,
    };
    var classes = useUtilityClasses(ownerState);
    var quickFilterParser = props.quickFilterParser, quickFilterFormatter = props.quickFilterFormatter, debounceMs = props.debounceMs, className = props.className, slotProps = props.slotProps, other = __rest(props, ["quickFilterParser", "quickFilterFormatter", "debounceMs", "className", "slotProps"]);
    return (<quickFilter_1.QuickFilter parser={quickFilterParser} formatter={quickFilterFormatter} debounceMs={debounceMs} render={function (quickFilterProps, state) {
            var currentOwnerState = __assign(__assign({}, ownerState), { expanded: state.expanded });
            return (<GridQuickFilterRoot {...quickFilterProps} className={(0, clsx_1.default)(classes.root, className)}>
            <quickFilter_1.QuickFilterTrigger render={function (triggerProps) { return (<rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('toolbarQuickFilterLabel')} enterDelay={0} // Prevents tooltip lagging behind transitioning trigger element
                >
                  <GridQuickFilterTrigger className={classes.trigger} {...triggerProps} ownerState={currentOwnerState} color="default" aria-disabled={state.expanded}>
                    <rootProps.slots.quickFilterIcon fontSize="small"/>
                  </GridQuickFilterTrigger>
                </rootProps.slots.baseTooltip>); }}/>
            <quickFilter_1.QuickFilterControl render={function (_a) {
                    var _b;
                    var ref = _a.ref, controlSlotProps = _a.slotProps, controlProps = __rest(_a, ["ref", "slotProps"]);
                    return (<GridQuickFilterTextField as={rootProps.slots.baseTextField} className={classes.control} ownerState={currentOwnerState} inputRef={ref} aria-label={apiRef.current.getLocaleText('toolbarQuickFilterLabel')} placeholder={apiRef.current.getLocaleText('toolbarQuickFilterPlaceholder')} size="small" slotProps={__assign({ input: __assign({ startAdornment: <rootProps.slots.quickFilterIcon fontSize="small"/>, endAdornment: controlProps.value ? (<quickFilter_1.QuickFilterClear render={<rootProps.slots.baseIconButton size="small" edge="end" aria-label={apiRef.current.getLocaleText('toolbarQuickFilterDeleteIconLabel')}>
                              <rootProps.slots.quickFilterClearIcon fontSize="small"/>
                            </rootProps.slots.baseIconButton>}/>) : null }, controlSlotProps === null || controlSlotProps === void 0 ? void 0 : controlSlotProps.input) }, controlSlotProps)} {...(_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseTextField} {...controlProps} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.root} {...other}/>);
                }}/>
          </GridQuickFilterRoot>);
        }}/>);
}
GridToolbarQuickFilter.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    className: prop_types_1.default.string,
    /**
     * The debounce time in milliseconds.
     * @default 150
     */
    debounceMs: prop_types_1.default.number,
    /**
     * Function responsible for formatting values of quick filter in a string when the model is modified
     * @param {any[]} values The new values passed to the quick filter model
     * @returns {string} The string to display in the text field
     * @default (values: string[]) => values.join(' ')
     */
    quickFilterFormatter: prop_types_1.default.func,
    /**
     * Function responsible for parsing text input in an array of independent values for quick filtering.
     * @param {string} input The value entered by the user
     * @returns {any[]} The array of value on which quick filter is applied
     * @default (searchText: string) => searchText
     *   .split(' ')
     *   .filter((word) => word !== '')
     */
    quickFilterParser: prop_types_1.default.func,
    slotProps: prop_types_1.default.object,
};
