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
exports.GridChartsPanelDataBody = GridChartsPanelDataBody;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var system_1 = require("@mui/system");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useGridRootProps_1 = require("../../../hooks/utils/useGridRootProps");
var collapsible_1 = require("../../collapsible");
var resizablePanel_1 = require("../../resizablePanel");
var GridChartsPanelDataField_1 = require("./GridChartsPanelDataField");
var gridChartsIntegrationSelectors_1 = require("../../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors");
var useGridPrivateApiContext_1 = require("../../../hooks/utils/useGridPrivateApiContext");
var useGridChartIntegration_1 = require("../../../hooks/utils/useGridChartIntegration");
var utils_1 = require("../../../hooks/features/chartsIntegration/utils");
var gridRowGroupingSelector_1 = require("../../../hooks/features/rowGrouping/gridRowGroupingSelector");
var gridPivotingSelectors_1 = require("../../../hooks/features/pivoting/gridPivotingSelectors");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['chartsPanelDataBody'],
        availableFields: ['chartsPanelDataAvailableFields'],
        sections: ['chartsPanelDataSections'],
        scrollArea: ['chartsPanelDataScrollArea'],
        section: ['chartsPanelDataSection'],
        sectionTitle: ['chartsPanelDataSectionTitle'],
        fieldList: ['chartsPanelDataFieldList'],
        placeholder: ['chartsPanelDataPlaceholder'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
var GridChartsPanelDataBodyRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataBody',
})({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
});
var GridChartsPanelDataAvailableFields = (0, system_1.styled)(x_data_grid_pro_1.GridShadowScrollArea, {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataAvailableFields',
})({
    flex: 1,
    minHeight: 84,
    transition: internals_1.vars.transition(['background-color'], {
        duration: internals_1.vars.transitions.duration.short,
        easing: internals_1.vars.transitions.easing.easeInOut,
    }),
    '&[data-drag-over="true"]': {
        backgroundColor: internals_1.vars.colors.interactive.hover,
    },
});
var GridChartsPanelDataSections = (0, system_1.styled)(resizablePanel_1.ResizablePanel, {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataSections',
})({
    position: 'relative',
    minHeight: 158,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
});
var GridChartsPanelDataScrollArea = (0, system_1.styled)(x_data_grid_pro_1.GridShadowScrollArea, {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataScrollArea',
})({
    height: '100%',
});
var GridChartsPanelDataSection = (0, system_1.styled)(collapsible_1.Collapsible, {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataSection',
    shouldForwardProp: function (prop) { return prop !== 'disabled'; },
})(function (_a) {
    var disabled = _a.disabled;
    return ({
        opacity: disabled ? 0.5 : 1,
        margin: internals_1.vars.spacing(0.5, 1),
        transition: internals_1.vars.transition(['border-color', 'background-color'], {
            duration: internals_1.vars.transitions.duration.short,
            easing: internals_1.vars.transitions.easing.easeInOut,
        }),
        '&[data-drag-over="true"]': {
            backgroundColor: internals_1.vars.colors.interactive.hover,
            outline: "2px solid ".concat(internals_1.vars.colors.interactive.selected),
        },
    });
});
var GridChartsPanelDataSectionTitle = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataSectionTitle',
})({
    flex: 1,
    marginRight: internals_1.vars.spacing(1.75),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: internals_1.vars.spacing(1),
    font: internals_1.vars.typography.font.body,
    fontWeight: internals_1.vars.typography.fontWeight.medium,
});
var GridChartsPanelDataFieldList = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataFieldList',
})({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: internals_1.vars.spacing(0.5, 0),
});
var GridChartsPanelDataPlaceholder = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataPlaceholder',
})({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textWrap: 'balance',
    textAlign: 'center',
    minHeight: 38,
    height: '100%',
    padding: internals_1.vars.spacing(0, 1),
    color: internals_1.vars.colors.foreground.muted,
    font: internals_1.vars.typography.font.body,
});
var INITIAL_DRAG_STATE = { active: false, field: null, dropSection: null, initialSection: null };
// dimensions and values
var SECTION_COUNT = 2;
function GridChartsPanelDataBody(props) {
    var _a, _b, _c, _d, _e, _f;
    var searchValue = props.searchValue;
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var rowGroupingModel = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridRowGroupingSelector_1.gridRowGroupingSanitizedModelSelector);
    var pivotActive = (0, x_data_grid_pro_1.useGridSelector)(apiRef, internals_1.gridPivotActiveSelector);
    var pivotModel = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridPivotingSelectors_1.gridPivotModelSelector);
    var activeChartId = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridChartsIntegrationSelectors_1.gridChartsIntegrationActiveChartIdSelector);
    var chartStateLookup = (0, useGridChartIntegration_1.useGridChartsIntegrationContext)().chartStateLookup;
    var dimensions = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridChartsIntegrationSelectors_1.gridChartsDimensionsSelector, activeChartId);
    var values = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridChartsIntegrationSelectors_1.gridChartsValuesSelector, activeChartId);
    var classes = useUtilityClasses(rootProps);
    var chartableColumns = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridChartsIntegrationSelectors_1.gridChartableColumnsSelector);
    var dimensionsLabel = React.useMemo(function () {
        var _a;
        return ((_a = chartStateLookup[activeChartId]) === null || _a === void 0 ? void 0 : _a.dimensionsLabel) ||
            apiRef.current.getLocaleText('chartsCategories');
    }, [chartStateLookup, activeChartId, apiRef]);
    var valuesLabel = React.useMemo(function () { var _a; return ((_a = chartStateLookup[activeChartId]) === null || _a === void 0 ? void 0 : _a.valuesLabel) || apiRef.current.getLocaleText('chartsSeries'); }, [chartStateLookup, activeChartId, apiRef]);
    var fullSections = React.useMemo(function () {
        var _a, _b, _c, _d;
        var sections = [];
        if (((_a = chartStateLookup[activeChartId]) === null || _a === void 0 ? void 0 : _a.maxDimensions) &&
            dimensions.length >= ((_b = chartStateLookup[activeChartId]) === null || _b === void 0 ? void 0 : _b.maxDimensions)) {
            sections.push('dimensions');
        }
        if (((_c = chartStateLookup[activeChartId]) === null || _c === void 0 ? void 0 : _c.maxValues) &&
            values.length >= ((_d = chartStateLookup[activeChartId]) === null || _d === void 0 ? void 0 : _d.maxValues)) {
            sections.push('values');
        }
        return sections;
    }, [dimensions, values, chartStateLookup, activeChartId]);
    var blockedSectionsLookup = React.useMemo(function () {
        return new Map(Object.values(chartableColumns).map(function (column) { return [
            column.field,
            Array.from(new Set(__spreadArray(__spreadArray([], (0, utils_1.getBlockedSections)(column, rowGroupingModel, pivotActive ? pivotModel : undefined), true), fullSections, true))),
        ]; }));
    }, [rowGroupingModel, chartableColumns, pivotActive, pivotModel, fullSections]);
    var availableFields = React.useMemo(function () {
        var notUsedFields = Object.keys(chartableColumns).filter(function (field) {
            return !dimensions.some(function (dimension) { return dimension.field === field; }) &&
                !values.some(function (value) { return value.field === field; });
        });
        if (searchValue) {
            return notUsedFields.filter(function (field) {
                var fieldName = apiRef.current.chartsIntegration.getColumnName(field);
                return fieldName.toLowerCase().includes(searchValue.toLowerCase());
            });
        }
        // Fields with all sections blocked should be at the end
        return notUsedFields.sort(function (a, b) {
            var aBlockedSections = blockedSectionsLookup.get(a).length;
            var bBlockedSections = blockedSectionsLookup.get(b).length;
            return ((aBlockedSections >= SECTION_COUNT ? 1 : 0) - (bBlockedSections >= SECTION_COUNT ? 1 : 0));
        });
    }, [apiRef, searchValue, chartableColumns, dimensions, values, blockedSectionsLookup]);
    var _g = React.useState(INITIAL_DRAG_STATE), drag = _g[0], setDrag = _g[1];
    var disabledSections = React.useMemo(function () {
        if (!drag.field) {
            return new Set();
        }
        return new Set(blockedSectionsLookup.get(drag.field));
    }, [blockedSectionsLookup, drag.field]);
    var handleDragStart = function (field, section) {
        setDrag({ active: true, field: field, initialSection: section, dropSection: null });
    };
    var handleDragEnd = function () {
        setDrag(INITIAL_DRAG_STATE);
    };
    var handleDrop = function (event) {
        setDrag(INITIAL_DRAG_STATE);
        // The drop event was already handled by a child
        if (event.defaultPrevented) {
            return;
        }
        event.preventDefault();
        var _a = JSON.parse(event.dataTransfer.getData('text/plain')), field = _a.field, originSection = _a.section;
        var targetSection = event.currentTarget.getAttribute('data-section');
        if (originSection === targetSection) {
            return;
        }
        apiRef.current.chartsIntegration.updateDataReference(field, originSection, targetSection);
    };
    var handleDragOver = React.useCallback(function (event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);
    var handleDragEnter = React.useCallback(function (event) {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            var dropSection_1 = event.currentTarget.getAttribute('data-section');
            setDrag(function (v) { return (__assign(__assign({}, v), { active: true, dropSection: dropSection_1 })); });
        }
    }, []);
    var handleDragLeave = React.useCallback(function (event) {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setDrag(function (v) { return (__assign(__assign({}, v), { active: true, dropSection: v.initialSection })); });
        }
    }, []);
    var handleChange = React.useCallback(function (field, section) {
        var apiMethod = section === 'dimensions'
            ? apiRef.current.updateChartDimensionsData
            : apiRef.current.updateChartValuesData;
        apiMethod(activeChartId, function (currentItems) {
            return currentItems.map(function (item) {
                return item.field === field ? __assign(__assign({}, item), { hidden: item.hidden !== true }) : item;
            });
        });
    }, [apiRef, activeChartId]);
    return ((0, jsx_runtime_1.jsxs)(GridChartsPanelDataBodyRoot, { ownerState: rootProps, className: classes.root, "data-dragging": drag.active, onDragLeave: handleDragLeave, children: [(0, jsx_runtime_1.jsxs)(GridChartsPanelDataAvailableFields, { ownerState: rootProps, className: classes.availableFields, onDrop: handleDrop, onDragEnter: handleDragEnter, onDragOver: handleDragOver, "data-section": null, "data-drag-over": drag.active && drag.dropSection === null, children: [availableFields.length === 0 && ((0, jsx_runtime_1.jsx)(GridChartsPanelDataPlaceholder, { ownerState: rootProps, className: classes.placeholder, children: apiRef.current.getLocaleText('chartsNoFields') })), availableFields.length > 0 && ((0, jsx_runtime_1.jsx)(GridChartsPanelDataFieldList, { ownerState: rootProps, className: classes.fieldList, children: availableFields.map(function (field) { return ((0, jsx_runtime_1.jsx)(GridChartsPanelDataField_1.GridChartsPanelDataField, { field: field, section: null, disabled: blockedSectionsLookup.get(field).length >= SECTION_COUNT, blockedSections: blockedSectionsLookup.get(field), dimensionsLabel: dimensionsLabel, valuesLabel: valuesLabel, onDragStart: handleDragStart, onDragEnd: handleDragEnd, children: apiRef.current.chartsIntegration.getColumnName(field) }, field)); }) }))] }), (0, jsx_runtime_1.jsxs)(GridChartsPanelDataSections, { ownerState: rootProps, className: classes.sections, direction: "vertical", children: [(0, jsx_runtime_1.jsx)(resizablePanel_1.ResizablePanelHandle, {}), (0, jsx_runtime_1.jsxs)(GridChartsPanelDataScrollArea, { ownerState: rootProps, className: classes.scrollArea, children: [(0, jsx_runtime_1.jsxs)(GridChartsPanelDataSection, { ownerState: rootProps, className: classes.section, onDrop: handleDrop, onDragEnter: handleDragEnter, onDragOver: handleDragOver, disabled: disabledSections.has('dimensions'), "data-section": "dimensions", "data-drag-over": !disabledSections.has('dimensions') && drag.dropSection === 'dimensions', children: [(0, jsx_runtime_1.jsx)(collapsible_1.CollapsibleTrigger, { "aria-label": dimensionsLabel, children: (0, jsx_runtime_1.jsxs)(GridChartsPanelDataSectionTitle, { ownerState: rootProps, className: classes.sectionTitle, children: [dimensionsLabel, (((_a = chartStateLookup[activeChartId]) === null || _a === void 0 ? void 0 : _a.maxDimensions) || dimensions.length > 0) && ((0, jsx_runtime_1.jsx)(rootProps.slots.baseBadge, { badgeContent: ((_b = chartStateLookup[activeChartId]) === null || _b === void 0 ? void 0 : _b.maxDimensions)
                                                        ? "".concat(dimensions.length, "/").concat((_c = chartStateLookup[activeChartId]) === null || _c === void 0 ? void 0 : _c.maxDimensions)
                                                        : dimensions.length }))] }) }), (0, jsx_runtime_1.jsxs)(collapsible_1.CollapsiblePanel, { children: [dimensions.length === 0 && ((0, jsx_runtime_1.jsx)(GridChartsPanelDataPlaceholder, { ownerState: rootProps, className: classes.placeholder, children: apiRef.current.getLocaleText('chartsDragToDimensions')(dimensionsLabel) })), dimensions.length > 0 && ((0, jsx_runtime_1.jsx)(GridChartsPanelDataFieldList, { ownerState: rootProps, className: classes.fieldList, children: dimensions.map(function (dimension) { return ((0, jsx_runtime_1.jsx)(GridChartsPanelDataField_1.GridChartsPanelDataField, { field: dimension.field, selected: dimension.hidden !== true, onChange: handleChange, section: "dimensions", blockedSections: blockedSectionsLookup.get(dimension.field), dimensionsLabel: dimensionsLabel, valuesLabel: valuesLabel, disabled: disabledSections.has('dimensions'), onDragStart: handleDragStart, onDragEnd: handleDragEnd, children: apiRef.current.chartsIntegration.getColumnName(dimension.field) }, dimension.field)); }) }))] })] }), (0, jsx_runtime_1.jsxs)(GridChartsPanelDataSection, { ownerState: rootProps, className: classes.section, onDrop: handleDrop, onDragEnter: handleDragEnter, onDragOver: handleDragOver, disabled: disabledSections.has('values'), "data-section": "values", "data-drag-over": !disabledSections.has('values') && drag.dropSection === 'values', children: [(0, jsx_runtime_1.jsx)(collapsible_1.CollapsibleTrigger, { "aria-label": valuesLabel, children: (0, jsx_runtime_1.jsxs)(GridChartsPanelDataSectionTitle, { ownerState: rootProps, className: classes.sectionTitle, children: [valuesLabel, (((_d = chartStateLookup[activeChartId]) === null || _d === void 0 ? void 0 : _d.maxValues) || values.length > 0) && ((0, jsx_runtime_1.jsx)(rootProps.slots.baseBadge, { badgeContent: ((_e = chartStateLookup[activeChartId]) === null || _e === void 0 ? void 0 : _e.maxValues)
                                                        ? "".concat(values.length, "/").concat((_f = chartStateLookup[activeChartId]) === null || _f === void 0 ? void 0 : _f.maxValues)
                                                        : values.length }))] }) }), (0, jsx_runtime_1.jsxs)(collapsible_1.CollapsiblePanel, { children: [values.length === 0 && ((0, jsx_runtime_1.jsx)(GridChartsPanelDataPlaceholder, { ownerState: rootProps, className: classes.placeholder, children: apiRef.current.getLocaleText('chartsDragToValues')(valuesLabel) })), values.length > 0 && ((0, jsx_runtime_1.jsx)(GridChartsPanelDataFieldList, { ownerState: rootProps, className: classes.fieldList, children: values.map(function (value) { return ((0, jsx_runtime_1.jsx)(GridChartsPanelDataField_1.GridChartsPanelDataField, { field: value.field, selected: value.hidden !== true, onChange: handleChange, section: "values", blockedSections: blockedSectionsLookup.get(value.field), dimensionsLabel: dimensionsLabel, valuesLabel: valuesLabel, disabled: disabledSections.has('values'), onDragStart: handleDragStart, onDragEnd: handleDragEnd, children: apiRef.current.chartsIntegration.getColumnName(value.field) }, value.field)); }) }))] })] })] })] })] }));
}
