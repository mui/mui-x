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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridToolbarFilterButton = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var capitalize_1 = require("@mui/utils/capitalize");
var useId_1 = require("@mui/utils/useId");
var useForkRef_1 = require("@mui/utils/useForkRef");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var cssVariables_1 = require("../../constants/cssVariables");
var gridColumnsSelector_1 = require("../../hooks/features/columns/gridColumnsSelector");
var useGridSelector_1 = require("../../hooks/utils/useGridSelector");
var gridFilterSelector_1 = require("../../hooks/features/filter/gridFilterSelector");
var gridPreferencePanelSelector_1 = require("../../hooks/features/preferencesPanel/gridPreferencePanelSelector");
var gridPreferencePanelsValue_1 = require("../../hooks/features/preferencesPanel/gridPreferencePanelsValue");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var gridClasses_1 = require("../../constants/gridClasses");
var GridPanelContext_1 = require("../panel/GridPanelContext");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['toolbarFilterList'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var GridToolbarFilterListRoot = (0, styles_1.styled)('ul', {
    name: 'MuiDataGrid',
    slot: 'ToolbarFilterList',
})({
    margin: cssVariables_1.vars.spacing(1, 1, 0.5),
    padding: cssVariables_1.vars.spacing(0, 1),
});
/**
 * @deprecated Use the {@link https://mui.com/x/react-data-grid/components/filter-panel/ Filter Panel Trigger} component instead. This component will be removed in a future major release.
 */
var GridToolbarFilterButton = (0, forwardRef_1.forwardRef)(function GridToolbarFilterButton(props, ref) {
    var _a, _b, _c;
    var _d = props.slotProps, slotProps = _d === void 0 ? {} : _d;
    var buttonProps = slotProps.button || {};
    var tooltipProps = slotProps.tooltip || {};
    var badgeProps = slotProps.badge || {};
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var activeFilters = (0, useGridSelector_1.useGridSelector)(apiRef, gridFilterSelector_1.gridFilterActiveItemsSelector);
    var lookup = (0, useGridSelector_1.useGridSelector)(apiRef, gridColumnsSelector_1.gridColumnLookupSelector);
    var preferencePanel = (0, useGridSelector_1.useGridSelector)(apiRef, gridPreferencePanelSelector_1.gridPreferencePanelStateSelector);
    var classes = useUtilityClasses(rootProps);
    var filterButtonId = (0, useId_1.default)();
    var filterPanelId = (0, useId_1.default)();
    var filterPanelTriggerRef = (0, GridPanelContext_1.useGridPanelContext)().filterPanelTriggerRef;
    var handleRef = (0, useForkRef_1.default)(ref, filterPanelTriggerRef);
    var tooltipContentNode = React.useMemo(function () {
        if (preferencePanel.open) {
            return apiRef.current.getLocaleText('toolbarFiltersTooltipHide');
        }
        if (activeFilters.length === 0) {
            return apiRef.current.getLocaleText('toolbarFiltersTooltipShow');
        }
        var getOperatorLabel = function (item) {
            return lookup[item.field].filterOperators.find(function (operator) { return operator.value === item.operator; })
                .label ||
                apiRef.current
                    .getLocaleText("filterOperator".concat((0, capitalize_1.default)(item.operator)))
                    .toString();
        };
        var getFilterItemValue = function (item) {
            var getValueAsString = lookup[item.field].filterOperators.find(function (operator) { return operator.value === item.operator; }).getValueAsString;
            return getValueAsString ? getValueAsString(item.value) : item.value;
        };
        return (<div>
          {apiRef.current.getLocaleText('toolbarFiltersTooltipActive')(activeFilters.length)}
          <GridToolbarFilterListRoot className={classes.root} ownerState={rootProps}>
            {activeFilters.map(function (item, index) { return (__assign({}, (lookup[item.field] && (<li key={index}>
                  {"".concat(lookup[item.field].headerName || item.field, "\n                  ").concat(getOperatorLabel(item), "\n                  ").concat(
                // implicit check for null and undefined
                item.value != null ? getFilterItemValue(item) : '')}
                </li>)))); })}
          </GridToolbarFilterListRoot>
        </div>);
    }, [apiRef, rootProps, preferencePanel.open, activeFilters, lookup, classes]);
    var toggleFilter = function (event) {
        var _a;
        var open = preferencePanel.open, openedPanelValue = preferencePanel.openedPanelValue;
        if (open && openedPanelValue === gridPreferencePanelsValue_1.GridPreferencePanelsValue.filters) {
            apiRef.current.hidePreferences();
        }
        else {
            apiRef.current.showPreferences(gridPreferencePanelsValue_1.GridPreferencePanelsValue.filters, filterPanelId, filterButtonId);
        }
        (_a = buttonProps.onClick) === null || _a === void 0 ? void 0 : _a.call(buttonProps, event);
    };
    // Disable the button if the corresponding is disabled
    if (rootProps.disableColumnFilter) {
        return null;
    }
    var isOpen = preferencePanel.open && preferencePanel.panelId === filterPanelId;
    return (<rootProps.slots.baseTooltip title={tooltipContentNode} enterDelay={1000} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseTooltip} {...tooltipProps}>
        <rootProps.slots.baseButton id={filterButtonId} size="small" aria-label={apiRef.current.getLocaleText('toolbarFiltersLabel')} aria-controls={isOpen ? filterPanelId : undefined} aria-expanded={isOpen} aria-haspopup startIcon={<rootProps.slots.baseBadge badgeContent={activeFilters.length} color="primary" {...(_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseBadge} {...badgeProps}>
              <rootProps.slots.openFilterButtonIcon />
            </rootProps.slots.baseBadge>} {...(_c = rootProps.slotProps) === null || _c === void 0 ? void 0 : _c.baseButton} {...buttonProps} onClick={toggleFilter} onPointerUp={function (event) {
            var _a;
            if (preferencePanel.open) {
                event.stopPropagation();
            }
            (_a = buttonProps.onPointerUp) === null || _a === void 0 ? void 0 : _a.call(buttonProps, event);
        }} ref={handleRef}>
          {apiRef.current.getLocaleText('toolbarFilters')}
        </rootProps.slots.baseButton>
      </rootProps.slots.baseTooltip>);
});
exports.GridToolbarFilterButton = GridToolbarFilterButton;
GridToolbarFilterButton.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * The props used for each slot inside.
     * @default {}
     */
    slotProps: prop_types_1.default.object,
};
