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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregationSelect = AggregationSelect;
exports.GridChartsPanelDataField = GridChartsPanelDataField;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var system_1 = require("@mui/system");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var composeClasses_1 = require("@mui/utils/composeClasses");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var useGridApiContext_1 = require("../../../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../../../hooks/utils/useGridRootProps");
var useGridPrivateApiContext_1 = require("../../../hooks/utils/useGridPrivateApiContext");
var GridChartsPanelDataFieldMenu_1 = require("./GridChartsPanelDataFieldMenu");
var aggregation_1 = require("../../../hooks/features/aggregation");
var gridRowGroupingSelector_1 = require("../../../hooks/features/rowGrouping/gridRowGroupingSelector");
var gridAggregationUtils_1 = require("../../../hooks/features/aggregation/gridAggregationUtils");
var columnGroups_1 = require("../../../constants/columnGroups");
var AGGREGATION_FUNCTION_NONE = 'none';
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['chartsPanelDataField'],
        name: ['chartsPanelDataFieldName'],
        actionContainer: ['chartsPanelDataFieldActionContainer'],
        dragIcon: ['chartsPanelDataFieldDragIcon'],
        checkbox: ['chartsPanelDataFieldCheckbox'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
var GridChartsPanelDataFieldRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataField',
})(function (_a) {
    var disabled = _a.disabled;
    return ({
        flexShrink: 0,
        position: 'relative',
        padding: internals_1.vars.spacing(0, 1, 0, 2),
        height: 32,
        display: 'flex',
        alignItems: 'center',
        gap: internals_1.vars.spacing(0.5),
        borderWidth: 0,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderStyle: 'solid',
        borderColor: 'transparent',
        margin: '-1px 0', // collapse vertical borders
        cursor: disabled ? 'not-allowed' : 'grab',
        opacity: disabled ? 0.5 : 1,
        variants: [
            { props: { dropPosition: 'top' }, style: { borderTopColor: internals_1.vars.colors.interactive.selected } },
            {
                props: { dropPosition: 'bottom' },
                style: { borderBottomColor: internals_1.vars.colors.interactive.selected },
            },
            {
                props: { section: null },
                style: { borderTopColor: 'transparent', borderBottomColor: 'transparent' },
            },
        ],
        '&:hover': {
            backgroundColor: internals_1.vars.colors.interactive.hover,
        },
    });
});
var GridChartsPanelDataFieldName = (0, system_1.styled)('span', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataFieldName',
})({
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
});
var GridChartsPanelDataFieldActionContainer = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataFieldActionContainer',
})({
    display: 'flex',
    alignItems: 'center',
});
var GridChartsPanelDataFieldDragIcon = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataFieldDragIcon',
})({
    position: 'absolute',
    left: -1,
    width: 16,
    display: 'flex',
    justifyContent: 'center',
    color: internals_1.vars.colors.foreground.base,
    opacity: 0,
    '[draggable="true"]:hover > &': {
        opacity: 0.3,
    },
});
var GridChartsPanelDataFieldCheckbox = (0, system_1.styled)((internals_1.NotRendered), {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataFieldCheckbox',
})({
    flex: 1,
    position: 'relative',
    margin: internals_1.vars.spacing(0, 0, 0, -1),
    cursor: 'grab',
});
function AggregationSelect(_a) {
    var _b;
    var aggFunc = _a.aggFunc, field = _a.field;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var _c = React.useState(false), aggregationMenuOpen = _c[0], setAggregationMenuOpen = _c[1];
    var aggregationMenuTriggerRef = React.useRef(null);
    var aggregationMenuTriggerId = React.useId();
    var aggregationMenuId = React.useId();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var aggregationModel = (0, aggregation_1.gridAggregationModelSelector)(apiRef);
    var pivotActive = (0, internals_1.gridPivotActiveSelector)(apiRef);
    var getActualFieldName = React.useCallback(function (fieldName) {
        return pivotActive ? fieldName.split(columnGroups_1.COLUMN_GROUP_ID_SEPARATOR).slice(-1)[0] : fieldName;
    }, [pivotActive]);
    var colDef = React.useCallback(function (fieldName) { return apiRef.current.getColumn(getActualFieldName(fieldName)); }, [apiRef, getActualFieldName]);
    var availableAggregationFunctions = React.useMemo(function () { return __spreadArray(__spreadArray([], (pivotActive ? [] : [AGGREGATION_FUNCTION_NONE]), true), (0, gridAggregationUtils_1.getAvailableAggregationFunctions)({
        aggregationFunctions: rootProps.aggregationFunctions,
        colDef: colDef(field),
        isDataSource: !!rootProps.dataSource,
    }), true); }, [colDef, field, pivotActive, rootProps.aggregationFunctions, rootProps.dataSource]);
    var handleClick = React.useCallback(function (func) {
        var _a;
        if (pivotActive) {
            var fieldName_1 = getActualFieldName(field);
            apiRef.current.setPivotModel(function (prev) { return (__assign(__assign({}, prev), { values: prev.values.map(function (col) {
                    if (col.field === fieldName_1) {
                        return __assign(__assign({}, col), { aggFunc: func });
                    }
                    return col;
                }) })); });
        }
        else if (func === AGGREGATION_FUNCTION_NONE) {
            var updatedAggregationModel = __assign({}, aggregationModel);
            delete updatedAggregationModel[field];
            apiRef.current.setAggregationModel(updatedAggregationModel);
        }
        else {
            apiRef.current.setAggregationModel(__assign(__assign({}, aggregationModel), (_a = {}, _a[field] = func, _a)));
        }
        setAggregationMenuOpen(false);
    }, [apiRef, field, getActualFieldName, pivotActive, aggregationModel, setAggregationMenuOpen]);
    return availableAggregationFunctions.length > 0 ? ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(rootProps.slots.baseChip, { label: (0, gridAggregationUtils_1.getAggregationFunctionLabel)({
                    apiRef: apiRef,
                    aggregationRule: {
                        aggregationFunctionName: aggFunc,
                        aggregationFunction: rootProps.aggregationFunctions[aggFunc] || {},
                    },
                }), size: "small", variant: "outlined", ref: aggregationMenuTriggerRef, id: aggregationMenuTriggerId, "aria-haspopup": "true", "aria-controls": aggregationMenuOpen ? aggregationMenuId : undefined, "aria-expanded": aggregationMenuOpen ? 'true' : undefined, onClick: function () { return setAggregationMenuOpen(!aggregationMenuOpen); } }), (0, jsx_runtime_1.jsx)(x_data_grid_pro_1.GridMenu, { open: aggregationMenuOpen, onClose: function () { return setAggregationMenuOpen(false); }, target: aggregationMenuTriggerRef.current, position: "bottom-start", children: (0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuList, __assign({ id: aggregationMenuId, "aria-labelledby": aggregationMenuTriggerId, autoFocusItem: true }, (_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseMenuList, { children: availableAggregationFunctions.map(function (func) {
                        var _a;
                        return ((0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuItem, __assign({ selected: aggFunc === func, onClick: function () { return handleClick(func); } }, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseMenuItem, { children: (0, gridAggregationUtils_1.getAggregationFunctionLabel)({
                                apiRef: apiRef,
                                aggregationRule: {
                                    aggregationFunctionName: func,
                                    aggregationFunction: rootProps.aggregationFunctions[func] || {},
                                },
                            }) }), func));
                    }) })) })] })) : null;
}
function GridChartsPanelDataField(props) {
    var _a, _b, _c;
    var children = props.children, field = props.field, section = props.section, blockedSections = props.blockedSections, dimensionsLabel = props.dimensionsLabel, valuesLabel = props.valuesLabel, selected = props.selected, disabled = props.disabled, onChange = props.onChange, onDragStart = props.onDragStart, onDragEnd = props.onDragEnd;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var _d = React.useState(null), dropPosition = _d[0], setDropPosition = _d[1];
    var ownerState = __assign(__assign({}, props), { classes: rootProps.classes, dropPosition: dropPosition, section: section });
    var classes = useUtilityClasses(ownerState);
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var aggregationModel = (0, x_data_grid_pro_1.useGridSelector)(apiRef, aggregation_1.gridAggregationModelSelector);
    var rowGroupingModel = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridRowGroupingSelector_1.gridRowGroupingSanitizedModelSelector);
    var isRowGroupingEnabled = React.useMemo(function () { return rowGroupingModel.length > 0; }, [rowGroupingModel]);
    var handleDragStart = React.useCallback(function (event) {
        var data = { field: field, section: section };
        event.dataTransfer.setData('text/plain', JSON.stringify(data));
        event.dataTransfer.dropEffect = 'move';
        onDragStart(field, section);
    }, [field, onDragStart, section]);
    var getDropPosition = React.useCallback(function (event) {
        var rect = event.target.getBoundingClientRect();
        var y = event.clientY - rect.top;
        if (y < rect.height / 2) {
            return 'top';
        }
        return 'bottom';
    }, []);
    var handleDragOver = React.useCallback(function (event) {
        if (disabled) {
            return;
        }
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setDropPosition(getDropPosition(event));
        }
    }, [disabled, getDropPosition]);
    var handleDragLeave = React.useCallback(function (event) {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setDropPosition(null);
        }
    }, []);
    var handleDrop = React.useCallback(function (event) {
        setDropPosition(null);
        if (!event.currentTarget.contains(event.relatedTarget)) {
            event.preventDefault();
            var position = getDropPosition(event);
            var _a = JSON.parse(event.dataTransfer.getData('text/plain')), droppedField = _a.field, originSection = _a.section;
            apiRef.current.chartsIntegration.updateDataReference(droppedField, originSection, section, field, position || undefined);
        }
    }, [getDropPosition, apiRef, field, section]);
    var hideable = section !== null;
    return ((0, jsx_runtime_1.jsx)(rootProps.slots.baseTooltip, __assign({ title: disabled ? apiRef.current.getLocaleText('chartsFieldBlocked') : undefined, enterDelay: 1000 }, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseTooltip, { children: (0, jsx_runtime_1.jsxs)(GridChartsPanelDataFieldRoot, { ownerState: ownerState, className: classes.root, onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, onDragStart: handleDragStart, onDragEnd: onDragEnd, draggable: !disabled, disabled: !!disabled, children: [(0, jsx_runtime_1.jsx)(GridChartsPanelDataFieldDragIcon, { ownerState: ownerState, className: classes.dragIcon, children: (0, jsx_runtime_1.jsx)(rootProps.slots.columnReorderIcon, { fontSize: "small" }) }), hideable ? ((0, jsx_runtime_1.jsx)(GridChartsPanelDataFieldCheckbox, __assign({ ownerState: ownerState, className: classes.checkbox, as: rootProps.slots.baseCheckbox, size: "small", density: "compact" }, (_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseCheckbox, { checked: selected || false, onChange: function () { return onChange && onChange(field, section); }, label: children }))) : ((0, jsx_runtime_1.jsx)(GridChartsPanelDataFieldName, { ownerState: ownerState, className: classes.name, children: children })), (0, jsx_runtime_1.jsxs)(GridChartsPanelDataFieldActionContainer, { ownerState: ownerState, className: classes.actionContainer, children: [isRowGroupingEnabled && section === 'values' && ((0, jsx_runtime_1.jsx)(AggregationSelect, { aggFunc: (_c = aggregationModel[field]) !== null && _c !== void 0 ? _c : AGGREGATION_FUNCTION_NONE, field: field })), (0, jsx_runtime_1.jsx)(GridChartsPanelDataFieldMenu_1.GridChartsPanelDataFieldMenu, { field: field, section: section, blockedSections: blockedSections, dimensionsLabel: dimensionsLabel, valuesLabel: valuesLabel })] })] }) })));
}
